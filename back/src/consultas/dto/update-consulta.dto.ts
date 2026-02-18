import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateConsultaDto {
  @IsOptional()
  @IsString()
  @IsIn(['pendiente', 'revisada', 'contactada'])
  estado?: string;
}
