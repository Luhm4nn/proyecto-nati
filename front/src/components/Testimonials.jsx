import './Testimonials.css';

function Testimonials() {
    const testimonials = [
        {
            text: "Gracias a Natalia pude aprobar el examen B2 en tiempo récord. Su metodología es excelente.",
            author: "María G.",
            role: "Arquitecta"
        },
        {
            text: "Las clases son súper dinámicas. Me siento mucho más seguro hablando en mi trabajo.",
            author: "Carlos R.",
            role: "Ingeniero"
        },
        {
            text: "Me encanta el enfoque cultural. No solo aprendes gramática, sino cómo vive la gente allá.",
            author: "Sofía L.",
            role: "Estudiante"
        }
    ];

    return (
        <section id="testimonials" className="testimonials-section section-padding">
            <div className="container">
                <h2 className="section-title">
                    Lo que dicen <span className="italic">nuestros estudiantes</span>
                </h2>

                <div className="testimonials-grid">
                    {testimonials.map((t, index) => (
                        <div key={index} className="testimonial-card">
                            <div className="quote-icon">“</div>
                            <p className="testimonial-text">{t.text}</p>
                            <div className="testimonial-author">
                                <span className="author-name">{t.author}</span>
                                <span className="author-role">{t.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
