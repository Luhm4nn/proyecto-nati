import { Module } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { InscripcionesController } from './inscripciones.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MailService } from 'src/utils/mail.service';

@Module({
  imports: [PrismaModule],
  controllers: [InscripcionesController],
  providers: [InscripcionesService, MailService],
})
export class InscripcionesModule { }
