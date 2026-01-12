import DOMPurify from "dompurify";

function SolicitudCard({ solicitud, onCambiarEstado, onEliminar, formatearFecha, getEstadoColor }) {
  return (
    <div className="solicitud-card">
      <div className="solicitud-header">
        <div className="solicitud-nombre-estado">
          <h3>
            {DOMPurify.sanitize(solicitud.nombre, { ALLOWED_TAGS: [] })}
          </h3>
          <span className={`estado-badge ${getEstadoColor(solicitud.estado)}`}>
            {solicitud.estado}
          </span>
        </div>
        <span className="fecha">{formatearFecha(solicitud.createdAt)}</span>
      </div>

      <div className="solicitud-body">
        <p>
          <strong>Email:</strong> {solicitud.email}
        </p>
        {solicitud.telefono && (
          <p>
            <strong>Teléfono:</strong>{" "}
            {DOMPurify.sanitize(solicitud.telefono, { ALLOWED_TAGS: [] })}
          </p>
        )}
        <p>
          <strong>Mensaje:</strong>{" "}
          {DOMPurify.sanitize(solicitud.mensaje, { ALLOWED_TAGS: [] })}
        </p>
      </div>

      <div className="solicitud-actions">
        <select
          value={solicitud.estado}
          onChange={(e) => onCambiarEstado(solicitud.id, e.target.value)}
          className="estado-select"
        >
          <option value="pendiente">Pendiente</option>
          <option value="revisada">Revisada</option>
          <option value="contactada">Contactada</option>
        </select>
        <button
          onClick={() => onEliminar(solicitud.id)}
          className="btn-eliminar"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default SolicitudCard;
