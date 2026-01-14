import { IsArray, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCursoDto {
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

  @IsArray()
  @IsString({ each: true })
  items: string[];
}
