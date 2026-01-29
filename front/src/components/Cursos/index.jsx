import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Cursos.css';

function Cursos() {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                // Intencionalmente NO enviamos headers de auth porque queremos ver los cursos públicos
                const response = await fetch(`${apiUrl}/cursos`);

                if (!response.ok) {
                    throw new Error('No se pudieron cargar los cursos');
                }

                const data = await response.json();
                // Filtrar solo cursos activos
                setCursos(data.filter(c => c.activo));
            } catch (err) {
                console.error("Error fetching cursos:", err);
                setError("No se pudieron cargar los cursos disponibles.");
            } finally {
                setLoading(false);
            }
        };

        fetchCursos();
    }, []);

    // Si hay error o no hay cursos y no está cargando, tal vez mostrar mensaje o nada?
    // Por diseño, si no hay cursos, podríamos ocultar la sección o mostrar un mensaje amigable.
    // Aquí mostraré un mensaje si no hay cursos para feedback visual durante desarrollo.

    return (
        <section className="cursos section-padding" id="cursos">
            <div className="container">
                <div className="cursos-header">
                    <span className="cursos-subtitle">Nuestros Programas</span>
                    <h2 className="cursos-title">Cursos Disponibles</h2>
                    <p className="text-secondary">
                        Descubre el camino perfecto para dominar el idioma alemán con nuestra metodología estructurada.
                    </p>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="skeleton-card"></div>
                        <div className="skeleton-card"></div>
                        <div className="skeleton-card"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-secondary">
                        <p>{error}</p>
                    </div>
                ) : cursos.length === 0 ? (
                    <div className="text-center text-secondary">
                        <p>Próximamente nuevos cursos.</p>
                    </div>
                ) : (
                    <div className="cursos-grid">
                        {cursos.map((curso) => (
                            <div key={curso.id} className="curso-card">
                                <div className="curso-content">
                                    <h3 className="curso-title">{curso.titulo}</h3>

                                    <p className="curso-description">{curso.descripcion}</p>

                                    {curso.items && curso.items.length > 0 && (
                                        <div className="curso-features-list">
                                            {curso.items.map((item, index) => (
                                                <div key={index} className="curso-feature-item">
                                                    <span className="check-icon">✓</span>
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="curso-footer">
                                    <Link to={`/inscripcion/${curso.id}`} className="btn-inscribirse">
                                        Inscribirse
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Cursos;
