import { useState } from "react";
import { useToast } from "../contexts/ToastContext";
import "./Contact.css";

function Contact() {
  const { showSuccess, showError, showWarning } = useToast();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Nombre: mínimo 3 caracteres
    if (formData.nombre.trim().length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    // Email: formato válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Ingresá un email válido";
    }

    // Mensaje: mínimo 10 caracteres
    if (formData.mensaje.trim().length < 10) {
      newErrors.mensaje = "El mensaje debe tener al menos 10 caracteres";
    }

    // Teléfono opcional: si lo pone, validar formato básico
    if (formData.telefono && formData.telefono.length < 8) {
      newErrors.telefono = "El teléfono debe tener al menos 8 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar antes de enviar
    if (!validateForm()) {
      showWarning("Por favor, corregí los errores del formulario");
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const apiUrl =
        import.meta.env.VITE_API_URL ||
        "https://proyecto-nati-backend.onrender.com";

      // Limpiar campos vacíos para que sean undefined en vez de ''
      const cleanData = {
        nombre: formData.nombre,
        email: formData.email,
        mensaje: formData.mensaje,
        ...(formData.telefono && { telefono: formData.telefono }),
      };

      const response = await fetch(`${apiUrl}/solicitudes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.message?.includes("Ya has enviado")) {
          showWarning(
            "Ya enviaste una solicitud recientemente. Esperá 24 horas.",
            6000
          );
        } else {
          showError("No se pudo enviar la solicitud. Intentá de nuevo.");
        }
        throw new Error("Error al enviar");
      }

      showSuccess("¡Solicitud enviada! Te contactaré pronto.", 5000);
      setSubmitted(true);
      setFormData({ nombre: "", email: "", telefono: "", mensaje: "" });

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      // El error ya se mostró con toast arriba
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <h2 className="contact-title">Contacta Conmigo</h2>
        <p className="contact-subtitle">
          Completa el formulario y te responderé a la brevedad para coordinar tu
          primera clase
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              className={errors.nombre ? "input-error" : ""}
            />
            {errors.nombre && (
              <span className="error-text">{errors.nombre}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono (opcional)</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+54 9 11 1234-5678"
              className={errors.telefono ? "input-error" : ""}
            />
            {errors.telefono && (
              <span className="error-text">{errors.telefono}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="mensaje">Mensaje (mín. 10 caracteres)</label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              rows="5"
              placeholder="Cuéntame sobre tu nivel actual, objetivos y disponibilidad..."
              className={errors.mensaje ? "input-error" : ""}
            />
            {errors.mensaje && (
              <span className="error-text">{errors.mensaje}</span>
            )}
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={submitted || loading}
          >
            {loading
              ? "Enviando..."
              : submitted
              ? "✓ Mensaje Enviado"
              : "Enviar Solicitud"}
          </button>
        </form>

        {submitted && (
          <div className="success-message">
            ¡Gracias por tu interés! Te contactaré pronto.
          </div>
        )}
      </div>
    </section>
  );
}

export default Contact;
