import { StarIcon } from '../shared/UI/Icons';
import './Features.css';

function Features() {
  const features = [
    {
      title: 'Clases en vivo desde donde estés.',
      desc: 'Clases online en tiempo real para aprender acompañado, interactuar y practicar alemán desde cualquier lugar.',
    },
    {
      title: 'Todo el material incluido.',
      desc: 'Acceso a una plataforma propia con materiales claros, dinámicos y prácticos. Sin libros obligatorios.',
    },
    {
      title: 'Aprendé con una profesora especializada.',
      desc: 'Clases guiadas por una docente certificada y con amplia experiencia acompañando procesos reales de aprendizaje del alemán.',
    },
    {
      title: 'Certificado de asistencia.',
      desc: 'Al finalizar el curso recibís un certificado que acredita tu participación y el recorrido realizado.',
    },
    {
      title: 'Aprender hablando desde el primer día.',
      desc: 'Trabajamos con actividades interactivas y situaciones reales para que uses el alemán de forma natural y progresiva.',
    },
    {
      title: 'Grupos pequeños, aprendizaje real.',
      desc: 'Cupos limitados para favorecer la participación, el seguimiento personalizado y la construcción de una verdadera comunidad de aprendizaje.',
    },
  ];

  return (
    <section id="features" className="features-section section-padding">
      <div className="container">
        <h2 className="section-title">
          <StarIcon className="section-title-icon text-accent" /> ¿Por qué
          elegir <span className="italic">Deutsch für dich?</span>
        </h2>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
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
