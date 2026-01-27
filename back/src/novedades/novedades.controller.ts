import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NovedadesService } from './novedades.service';
import { CreateNovedadDto } from './dto/create-novedad.dto';
import { UpdateNovedadDto } from './dto/update-novedad.dto';

@Controller('novedades')
export class NovedadesController {
  constructor(private readonly novedadesService: NovedadesService) {}

  /**
   * Crear novedad - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  create(
    @Body() createNovedadDto: CreateNovedadDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('La imagen es requerida');
    }
    return this.novedadesService.create(createNovedadDto, file);
  }

  /**
   * Obtener novedades - PÚBLICO
   */
  @Get()
  findAll() {
    return this.novedadesService.findAll();
  }

  /**
   * Obtener una novedad por ID - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.novedadesService.findOne(+id);
  }

  /**
   * Actualizar novedad - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('imagen'))
  update(
    @Param('id') id: string,
    @Body() updateNovedadDto: UpdateNovedadDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.novedadesService.update(+id, updateNovedadDto, file);
  }

  /**
   * Eliminar novedad - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.novedadesService.remove(+id);
  }
}
