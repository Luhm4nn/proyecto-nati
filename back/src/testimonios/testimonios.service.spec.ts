import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TestimoniosService } from './testimonios.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TestimoniosService', () => {
  let service: TestimoniosService;
  let prisma: PrismaService;

  const mockPrismaService = {
    testimonio: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestimoniosService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TestimoniosService>(TestimoniosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un testimonio con datos sanitizados', async () => {
      const createDto = {
        nombreCompleto: 'Juan Pérez',
        texto: 'Excelente profesora',
        activo: true,
      };

      const expectedResult = {
        id: 1,
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.testimonio.create.mockResolvedValue(expectedResult);

      const result = await service.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.testimonio.create).toHaveBeenCalledWith({
        data: {
          nombreCompleto: createDto.nombreCompleto,
          texto: createDto.texto,
          activo: true,
        },
      });
    });

    it('debería sanitizar XSS en nombre y texto', async () => {
      const createDto = {
        nombreCompleto: '<script>alert("xss")</script>Juan',
        texto: '<img src=x onerror=alert(1)>Testimonio',
        activo: true,
      };

      mockPrismaService.testimonio.create.mockResolvedValue({
        id: 1,
        nombreCompleto: 'Juan',
        texto: 'Testimonio',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await service.create(createDto);

      const callArgs = mockPrismaService.testimonio.create.mock.calls[0][0];
      // XSS escapa el HTML peligroso en lugar de eliminarlo completamente
      expect(callArgs.data.nombreCompleto).toContain('&lt;');
      expect(callArgs.data.texto).not.toContain('onerror=');
    });

    it('debería establecer activo=true por defecto si no se proporciona', async () => {
      const createDto = {
        nombreCompleto: 'María González',
        texto: 'Gran experiencia',
      };

      mockPrismaService.testimonio.create.mockResolvedValue({
        id: 2,
        ...createDto,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await service.create(createDto as any);

      const callArgs = mockPrismaService.testimonio.create.mock.calls[0][0];
      expect(callArgs.data.activo).toBe(true);
    });
  });

  describe('findAll', () => {
    it('debería retornar solo testimonios activos por defecto', async () => {
      const testimonios = [
        { id: 1, nombreCompleto: 'Juan', texto: 'Test', activo: true },
        { id: 2, nombreCompleto: 'María', texto: 'Test 2', activo: true },
      ];

      mockPrismaService.testimonio.findMany.mockResolvedValue(testimonios);

      const result = await service.findAll();

      expect(result).toEqual(testimonios);
      expect(mockPrismaService.testimonio.findMany).toHaveBeenCalledWith({
        where: { activo: true },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('debería retornar todos los testimonios cuando soloActivos=false', async () => {
      const testimonios = [
        { id: 1, nombreCompleto: 'Juan', texto: 'Test', activo: true },
        { id: 2, nombreCompleto: 'María', texto: 'Test 2', activo: false },
      ];

      mockPrismaService.testimonio.findMany.mockResolvedValue(testimonios);

      const result = await service.findAll(false);

      expect(result).toEqual(testimonios);
      expect(mockPrismaService.testimonio.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('debería retornar array vacío si no hay testimonios', async () => {
      mockPrismaService.testimonio.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('debería retornar un testimonio por ID', async () => {
      const testimonio = {
        id: 1,
        nombreCompleto: 'Juan Pérez',
        texto: 'Excelente',
        activo: true,
      };

      mockPrismaService.testimonio.findUnique.mockResolvedValue(testimonio);

      const result = await service.findOne(1);

      expect(result).toEqual(testimonio);
      expect(mockPrismaService.testimonio.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('debería lanzar NotFoundException si el testimonio no existe', async () => {
      mockPrismaService.testimonio.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Testimonio con ID 999 no encontrado',
      );
    });
  });

  describe('update', () => {
    it('debería actualizar un testimonio existente', async () => {
      const existingTestimonio = {
        id: 1,
        nombreCompleto: 'Juan',
        texto: 'Original',
        activo: true,
      };

      const updateDto = {
        texto: 'Actualizado',
        activo: false,
      };

      mockPrismaService.testimonio.findUnique.mockResolvedValue(
        existingTestimonio,
      );
      mockPrismaService.testimonio.update.mockResolvedValue({
        ...existingTestimonio,
        ...updateDto,
      });

      const result = await service.update(1, updateDto);

      expect(result.texto).toBe('Actualizado');
      expect(result.activo).toBe(false);
      expect(mockPrismaService.testimonio.update).toHaveBeenCalled();
    });

    it('debería sanitizar XSS en actualización', async () => {
      mockPrismaService.testimonio.findUnique.mockResolvedValue({
        id: 1,
        nombreCompleto: 'Juan',
        texto: 'Original',
        activo: true,
      });

      const updateDto = {
        texto: '<script>alert("hack")</script>Nuevo texto',
      };

      mockPrismaService.testimonio.update.mockResolvedValue({
        id: 1,
        nombreCompleto: 'Juan',
        texto: 'Nuevo texto',
        activo: true,
      });

      await service.update(1, updateDto);

      const callArgs = mockPrismaService.testimonio.update.mock.calls[0][0];
      // XSS escapa tags peligrosos: <script> se convierte en &lt;script&gt;
      expect(callArgs.data.texto).toContain('&lt;script&gt;');
      expect(callArgs.data.texto).toContain('&lt;/script&gt;');
    });

    it('debería lanzar NotFoundException si el testimonio no existe', async () => {
      mockPrismaService.testimonio.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { texto: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('debería actualizar solo los campos proporcionados', async () => {
      mockPrismaService.testimonio.findUnique.mockResolvedValue({
        id: 1,
        nombreCompleto: 'Juan',
        texto: 'Original',
        activo: true,
      });

      mockPrismaService.testimonio.update.mockResolvedValue({
        id: 1,
        nombreCompleto: 'Juan',
        texto: 'Original',
        activo: false,
      });

      const updateDto = { activo: false };
      await service.update(1, updateDto);

      const callArgs = mockPrismaService.testimonio.update.mock.calls[0][0];
      expect(callArgs.data).toEqual({ activo: false });
    });
  });

  describe('remove', () => {
    it('debería eliminar un testimonio existente', async () => {
      const testimonio = {
        id: 1,
        nombreCompleto: 'Juan',
        texto: 'Test',
        activo: true,
      };

      mockPrismaService.testimonio.findUnique.mockResolvedValue(testimonio);
      mockPrismaService.testimonio.delete.mockResolvedValue(testimonio);

      const result = await service.remove(1);

      expect(result).toEqual(testimonio);
      expect(mockPrismaService.testimonio.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('debería lanzar NotFoundException si el testimonio no existe', async () => {
      mockPrismaService.testimonio.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
