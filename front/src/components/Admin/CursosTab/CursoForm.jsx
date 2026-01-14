function CursoForm({
  formCurso,
  onChange,
  onItemChange,
  onAgregarItem,
  onEliminarItem,
  onSubmit,
  onCancelar,
}) {
  return (
    <div className="form-section">
      <h2>{formCurso.id ? "Editar Curso" : "Agregar Nuevo Curso"}</h2>
      <form onSubmit={onSubmit} className="curso-form">
        <div className="form-group">
          <label htmlFor="titulo">
            Título del Curso
            <span className="char-count">{formCurso.titulo.length}/50</span>
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formCurso.titulo}
            onChange={onChange}
            required
            minLength={2}
            maxLength={50}
            placeholder="Ej: Curso de Fotografía Digital"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">
            Descripción
            <span className="char-count">{formCurso.descripcion.length}/500</span>
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formCurso.descripcion}
            onChange={onChange}
            required
            minLength={10}
            maxLength={500}
            rows={4}
            placeholder="Describe el contenido del curso..."
          />
        </div>

        <div className="form-group">
          <label>Contenidos del Curso</label>
          {formCurso.items.map((item, index) => (
            <div key={index} className="item-input-group">
              <input
                type="text"
                value={item}
                onChange={(e) => onItemChange(index, e.target.value)}
                placeholder={`Item ${index + 1}`}
                maxLength={200}
              />
              {formCurso.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => onEliminarItem(index)}
                  className="btn-eliminar-item"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={onAgregarItem} className="btn-agregar-item">
            + Agregar Item
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-guardar">
            {formCurso.id ? "Actualizar" : "Guardar"}
          </button>
          {formCurso.id && (
            <button type="button" onClick={onCancelar} className="btn-cancelar">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CursoForm;
