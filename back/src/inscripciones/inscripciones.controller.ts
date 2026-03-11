import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InscripcionesService } from './inscripciones.service';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { EnviarCorreoMasivoDto } from './dto/enviar-correo-masivo.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) { }

  @Throttle({ default: { limit: 10, ttl: 3600000 } })
  @Post()
  @UseInterceptors(FileInterceptor('comprobante'))
  create(@Body() createInscripcionDto: CreateInscripcionDto, @UploadedFile() file: Express.Multer.File) {
    return this.inscripcionesService.create(createInscripcionDto, file);
  }

  /**
   * Crear inscripción desde el panel de admin - PROTEGIDO
   */
  @UseGuards(JwtAuthGuard)
  @Post('admin')
  createAdmin(@Body() createInscripcionDto: CreateInscripcionDto) {
    return this.inscripcionesService.createAdmin(createInscripcionDto);
  }

  /**
   * Obtener emails de alumnos confirmados en cursos en curso
   */
  @UseGuards(JwtAuthGuard)
  @Get('emails-activos')
  obtenerEmailsActivos() {
    return this.inscripcionesService.obtenerEmailsActivos();
  }

  /**
   * Enviar correo masivo
   */
  @UseGuards(JwtAuthGuard)
  @Post('correo-masivo')
  enviarCorreoMasivo(@Body() body: EnviarCorreoMasivoDto) {
    return this.inscripcionesService.enviarCorreoMasivo(body.emails, body.asunto, body.cuerpo);
  }

  /**
   * Obtener todas las inscripciones - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('estado') estado?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.inscripcionesService.findAll(estado, pageNum, limitNum);
  }

  /**
   * Obtener una inscripción por ID - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inscripcionesService.findOne(+id);
  }

  /**
   * Actualizar inscripción - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInscripcionDto: UpdateInscripcionDto) {
    return this.inscripcionesService.update(+id, updateInscripcionDto);
  }

  /**
   * Confirmar inscripción - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/confirmar')
  confirmar(@Param('id') id: string) {
    return this.inscripcionesService.confirmarInscripcion(+id);
  }

  /**
   * Eliminar inscripción - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inscripcionesService.remove(+id);
  }
}

