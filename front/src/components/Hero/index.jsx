import './Hero.css';

function Hero() {
  const scrollToContact = () => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="hero-section">
      {/* Editorial Header */}
      <div className="hero-header container">
        <div className="hero-top-row">
          <span>Clases Online</span>
          <span>A1 - C2</span>
          <span>Exámenes</span>
        </div>

        <div className="hero-logo-container">
          <img
            src="/natiluhmannlogofinal2022 (1).jpg"
            alt="Natalia Luhmann Logo"
            className="hero-logo-large"
          />
        </div>

        <p className="hero-subtitle">
          Clases personalizadas para tu desarrollo profesional y personal.
        </p>

        <button className="hero-cta-main" onClick={scrollToContact}>
          Reserva tu lugar
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
