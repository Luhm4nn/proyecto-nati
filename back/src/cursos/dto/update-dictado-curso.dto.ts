import { PartialType } from '@nestjs/mapped-types';
import { CreateDictadoCursoDto } from './create-dictado-curso.dto';
import { IsOptional, IsInt } from 'class-validator';

export class UpdateDictadoCursoDto extends PartialType(CreateDictadoCursoDto) {
  @IsOptional()
  @IsInt()
  cursoId?: number;
}
