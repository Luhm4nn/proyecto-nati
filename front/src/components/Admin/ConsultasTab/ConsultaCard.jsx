import DOMPurify from "dompurify";
import CustomSelect from "../../shared/CustomSelect";

const ESTADO_OPTIONS = [
  { value: "pendiente", label: "Pendiente" },
  { value: "revisada", label: "Revisada" },
  { value: "contactada", label: "Contactada" },
];

function ConsultaCard({ consulta, onCambiarEstado, onEliminar, formatearFecha, getEstadoColor }) {
  return (
    <div className="consulta-card">
      <div className="consulta-header">
        <div className="consulta-nombre-estado">
          <h3>
            {DOMPurify.sanitize(consulta.nombre, { ALLOWED_TAGS: [] })}
          </h3>
          <span className={`estado-badge ${getEstadoColor(consulta.estado)}`}>
            {consulta.estado}
          </span>
        </div>
        <span className="fecha">{formatearFecha(consulta.createdAt)}</span>
      </div>

      <div className="consulta-body">
        <p>
          <strong>Email:</strong> {consulta.email}
        </p>
        {consulta.telefono && (
          <p>
            <strong>Teléfono:</strong>{" "}
            {DOMPurify.sanitize(consulta.telefono, { ALLOWED_TAGS: [] })}
          </p>
        )}
        <p>
          <strong>Mensaje:</strong>{" "}
          {DOMPurify.sanitize(consulta.mensaje, { ALLOWED_TAGS: [] })}
        </p>
      </div>

      <div className="consulta-actions">
        <div style={{ display: 'flex', gap: '1rem', width: '100%', alignItems: 'center' }}>
          <div style={{ width: '200px' }}>
            <CustomSelect
              value={consulta.estado}
              options={ESTADO_OPTIONS}
              onChange={(e) => onCambiarEstado(consulta.id, e.target.value)}
              placeholder="Estado"
              name="estado"
            />
          </div>

          <button
            onClick={() => onEliminar(consulta)}
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

export default ConsultaCard;
