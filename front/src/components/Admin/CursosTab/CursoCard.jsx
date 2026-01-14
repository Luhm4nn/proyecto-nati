function CursoCard({ curso, onEditar, onEliminar, onAgregarDictado, onEditarDictado, onEliminarDictado, formatearFecha }) {
  return (
    <div className="content-card">
      <div className="card-header">
        <h3>{curso.titulo}</h3>
        <div className="card-actions">
          <button onClick={() => onEditar(curso)} className="btn-editar">
            Editar
          </button>
          <button onClick={() => onAgregarDictado(curso)} className="btn-secundario">
            + Dictado
          </button>
          <button onClick={() => onEliminar(curso.id)} className="btn-eliminar">
            Eliminar
          </button>
        </div>
      </div>

      <div className="card-body">
        <p className="curso-descripcion">{curso.descripcion}</p>

        {curso.items && curso.items.length > 0 && (
          <div className="curso-items">
            <strong>Contenidos:</strong>
            <ul>
              {curso.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {curso.dictadosCurso && curso.dictadosCurso.length > 0 && (
          <div className="dictados-section">
            <div className="dictados-header">
              <strong>Dictados Programados</strong>
              <span className="dictados-count">{curso.dictadosCurso.length}</span>
            </div>
            {curso.dictadosCurso.map((dictado) => (
              <div key={dictado.id} className="dictado-item">
                <div className="dictado-content">
                  <div className="dictado-main">
                    <span className="dictado-horario">
                      {dictado.horarioInicio} - {dictado.horarioFin}
                    </span>
                    <span className="dictado-dias">{dictado.diasSemana.join(", ")}</span>
                  </div>
                  <div className="dictado-details">
                    <span className="dictado-fechas">
                      {formatearFecha(dictado.fechaInicio)} al {formatearFecha(dictado.fechaFin)}
                    </span>
                    <span className="dictado-duracion">
                      {dictado.duracionEstimada} {dictado.duracionEstimada === 1 ? "mes" : "meses"}
                    </span>
                  </div>
                </div>
                <div className="dictado-actions">
                  <button
                    onClick={() => onEditarDictado(curso, dictado)}
                    className="btn-editar-small"
                    title="Editar dictado"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onEliminarDictado(dictado.id)}
                    className="btn-eliminar-small"
                    title="Eliminar dictado"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="card-footer">
          <small>Creado: {formatearFecha(curso.createdAt)}</small>
        </div>
      </div>
    </div>
  );
}

export default CursoCard;
