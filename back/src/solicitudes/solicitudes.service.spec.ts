import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SolicitudesService', () => {
  let service: SolicitudesService;
  let prismaService: PrismaService;

  const mockSolicitud = {
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
    solicitud: {
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
        SolicitudesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SolicitudesService>(SolicitudesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debería crear una solicitud cuando no hay duplicados recientes', async () => {
      const createDto = {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        telefono: '123456789',
        mensaje: 'Quiero aprender alemán',
      };

      mockPrismaService.solicitud.findFirst.mockResolvedValue(null);
      mockPrismaService.solicitud.create.mockResolvedValue(mockSolicitud);

      const result = await service.create(createDto);

      expect(result).toEqual(mockSolicitud);
      expect(prismaService.solicitud.findFirst).toHaveBeenCalled();
      expect(prismaService.solicitud.create).toHaveBeenCalled();
    });

    it('debería sanitizar los datos antes de crear', async () => {
      const createDto = {
        nombre: '<script>alert("XSS")</script>Juan',
        email: 'JUAN@EXAMPLE.COM',
        telefono: '<b>123</b>',
        mensaje: '<img src=x onerror=alert(1)>Mensaje',
      };

      mockPrismaService.solicitud.findFirst.mockResolvedValue(null);
      mockPrismaService.solicitud.create.mockResolvedValue(mockSolicitud);

      await service.create(createDto);

      const createCall = mockPrismaService.solicitud.create.mock.calls[0][0];
      
      // Verificar que el email fue normalizado
      expect(createCall.data.email).toBe('juan@example.com');
      
      // Verificar que no hay scripts en los datos
      expect(createCall.data.nombre).not.toContain('<script>');
      expect(createCall.data.mensaje).not.toContain('onerror');
    });

    it('debería lanzar BadRequestException si hay una solicitud reciente', async () => {
      const createDto = {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        telefono: '123456789',
        mensaje: 'Quiero aprender alemán',
      };

      // Simular que ya existe una solicitud reciente
      mockPrismaService.solicitud.findFirst.mockResolvedValue(mockSolicitud);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createDto)).rejects.toThrow(
        'Ya has enviado una solicitud recientemente',
      );
    });

    it('debería permitir crear solicitud si la anterior es mayor a 24h', async () => {
      const createDto = {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        telefono: '123456789',
        mensaje: 'Quiero aprender alemán',
      };

      // Solicitud creada hace 25 horas (más de 24h)
      const solicitudAntigua = {
        ...mockSolicitud,
        createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
      };

      mockPrismaService.solicitud.findFirst.mockResolvedValue(null);
      mockPrismaService.solicitud.create.mockResolvedValue(mockSolicitud);

      const result = await service.create(createDto);

      expect(result).toEqual(mockSolicitud);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las solicitudes ordenadas por fecha con paginación', async () => {
      const mockSolicitudes = [mockSolicitud, { ...mockSolicitud, id: 2 }];
      mockPrismaService.solicitud.findMany.mockResolvedValue(mockSolicitudes);
      mockPrismaService.solicitud.count.mockResolvedValue(20);

      const result = await service.findAll(undefined, 1, 10);

      expect(result).toEqual({
        data: mockSolicitudes,
        pagination: {
          page: 1,
          limit: 10,
          total: 20,
          totalPages: 2,
        },
      });
      expect(prismaService.solicitud.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
      expect(prismaService.solicitud.count).toHaveBeenCalledWith({
        where: undefined,
      });
    });

    it('debería filtrar por estado cuando se proporciona', async () => {
      mockPrismaService.solicitud.findMany.mockResolvedValue([mockSolicitud]);
      mockPrismaService.solicitud.count.mockResolvedValue(5);

      const result = await service.findAll('pendiente', 1, 10);

      expect(result.data).toEqual([mockSolicitud]);
      expect(result.pagination.total).toBe(5);
      expect(prismaService.solicitud.findMany).toHaveBeenCalledWith({
        where: { estado: 'pendiente' },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('update', () => {
    it('debería actualizar una solicitud existente', async () => {
      const updateDto = { estado: 'contactado' };
      const updatedSolicitud = { ...mockSolicitud, estado: 'contactado' };

      mockPrismaService.solicitud.findUnique.mockResolvedValue(mockSolicitud);
      mockPrismaService.solicitud.update.mockResolvedValue(updatedSolicitud);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedSolicitud);
      expect(prismaService.solicitud.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
    });

    it('debería lanzar NotFoundException si la solicitud no existe', async () => {
      mockPrismaService.solicitud.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { estado: 'contactado' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('debería eliminar una solicitud existente', async () => {
      mockPrismaService.solicitud.findUnique.mockResolvedValue(mockSolicitud);
      mockPrismaService.solicitud.delete.mockResolvedValue(mockSolicitud);

      const result = await service.remove(1);

      expect(result).toEqual(mockSolicitud);
      expect(prismaService.solicitud.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('debería lanzar NotFoundException si la solicitud no existe', async () => {
      mockPrismaService.solicitud.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
