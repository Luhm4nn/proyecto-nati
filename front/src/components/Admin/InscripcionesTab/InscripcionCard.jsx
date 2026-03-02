import DOMPurify from "dompurify";
import ReactCountryFlag from 'react-country-flag';
import { formatearRangoHorario } from "../../../utils/dateUtils";
function InscripcionCard({ inscripcion, onConfirmar, onEliminar, onVer, formatearFecha, getEstadoColor }) {
    const dictado = inscripcion.dictadoCurso;
    const curso = dictado?.curso;

    return (
        <div className="consulta-card">
            <div className="consulta-header">
                <div className="consulta-nombre-estado">
                    <h3>
                        {DOMPurify.sanitize(inscripcion.nombre + ' ' + inscripcion.apellido, { ALLOWED_TAGS: [] })}
                    </h3>
                    <span className={`estado-badge ${getEstadoColor(inscripcion.estado)}`}>
                        {inscripcion.estado}
                    </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span className="fecha">{formatearFecha(inscripcion.createdAt)}</span>
                    {inscripcion.comprobanteUrl && (
                        <span className="estado-badge" style={{ backgroundColor: '#e3f2fd', color: '#1976d2', borderColor: '#bbdefb' }}>
                            Con comprobante
                        </span>
                    )}
                </div>
            </div>

            <div className="consulta-body">
                <p>
                    <strong>Curso:</strong> {curso?.titulo || 'Cargando...'}
                </p>
                <div style={{ marginBottom: '10px' }}>
                    <strong style={{ marginRight: '4px' }}>Horario:</strong>
                    {dictado && formatearRangoHorario(dictado.horarioInicio, dictado.horarioFin) ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            {formatearRangoHorario(dictado.horarioInicio, dictado.horarioFin).horarioArg}
                            <ReactCountryFlag countryCode="AR" svg style={{ width: '1.2em', height: '1.2em' }} /> /
                            {formatearRangoHorario(dictado.horarioInicio, dictado.horarioFin).horarioEur}
                            <ReactCountryFlag countryCode="ES" svg style={{ width: '1.2em', height: '1.2em' }} />
                            <ReactCountryFlag countryCode="DE" svg style={{ width: '1.2em', height: '1.2em' }} />
                            <span style={{ marginLeft: '4px' }}>({dictado?.diasSemana.join(', ')})</span>
                        </span>
                    ) : ''}
                </div>
                <p>
                    <strong>Email:</strong> {inscripcion.email}
                </p>
                {inscripcion.telefono && (
                    <p>
                        <strong>Teléfono:</strong>{" "}
                        {DOMPurify.sanitize(inscripcion.telefono, { ALLOWED_TAGS: [] })}
                    </p>
                )}
            </div>

            <div className="consulta-actions">
                <div style={{ display: 'flex', gap: '1rem', width: '100%', alignItems: 'center', flexWrap: 'wrap' }}>
                    {inscripcion.estado === 'pendiente' && (
                        <button
                            onClick={() => onConfirmar(inscripcion)}
                            className="btn-guardar"
                            style={{ padding: '0.6rem 1rem' }}
                        >
                            Confirmar Inscripción
                        </button>
                    )}

                    {inscripcion.comprobanteUrl && (
                        <button
                            onClick={() => onVer(inscripcion)}
                            className="btn-ver"
                            style={{
                                padding: '0.6rem 1rem',
                                color: '#1976d2',
                                backgroundColor: '#e3f2fd',
                                border: '1px solid #bbdefb',
                                borderRadius: '4px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#bbdefb'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#e3f2fd'}
                        >
                            Ver Comprobante
                        </button>
                    )}

                    <button
                        onClick={() => onEliminar(inscripcion)}
                        className="btn-eliminar"
                        style={{ marginLeft: 'auto' }}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InscripcionCard;
