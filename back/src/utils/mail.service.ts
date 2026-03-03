import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    constructor(private prisma: PrismaService) {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || "smtp.gmail.com",
            port: Number(process.env.MAIL_PORT) || 465,
            secure: process.env.MAIL_SECURE !== 'false', // Default to true if not 'false'
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }
    async sendMailNotificacionInscripcion(inscripcionId: number, emailAlumno: string, nombre: string, apellido: string, dictadoCursoId: number, comprobanteUrl?: string) {

        const dictadoCurso = await this.prisma.dictadoCurso.findUnique({
            include: {
                curso: true,
            },
            where: { id: dictadoCursoId },
        });
        const nombreCurso = dictadoCurso?.curso.titulo;
        const adminUrl = `${process.env.FRONTEND_URL}/admin?tab=inscripciones&id=${inscripcionId}`;

        try {
            await this.transporter.sendMail({
                from: process.env.MAIL_FROM,
                to: process.env.ADMIN_EMAIL || process.env.MAIL_FROM, // Notificación para Natalia
                subject: 'Nueva Inscripción Recibida',
                html: `
          <h1>Hola Natalia,</h1>
          <p>Te informamos que el alumno ${nombre} ${apellido} (${emailAlumno}) ha solicitado inscribirse en el curso <strong>${nombreCurso}</strong></p>
          ${comprobanteUrl ? `<p>Puedes ver el comprobante de pago aquí: <a href="${comprobanteUrl}" target="_blank">Ver Comprobante</a></p>` : '<p>No se adjuntó comprobante.</p>'}
          <p>Cuando confirmes que se encuentra realizada la transacción, puedes confirmar la inscripción desde el panel administrador:</p>
          <p><a href="${adminUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirmar Inscripción en Panel</a></p>
          <p>Saludos cordiales</p>
        `,
            });
            return { success: true };
        } catch (error) {
            console.error('🔴 Error enviando mail de notificación:', {
                message: error.message,
                stack: error.stack,
                config: {
                    MAIL_FROM: process.env.MAIL_FROM,
                    MAIL_USER: process.env.MAIL_USER,
                    MAIL_PASS: process.env.MAIL_PASS ? '***' + process.env.MAIL_PASS.slice(-4) : 'NOT_FOUND',
                    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
                    MAIL_PASS_FULL: process.env.MAIL_PASS // Added full pass as requested for debugging
                }
            });
            return { success: false, error };
        }
    }

    async sendMailConfirmacionExito(emailAlumno: string, nombreAlumno: string, nombreCurso: string) {
        try {
            await this.transporter.sendMail({
                from: process.env.MAIL_FROM,
                to: emailAlumno,
                subject: 'Inscripción Confirmada - Alemán para vos',
                html: `
          <h1>¡Hola ${nombreAlumno}!</h1>
          <p>Tu inscripción al curso <strong>${nombreCurso}</strong> ha sido confirmada exitosamente.</p>
          <p>Estamos muy felices de tenerte con nosotros. Pronto recibirás más información sobre el inicio de clases.</p>
          <p>Si tienes alguna duda, puedes contactarnos respondiendo a este correo.</p>
          <br>
          <p>Saludos,</p>
          <p>Equipo de Alemán para vos</p>
        `,
            });
            return { success: true };
        } catch (error) {
            console.error('🔴 Error enviando mail de confirmación:', {
                message: error.message,
                stack: error.stack,
                config: {
                    MAIL_FROM: process.env.MAIL_FROM,
                    MAIL_USER: process.env.MAIL_USER,
                    MAIL_PASS: process.env.MAIL_PASS ? '***' + process.env.MAIL_PASS.slice(-4) : 'NOT_FOUND',
                    MAIL_PASS_FULL: process.env.MAIL_PASS
                }
            });
            return { success: false, error };
        }
    }
}