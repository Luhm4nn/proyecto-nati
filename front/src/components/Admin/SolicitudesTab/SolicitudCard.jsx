import DOMPurify from "dompurify";
import CustomSelect from "../../shared/CustomSelect";

const ESTADO_OPTIONS = [
  { value: "pendiente", label: "Pendiente" },
  { value: "revisada", label: "Revisada" },
  { value: "contactada", label: "Contactada" },
];

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
        <div style={{ width: '200px' }}>
            <CustomSelect
                value={solicitud.estado}
                options={ESTADO_OPTIONS}
                onChange={(e) => onCambiarEstado(solicitud.id, e.target.value)}
                placeholder="Estado"
                name="estado"
            />
        </div>
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
