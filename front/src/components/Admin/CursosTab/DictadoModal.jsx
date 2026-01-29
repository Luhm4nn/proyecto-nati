const DIAS_SEMANA = [
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
  "domingo",
];

function DictadoModal({
  show,
  curso,
  formDictado,
  onChange,
  onToggleDia,
  onSubmit,
  onClose,
  onEliminarDictado,
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {formDictado.id ? "Editar Dictado" : "Nuevo Dictado"} - {curso?.titulo}
          </h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="dictado-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="horarioInicio">Horario Inicio</label>
              <input
                type="time"
                id="horarioInicio"
                name="horarioInicio"
                value={formDictado.horarioInicio}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="horarioFin">Horario Fin</label>
              <input
                type="time"
                id="horarioFin"
                name="horarioFin"
                value={formDictado.horarioFin}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fechaInicio">Fecha Inicio</label>
              <input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={formDictado.fechaInicio}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fechaFin">Fecha Fin</label>
              <input
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={formDictado.fechaFin}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duracionEstimada">Duración Estimada (meses)</label>
              <input
                type="number"
                id="duracionEstimada"
                name="duracionEstimada"
                value={formDictado.duracionEstimada}
                onChange={onChange}
                min="1"
                max="24"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cupos">Cupos Disponibles (0 = ilimitados)</label>
              <input
                type="number"
                id="cupos"
                name="cupos"
                value={formDictado.cupos}
                onChange={onChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="activo"
                checked={formDictado.activo}
                onChange={(e) => onChange({ target: { name: 'activo', value: e.target.checked } })}
              />
              Dictado Activo (se muestra en la web)
            </label>
          </div>

          <div className="form-group">
            <label>Días de Cursado</label>
            <div className="dias-semana-grid">
              {DIAS_SEMANA.map((dia) => (
                <button
                  key={dia}
                  type="button"
                  className={`dia-btn ${formDictado.diasSemana.includes(dia) ? "active" : ""
                    }`}
                  onClick={() => onToggleDia(dia)}
                >
                  {dia.charAt(0).toUpperCase() + dia.slice(1, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-guardar">
              {formDictado.id ? "Actualizar" : "Guardar"}
            </button>
            {formDictado.id && (
              <button
                type="button"
                onClick={() => {
                  onEliminarDictado(formDictado.id);
                  onClose();
                }}
                className="btn-eliminar"
              >
                Eliminar
              </button>
            )}
            <button type="button" onClick={onClose} className="btn-cancelar">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DictadoModal;
