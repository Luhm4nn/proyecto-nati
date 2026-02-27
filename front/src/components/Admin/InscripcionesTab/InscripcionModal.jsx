import { XMarkIcon } from '../../shared/UI/Icons';

function InscripcionModal({ show, onClose, form, onChange, onSubmit, cursos }) {
  if (!show) return null;

  // Obtener dictados del curso seleccionado
  const cursoSeleccionado = cursos.find((c) => c.id === parseInt(form.cursoId));
  const dictados = cursoSeleccionado?.dictadosCurso || [];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Nueva Inscripción</h2>
          <button className="modal-close" onClick={onClose}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form className="dictado-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Apellido *</label>
            <input
              type="text"
              name="apellido"
              value={form.apellido}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={onChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Curso *</label>
              <select
                name="cursoId"
                value={form.cursoId}
                onChange={onChange}
                required
              >
                <option value="">Seleccionar curso</option>
                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.titulo}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Dictado *</label>
              <select
                name="dictadoCursoId"
                value={form.dictadoCursoId}
                onChange={onChange}
                required
                disabled={!form.cursoId}
              >
                <option value="">Seleccionar dictado</option>
                {dictados.map((dictado) => (
                  <option key={dictado.id} value={dictado.id}>
                    {dictado.diasSemana.join(', ')} ({dictado.horarioInicio} -{' '}
                    {dictado.horarioFin})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-guardar">
              Registrar Inscripción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InscripcionModal;
