import { Link } from 'react-router-dom';
import './Features.css';

function Features() {
    const features = [
        { title: 'Clases 100% Online', desc: 'Clases virtuales en vivo, desde cualquier lugar.' },
        { title: 'Material incluido', desc: 'Material incluido con una plataforma especializada, todo dinámico, sin libros tediosos.' },
        { title: 'Profesora certificada', desc: 'Clases impartidas por una profesional certificada en la enseñanza del idioma.' },
        { title: 'Certificación', desc: 'Se otorga certificado de finalización de cursado al terminar el nivel.' },
        { title: 'Contenido a medida', desc: 'El contenido de vocabulario puede ser general o específico para determinados rubros (medicina, mecánica, etc.).' }
    ];

    return (
        <section id="features" className="features-section section-padding">
            <div className="container">
                <h2 className="section-title">
                    🌟 ¿Por qué elegir <span className="italic">Deutsch für dich?</span>
                </h2>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className={`feature-card card-${index}`}>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    ))}
                </div>

                <Link to="/sobre-mi" className="about-me-banner-card">
                    <div className="about-me-banner-content">
                        <div className="about-me-banner-text">
                            <h3>Conocé a tu profesora Natalia</h3>
                            <p>Descubrí mi trayectoria, mi pasión por la enseñanza del alemán y cómo puedo acompañarte a lograr tus objetivos con un enfoque personalizado.</p>
                        </div>
                        <span className="about-me-banner-link">Saber más sobre mí →</span>
                    </div>
                </Link>
            </div>
        </section>
    );
}

export default Features;
