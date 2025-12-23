import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestimonioDto } from './dto/create-testimonio.dto';
import { UpdateTestimonioDto } from './dto/update-testimonio.dto';
import xss from 'xss';

@Injectable()
export class TestimoniosService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crear un nuevo testimonio
   */
  async create(createTestimonioDto: CreateTestimonioDto) {
    const dataSanitizada = {
      nombreCompleto: xss(createTestimonioDto.nombreCompleto),
      texto: xss(createTestimonioDto.texto),
      activo: createTestimonioDto.activo ?? true,
    };

    return this.prisma.testimonio.create({
      data: dataSanitizada,
    });
  }

  /**
   * Obtener todos los testimonios activos (público) o todos (admin)
   */
  async findAll(soloActivos: boolean = true) {
    return this.prisma.testimonio.findMany({
      where: soloActivos ? { activo: true } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Obtener un testimonio por ID
   */
  async findOne(id: number) {
    const testimonio = await this.prisma.testimonio.findUnique({
      where: { id },
    });

    if (!testimonio) {
      throw new NotFoundException(`Testimonio con ID ${id} no encontrado`);
    }

    return testimonio;
  }

  /**
   * Actualizar un testimonio
   */
  async update(id: number, updateTestimonioDto: UpdateTestimonioDto) {
    await this.findOne(id); // Verifica que existe

    const dataSanitizada: any = {};
    
    if (updateTestimonioDto.nombreCompleto) {
      dataSanitizada.nombreCompleto = xss(updateTestimonioDto.nombreCompleto);
    }
    if (updateTestimonioDto.texto) {
      dataSanitizada.texto = xss(updateTestimonioDto.texto);
    }
    if (updateTestimonioDto.activo !== undefined) {
      dataSanitizada.activo = updateTestimonioDto.activo;
    }

    return this.prisma.testimonio.update({
      where: { id },
      data: dataSanitizada,
    });
  }

  /**
   * Eliminar un testimonio
   */
  async remove(id: number) {
    await this.findOne(id); // Verifica que existe

    return this.prisma.testimonio.delete({
      where: { id },
    });
  }
}
