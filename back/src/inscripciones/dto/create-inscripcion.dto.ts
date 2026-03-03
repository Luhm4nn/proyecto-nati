import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInscripcionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  apellido: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEmail()
  @IsOptional()
  emailConfirmacion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @IsOptional()
  @IsString()
  comprobanteUrl?: string | null;

  @IsOptional()
  @IsString()
  comprobantePublicId?: string | null;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  dictadoCursoId: number;
}
