import { Link } from 'react-router-dom'
import './Hero.css'

function Hero() {
  const scrollToContact = () => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero">
      <Link to="/login" className="admin-link">
        Admin
      </Link>
      <div className="hero-content">
        <div className="hero-logo">
          <img src="/natiluhmannlogofinal2022 (1).jpg" alt="Natalia Luhmann - Deutsch für dich" />
        </div>
        <h1 className="hero-title">Natalia Luhmann</h1>
        <p className="hero-subtitle">Deutsch für dich</p>
        <div className="hero-description">
          <p>
            ¿Quieres dominar el alemán y abrir nuevas oportunidades? 
            Te ofrezco clases personalizadas adaptadas a tu nivel y objetivos.
          </p>
          <ul className="hero-features">
            <li>✓ Clases online</li>
            <li>✓ Todos los niveles (A1 - C2)</li>
            <li>✓ Preparación para exámenes oficiales</li>
            <li>✓ Material didáctico incluido</li>
          </ul>
        </div>
        <button className="hero-cta" onClick={scrollToContact}>
          Solicitar Información
        </button>
      </div>
    </section>
  )
}

export default Hero
