import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './AboutMe.css';

function AboutMe() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="about-me-page">
            <Navbar />

            <section className="about-hero section-padding">
                <div className="about-hero-overlay" />
                <div className="container about-hero-container">
                    <div className="about-hero-content">
                        <span className="about-badge">Conocé a tu profesora</span>
                        <h1 className="about-title">Acompañándote en tu camino con el <span className="text-highlight">Alemán</span></h1>
                        <p className="about-subtitle">
                            Soy Natalia Luhmann, apasionada por la enseñanza de idiomas y dedicada a que mis alumnos logren sus metas en Alemania.
                        </p>
                    </div>
                </div>
            </section>

            <section className="about-bio container section-padding">
                <div className="about-grid">
                    <div className="about-image-container">
                        <div className="about-image-card">
                            <img src="/natiluhmannlogofinal2022 (1).jpg" alt="Natalia Luhmann" className="about-profile-img" />
                            <div className="experience-badge">
                                <span className="years">10+</span>
                                <span className="label">Años de Exp.</span>
                            </div>
                        </div>
                    </div>

                    <div className="about-text-content">
                        <h2 className="section-title">Mi Misión</h2>
                        <p>
                            Mi objetivo principal es derribar las barreras lingüísticas que te separan de tus sueños. Ya sea que busques certificar tu nivel para una visa, mejorar tu perfil profesional o simplemente comunicarte con fluidez en tu día a día.
                        </p>
                        <p>
                            Entiendo que aprender alemán puede parecer un desafío, pero con la metodología adecuada y un enfoque personalizado, cualquier persona puede dominar este hermoso idioma.
                        </p>

                        <div className="highlights-grid">
                            <div className="highlight-item">
                                <div className="highlight-icon">🎓</div>
                                <div className="highlight-info">
                                    <h3>Certificación Oficial</h3>
                                    <p>Profesora avalada con amplia trayectoria.</p>
                                </div>
                            </div>
                            <div className="highlight-item">
                                <div className="highlight-icon">🌍</div>
                                <div className="highlight-info">
                                    <h3>Enfoque Cultural</h3>
                                    <p>No solo aprendés el idioma, sino la cultura alemana.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-stats section-padding">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3 className="stat-number">200+</h3>
                            <p className="stat-label">Alumnos Felices</p>
                        </div>
                        <div className="stat-card">
                            <h3 className="stat-number">98%</h3>
                            <p className="stat-label">Exámenes Aprobados</p>
                        </div>
                        <div className="stat-card">
                            <h3 className="stat-number">15+</h3>
                            <p className="stat-label">Cursos Especializados</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-cta section-padding">
                <div className="container">
                    <div className="cta-card glass-morphism">
                        <h2>¿Empezamos tu aventura hoy mismo?</h2>
                        <p>Unite a mis clases personalizadas y descubrí lo fácil que puede ser aprender alemán.</p>
                        <button className="btn btn-primary" onClick={() => window.location.href = '/#contact'}>
                            Reservar Clase Gratis
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default AboutMe;
