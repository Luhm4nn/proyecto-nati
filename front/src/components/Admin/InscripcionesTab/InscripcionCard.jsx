import DOMPurify from "dompurify";

function InscripcionCard({ inscripcion, onConfirmar, onEliminar, formatearFecha, getEstadoColor }) {
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
                <span className="fecha">{formatearFecha(inscripcion.createdAt)}</span>
            </div>

            <div className="consulta-body">
                <p>
                    <strong>Curso:</strong> {curso?.titulo || 'Cargando...'}
                </p>
                <p>
                    <strong>Horario:</strong> {dictado?.horarioInicio} - {dictado?.horarioFin} ({dictado?.diasSemana.join(', ')})
                </p>
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
