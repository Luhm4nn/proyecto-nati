import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConsultasModule } from './consultas/consultas.module';
import { AuthModule } from './auth/auth.module';
import { TestimoniosModule } from './testimonios/testimonios.module';
import { NovedadesModule } from './novedades/novedades.module';
import { CursosModule } from './cursos/cursos.module';
import { envValidationSchema } from './config/env.validation';
import { InscripcionesModule } from './inscripciones/inscripciones.module';

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
    // Los endpoints críticos (login, crear consulta) tienen sus propios límites más estrictos
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    ConsultasModule,
    AuthModule,
    TestimoniosModule,
    NovedadesModule,
    CursosModule,
    InscripcionesModule,
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
export class AppModule { }
