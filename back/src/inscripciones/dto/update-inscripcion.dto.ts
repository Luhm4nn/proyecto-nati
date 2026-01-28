import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

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
  @IsNotEmpty()
  emailConfirmacion: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @IsNotEmpty()
  @IsNumber()
  dictadoCursoId: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(['pendiente', 'inscrito', 'rechazado'])
  estado: string;

}
