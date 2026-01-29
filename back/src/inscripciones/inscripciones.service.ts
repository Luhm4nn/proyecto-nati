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
   * y que queden cupos disponibles.
   */
  async create(createInscripcionDto: CreateInscripcionDto, file: Express.Multer.File) {
    // 1. Verificar cupos
    const dictado = await this.prisma.dictadoCurso.findUnique({
      where: { id: createInscripcionDto.dictadoCursoId },
      include: {
        _count: {
          select: { inscripcions: true },
        },
      },
    });

    if (!dictado) {
      throw new NotFoundException('Dictado no encontrado');
    }

    if (dictado.cupos > 0 && dictado._count.inscripcions >= dictado.cupos) {
      throw new BadRequestException(
        'Lo sentimos, no quedan cupos disponibles para este dictado.',
      );
    }

    // 2. Verificar si ya existe una inscripcion del mismo email en las últimas 24 horas
    // const hace24Horas = new Date();
    // hace24Horas.setHours(hace24Horas.getHours() - 24);

    // const solicitudReciente = await this.prisma.inscripcion.findFirst({
    //   where: {
    //     email: createInscripcionDto.email,
    //     createdAt: {
    //       gte: hace24Horas,
    //     },
    //   },
    // });

    // if (solicitudReciente) {
    //   throw new BadRequestException(
    //     'Ya has enviado una solicitud recientemente. Por favor, espera 24 horas antes de enviar otra.',
    //   );
    // }

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

    // Notificar a la administración
    await this.mailService.sendMailNotificacionInscripcion(
      result.id, // Pasamos el ID para el link de confirmación
      createInscripcionDto.email,
      createInscripcionDto.nombre,
      createInscripcionDto.apellido,
      createInscripcionDto.dictadoCursoId,
      file,
    );
  }

  async confirmarInscripcion(id: number) {
    const inscripcion = await this.prisma.inscripcion.findUnique({
      where: { id },
      include: {
        dictadoCurso: {
          include: {
            curso: true
          }
        }
      }
    });

    if (!inscripcion) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }

    if (inscripcion.estado === 'confirmada') {
      throw new BadRequestException('Esta inscripción ya ha sido confirmada anteriormente.');
    }

    const updated = await this.prisma.inscripcion.update({
      where: { id },
      data: { estado: 'confirmada' },
    });

    // Enviar mail de confirmación al alumno
    await this.mailService.sendMailConfirmacionExito(
      inscripcion.email,
      inscripcion.nombre,
      inscripcion.dictadoCurso.curso.titulo
    );

    return updated;
  }

  async findAll(estado?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const where = estado ? { estado } : undefined;

    const [data, total] = await Promise.all([
      this.prisma.inscripcion.findMany({
        where,
        include: {
          dictadoCurso: {
            include: {
              curso: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.inscripcion.count({ where }),
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
    return this.prisma.inscripcion.findUnique({
      where: { id },
      include: {
        dictadoCurso: {
          include: {
            curso: true
          }
        }
      }
    });
  }

  async update(id: number, updateInscripcionDto: any) {
    const inscripcion = await this.prisma.inscripcion.findUnique({
      where: { id },
    });

    if (!inscripcion) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }

    return this.prisma.inscripcion.update({
      where: { id },
      data: updateInscripcionDto,
    });
  }

  async remove(id: number) {
    const inscripcion = await this.prisma.inscripcion.findUnique({
      where: { id },
    });

    if (!inscripcion) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }

    return this.prisma.inscripcion.delete({
      where: { id },
    });
  }
}
