import './Features.css';

function Features() {
    const features = [
        { title: 'Clases 100% Online', desc: 'Aprende desde la comodidad de tu casa, sin perder tiempo en traslados.' },
        { title: 'Flexibilidad Horaria', desc: 'Horarios adaptados a tu ritmo de vida y compromisos.' },
        { title: 'Material Incluido', desc: 'No necesitas comprar libros extra. Todo el material digital está incluido.' },
        { title: 'Preparación Exámenes', desc: 'Goethe-Zertifikat, TestDaF, DSH. Entrenamiento específico.' },
        { title: 'Enfoque Personalizado', desc: 'Cada clase está diseñada según tus objetivos y debilidades.' },
        { title: 'Cultura Alemana', desc: 'No solo aprendes el idioma, sino también la cultura y costumbres.' }
    ];

    return (
        <section id="features" className="features-section section-padding">
            <div className="container">
                <h2 className="section-title">
                    ¿Por qué elegir <span className="italic">Deutsch für dich?</span>
                </h2>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className={`feature-card card-${index}`}>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Features;
