import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import xss from 'xss';

@Injectable()
export class ConsultasService {
  constructor(private prisma: PrismaService) { }

  /**
   * Crea una nueva consulta verificando que no exista una duplicada en las últimas 24h
   */
  async create(createConsultaDto: CreateConsultaDto) {
    // Verificar si ya existe una consulta del mismo email en las últimas 24 horas
    const hace24Horas = new Date();
    hace24Horas.setHours(hace24Horas.getHours() - 24);

    const consultaReciente = await this.prisma.consulta.findFirst({
      where: {
        email: createConsultaDto.email,
        createdAt: {
          gte: hace24Horas,
        },
      },
    });

    if (consultaReciente) {
      throw new BadRequestException(
        'Ya has enviado una consulta recientemente. Por favor, espera 24 horas antes de enviar otra.',
      );
    }

    // Sanitizar inputs contra XSS
    const dataSanitizada = {
      nombre: xss(createConsultaDto.nombre),
      email: createConsultaDto.email.toLowerCase().trim(),
      telefono: createConsultaDto.telefono
        ? xss(createConsultaDto.telefono)
        : null,
      mensaje: xss(createConsultaDto.mensaje),
    };

    return this.prisma.consulta.create({
      data: dataSanitizada,
    });
  }

  async findAll(estado?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const where = estado ? { estado } : undefined;

    const [data, total] = await Promise.all([
      this.prisma.consulta.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.consulta.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    return this.prisma.consulta.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateConsultaDto: UpdateConsultaDto) {
    const consulta = await this.prisma.consulta.findUnique({
      where: { id },
    });

    if (!consulta) {
      throw new NotFoundException(`Consulta con ID ${id} no encontrada`);
    }

    return this.prisma.consulta.update({
      where: { id },
      data: updateConsultaDto,
    });
  }

  async remove(id: number) {
    const consulta = await this.prisma.consulta.findUnique({
      where: { id },
    });

    if (!consulta) {
      throw new NotFoundException(`Consulta con ID ${id} no encontrada`);
    }

    return this.prisma.consulta.delete({
      where: { id },
    });
  }
}
