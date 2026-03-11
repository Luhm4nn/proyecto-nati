import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Resend } from 'resend';

@Injectable()
export class MailService {
    private resend: Resend;
    constructor(private prisma: PrismaService) {
        this.resend = new Resend(process.env.RESEND_API_KEY);
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
            const { data, error } = await this.resend.emails.send({
                from: process.env.MAIL_FROM || 'info@alemanparavos.com',
                to: process.env.ADMIN_EMAIL || 'alemanparavos.cursos@gmail.com', // Notificación para Natalia
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

            if (error) {
                console.error('🔴 Error de Resend enviando mail de notificación:', error);
                return { success: false, error };
            }

            return { success: true, data };
        } catch (error) {
            console.error('🔴 Excepción enviando mail de notificación:', error);
            return { success: false, error };
        }
    }

    async sendMailConfirmacionExito(emailAlumno: string, nombreAlumno: string, nombreCurso: string) {
        try {
            const { data, error } = await this.resend.emails.send({
                from: process.env.MAIL_FROM || 'info@alemanparavos.com',
                // Resend requires verified domains to send to custom emails, otherwise using testing email
                to: emailAlumno,
                subject: 'Inscripción Confirmada - Alemán para vos',
                html: `
          <h1>¡Hola ${nombreAlumno}!</h1>
          <p>Tu inscripción al curso <strong>${nombreCurso}</strong> ha sido confirmada exitosamente.</p>
          <p>Estamos muy felices de tenerte con nosotros. Pronto recibirás más información sobre el inicio de clases.</p>
          <p>Si tienes alguna duda, puedes contactarnos a ${process.env.ADMIN_EMAIL || 'alemanparavos.cursos@gmail.com'}.</p>
          <br>
          <p>Saludos,</p>
          <p>Equipo de Alemán para vos</p>
        `,
            });

            if (error) {
                console.error('🔴 Error de Resend enviando mail de confirmación:', error);
                return { success: false, error };
            }

            return { success: true, data };
        } catch (error) {
            console.error('🔴 Excepción enviando mail de confirmación:', error);
            return { success: false, error };
        }
    }

    async sendMailMasivo(emailAlumno: string, asunto: string, cuerpo: string) {
        try {
            const { data, error } = await this.resend.emails.send({
                from: process.env.MAIL_FROM || 'info@alemanparavos.com',
                to: emailAlumno,
                subject: asunto,
                html: cuerpo,
            });

            if (error) {
                console.error(`🔴 Error de Resend enviando mail masivo a ${emailAlumno}:`, error);
                return { success: false, error };
            }

            return { success: true, data };
        } catch (error) {
            console.error(`🔴 Excepción enviando mail masivo a ${emailAlumno}:`, error);
            return { success: false, error };
        }
    }
}