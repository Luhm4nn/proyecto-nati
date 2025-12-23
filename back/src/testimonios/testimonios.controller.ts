import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TestimoniosService } from './testimonios.service';
import { CreateTestimonioDto } from './dto/create-testimonio.dto';
import { UpdateTestimonioDto } from './dto/update-testimonio.dto';

@Controller('testimonios')
export class TestimoniosController {
  constructor(private readonly testimoniosService: TestimoniosService) {}

  /**
   * Crear testimonio - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTestimonioDto: CreateTestimonioDto) {
    return this.testimoniosService.create(createTestimonioDto);
  }

  /**
   * Obtener testimonios - PÚBLICO (solo activos) o ADMIN (todos)
   * Query param: ?todos=true (requiere auth)
   */
  @Get()
  findAll(@Query('todos') todos?: string) {
    // Si pide "todos", devuelve incluso inactivos (pero este endpoint es público)
    // En producción podrías proteger esto con @UseGuards si solo admin debe ver inactivos
    const soloActivos = todos !== 'true';
    return this.testimoniosService.findAll(soloActivos);
  }

  /**
   * Obtener un testimonio por ID - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testimoniosService.findOne(+id);
  }

  /**
   * Actualizar testimonio - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestimonioDto: UpdateTestimonioDto) {
    return this.testimoniosService.update(+id, updateTestimonioDto);
  }

  /**
   * Eliminar testimonio - PROTEGIDO (requiere JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testimoniosService.remove(+id);
  }
}
