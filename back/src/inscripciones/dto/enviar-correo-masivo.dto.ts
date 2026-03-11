import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';

export class EnviarCorreoMasivoDto {
    @IsArray()
    @ArrayMinSize(1, { message: 'Debe proporcionar al menos un correo.' })
    @IsString({ each: true, message: 'Cada elemento debe ser un correo válido.' })
    emails: string[];

    @IsString()
    @IsNotEmpty({ message: 'El asunto es obligatorio.' })
    asunto: string;

    @IsString()
    @IsNotEmpty({ message: 'El cuerpo del mensaje es obligatorio.' })
    cuerpo: string;
}
