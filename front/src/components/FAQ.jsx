import { useState } from 'react';
import './FAQ.css';

function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "¿Necesito conocimientos previos?",
            answer: "No, ofrecemos cursos desde nivel A1 (principiante absoluto) hasta C2 (perfeccionamiento)."
        },
        {
            question: "¿Cómo son las clases online?",
            answer: "Utilizamos una plataforma interactiva con pizarra virtual, ejercicios en vivo y material multimedia."
        },
        {
            question: "¿Preparan para exámenes oficiales?",
            answer: "Sí, preparamos para todos los exámenes del Goethe-Institut, TestDaF y Telc."
        },
        {
            question: "¿Qué métodos de pago aceptan?",
            answer: "Aceptamos transferencias bancarias, Mercado Pago y PayPal para pagos internacionales."
        }
    ];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faq" className="faq-section section-padding">
            <div className="container">
                <h2 className="section-title">
                    Preguntas <span className="italic">Frecuentes</span>
                </h2>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                        >
                            <button
                                className="faq-question"
                                onClick={() => toggleAccordion(index)}
                            >
                                {faq.question}
                                <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
                            </button>
                            <div
                                className="faq-answer"
                                style={{ maxHeight: activeIndex === index ? '200px' : '0' }}
                            >
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FAQ;
