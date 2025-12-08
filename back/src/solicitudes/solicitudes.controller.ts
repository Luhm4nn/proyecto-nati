import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SolicitudesService } from './solicitudes.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';

@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  /**
   * Crear solicitud con rate limiting: máximo 3 solicitudes por hora
   * Endpoint público para el formulario de contacto
   */
  @Throttle({ default: { limit: 3, ttl: 3600000 } })
  @Post()
  create(@Body() createSolicitudDto: CreateSolicitudDto) {
    return this.solicitudesService.create(createSolicitudDto);
  }

  /**
   * Obtener todas las solicitudes - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('estado') estado?: string) {
    return this.solicitudesService.findAll(estado);
  }

  /**
   * Obtener una solicitud por ID - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solicitudesService.findOne(+id);
  }

  /**
   * Actualizar solicitud - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSolicitudDto: UpdateSolicitudDto) {
    return this.solicitudesService.update(+id, updateSolicitudDto);
  }

  /**
   * Eliminar solicitud - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.solicitudesService.remove(+id);
  }
}

