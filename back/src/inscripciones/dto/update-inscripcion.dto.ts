import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateInscripcionDto {
  @IsOptional()
  @IsString()
  @IsIn(['pendiente', 'inscrito', 'rechazado', 'confirmada'])
  estado?: string;
}
