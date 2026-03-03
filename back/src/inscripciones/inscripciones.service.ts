import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import xss from 'xss';
import { v2 as cloudinary } from 'cloudinary';
import { MailService } from 'src/utils/mail.service';
import * as path from 'path';

@Injectable()
export class InscripcionesService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) { }

  /**
   * Subir archivo a Cloudinary
   */
  private async uploadToCloudinary(
    file: Express.Multer.File,
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      // Determinar el resource_type basado en el mimetype
      const isImage = file.mimetype.startsWith('image/');
      const resourceType = isImage ? 'image' : 'raw';

      // Para archivos raw, necesitamos incluir la extensión en el public_id 
      // para que Cloudinary la sirva correctamente en el enlace
      const extension = path.extname(file.originalname);
      const nombreBase = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9]/g, '_');
      const publicId = `${nombreBase}_${Date.now()}${extension}`;

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'inscripciones',
          resource_type: resourceType,
          public_id: publicId,
        },
        (error, result) => {
          if (error) {
            console.error('Error en Cloudinary:', error);
            return reject(error);
          }
          if (!result) return reject(new Error('Error al subir el archivo'));
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  /**
   * Eliminar archivo de Cloudinary
   */
  private async deleteFromCloudinary(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    } catch (error) {
      console.error('Error al eliminar archivo de Cloudinary:', error);
    }
  }

  /**
   * Crea una nueva inscripción verificando que no exista una duplicada en las últimas 24h
   * y que queden cupos disponibles.
   */
  async create(createInscripcionDto: CreateInscripcionDto, file: Express.Multer.File) {
    // 1. Verificar cupos
    const dictado = await this.prisma.dictadoCurso.findUnique({
      where: { id: createInscripcionDto.dictadoCursoId },
      include: {
        _count: {
          select: {
            inscripciones: {
              where: { estado: 'confirmada' },
            },
          },
        },
      },
    });

    if (!dictado) {
      throw new NotFoundException('Dictado no encontrado');
    }

    if (dictado.cupos > 0 && dictado._count.inscripciones >= dictado.cupos) {
      throw new BadRequestException(
        'Lo sentimos, no quedan cupos disponibles para este dictado.',
      );
    }

    // 2. Subir a Cloudinary si hay archivo
    let comprobanteUrl: string | undefined = undefined;
    let comprobantePublicId: string | undefined = undefined;

    if (file) {
      const uploadResult = await this.uploadToCloudinary(file);
      comprobanteUrl = uploadResult.url;
      comprobantePublicId = uploadResult.publicId;
    }

    // Separar campos que no van a la base de datos
    const { emailConfirmacion, ...dataToSave } = createInscripcionDto;

    let result = await this.prisma.inscripcion.create({
      data: {
        ...dataToSave,
        comprobanteUrl,
        comprobantePublicId,
      },
    });

    if (!result) {
      throw new BadRequestException(
        'No se pudo crear la inscripcion. Por favor, intente de nuevo.',
      );
    }

    // Notificar a la administración (en segundo plano)
    this.mailService.sendMailNotificacionInscripcion(
      result.id, // Pasamos el ID para el link de confirmación
      createInscripcionDto.email,
      createInscripcionDto.nombre,
      createInscripcionDto.apellido,
      createInscripcionDto.dictadoCursoId,
      comprobanteUrl, // Pasar la URL
    ).catch(error => console.error('Error enviando mail de notificación:', error));

    return result;
  }

  /**
   * Crea una inscripción directamente desde el panel de admin (ya confirmada)
   */
  async createAdmin(createInscripcionDto: CreateInscripcionDto) {
    // 1. Verificar cupos
    const dictado = await this.prisma.dictadoCurso.findUnique({
      where: { id: createInscripcionDto.dictadoCursoId },
      include: {
        _count: {
          select: {
            inscripciones: {
              where: { estado: 'confirmada' },
            },
          },
        },
      },
    });

    if (!dictado) {
      throw new NotFoundException('Dictado no encontrado');
    }

    if (dictado.cupos > 0 && dictado._count.inscripciones >= dictado.cupos) {
      throw new BadRequestException('No quedan cupos disponibles.');
    }

    // Separar campos que no van a la base de datos
    const { emailConfirmacion, ...dataToSave } = createInscripcionDto;

    return this.prisma.inscripcion.create({
      data: {
        ...dataToSave,
        estado: 'confirmada' // Forzamos estado confirmada
      },
    });
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

    // Enviar mail de confirmación al alumno (en segundo plano)
    this.mailService.sendMailConfirmacionExito(
      inscripcion.email,
      inscripcion.nombre,
      inscripcion.dictadoCurso.curso.titulo
    ).catch(error => console.error('Error enviando mail de confirmación:', error));

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

  async update(id: number, updateInscripcionDto: UpdateInscripcionDto) {
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

    if (inscripcion.comprobantePublicId) {
      await this.deleteFromCloudinary(inscripcion.comprobantePublicId);
    }

    return this.prisma.inscripcion.delete({
      where: { id },
    });
  }
}
