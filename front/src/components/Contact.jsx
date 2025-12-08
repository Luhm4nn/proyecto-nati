import { useState } from 'react'
import './Contact.css'

function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://proyecto-nati-backend.onrender.com'
      
      // Limpiar campos vacíos para que sean undefined en vez de ''
      const cleanData = {
        nombre: formData.nombre,
        email: formData.email,
        mensaje: formData.mensaje,
        ...(formData.telefono && { telefono: formData.telefono })
      }
      
      const response = await fetch(`${apiUrl}/solicitudes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error del servidor:', errorData)
        throw new Error(errorData.message || 'Error al enviar la solicitud')
      }

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ nombre: '', email: '', telefono: '', mensaje: '' })
      }, 3000)
    } catch (err) {
      setError('Hubo un error al enviar tu solicitud. Por favor, intenta nuevamente.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <h2 className="contact-title">Contacta Conmigo</h2>
        <p className="contact-subtitle">
          Completa el formulario y te responderé a la brevedad para coordinar tu primera clase
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
              required
              placeholder="Tu nombre"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Cuéntame sobre tu nivel actual, objetivos y disponibilidad..."
            />
          </div>

          <button type="submit" className="submit-btn" disabled={submitted || loading}>
            {loading ? 'Enviando...' : submitted ? '✓ Mensaje Enviado' : 'Enviar Solicitud'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {submitted && (
          <div className="success-message">
            ¡Gracias por tu interés! Te contactaré pronto.
          </div>
        )}
      </div>
    </section>
  )
}

export default Contact
