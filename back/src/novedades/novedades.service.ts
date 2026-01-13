import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNovedadDto } from './dto/create-novedad.dto';
import { UpdateNovedadDto } from './dto/update-novedad.dto';
import { v2 as cloudinary } from 'cloudinary';
import xss from 'xss';

@Injectable()
export class NovedadesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Subir imagen a Cloudinary con optimización automática
   */
  private async uploadToCloudinary(
    file: Express.Multer.File,
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'novedades',
          resource_type: 'image',
          transformation: [
            { width: 1920, height: 1080, crop: 'limit' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Error al subir la imagen'));
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
   * Eliminar imagen de Cloudinary
   */
  private async deleteFromCloudinary(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error al eliminar imagen de Cloudinary:', error);
    }
  }

  /**
   * Crear una nueva novedad con imagen
   */
  async create(
    createNovedadDto: CreateNovedadDto,
    file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('La imagen es requerida');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Formato de imagen no válido. Solo se permiten JPEG, PNG y WebP',
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(
        'La imagen es demasiado grande. Tamaño máximo: 5MB',
      );
    }

    const { url, publicId } = await this.uploadToCloudinary(file);

    const dataSanitizada = {
      titulo: xss(createNovedadDto.titulo),
      descripcion: xss(createNovedadDto.descripcion),
      imagenUrl: url,
      imagenPublicId: publicId,
    };

    return this.prisma.novedad.create({
      data: dataSanitizada,
    });
  }

  /**
   * Obtener todas las novedades
   */
  async findAll() {
    return this.prisma.novedad.findMany({
      orderBy: { id: 'desc' },
    });
  }

  /**
   * Obtener una novedad por ID
   */
  async findOne(id: number) {
    const novedad = await this.prisma.novedad.findUnique({
      where: { id },
    });

    if (!novedad) {
      throw new NotFoundException(`Novedad con ID ${id} no encontrada`);
    }

    return novedad;
  }

  /**
   * Actualizar novedad
   */
  async update(
    id: number,
    updateNovedadDto: UpdateNovedadDto,
    file?: Express.Multer.File,
  ) {
    const novedadExistente = await this.findOne(id);

    let imagenUrl = novedadExistente.imagenUrl;
    let imagenPublicId = novedadExistente.imagenPublicId;

    if (file) {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          'Formato de imagen no válido. Solo se permiten JPEG, PNG y WebP',
        );
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new BadRequestException(
          'La imagen es demasiado grande. Tamaño máximo: 5MB',
        );
      }

      if (novedadExistente.imagenPublicId) {
        await this.deleteFromCloudinary(novedadExistente.imagenPublicId);
      }

      const uploadResult = await this.uploadToCloudinary(file);
      imagenUrl = uploadResult.url;
      imagenPublicId = uploadResult.publicId;
    }

    const dataSanitizada: any = {};
    if (updateNovedadDto.titulo) {
      dataSanitizada.titulo = xss(updateNovedadDto.titulo);
    }
    if (updateNovedadDto.descripcion) {
      dataSanitizada.descripcion = xss(updateNovedadDto.descripcion);
    }

    if (file) {
      dataSanitizada.imagenUrl = imagenUrl;
      dataSanitizada.imagenPublicId = imagenPublicId;
    }

    return this.prisma.novedad.update({
      where: { id },
      data: dataSanitizada,
    });
  }

  /**
   * Eliminar novedad
   */
  async remove(id: number) {
    const novedad = await this.findOne(id);

    if (novedad.imagenPublicId) {
      await this.deleteFromCloudinary(novedad.imagenPublicId);
    }

    return this.prisma.novedad.delete({
      where: { id },
    });
  }
}
