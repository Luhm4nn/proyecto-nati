import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NovedadesService } from './novedades.service';
import { NovedadesController } from './novedades.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryProvider } from '../config/cloudinary.config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [NovedadesController],
  providers: [NovedadesService, CloudinaryProvider],
})
export class NovedadesModule {}
