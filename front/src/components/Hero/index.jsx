import { useState, useEffect } from 'react';
import './Hero.css';

function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const imagesDesktop = [
    '/hero/desktop/image1.png',
    '/hero/desktop/image2.png',
    '/hero/desktop/image3.png',
  ];
  const imagesMobile = [
    '/hero/mobile/image1m.png',
    '/hero/mobile/image2m.png',
    '/hero/mobile/image3m.png',
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const images = isMobile ? imagesMobile : imagesDesktop;

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
      <div className="hero-header container">

        <div className="hero-logo-title-container">
          <h1 className="hero-brand-name">Alemán para vos<span className="hero-brand-subtitle">Natalia Luhmann</span></h1>
        </div>

        <h2 className="hero-main-title">Aprendé <span className="text-highlight">Alemán</span> con Clases <span className="text-accent">Personalizadas</span></h2>

        <p className="hero-subtitle">
          Clases online 1 a 1 adaptadas a tus objetivos: trabajo, estudios o viajes. Con profesora certificada.
        </p>

        <button className="hero-cta-main" onClick={scrollToContact}>
          Reservá tu Primera Clase
        </button>
      </div>

      <div className="hero-banner">
        <div className="container">
          <h2 className="banner-text">
            ¿Estás listo para llevar tu <span className="text-gold">alemán</span> al siguiente nivel?
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
