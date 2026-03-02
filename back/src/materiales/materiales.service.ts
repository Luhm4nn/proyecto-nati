import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { v2 as cloudinary } from 'cloudinary';
import xss from 'xss';
import * as path from 'path';

@Injectable()
export class MaterialesService {
  constructor(private prisma: PrismaService) {}

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
          folder: 'materiales',
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
      // Para archivos no-imagen, a veces se requiere especificar el resource_type
      // 'auto' suele funcionar, pero si no, intentamos con 'raw' o 'image' basado en la subida original
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
      // Nota: Cloudinary maneja PDFs a veces como images o como raw dependiendo de la config.
      // Ejecutar ambos asegura que se borre.
    } catch (error) {
      console.error('Error al eliminar archivo de Cloudinary:', error);
    }
  }

  /**
   * Crear un nuevo material
   */
  async create(
    createMaterialDto: CreateMaterialDto,
    file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('El archivo es requerido');
    }

    // Validaciones básicas de archivo (PDF, DOCX, etc)
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    // Si queremos ser más flexibles:
    // if (!allowedMimeTypes.includes(file.mimetype)) { ... }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException(
        'El archivo es demasiado grande. Tamaño máximo: 10MB',
      );
    }

    const { url, publicId } = await this.uploadToCloudinary(file);

    const dataSanitizada = {
      nombre: xss(createMaterialDto.nombre),
      docUrl: url,
      docPublicId: publicId,
    };

    return this.prisma.material.create({
      data: dataSanitizada,
    });
  }

  /**
   * Obtener todos los materiales
   */
  async findAll() {
    return this.prisma.material.findMany({
      orderBy: { id: 'desc' },
    });
  }

  /**
   * Obtener un material por ID
   */
  async findOne(id: number) {
    const material = await this.prisma.material.findUnique({
      where: { id },
    });

    if (!material) {
      throw new NotFoundException(`Material con ID ${id} no encontrado`);
    }

    return material;
  }

  /**
   * Actualizar material
   */
  async update(
    id: number,
    updateMaterialDto: UpdateMaterialDto,
    file?: Express.Multer.File,
  ) {
    const materialExistente = await this.findOne(id);

    let docUrl = materialExistente.docUrl;
    let docPublicId = materialExistente.docPublicId;

    if (file) {
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new BadRequestException(
          'El archivo es demasiado grande. Tamaño máximo: 10MB',
        );
      }

      if (materialExistente.docPublicId) {
        await this.deleteFromCloudinary(materialExistente.docPublicId);
      }

      const uploadResult = await this.uploadToCloudinary(file);
      docUrl = uploadResult.url;
      docPublicId = uploadResult.publicId;
    }

    const dataSanitizada: any = {};
    if (updateMaterialDto.nombre) {
      dataSanitizada.nombre = xss(updateMaterialDto.nombre);
    }

    if (file) {
      dataSanitizada.docUrl = docUrl;
      dataSanitizada.docPublicId = docPublicId;
    }

    return this.prisma.material.update({
      where: { id },
      data: dataSanitizada,
    });
  }

  /**
   * Eliminar material
   */
  async remove(id: number) {
    const material = await this.findOne(id);

    if (material.docPublicId) {
      await this.deleteFromCloudinary(material.docPublicId);
    }

    return this.prisma.material.delete({
      where: { id },
    });
  }
}
