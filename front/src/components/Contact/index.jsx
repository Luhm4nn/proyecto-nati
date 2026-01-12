
import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import "./Contact.css";
import CustomSelect from "../shared/CustomSelect";
import { countries } from "../shared/CustomSelect/countries";

function Contact() {
  const { showSuccess, showError, showWarning } = useToast();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    nivel: "",
    pais: "",
    mensaje: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const levelOptions = [
    "Sin conocimientos previos",
    "Principiante (A1-A2)",
    "Intermedio (B1-B2)",
    "Avanzado (C1-C2)"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const finalMessage = `Nivel: ${formData.nivel}

País/Ubicación: ${formData.pais}

Mensaje adicional:
${formData.mensaje}`;

      const cleanData = {
        nombre: formData.nombre,
        email: formData.email,
        mensaje: finalMessage
      };

      if (formData.telefono && formData.telefono.trim() !== '') {
        cleanData.telefono = formData.telefono.trim();
      }

      const response = await fetch(`${apiUrl}/solicitudes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error details:", errorData);
        throw new Error(errorData.message || "Error al enviar");
      }

      showSuccess("¡Solicitud enviada! Te contactaré pronto.", 5000);
      setSubmitted(true);
      setFormData({ nombre: "", email: "", telefono: "", nivel: "", pais: "", mensaje: "" });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Submission error:", err);
      showError("Hubo un error al enviar tu solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section section-padding">
      <div className="container">
        <div className="contact-wrapper">
          <div className="contact-header">
            <h2 className="section-title white">
              ¿Tienes consultas? Envianos un mensaje y te contactaré pronto.
            </h2>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu Nombre"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Tu Email"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Tu Teléfono (Opcional)"
                  maxLength="20"
                />
              </div>
              <div className="form-group">
                <CustomSelect
                  name="nivel"
                  value={formData.nivel}
                  onChange={handleChange}
                  options={levelOptions}
                  placeholder="Tu Nivel Actual"
                  required
                />
                <div className="test-link-wrapper">
                  <a
                    href="https://www.esl-idiomas.com/es/test-idiomas/aleman/test-linea"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="test-link"
                  >
                    ¿No sabes tu nivel? Haz un test rápido aquí
                  </a>
                </div>
              </div>
              <div className="form-group">
                <CustomSelect
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                  options={countries}
                  placeholder="¿Desde dónde tomarás las clases?"
                  required
                />
              </div>
            </div>

            <div className="form-group full-width">
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="Cuéntame más sobre tus metas, disponibilidad, etc..."
                rows="4"
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={loading || submitted}>
              {loading ? "Enviando..." : submitted ? "¡Enviado!" : "Enviar Solicitud"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
