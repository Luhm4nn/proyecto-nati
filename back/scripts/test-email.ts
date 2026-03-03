
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Cargar variables de entorno desde el archivo .ENV del backend
dotenv.config({ path: join(__dirname, '..', '.ENV') });

async function bootstrap() {
  console.log('--- Iniciando prueba de envío de correo ---');
  console.log('Host:', process.env.MAIL_HOST);
  console.log('Port:', process.env.MAIL_PORT);
  console.log('User:', process.env.MAIL_USER);
  console.log('From:', process.env.MAIL_FROM);
  console.log('To:', process.env.ADMIN_EMAIL);

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || '',
    port: parseInt(process.env.MAIL_PORT || '465'),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER || '',
      pass: process.env.MAIL_PASS || '',
    },
    tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            }
  });

  try {
    const fromAddress = process.env.MAIL_FROM || 'test@test.com';
    const info = await transporter.sendMail({
      from: `"Prueba Aleman para Vos" <${fromAddress}>`,
      to: process.env.ADMIN_EMAIL || 'emyluhmann@gmail.com',
      subject: 'Prueba de Configuración SMTP ✔',
      text: 'Este es un correo de prueba para verificar la configuración de TurboSMTP en el proyecto.',
      html: '<b>Este es un correo de prueba para verificar la configuración de TurboSMTP en el proyecto.</b>',
    });

    console.log('Mensaje enviado satisfactoriamente: %s', info.messageId);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
  
  process.exit(0);
}

bootstrap();
