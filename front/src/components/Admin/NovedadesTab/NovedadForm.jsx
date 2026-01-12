function NovedadForm({ 
  formNovedad, 
  previewImagen, 
  onChange, 
  onImagenChange,
  onSubmit, 
  onCancelar 
}) {
  return (
    <div className="form-section">
      <h2>
        {formNovedad.id ? "Editar Novedad" : "Agregar Nueva Novedad"}
      </h2>
      <form onSubmit={onSubmit} className="novedad-form">
        <div className="form-group">
          <label htmlFor="titulo">
            Título
            <span className="char-count">
              {formNovedad.titulo.length}/100
            </span>
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formNovedad.titulo}
            onChange={onChange}
            required
            minLength={5}
            maxLength={100}
            placeholder="Ej: Nueva sesión de coaching disponible"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">
            Descripción
            <span className="char-count">
              {formNovedad.descripcion.length}/500
            </span>
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formNovedad.descripcion}
            onChange={onChange}
            required
            minLength={10}
            maxLength={500}
            rows={4}
            placeholder="Describe la novedad..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="imagen">
            Imagen {formNovedad.id && "(opcional para edición)"}
            <span className="image-info">Formatos: JPEG, PNG, WebP (máx 5MB)</span>
          </label>
          <input
            type="file"
            id="imagen"
            name="imagen"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={onImagenChange}
            required={!formNovedad.id}
          />
          {previewImagen && (
            <div className="image-preview">
              <img src={previewImagen} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-guardar">
            {formNovedad.id ? "Actualizar" : "Guardar"}
          </button>
          {formNovedad.id && (
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

export default NovedadForm;
