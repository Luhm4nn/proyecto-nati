import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InscripcionesService } from './inscripciones.service';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateSolicitudDto } from 'src/solicitudes/dto/update-solicitud.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) { }

  /**
   * Crear solicitud con rate limiting: máximo 10 solicitudes por hora
   * Endpoint público para el formulario de inscripción
   */
  @Throttle({ default: { limit: 10, ttl: 3600000 } })
  @Post()
  @UseInterceptors(FileInterceptor('comprobante'))
  create(@Body() createInscripcionDto: CreateInscripcionDto, @UploadedFile() file: Express.Multer.File) {
    return this.inscripcionesService.create(createInscripcionDto, file);
  }

  /**
   * Obtener todas las solicitudes - PROTEGIDO (requiere JWT)
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
   * Obtener una solicitud por ID - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inscripcionesService.findOne(+id);
  }

  /**
   * Actualizar solicitud - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInscripcionDto: UpdateSolicitudDto) {
    return this.inscripcionesService.update(+id, updateInscripcionDto);
  }

  /**
   * Eliminar solicitud - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inscripcionesService.remove(+id);
  }
}

