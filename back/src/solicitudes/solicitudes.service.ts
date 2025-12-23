import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';
import xss from 'xss';

@Injectable()
export class SolicitudesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crea una nueva solicitud verificando que no exista una duplicada en las últimas 24h
   */
  async create(createSolicitudDto: CreateSolicitudDto) {
    // Verificar si ya existe una solicitud del mismo email en las últimas 24 horas
    const hace24Horas = new Date();
    hace24Horas.setHours(hace24Horas.getHours() - 24);

    const solicitudReciente = await this.prisma.solicitud.findFirst({
      where: {
        email: createSolicitudDto.email,
        createdAt: {
          gte: hace24Horas,
        },
      },
    });

    if (solicitudReciente) {
      throw new BadRequestException(
        'Ya has enviado una solicitud recientemente. Por favor, espera 24 horas antes de enviar otra.',
      );
    }

    // Sanitizar inputs contra XSS
    const dataSanitizada = {
      nombre: xss(createSolicitudDto.nombre),
      email: createSolicitudDto.email.toLowerCase().trim(),
      telefono: createSolicitudDto.telefono
        ? xss(createSolicitudDto.telefono)
        : null,
      mensaje: xss(createSolicitudDto.mensaje),
    };

    return this.prisma.solicitud.create({
      data: dataSanitizada,
    });
  }

  async findAll(estado?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const where = estado ? { estado } : undefined;
    
    const [data, total] = await Promise.all([
      this.prisma.solicitud.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.solicitud.count({ where }),
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
    return this.prisma.solicitud.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateSolicitudDto: UpdateSolicitudDto) {
    const solicitud = await this.prisma.solicitud.findUnique({
      where: { id },
    });

    if (!solicitud) {
      throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);
    }

    return this.prisma.solicitud.update({
      where: { id },
      data: updateSolicitudDto,
    });
  }

  async remove(id: number) {
    const solicitud = await this.prisma.solicitud.findUnique({
      where: { id },
    });

    if (!solicitud) {
      throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);
    }

    return this.prisma.solicitud.delete({
      where: { id },
    });
  }
}
