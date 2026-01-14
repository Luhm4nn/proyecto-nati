import { Test, TestingModule } from '@nestjs/testing';
import { CursosService } from './cursos.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CursosService', () => {
  let service: CursosService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CursosService,
        {
          provide: PrismaService,
          useValue: {
            curso: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            dictadoCurso: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CursosService>(CursosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a curso', async () => {
      const createDto = {
        titulo: 'Curso de Testing',
        descripcion: 'Descripción del curso de testing',
        items: ['Item 1', 'Item 2'],
      };

      const expectedResult = {
        id: 1,
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        dictadosCurso: [],
      };

      jest.spyOn(prisma.curso, 'create').mockResolvedValue(expectedResult);

      const result = await service.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(prisma.curso.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of cursos', async () => {
      const expectedResult = [
        {
          id: 1,
          titulo: 'Curso 1',
          descripcion: 'Descripción 1',
          items: ['Item 1'],
          createdAt: new Date(),
          updatedAt: new Date(),
          dictadosCurso: [],
        },
      ];

      jest.spyOn(prisma.curso, 'findMany').mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a curso by id', async () => {
      const expectedResult = {
        id: 1,
        titulo: 'Curso 1',
        descripcion: 'Descripción 1',
        items: ['Item 1'],
        createdAt: new Date(),
        updatedAt: new Date(),
        dictadosCurso: [],
      };

      jest.spyOn(prisma.curso, 'findUnique').mockResolvedValue(expectedResult);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException when curso not found', async () => {
      jest.spyOn(prisma.curso, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('Curso con ID 999 no encontrado');
    });
  });
});
