import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    constructor(private prisma: PrismaService) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS, // La contraseña de aplicación
            },
        });
    }
    async sendMailNotificacionInscripcion(email: string, nombre: string, apellido: string, dictadoCursoId: number, file: Express.Multer.File) {

        const dictadoCurso = await this.prisma.dictadoCurso.findUnique({
            include: {
                curso: true,
            },
            where: { id: dictadoCursoId },
        });
        const nombreCurso = dictadoCurso?.curso.titulo;
        try {
            await this.transporter.sendMail({
                from: process.env.MAIL_FROM,
                to: email,
                subject: 'Solicitud de Inscripción',
                html: `
          <h1>Hola Natalia,</h1>
          <p>Te informamos que el alumno ${nombre} ${apellido} ha solicitado inscribirse en el curso ${nombreCurso}</p>
          <p>Adjuntamos el comprobante de pago.</p>
          Cuando confirmes que se encuentra realizada la transacción, ingresa en el siguiente link para confirmar la inscripción: <a href="">Confirmar Inscripción</a>
          <p>Saludos cordiales</p>
        `,
                attachments: [
                    {
                        filename: file.originalname,
                        content: file.buffer,
                    },
                ],
            });
            return { success: true };
        } catch (error) {
            console.error('Error enviando mail:', error);
            return { success: false, error };
        }
    }
}