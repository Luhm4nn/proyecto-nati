import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Consultas API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Limpiar la base de datos de test
    await prisma.consulta.deleteMany();
    await prisma.user.deleteMany();

    // Crear usuario admin para los tests
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('test123', 10);
    await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: hashedPassword,
        nombre: 'Admin Test',
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('Auth Endpoints', () => {
    it('/auth/login (POST) - debería autenticar usuario válido', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'test123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe('admin@test.com');
          authToken = res.body.access_token;
        });
    });

    it('/auth/login (POST) - debería rechazar credenciales inválidas', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'wrongpassword',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toContain('Credenciales inválidas');
        });
    });

    it('/auth/login (POST) - debería validar campos requeridos', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin@test.com',
        })
        .expect(400);
    });
  });

  describe('Consultas Endpoints', () => {
    let consultaId: number;

    it('/consultas (POST) - debería crear una nueva consulta', () => {
      return request(app.getHttpServer())
        .post('/consultas')
        .send({
          nombre: 'Juan Pérez',
          email: 'juan@example.com',
          telefono: '123456789',
          mensaje: 'Quiero aprender alemán nivel A1',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.nombre).toBe('Juan Pérez');
          expect(res.body.estado).toBe('pendiente');
          consultaId = res.body.id;
        });
    });

    it('/consultas (POST) - debería rechazar consultas duplicadas en 24h', () => {
      return request(app.getHttpServer())
        .post('/consultas')
        .send({
          nombre: 'Juan Pérez',
          email: 'juan@example.com',
          telefono: '123456789',
          mensaje: 'Otra consulta',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Ya has enviado una consulta');
        });
    });

    it('/consultas (POST) - debería sanitizar contenido XSS', async () => {
      const response = await request(app.getHttpServer())
        .post('/consultas')
        .send({
          nombre: '<script>alert("XSS")</script>María',
          email: 'maria@example.com',
          mensaje: '<img src=x onerror=alert(1)>Mensaje',
        })
        .expect(201);

      expect(response.body.nombre).not.toContain('<script>');
      expect(response.body.mensaje).not.toContain('onerror');
    });

    it('/consultas (POST) - debería validar email válido', () => {
      return request(app.getHttpServer())
        .post('/consultas')
        .send({
          nombre: 'Test',
          email: 'invalid-email',
          mensaje: 'Test',
        })
        .expect(400);
    });

    it('/consultas (GET) - debería requerir autenticación', () => {
      return request(app.getHttpServer())
        .get('/consultas')
        .expect(401);
    });

    it('/consultas (GET) - debería retornar todas las consultas con auth', async () => {
      // Primero hacer login
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'test123',
        });

      const token = loginRes.body.access_token;

      return request(app.getHttpServer())
        .get('/consultas')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('/consultas/:id (PATCH) - debería actualizar estado con auth', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'test123',
        });

      const token = loginRes.body.access_token;

      return request(app.getHttpServer())
        .patch(`/consultas/${consultaId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ estado: 'revisada' })
        .expect(200)
        .expect((res) => {
          expect(res.body.estado).toBe('revisada');
        });
    });

    it('/consultas/:id (DELETE) - debería eliminar consulta con auth', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'test123',
        });

      const token = loginRes.body.access_token;

      return request(app.getHttpServer())
        .delete(`/consultas/${consultaId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('/consultas/:id (GET) - debería retornar 404 para consulta inexistente', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'test123',
        });

      const token = loginRes.body.access_token;

      return request(app.getHttpServer())
        .delete('/consultas/99999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
