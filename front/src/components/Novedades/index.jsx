import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import "./Novedades.css";

function Novedades() {
  const [novedades, setNovedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchNovedades = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/novedades`);
        if (response.ok) {
          const data = await response.json();
          setNovedades(data);
        }
      } catch (error) {
        console.error("Error al cargar novedades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNovedades();
  }, []);

  useEffect(() => {
    if (novedades.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % novedades.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [novedades.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? novedades.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % novedades.length);
  };

  if (loading) {
    return (
      <section className="novedades-section">
        <div className="container">
          <h2 className="section-title">
            ✨ Últimas <span className="italic">Novedades</span>
          </h2>
          <div className="novedades-loading">Cargando novedades...</div>
        </div>
      </section>
    );
  }

  if (novedades.length === 0) {
    return null;
  }

  return (
    <section className="novedades-section" id="novedades">
      <div className="container">
        <h2 className="section-title">
        ✨ Últimas <span className="italic">Novedades</span>
        </h2>

        <div className="novedades-carousel">
          <button 
            className="carousel-btn carousel-btn-prev" 
            onClick={goToPrevious}
            aria-label="Anterior"
          >
            ‹
          </button>

          <div className="carousel-track">
            {novedades.map((novedad, index) => (
              <div
                key={novedad.id}
                className={`carousel-slide ${
                  index === currentIndex ? "active" : ""
                } ${
                  index === (currentIndex - 1 + novedades.length) % novedades.length
                    ? "prev"
                    : ""
                } ${
                  index === (currentIndex + 1) % novedades.length ? "next" : ""
                }`}
              >
                <div className="novedad-card-public">
                  <div className="novedad-image-container">
                    <img
                      src={novedad.imagenUrl}
                      alt={DOMPurify.sanitize(novedad.titulo, {
                        ALLOWED_TAGS: [],
                      })}
                      className="novedad-image"
                    />
                  </div>
                  <div className="novedad-content-public">
                    <h3 className="novedad-title">
                      {DOMPurify.sanitize(novedad.titulo, {
                        ALLOWED_TAGS: [],
                      })}
                    </h3>
                    <p className="novedad-description">
                      {DOMPurify.sanitize(novedad.descripcion, {
                        ALLOWED_TAGS: [],
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="carousel-btn carousel-btn-next" 
            onClick={goToNext}
            aria-label="Siguiente"
          >
            ›
          </button>

          <div className="carousel-dots">
            {novedades.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${
                  index === currentIndex ? "active" : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Ir a novedad ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Novedades;
