import { useState } from 'react';
import { ChevronDownIcon, PlusIcon, PencilIcon, TrashIcon } from '../../shared/UI/Icons';
import { calculateMonthDuration } from '../../../utils/dateUtils';

function CursoCard({ curso, onEditar, onEliminar, onAgregarDictado, onEditarDictado, onEliminarDictado, formatearFecha }) {
  const [dictadosExpanded, setDictadosExpanded] = useState(false);

  return (
    <div className="curso-card">
      <div className="curso-header">
        <h3>{curso.titulo}</h3>
        <div className="curso-actions">
          <button onClick={() => onEditar(curso)} className="btn-editar">
            <PencilIcon className="w-4 h-4" /> Editar
          </button>
          <button onClick={() => onEliminar(curso)} className="btn-eliminar">
            <TrashIcon className="w-4 h-4" /> Eliminar
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
              <span className="dictados-count">{curso.dictadosCurso.length || 0}</span>
            </div>
            <ChevronDownIcon className={`toggle-icon ${dictadosExpanded ? 'expanded' : ''}`} />
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
                      <span>• {calculateMonthDuration(dictado.fechaInicio, dictado.fechaFin)} {calculateMonthDuration(dictado.fechaInicio, dictado.fechaFin) === 1 ? "mes" : "meses"}</span>
                    </div>
                  </div>
                  <div className="dictado-actions">
                    <button
                      onClick={() => onEditarDictado(curso, dictado)}
                      className="btn-editar"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEliminarDictado(dictado, curso.titulo)}
                      className="btn-eliminar"
                    >
                      <TrashIcon className="w-4 h-4" />
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
          <PlusIcon className="w-4 h-4" /> Agregar Dictado
        </button>
      </div>
    </div>
  );
}

export default CursoCard;
