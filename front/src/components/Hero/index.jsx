import { useState, useEffect } from 'react';
import './Hero.css';

function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  
  // Imágenes del carrusel - agregá tus propias imágenes en public/hero/
  const images = [
    '/hero/image1.png',
    '/hero/image2.png',
    '/hero/image3.png',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 8000); 

    return () => clearInterval(interval);
  }, [images.length]);

  const scrollToContact = () => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="hero-section">
      {/* Carrusel de imágenes de fondo */}
      <div className="hero-background">
        {images.map((image, index) => (
          <div
            key={index}
            className={`hero-bg-image ${index === currentImage ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        <div className="hero-overlay" />
      </div>
      {/* Editorial Header */}
      <div className="hero-header container">
        <div className="hero-top-row">
          <span>Clases de Alemán Online</span>
          <span>Todos los Niveles: A1 - C2</span>
          <span>Preparación de Exámenes</span>
        </div>

        <div className="hero-logo-container">
          <img
            src="/natiluhmannlogofinal2022 (1).jpg"
            alt="Natalia Luhmann - Clases de Alemán"
            className="hero-logo-large"
          />
        </div>

        <h1 className="hero-main-title">Aprendé Alemán con Clases Personalizadas</h1>

        <p className="hero-subtitle">
          Clases online 1 a 1 adaptadas a tus objetivos: trabajo, estudios o viajes. Con profesora nativa y certificada.
        </p>

        <button className="hero-cta-main" onClick={scrollToContact}>
          Reservá tu Primera Clase
        </button>
      </div>

      {/* Red Banner Section */}
      <div className="hero-banner">
        <div className="container">
          <h2 className="banner-text">
            "El idioma abre puertas. <span className="italic">Nosotros te damos la llave.</span>"
          </h2>

          <div className="banner-grid">
            <div className="banner-item">
              <span className="banner-label">Metodología</span>
              <p>Enfoque comunicativo y práctico</p>
            </div>
            <div className="banner-item border-left">
              <span className="banner-label">Para quién</span>
              <p>Estudiantes y Profesionales</p>
            </div>
            <div className="banner-item border-left">
              <span className="banner-label">Resultados</span>
              <p>Certificaciones Oficiales</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
