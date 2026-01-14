import { useState } from 'react';

function CursoCard({ curso, onEditar, onEliminar, onAgregarDictado, onEditarDictado, onEliminarDictado, formatearFecha }) {
  const [dictadosExpanded, setDictadosExpanded] = useState(false);

  return (
    <div className="curso-card">
      <div className="curso-header">
        <h3>{curso.titulo}</h3>
        <div className="curso-actions">
          <button onClick={() => onEditar(curso)} className="btn-editar">
            Editar
          </button>
          <button onClick={() => onEliminar(curso)} className="btn-eliminar">
            Eliminar
          </button>
        </div>
      </div>


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
          <button 
            className="dictados-toggle"
            onClick={() => setDictadosExpanded(!dictadosExpanded)}
          >
            <div className="dictados-toggle-content">
              <strong>Dictados Programados</strong>
              <span className="dictados-count">{curso.dictadosCurso.length}</span>
            </div>
            <span className={`toggle-icon ${dictadosExpanded ? 'expanded' : ''}`}>
              ▼
            </span>
          </button>
          
          {dictadosExpanded && (
            <div className="dictados-list">
              {curso.dictadosCurso.map((dictado) => (
                <div key={dictado.id} className="dictado-item">
                  <div className="dictado-info">
                    <div className="dictado-horario">
                      <strong>{dictado.horarioInicio} - {dictado.horarioFin}</strong>
                      <span className="dictado-dias">{dictado.diasSemana.join(", ")}</span>
                    </div>
                    <div className="dictado-detalles">
                      <span>{formatearFecha(dictado.fechaInicio)} al {formatearFecha(dictado.fechaFin)}</span>
                      <span>• {dictado.duracionEstimada} {dictado.duracionEstimada === 1 ? "mes" : "meses"}</span>
                    </div>
                  </div>
                  <div className="dictado-actions">
                    <button
                      onClick={() => onEditarDictado(curso, dictado)}
                      className="btn-editar"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onEliminarDictado(dictado, curso.titulo)}
                      className="btn-eliminar"
                    >
                      Eliminar
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="curso-footer">
        <span className="fecha">Creado: {formatearFecha(curso.createdAt)}</span>
        <button onClick={() => onAgregarDictado(curso)} className="btn-editar">
          + Agregar Dictado
        </button>
      </div>
    </div>
  );
}

export default CursoCard;
