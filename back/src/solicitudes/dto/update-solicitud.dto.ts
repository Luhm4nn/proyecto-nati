import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateSolicitudDto {
  @IsOptional()
  @IsString()
  @IsIn(['pendiente', 'revisada', 'contactada'])
  estado?: string;
}
