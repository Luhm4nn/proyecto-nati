import { IsArray, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

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
}
