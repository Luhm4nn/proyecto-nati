import { Test, TestingModule } from '@nestjs/testing';
import { NovedadesService } from './novedades.service';
import { PrismaService } from '../prisma/prisma.service';

describe('NovedadesService', () => {
  let service: NovedadesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NovedadesService,
        {
          provide: PrismaService,
          useValue: {
            novedad: {
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

    service = module.get<NovedadesService>(NovedadesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
