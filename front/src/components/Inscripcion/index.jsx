import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import Footer from '../Footer';
import './Inscripcion.css';

function Inscripcion() {
    const { id } = useParams();
    const [curso, setCurso] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showSuccess, showError } = useToast();
    const formRef = useRef(null);

    // Estados para la inscripción
    const [selectedDictado, setSelectedDictado] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [inscripcionFormData, setInscripcionFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        emailConfirmacion: '',
        telefono: '',
    });
    const [comprobante, setComprobante] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchCurso = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await fetch(`${apiUrl}/cursos/${id}`);

                if (!response.ok) {
                    throw new Error('No se pudo cargar la información del curso');
                }

                const data = await response.json();
                setCurso(data);
            } catch (err) {
                console.error("Error fetching curso:", err);
                setError("No se pudo cargar la información del curso.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCurso();
        }
    }, [id]);

    const formatearFecha = (fechaString) => {
        if (!fechaString) return "";
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatearHorario = (horario) => {
        return horario ? horario.slice(0, 5) : "";
    };

    const handleSelectDictado = (dictado) => {
        setSelectedDictado(dictado);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInscripcionFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setComprobante(e.target.files[0]);
        }
    };

    const handleSubmitInscripcion = async (e) => {
        e.preventDefault();

        if (inscripcionFormData.email !== inscripcionFormData.emailConfirmacion) {
            showError("Los correos electrónicos no coinciden");
            return;
        }

        if (!comprobante) {
            showError("Por favor adjunta el comprobante de pago");
            return;
        }

        setSubmitting(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const formData = new FormData();

            // Campos del DTO
            formData.append('nombre', inscripcionFormData.nombre);
            formData.append('apellido', inscripcionFormData.apellido);
            formData.append('email', inscripcionFormData.email);
            formData.append('emailConfirmacion', inscripcionFormData.emailConfirmacion);
            formData.append('telefono', inscripcionFormData.telefono);
            formData.append('dictadoCursoId', selectedDictado.id);

            // Archivo
            formData.append('comprobante', comprobante);

            const response = await fetch(`${apiUrl}/inscripciones`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al procesar la inscripción');
            }

            showSuccess("¡Inscripción enviada con éxito!");
            setSelectedDictado(null);
            setInscripcionFormData({
                nombre: '',
                apellido: '',
                email: '',
                emailConfirmacion: '',
                telefono: '',
            });
            setComprobante(null);

        } catch (err) {
            console.error("Error submitting inscripcion:", err);
            showError(err.message || "Hubo un error al enviar tu inscripción.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <>
            <div className="loading-spinner-container">
                <div className="spinner"></div>
            </div>
            <Footer />
        </>
    );

    if (error || !curso) return (
        <>
            <div className="inscripcion-page">
                <div className="inscripcion-container text-center">
                    <h2 className="text-2xl mb-4">Error</h2>
                    <p className="mb-4">{error || "Curso no encontrado"}</p>
                    <Link to="/#cursos" className="btn-primary">Volver a Cursos</Link>
                </div>
            </div>
            <Footer />
        </>
    );

    return (
        <>
            <div className="inscripcion-page">
                <div className="inscripcion-container">
                    <Link to="/#cursos" className="inscripcion-back">
                        ← Volver a Cursos
                    </Link>

                    <div className="inscripcion-header">
                        <h1 className="inscripcion-title">{curso.titulo}</h1>
                    </div>

                    <div className="inscripcion-content">
                        <div className="inscripcion-feature-card">
                            <div className="feature-card-left">
                                <h2 className="inscripcion-section-title">
                                    ¿Qué aprenderás?
                                </h2>
                                <p className="inscripcion-description-text">
                                    {curso.descripcion}
                                </p>
                            </div>

                            <div className="feature-card-right">
                                {curso.items && curso.items.length > 0 ? (
                                    <div className="inscripcion-points">
                                        {curso.items.map((item, index) => (
                                            <div key={index} className="point-item">
                                                <span className="point-icon">✓</span>
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-secondary italic">No hay detalles específicos disponibles.</p>
                                )}
                            </div>
                        </div>

                        <div className="inscripcion-dictados-section">
                            <h2 className="inscripcion-section-title">
                                Horarios de Cursado
                            </h2>
                            <p className="text-secondary mb-6">
                                Elige la comisión que mejor se adapte a tus horarios.
                            </p>

                            <div className="dictados-grid">
                                {curso.dictados_curso && curso.dictados_curso.filter(d => d.activo).length > 0 ? (
                                    curso.dictados_curso.filter(d => d.activo).map((dictado) => {
                                        const sinCupos = dictado.cupos > 0 && (dictado._count?.inscripcions || 0) >= dictado.cupos;
                                        return (
                                            <div key={dictado.id} className={`dictado-card-full ${sinCupos ? 'sin-cupos' : ''}`}>
                                                <div className="dictado-header-full">
                                                    <div className="dictado-days-full">
                                                        {dictado.diasSemana.join(" y ")}
                                                    </div>
                                                    <span className="dictado-duration-badge">
                                                        {dictado.duracionEstimada} {dictado.duracionEstimada === 1 ? 'mes' : 'meses'}
                                                    </span>
                                                </div>

                                                <div className="dictado-body-full">
                                                    <div className="dictado-info-item">
                                                        <span className="info-label">Horario:</span>
                                                        <span className="info-value">
                                                            {formatearHorario(dictado.horarioInicio)} - {formatearHorario(dictado.horarioFin)} hs
                                                        </span>
                                                    </div>
                                                    <div className="dictado-info-item">
                                                        <span className="info-label">Fechas:</span>
                                                        <span className="info-value">
                                                            {formatearFecha(dictado.fechaInicio)} al {formatearFecha(dictado.fechaFin)}
                                                        </span>
                                                    </div>
                                                    {dictado.cupos > 0 && (
                                                        <div className="dictado-info-item cupos-info">
                                                            <span className="info-label">Cupos:</span>
                                                            <span className={`info-value ${sinCupos ? 'text-error' : ''}`}>
                                                                {sinCupos ? '¡Completo!' : `${dictado.cupos - (dictado._count?.inscripcions || 0)} disponibles`}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <button
                                                    className={`btn-select-dictado-full ${selectedDictado?.id === dictado.id ? 'selected' : ''}`}
                                                    onClick={() => !sinCupos && handleSelectDictado(dictado)}
                                                    disabled={sinCupos}
                                                >
                                                    {sinCupos ? 'Sin cupos' : (selectedDictado?.id === dictado.id ? 'Seleccionado' : 'Seleccionar este horario')}
                                                </button>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="no-dictados">
                                        <p>No hay comisiones abiertas por el momento.</p>
                                        <Link to="/contact" className="text-primary hover:underline text-sm mt-2 block">
                                            Consultar por nuevas fechas
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {selectedDictado && (
                            <div className="inscripcion-form-section" ref={formRef}>
                                <div className="form-card">
                                    <h2 className="inscripcion-section-title">Datos Personales</h2>
                                    <p className="text-secondary mb-6">
                                        Completa tus datos para finalizar la inscripción a la comisión de los **{selectedDictado.diasSemana.join(" y ")}**.
                                    </p>

                                    <form className="inscripcion-form" onSubmit={handleSubmitInscripcion}>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label htmlFor="nombre">Nombre</label>
                                                <input
                                                    type="text"
                                                    id="nombre"
                                                    name="nombre"
                                                    value={inscripcionFormData.nombre}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="Tu nombre"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="apellido">Apellido</label>
                                                <input
                                                    type="text"
                                                    id="apellido"
                                                    name="apellido"
                                                    value={inscripcionFormData.apellido}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="Tu apellido"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email">Email</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={inscripcionFormData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="tu@email.com"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="emailConfirmacion">Confirmar Email</label>
                                                <input
                                                    type="email"
                                                    id="emailConfirmacion"
                                                    name="emailConfirmacion"
                                                    value={inscripcionFormData.emailConfirmacion}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="Repite tu email"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="telefono">Teléfono (WhatsApp)</label>
                                                <input
                                                    type="tel"
                                                    id="telefono"
                                                    name="telefono"
                                                    value={inscripcionFormData.telefono}
                                                    onChange={handleInputChange}
                                                    placeholder="+54 9 11 ..."
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="comprobante">Comprobante de Pago (PDF o Imagen)</label>
                                                <div className="file-input-wrapper">
                                                    <input
                                                        type="file"
                                                        id="comprobante"
                                                        onChange={handleFileChange}
                                                        accept="image/*,.pdf"
                                                        required
                                                    />
                                                    <span className="file-hint">Máximo 5MB</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-actions">
                                            <button
                                                type="submit"
                                                className="btn-submit-inscripcion"
                                                disabled={submitting}
                                            >
                                                {submitting ? 'Enviando...' : 'Finalizar Inscripción'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Inscripcion;
