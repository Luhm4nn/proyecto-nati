import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';
import { AuthModule } from './auth/auth.module';
import { TestimoniosModule } from './testimonios/testimonios.module';
import { NovedadesModule } from './novedades/novedades.module';
import { envValidationSchema } from './config/env.validation';

@Module({
  imports: [
    // Validación de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: true, // Detener en el primer error
      },
    }),
    // Rate limiting global: máximo 100 requests por minuto por IP
    // Los endpoints críticos (login, crear solicitud) tienen sus propios límites más estrictos
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    SolicitudesModule,
    AuthModule,
    TestimoniosModule,
    NovedadesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
