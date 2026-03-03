import { useState } from 'react';
import {
  ChevronDownIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
} from '../../shared/UI/Icons';
import { calculateMonthDuration, formatearRangoHorario, formatearFechaSinHora } from '../../../utils/dateUtils';
import ReactCountryFlag from 'react-country-flag';

function CursoCard({
  curso,
  onEditar,
  onEliminar,
  onAgregarDictado,
  onEditarDictado,
  onEliminarDictado,
  formatearFecha,
}) {
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

      <div className="curso-value-badge">
        <strong>Valor mensual: </strong> AR$ {curso.valor?.toLocaleString('es-AR')} | € {curso.valorInternacional?.toLocaleString('es-ES')}
        {curso.valorDolares > 0 && ` | US$ ${curso.valorDolares?.toLocaleString('en-US')}`}
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
              <span className="dictados-count">
                {curso.dictadosCurso.length || 0}
              </span>
            </div>
            <ChevronDownIcon
              className={`toggle-icon ${dictadosExpanded ? 'expanded' : ''}`}
            />
          </button>

          {dictadosExpanded && (
            <div className="dictados-list">
              {curso.dictadosCurso.map((dictado) => (
                <div key={dictado.id} className="dictado-item">
                  <div className="dictado-info">
                    <div className="dictado-horario">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {formatearRangoHorario(dictado.horarioInicio, dictado.horarioFin) && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                            {formatearRangoHorario(dictado.horarioInicio, dictado.horarioFin).horarioArg}
                            <ReactCountryFlag countryCode="AR" svg style={{ width: '1.2em', height: '1.2em' }} /> /
                            {formatearRangoHorario(dictado.horarioInicio, dictado.horarioFin).horarioEur}
                            <ReactCountryFlag countryCode="ES" svg style={{ width: '1.2em', height: '1.2em' }} />
                            <ReactCountryFlag countryCode="DE" svg style={{ width: '1.2em', height: '1.2em' }} />
                          </div>
                        )}
                      </div>
                      <span className="dictado-dias" style={{ flexShrink: 0 }}>
                        {dictado.diasSemana.map(d => d.charAt(0).toUpperCase() + d.slice(1, 3)).join(', ')}
                      </span>
                    </div>
                    <div className="dictado-detalles">
                      <span>
                        {formatearFechaSinHora(dictado.fechaInicio)} al{' '}
                        {formatearFechaSinHora(dictado.fechaFin)}
                      </span>
                      <span>
                        •{' '}
                        {calculateMonthDuration(
                          dictado.fechaInicio,
                          dictado.fechaFin
                        )}{' '}
                        {calculateMonthDuration(
                          dictado.fechaInicio,
                          dictado.fechaFin
                        ) === 1
                          ? 'mes'
                          : 'meses'}
                      </span>
                    </div>
                    <div className="dictado-cupos-status">
                      <UserGroupIcon className="w-4 h-4" />
                      <span>
                        {dictado.cuposOcupados || 0} / {dictado.cupos || 0}{' '}
                        alumnos
                      </span>
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
      )
      }

      <div className="curso-footer">
        <span className="fecha">Creado: {formatearFecha(curso.createdAt)}</span>
        <button onClick={() => onAgregarDictado(curso)} className="btn-editar">
          <PlusIcon className="w-4 h-4" /> Agregar Dictado
        </button>
      </div>
    </div >
  );
}

export default CursoCard;
