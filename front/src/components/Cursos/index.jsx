import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from '../shared/UI/Icons';
import './Cursos.css';

function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/cursos`);

        if (!response.ok) {
          throw new Error('No se pudieron cargar los cursos');
        }

        const data = await response.json();
        setCursos(data.filter((c) => c.activo));
      } catch (err) {
        console.error('Error fetching cursos:', err);
        setError('No se pudieron cargar los cursos disponibles.');
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? cursos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cursos.length);
  };

  return (
    <section className="cursos section-padding" id="cursos">
      <div className="container">
        <div className="cursos-header">
          <span className="cursos-subtitle">Nuestros Programas</span>
          <h2 className="cursos-title">Cursos Disponibles</h2>
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
          <div
            className={`cursos-carousel ${cursos.length === 1 ? 'single' : ''}`}
          >
            {cursos.length > 1 && (
              <button
                className="carousel-btn carousel-btn-prev"
                onClick={goToPrevious}
                aria-label="Anterior"
              >
                ‹
              </button>
            )}

            <div className="carousel-track">
              {cursos.map((curso, index) => (
                <div
                  key={curso.id}
                  className={`carousel-slide ${
                    index === currentIndex ? 'active' : ''
                  } ${
                    cursos.length > 1 &&
                    index === (currentIndex - 1 + cursos.length) % cursos.length
                      ? 'prev'
                      : ''
                  } ${
                    cursos.length > 1 &&
                    index === (currentIndex + 1) % cursos.length
                      ? 'next'
                      : ''
                  }`}
                >
                  <div className="curso-card">
                    <div className="curso-content">
                      <h3 className="curso-title">{curso.titulo}</h3>

                      <p className="curso-description">{curso.descripcion}</p>
                      <div className="curso-price">
                        AR$ {curso.valor?.toLocaleString('es-AR')} | €{' '}
                        {curso.valorInternacional?.toLocaleString('es-ES')}
                        {curso.valorDolares > 0 &&
                          ` | US$ ${curso.valorDolares?.toLocaleString('en-US')}`}
                      </div>
                      {curso.items && curso.items.length > 0 && (
                        <div className="curso-features-list">
                          {curso.items.map((item, idx) => (
                            <div key={idx} className="curso-feature-item">
                              <span className="check-icon-wrapper">
                                <CheckIcon className="w-3 h-3 text-accent" />
                              </span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="curso-footer">
                      <Link
                        to={`/inscripcion/${curso.id}`}
                        className="btn-inscribirse"
                      >
                        Inscribirse
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {cursos.length > 1 && (
              <>
                <button
                  className="carousel-btn carousel-btn-next"
                  onClick={goToNext}
                  aria-label="Siguiente"
                >
                  ›
                </button>

                <div className="carousel-dots">
                  {cursos.map((_, index) => (
                    <button
                      key={index}
                      className={`carousel-dot ${
                        index === currentIndex ? 'active' : ''
                      }`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Ir a curso ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Cursos;
