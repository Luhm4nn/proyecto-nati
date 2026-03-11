import { useState, useEffect } from 'react';
import { useToast } from '../../../contexts/ToastContext';
import { useLoading } from '../../../contexts/LoadingContext';

export function useCorreosMasivos() {
    const { showSuccess, showError } = useToast();
    const { startLoading, stopLoading } = useLoading();
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        asunto: '',
        cuerpo: '',
    });

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
    };

    const cargarEmailsActivos = async () => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/inscripciones/emails-activos`, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error('Error al cargar emails');
            }

            const data = await response.json();
            // data is an array of objects { email, nombre }
            setEmails(data.map(item => ({
                email: item.email,
                nombre: item.nombre || '',
                selected: true
            })));
        } catch (error) {
            showError('Error al cargar correos sugeridos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarEmailsActivos();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const toggleEmail = (emailStr) => {
        setEmails(prev => prev.map(item =>
            item.email === emailStr ? { ...item, selected: !item.selected } : item
        ));
    };

    const addEmail = (emailStr, nombreStr = '') => {
        if (!emailStr) return;
        const exists = emails.find(item => item.email === emailStr);
        if (!exists) {
            setEmails(prev => [...prev, { email: emailStr, nombre: nombreStr, selected: true }]);
        }
    };

    const removeEmail = (emailStr) => {
        setEmails(prev => prev.filter(item => item.email !== emailStr));
    };

    const enviarCorreos = async (e) => {
        if (e) e.preventDefault();

        const selectedEmails = emails.filter(item => item.selected).map(item => item.email);

        if (selectedEmails.length === 0) {
            showError('Debe seleccionar al menos un correo');
            return;
        }

        if (!form.asunto || !form.cuerpo) {
            showError('El asunto y el cuerpo son obligatorios');
            return;
        }

        startLoading('Enviando correos, esto puede demorar unos minutos por favor espere...');
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/inscripciones/correo-masivo`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    emails: selectedEmails,
                    asunto: form.asunto,
                    cuerpo: form.cuerpo
                }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Error al enviar correos');
            }

            const result = await response.json();
            showSuccess(result.message || 'Correos enviados exitosamente');
            setForm({ asunto: '', cuerpo: '' });
        } catch (error) {
            showError(error.message || 'Error al enviar los correos');
        } finally {
            stopLoading();
        }
    };

    const sugerirPrompt = () => {
        const prompt = `Actúa como un experto en redacción de correos para "Alemán para vos", una academia moderna y dinámica enfocada en la enseñanza del alemán. Necesito redactar un correo electrónico para enviar a nuestros alumnos.

[ESCRIBE AQUÍ DE QUÉ TRATA EL CORREO: ej. Recordatorio de reinscripción, envío de material del módulo 3, aviso importante de feriados, etc.]

El tono debe ser:
- Formal pero muy cercano, empático y motivador. Queremos que el alumno se sienta animado en su proceso de aprendizaje.
- Incluye ocasionalmente un saludo o despedida breve en alemán (ej. Hallo!, Liebe Studenten, Viel Erfolg, Bis bald!, Tschüss!).

Por favor, entrégame el resultado ÚNICAMENTE en código HTML puro (sin envolverlo en backticks de Markdown ni \`\`\`html) listo para renderizar.
El diseño debe seguir nuestra identidad visual, utilizando HTML en línea (style="..."):
- Fondo: Color blanco (#ffffff) o nuestro gris muy claro (#f8fafc) para que respire.
- Texto principal: Color pizarra oscuro (#1e293b) para máxima legibilidad, con fuente sans-serif moderna (ej. Montserrat, Poppins, Arial).
- Títulos (<h1>, <h2>): Ligeramente destacados; puedes usar nuestro color amarillo oro de acento (#fbbf24) sutilmente en bordes, separadores (<hr>) o directamente en el título si no satura.
- Botones/Links (CTA): Si hay botones, que tengan fondo amarillo oro (#fbbf24), texto oscuro (#1e293b), bordes redondeados (border-radius: 9999px), negrita, sin subrayado y con espaciado interno (padding: 12px 24px).
- Párrafos (<p>): Con un margen inferior (margin-bottom: 1.5rem) y altura de línea (line-height: 1.6) para evitar textos apelmazados.
- Negritas (<strong>): Úsalas para resaltar fechas clave, links o información vital.`;
        return prompt;
    };

    const copiarPrompt = async () => {
        try {
            await navigator.clipboard.writeText(sugerirPrompt());
            showSuccess('Prompt copiado al portapapeles');
        } catch (err) {
            showError('Error al copiar el prompt');
        }
    };

    return {
        emails,
        form,
        loading,
        handleFormChange,
        toggleEmail,
        addEmail,
        removeEmail,
        enviarCorreos,
        copiarPrompt
    };
}
