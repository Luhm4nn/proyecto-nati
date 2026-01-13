import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, IsInt, Min } from 'class-validator';

export class CreateNovedadDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  titulo: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  descripcion: string;

}
