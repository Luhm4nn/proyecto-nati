import DOMPurify from "dompurify";

function TestimonioCard({ testimonio, onEditar, onEliminar, formatearFecha }) {
  return (
    <div className="testimonio-card">
      <div className="testimonio-header">
        <h3>
          {DOMPurify.sanitize(testimonio.nombreCompleto, { ALLOWED_TAGS: [] })}
        </h3>
        <span
          className={`status-badge ${testimonio.activo ? "activo" : "inactivo"}`}
        >
          {testimonio.activo ? "Activo" : "Inactivo"}
        </span>
      </div>
      <p className="testimonio-texto">
        "{DOMPurify.sanitize(testimonio.texto, { ALLOWED_TAGS: [] })}"
      </p>
      <div className="testimonio-footer">
        <span className="fecha">{formatearFecha(testimonio.createdAt)}</span>
        <div className="testimonio-actions">
          <button onClick={() => onEditar(testimonio)} className="btn-editar">
            Editar
          </button>
          <button
            onClick={() => onEliminar(testimonio.id)}
            className="btn-eliminar"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestimonioCard;
