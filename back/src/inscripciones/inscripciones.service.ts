import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import xss from 'xss';
import { MailService } from 'src/utils/mail.service';
import { UpdateSolicitudDto } from 'src/solicitudes/dto/update-solicitud.dto';

@Injectable()
export class InscripcionesService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) { }

  /**
   * Crea una nueva inscripcion verificando que no exista una duplicada en las últimas 24h
   */
  async create(createInscripcionDto: CreateInscripcionDto, file: Express.Multer.File) {
    // Verificar si ya existe una inscripcion del mismo email en las últimas 24 horas
    const hace24Horas = new Date();
    hace24Horas.setHours(hace24Horas.getHours() - 24);

    const solicitudReciente = await this.prisma.inscripcion.findFirst({
      where: {
        email: createInscripcionDto.email,
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

    // Separar campos que no van a la base de datos
    const { emailConfirmacion, ...dataToSave } = createInscripcionDto;

    let result = await this.prisma.inscripcion.create({
      data: dataToSave,
    });

    if (!result) {
      throw new BadRequestException(
        'No se pudo crear la inscripcion. Por favor, intente de nuevo.',
      );
    }

    await this.mailService.sendMailNotificacionInscripcion(
      createInscripcionDto.email,
      createInscripcionDto.nombre,
      createInscripcionDto.apellido,
      createInscripcionDto.dictadoCursoId,
      file,
    );

  }

  async findAll(estado?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const where = estado ? { estado } : undefined;

    const [data, total] = await Promise.all([
      this.prisma.inscripcion.findMany({
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
