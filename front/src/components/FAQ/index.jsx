import { useState } from 'react';
import { QuestionMarkCircleIcon, PlusIcon, MinusIcon } from '../shared/UI/Icons';
import './FAQ.css';

function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "¿Necesito conocimientos previos?",
            answer: "No 😊 El curso está pensado para principiantes absolutos. Empezamos desde cero y avanzamos paso a paso, sin necesidad de experiencia previa con el alemán."
        },
        {
            question: "¿Cómo son las clases online?",
            answer: "Las clases son en vivo, en grupos reducidos y por Zoom. Trabajamos con explicaciones claras, práctica oral desde el inicio y acceso a una plataforma con materiales para seguir aprendiendo entre clases."
        },
        {
            question: "¿Qué métodos de pago aceptan?",
            answer: "Podés abonar mediante transferencia bancaria o medios digitales. Los detalles se envían al momento de la inscripción."
        },
        {
            question: "¿Cuántos alumnos hay por curso?",
            answer: "Los grupos son pequeños para que cada persona tenga su espacio para hablar y participar. Con el tiempo se arma algo más que una clase: un grupo que aprende, se acompaña y crece junto."
        },
        {
            question: "¿Dan certificados?",
            answer: "Al finalizar el curso se entrega un certificado de asistencia que acredita la participación y el recorrido realizado durante la cursada. No se trata de un certificado oficial de examen internacional."
        },
        {
            question: "¿Hay exámenes?",
            answer: "No hay exámenes formales. Realizamos una evaluación interna al finalizar el curso para acompañar el proceso de aprendizaje y ver los avances alcanzados, sin generar presión ni estrés."
        },
        {
            question: "¿Qué pasa si falto a una clase o me voy de viaje?",
            answer: "El curso es un proceso que se construye clase a clase y en grupo. Por eso, el lugar queda reservado durante toda la cursada y las clases se abonan de manera mensual, incluso si en algún momento no podés asistir. Siempre vas a contar con los materiales para seguir el ritmo del curso."
        },
    ];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faq" className="faq-section section-padding">
            <div className="container">
                <h2 className="section-title">
                    <QuestionMarkCircleIcon className="section-title-icon" /> Preguntas <span className="italic">Frecuentes</span>
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
                                <span className="faq-icon">
                                    {activeIndex === index ? <MinusIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
                                </span>
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
