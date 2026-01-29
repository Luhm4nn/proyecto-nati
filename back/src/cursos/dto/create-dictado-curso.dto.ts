import { IsArray, IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Min } from 'class-validator';

export class CreateDictadoCursoDto {
  @IsInt()
  @IsNotEmpty()
  cursoId: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'horarioInicio debe tener formato HH:mm',
  })
  horarioInicio: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'horarioFin debe tener formato HH:mm',
  })
  horarioFin: string;

  @IsDateString()
  @IsNotEmpty()
  fechaInicio: string;

  @IsDateString()
  @IsNotEmpty()
  fechaFin: string;

  @IsInt()
  @Min(1)
  duracionEstimada: number;

  @IsArray()
  @IsString({ each: true })
  diasSemana: string[];

  @IsInt()
  @Min(0)
  @IsOptional()
  cupos?: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
