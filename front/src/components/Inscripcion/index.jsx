import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../Footer';
import './Inscripcion.css';

function Inscripcion() {
    const { id } = useParams();
    const [curso, setCurso] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                                {curso.dictadosCurso && curso.dictadosCurso.length > 0 ? (
                                    curso.dictadosCurso.map((dictado) => (
                                        <div key={dictado.id} className="dictado-card-full">
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
                                            </div>

                                            <button className="btn-select-dictado-full">
                                                Seleccionar este horario
                                            </button>
                                        </div>
                                    ))
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
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Inscripcion;
