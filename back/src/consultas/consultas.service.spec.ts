import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConsultasService } from './consultas.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ConsultasService', () => {
  let service: ConsultasService;
  let prismaService: PrismaService;

  const mockConsulta = {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    telefono: '123456789',
    mensaje: 'Quiero aprender alemán',
    estado: 'pendiente',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    consulta: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultasService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ConsultasService>(ConsultasService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debería crear una consulta cuando no hay duplicados recientes', async () => {
      const createDto = {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        telefono: '123456789',
        mensaje: 'Quiero aprender alemán',
      };

      mockPrismaService.consulta.findFirst.mockResolvedValue(null);
      mockPrismaService.consulta.create.mockResolvedValue(mockConsulta);

      const result = await service.create(createDto);

      expect(result).toEqual(mockConsulta);
      expect(prismaService.consulta.findFirst).toHaveBeenCalled();
      expect(prismaService.consulta.create).toHaveBeenCalled();
    });

    it('debería sanitizar los datos antes de crear', async () => {
      const createDto = {
        nombre: '<script>alert("XSS")</script>Juan',
        email: 'JUAN@EXAMPLE.COM',
        telefono: '<b>123</b>',
        mensaje: '<img src=x onerror=alert(1)>Mensaje',
      };

      mockPrismaService.consulta.findFirst.mockResolvedValue(null);
      mockPrismaService.consulta.create.mockResolvedValue(mockConsulta);

      await service.create(createDto);

      const createCall = mockPrismaService.consulta.create.mock.calls[0][0];
      
      // Verificar que el email fue normalizado
      expect(createCall.data.email).toBe('juan@example.com');
      
      // Verificar que no hay scripts en los datos
      expect(createCall.data.nombre).not.toContain('<script>');
      expect(createCall.data.mensaje).not.toContain('onerror');
    });

    it('debería lanzar BadRequestException si hay una consulta reciente', async () => {
      const createDto = {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        telefono: '123456789',
        mensaje: 'Quiero aprender alemán',
      };

      // Simular que ya existe una consulta reciente
      mockPrismaService.consulta.findFirst.mockResolvedValue(mockConsulta);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createDto)).rejects.toThrow(
        'Ya has enviado una consulta recientemente',
      );
    });

    it('debería permitir crear consulta si la anterior es mayor a 24h', async () => {
      const createDto = {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        telefono: '123456789',
        mensaje: 'Quiero aprender alemán',
      };

      // Consulta creada hace 25 horas (más de 24h)
      const consultaAntigua = {
        ...mockConsulta,
        createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
      };

      mockPrismaService.consulta.findFirst.mockResolvedValue(null);
      mockPrismaService.consulta.create.mockResolvedValue(mockConsulta);

      const result = await service.create(createDto);

      expect(result).toEqual(mockConsulta);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las consultas ordenadas por fecha con paginación', async () => {
      const mockConsultas = [mockConsulta, { ...mockConsulta, id: 2 }];
      mockPrismaService.consulta.findMany.mockResolvedValue(mockConsultas);
      mockPrismaService.consulta.count.mockResolvedValue(20);

      const result = await service.findAll(undefined, 1, 10);

      expect(result).toEqual({
        data: mockConsultas,
        pagination: {
          page: 1,
          limit: 10,
          total: 20,
          totalPages: 2,
        },
      });
      expect(prismaService.consulta.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
      expect(prismaService.consulta.count).toHaveBeenCalledWith({
        where: undefined,
      });
    });

    it('debería filtrar por estado cuando se proporciona', async () => {
      mockPrismaService.consulta.findMany.mockResolvedValue([mockConsulta]);
      mockPrismaService.consulta.count.mockResolvedValue(5);

      const result = await service.findAll('pendiente', 1, 10);

      expect(result.data).toEqual([mockConsulta]);
      expect(result.pagination.total).toBe(5);
      expect(prismaService.consulta.findMany).toHaveBeenCalledWith({
        where: { estado: 'pendiente' },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('update', () => {
    it('debería actualizar una consulta existente', async () => {
      const updateDto = { estado: 'contactado' };
      const updatedConsulta = { ...mockConsulta, estado: 'contactado' };

      mockPrismaService.consulta.findUnique.mockResolvedValue(mockConsulta);
      mockPrismaService.consulta.update.mockResolvedValue(updatedConsulta);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedConsulta);
      expect(prismaService.consulta.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
    });

    it('debería lanzar NotFoundException si la consulta no existe', async () => {
      mockPrismaService.consulta.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { estado: 'contactado' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('debería eliminar una consulta existente', async () => {
      mockPrismaService.consulta.findUnique.mockResolvedValue(mockConsulta);
      mockPrismaService.consulta.delete.mockResolvedValue(mockConsulta);

      const result = await service.remove(1);

      expect(result).toEqual(mockConsulta);
      expect(prismaService.consulta.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('debería lanzar NotFoundException si la consulta no existe', async () => {
      mockPrismaService.consulta.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
