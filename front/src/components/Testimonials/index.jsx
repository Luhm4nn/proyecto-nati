import { useState, useEffect } from 'react';
import './Testimonials.css';

function Testimonials() {
    const [testimonios, setTestimonios] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarTestimonios();
    }, []);

    useEffect(() => {
        if (testimonios.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % testimonios.length);
            }, 12000);

            return () => clearInterval(interval);
        }
    }, [testimonios.length]);

    const cargarTestimonios = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/testimonios`);
            
            if (response.ok) {
                const data = await response.json();
                setTestimonios(data);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section id="testimonials" className="testimonials-section section-padding">
                <div className="container">
                    <h2 className="section-title">
                        Lo que dicen <span className="italic">nuestros estudiantes</span>
                    </h2>
                    <div className="loading-testimonials">Cargando testimonios...</div>
                </div>
            </section>
        );
    }

    if (testimonios.length === 0) {
        return null;
    }

    return (
        <section id="testimonials" className="testimonials-section section-padding">
            <div className="container">
                <h2 className="section-title">
                    Lo que dicen <span className="italic">nuestros estudiantes</span>
                </h2>

                <div className="testimonials-carousel">
                    {testimonios.map((testimonio, index) => (
                        <div
                            key={testimonio.id}
                            className={`testimonial-card ${index === currentIndex ? 'active' : ''}`}
                        >
                            <div className="quote-icon">"</div>
                            <p className="testimonial-text">{testimonio.texto}</p>
                            <div className="testimonial-author">
                                <span className="author-name">{testimonio.nombreCompleto}</span>
                                <span className="testimonial-date">
                                    {new Date(testimonio.createdAt).toLocaleDateString('es-AR', {
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="carousel-dots">
                    {testimonios.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Ver testimonio ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
