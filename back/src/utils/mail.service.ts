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
    async sendMailNotificacionInscripcion(inscripcionId: number, emailAlumno: string, nombre: string, apellido: string, dictadoCursoId: number, file: Express.Multer.File) {

        const dictadoCurso = await this.prisma.dictadoCurso.findUnique({
            include: {
                curso: true,
            },
            where: { id: dictadoCursoId },
        });
        const nombreCurso = dictadoCurso?.curso.titulo;
        const adminUrl = `${process.env.FRONTEND_URL}/admin?tab=solicitudes&id=${inscripcionId}`;

        try {
            await this.transporter.sendMail({
                from: process.env.MAIL_FROM,
                to: process.env.ADMIN_EMAIL || process.env.MAIL_FROM, // Notificación para Natalia (administración)
                subject: 'Nueva Solicitud de Inscripción',
                html: `
          <h1>Hola Natalia,</h1>
          <p>Te informamos que el alumno ${nombre} ${apellido} (${emailAlumno}) ha solicitado inscribirse en el curso <strong>${nombreCurso}</strong></p>
          <p>Adjuntamos el comprobante de pago.</p>
          <p>Cuando confirmes que se encuentra realizada la transacción, puedes confirmar la inscripción desde el panel administrador:</p>
          <p><a href="${adminUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirmar Inscripción en Panel</a></p>
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

    async sendMailConfirmacionExito(emailAlumno: string, nombreAlumno: string, nombreCurso: string) {
        try {
            await this.transporter.sendMail({
                from: process.env.MAIL_FROM,
                to: emailAlumno,
                subject: 'Inscripción Confirmada - Proyecto Nati',
                html: `
          <h1>¡Hola ${nombreAlumno}!</h1>
          <p>Tu inscripción al curso <strong>${nombreCurso}</strong> ha sido confirmada exitosamente.</p>
          <p>Estamos muy felices de tenerte con nosotros. Pronto recibirás más información sobre el inicio de clases.</p>
          <p>Si tienes alguna duda, puedes contactarnos respondiendo a este correo.</p>
          <br>
          <p>Saludos,</p>
          <p>Equipo de Proyecto Nati</p>
        `,
            });
            return { success: true };
        } catch (error) {
            console.error('Error enviando mail de confirmación:', error);
            return { success: false, error };
        }
    }
}