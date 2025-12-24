import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import "./Contact.css";

function Contact() {
  const { showSuccess, showError, showWarning } = useToast();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    nivel: "",
    objetivo: "",
    mensaje: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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

Objetivo: ${formData.objetivo}

Mensaje adicional:
${formData.mensaje}`;

      const cleanData = {
        nombre: formData.nombre,
        email: formData.email,
        mensaje: finalMessage
      };

      const response = await fetch(`${apiUrl}/solicitudes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) throw new Error("Error al enviar");

      showSuccess("¡Solicitud enviada! Te contactaré pronto.", 5000);
      setSubmitted(true);
      setFormData({ nombre: "", email: "", nivel: "", objetivo: "", mensaje: "" });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
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
              ¿Listo para romper <span className="italic">barreras?</span>
            </h2>
            <p className="contact-subtitle">
              Reserva tu primera clase y habla con confianza.
            </p>
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
                <select name="nivel" value={formData.nivel} onChange={handleChange} required>
                  <option value="">Tu Nivel Actual</option>
                  <option value="Sin conocimientos previos">Sin conocimientos previos</option>
                  <option value="Principiante (A1-A2)">Principiante (A1-A2)</option>
                  <option value="Intermedio (B1-B2)">Intermedio (B1-B2)</option>
                  <option value="Avanzado (C1-C2)">Avanzado (C1-C2)</option>
                </select>
              </div>
              <div className="form-group">
                <select name="objetivo" value={formData.objetivo} onChange={handleChange} required>
                  <option value="">Tu Objetivo Principal</option>
                  <option value="Trabajo/Carrera">Trabajo / Carrera</option>
                  <option value="Estudios/Universidad">Estudios / Universidad</option>
                  <option value="Turismo/Hobby">Turismo / Hobby</option>
                  <option value="Examen Oficial">Examen Oficial</option>
                </select>
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
