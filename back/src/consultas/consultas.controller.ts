import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConsultasService } from './consultas.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';

@Controller('consultas')
export class ConsultasController {
  constructor(private readonly consultasService: ConsultasService) {}

  /**
   * Crear consulta con rate limiting: máximo 10 consultas por hora
   * Endpoint público para el formulario de contacto
   */
  @Throttle({ default: { limit: 10, ttl: 3600000 } })
  @Post()
  create(@Body() createConsultaDto: CreateConsultaDto) {
    return this.consultasService.create(createConsultaDto);
  }

  /**
   * Obtener todas las consultas - PROTEGIDO (requiere JWT)
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
    return this.consultasService.findAll(estado, pageNum, limitNum);
  }

  /**
   * Obtener una consulta por ID - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consultasService.findOne(+id);
  }

  /**
   * Actualizar consulta - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConsultaDto: UpdateConsultaDto) {
    return this.consultasService.update(+id, updateConsultaDto);
  }

  /**
   * Eliminar consulta - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultasService.remove(+id);
  }
}

