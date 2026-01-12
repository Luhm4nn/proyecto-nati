function TestimonioForm({ formTestimonio, onChange, onSubmit, onCancelar }) {
  return (
    <div className="form-section">
      <h2>
        {formTestimonio.id ? "Editar Testimonio" : "Agregar Nuevo Testimonio"}
      </h2>
      <form onSubmit={onSubmit} className="testimonio-form">
        <div className="form-group">
          <label htmlFor="nombreCompleto">
            Nombre Completo
            <span className="char-count">
              {formTestimonio.nombreCompleto.length}/100
            </span>
          </label>
          <input
            type="text"
            id="nombreCompleto"
            name="nombreCompleto"
            value={formTestimonio.nombreCompleto}
            onChange={onChange}
            required
            minLength={2}
            maxLength={100}
            placeholder="Ej: María González"
          />
        </div>
        <div className="form-group">
          <label htmlFor="texto">
            Testimonio
            <span className="char-count">
              {formTestimonio.texto.length}/500
            </span>
          </label>
          <textarea
            id="texto"
            name="texto"
            value={formTestimonio.texto}
            onChange={onChange}
            required
            minLength={10}
            maxLength={500}
            rows={4}
            placeholder="Escribe el testimonio del alumno..."
          />
        </div>
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="activo"
              checked={formTestimonio.activo}
              onChange={onChange}
            />
            Testimonio activo (visible en la web)
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-guardar">
            {formTestimonio.id ? "Actualizar" : "Guardar"}
          </button>
          {formTestimonio.id && (
            <button
              type="button"
              onClick={onCancelar}
              className="btn-cancelar"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TestimonioForm;
