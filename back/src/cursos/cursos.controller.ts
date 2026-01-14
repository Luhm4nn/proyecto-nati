import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { CreateDictadoCursoDto } from './dto/create-dictado-curso.dto';
import { UpdateDictadoCursoDto } from './dto/update-dictado-curso.dto';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}
  /**
   * Crear curso - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCursoDto: CreateCursoDto) {
    return this.cursosService.create(createCursoDto);
  }

  /**
   * Obtener todos los cursos - PÚBLICO
   */
  @Get()
  findAll() {
    return this.cursosService.findAll();
  }

  /**
   * Obtener un curso por ID - PÚBLICO
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.findOne(id);
  }

  /**
   * Actualizar un curso - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCursoDto: UpdateCursoDto,
  ) {
    return this.cursosService.update(id, updateCursoDto);
  }

  /**
   * Eliminar un curso - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.remove(id);
  }

  // ========== ENDPOINTS DE DICTADOS DE CURSO ==========

  /**
   * Crear dictado de curso - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Post('dictados')
  createDictado(@Body() createDictadoDto: CreateDictadoCursoDto) {
    return this.cursosService.createDictado(createDictadoDto);
  }

  /**
   * Obtener dictados de un curso - PÚBLICO
   */
  @Get(':cursoId/dictados')
  findDictadosByCurso(@Param('cursoId', ParseIntPipe) cursoId: number) {
    return this.cursosService.findDictadosByCurso(cursoId);
  }

  /**
   * Obtener un dictado específico - PÚBLICO
   */
  @Get('dictados/:id')
  findOneDictado(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.findOneDictado(id);
  }

  /**
   * Actualizar un dictado - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Patch('dictados/:id')
  updateDictado(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDictadoDto: UpdateDictadoCursoDto,
  ) {
    return this.cursosService.updateDictado(id, updateDictadoDto);
  }

  /**
   * Eliminar un dictado - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Delete('dictados/:id')
  removeDictado(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.removeDictado(id);
  }
}
