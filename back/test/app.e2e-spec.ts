import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Solicitudes API (e2e)', () => {
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
    await prisma.solicitud.deleteMany();
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

  describe('Solicitudes Endpoints', () => {
    let solicitudId: number;

    it('/solicitudes (POST) - debería crear una nueva solicitud', () => {
      return request(app.getHttpServer())
        .post('/solicitudes')
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
          solicitudId = res.body.id;
        });
    });

    it('/solicitudes (POST) - debería rechazar solicitudes duplicadas en 24h', () => {
      return request(app.getHttpServer())
        .post('/solicitudes')
        .send({
          nombre: 'Juan Pérez',
          email: 'juan@example.com',
          telefono: '123456789',
          mensaje: 'Otra solicitud',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Ya has enviado una solicitud');
        });
    });

    it('/solicitudes (POST) - debería sanitizar contenido XSS', async () => {
      const response = await request(app.getHttpServer())
        .post('/solicitudes')
        .send({
          nombre: '<script>alert("XSS")</script>María',
          email: 'maria@example.com',
          mensaje: '<img src=x onerror=alert(1)>Mensaje',
        })
        .expect(201);

      expect(response.body.nombre).not.toContain('<script>');
      expect(response.body.mensaje).not.toContain('onerror');
    });

    it('/solicitudes (POST) - debería validar email válido', () => {
      return request(app.getHttpServer())
        .post('/solicitudes')
        .send({
          nombre: 'Test',
          email: 'invalid-email',
          mensaje: 'Test',
        })
        .expect(400);
    });

    it('/solicitudes (GET) - debería requerir autenticación', () => {
      return request(app.getHttpServer())
        .get('/solicitudes')
        .expect(401);
    });

    it('/solicitudes (GET) - debería retornar todas las solicitudes con auth', async () => {
      // Primero hacer login
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'test123',
        });

      const token = loginRes.body.access_token;

      return request(app.getHttpServer())
        .get('/solicitudes')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('/solicitudes/:id (PATCH) - debería actualizar estado con auth', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'test123',
        });

      const token = loginRes.body.access_token;

      return request(app.getHttpServer())
        .patch(`/solicitudes/${solicitudId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ estado: 'contactado' })
        .expect(200)
        .expect((res) => {
          expect(res.body.estado).toBe('contactado');
        });
    });

    it('/solicitudes/:id (DELETE) - debería eliminar solicitud con auth', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'test123',
        });

      const token = loginRes.body.access_token;

      return request(app.getHttpServer())
        .delete(`/solicitudes/${solicitudId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('/solicitudes/:id (GET) - debería retornar 404 para solicitud inexistente', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'test123',
        });

      const token = loginRes.body.access_token;

      return request(app.getHttpServer())
        .delete('/solicitudes/99999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
