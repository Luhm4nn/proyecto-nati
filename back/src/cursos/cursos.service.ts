import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { CreateDictadoCursoDto } from './dto/create-dictado-curso.dto';
import { UpdateDictadoCursoDto } from './dto/update-dictado-curso.dto';
import xss from 'xss';

@Injectable()
export class CursosService {
  constructor(private prisma: PrismaService) { }

  // ========== MÉTODOS PARA CURSOS ==========

  /**
   * Crear un nuevo curso
   */
  async create(createCursoDto: CreateCursoDto) {
    const dataSanitizada = {
      titulo: xss(createCursoDto.titulo),
      descripcion: xss(createCursoDto.descripcion),
      items: createCursoDto.items.map((item) => xss(item)),
      activo: createCursoDto.activo !== undefined ? createCursoDto.activo : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.prisma.curso.create({
      data: dataSanitizada,
    });
  }

  /**
   * Obtener todos los cursos con sus dictados
   */
  async findAll() {
    return this.prisma.curso.findMany({
      include: {
        dictados_curso: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Obtener un curso por ID
   */
  async findOne(id: number) {
    const curso = await this.prisma.curso.findUnique({
      where: { id },
      include: {
        dictados_curso: true,
      },
    });

    if (!curso) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }

    return curso;
  }

  /**
   * Actualizar un curso
   */
  async update(id: number, updateCursoDto: UpdateCursoDto) {
    await this.findOne(id);

    const dataSanitizada: any = {};
    if (updateCursoDto.titulo) {
      dataSanitizada.titulo = xss(updateCursoDto.titulo);
    }
    if (updateCursoDto.descripcion) {
      dataSanitizada.descripcion = xss(updateCursoDto.descripcion);
    }
    if (updateCursoDto.items) {
      dataSanitizada.items = updateCursoDto.items.map((item) => xss(item));
    }
    if (updateCursoDto.activo !== undefined) {
      dataSanitizada.activo = updateCursoDto.activo;
    }

    return this.prisma.curso.update({
      where: { id },
      data: {
        ...dataSanitizada,
        updatedAt: new Date(),
      },
      include: {
        dictados_curso: true,
      },
    });
  }

  /**
   * Eliminar un curso (eliminará sus dictados en cascada)
   */
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.curso.delete({
      where: { id },
    });
  }

  // ========== MÉTODOS PARA DICTADOS DE CURSO ==========

  /**
   * Crear un nuevo dictado de curso
   */
  async createDictado(createDictadoDto: CreateDictadoCursoDto) {
    const curso = await this.prisma.curso.findUnique({
      where: { id: createDictadoDto.cursoId },
    });

    if (!curso) {
      throw new NotFoundException(
        `Curso con ID ${createDictadoDto.cursoId} no encontrado`,
      );
    }

    // Validar que la fecha de fin sea posterior a la fecha de inicio
    const fechaInicio = new Date(createDictadoDto.fechaInicio);
    const fechaFin = new Date(createDictadoDto.fechaFin);

    if (fechaFin <= fechaInicio) {
      throw new BadRequestException(
        'La fecha de fin debe ser posterior a la fecha de inicio',
      );
    }

    return this.prisma.dictadoCurso.create({
      data: {
        cursoId: createDictadoDto.cursoId,
        horarioInicio: createDictadoDto.horarioInicio,
        horarioFin: createDictadoDto.horarioFin,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        duracionEstimada: createDictadoDto.duracionEstimada,
        diasSemana: createDictadoDto.diasSemana,
        cupos: createDictadoDto.cupos || 0,
        activo: createDictadoDto.activo !== undefined ? createDictadoDto.activo : true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        curso: true,
      },
    });
  }

  /**
   * Obtener todos los dictados de un curso
   */
  async findDictadosByCurso(cursoId: number) {
    await this.findOne(cursoId);

    return this.prisma.dictadoCurso.findMany({
      where: { cursoId },
      include: {
        curso: true,
      },
      orderBy: {
        fechaInicio: 'desc',
      },
    });
  }

  /**
   * Obtener un dictado específico
   */
  async findOneDictado(id: number) {
    const dictado = await this.prisma.dictadoCurso.findUnique({
      where: { id },
      include: {
        curso: true,
      },
    });

    if (!dictado) {
      throw new NotFoundException(`Dictado con ID ${id} no encontrado`);
    }

    return dictado;
  }

  /**
   * Actualizar un dictado de curso
   */
  async updateDictado(id: number, updateDictadoDto: UpdateDictadoCursoDto) {
    await this.findOneDictado(id);

    if (updateDictadoDto.cursoId) {
      const curso = await this.prisma.curso.findUnique({
        where: { id: updateDictadoDto.cursoId },
      });

      if (!curso) {
        throw new NotFoundException(
          `Curso con ID ${updateDictadoDto.cursoId} no encontrado`,
        );
      }
    }

    // Validar fechas si se actualizan ambas
    if (updateDictadoDto.fechaInicio && updateDictadoDto.fechaFin) {
      const fechaInicio = new Date(updateDictadoDto.fechaInicio);
      const fechaFin = new Date(updateDictadoDto.fechaFin);

      if (fechaFin <= fechaInicio) {
        throw new BadRequestException(
          'La fecha de fin debe ser posterior a la fecha de inicio',
        );
      }
    }

    return this.prisma.dictadoCurso.update({
      where: { id },
      data: {
        cursoId: updateDictadoDto.cursoId,
        horarioInicio: updateDictadoDto.horarioInicio,
        horarioFin: updateDictadoDto.horarioFin,
        fechaInicio: updateDictadoDto.fechaInicio ? new Date(updateDictadoDto.fechaInicio) : undefined,
        fechaFin: updateDictadoDto.fechaFin ? new Date(updateDictadoDto.fechaFin) : undefined,
        duracionEstimada: updateDictadoDto.duracionEstimada,
        diasSemana: updateDictadoDto.diasSemana,
        cupos: updateDictadoDto.cupos,
        activo: updateDictadoDto.activo,
        updatedAt: new Date(),
      },
      include: {
        curso: true,
      },
    });
  }

  /**
   * Eliminar un dictado de curso
   */
  async removeDictado(id: number) {
    await this.findOneDictado(id);

    return this.prisma.dictadoCurso.delete({
      where: { id },
    });
  }
}
