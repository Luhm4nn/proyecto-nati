import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateCursoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  titulo: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  descripcion: string;

  @IsArray()
  @IsString({ each: true })
  items: string[];

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  valor: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  valorInternacional: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  valorDolares: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
