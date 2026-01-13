import DOMPurify from "dompurify";

function NovedadCard({ novedad, onEditar, onEliminar, formatearFecha }) {
  return (
    <div className="novedad-card">
      <div className="novedad-imagen">
        <img src={novedad.imagenUrl} alt={novedad.titulo} />
      </div>
      <div className="novedad-content">
        <div className="novedad-header">
          <h3>
            {DOMPurify.sanitize(novedad.titulo, { ALLOWED_TAGS: [] })}
          </h3>
        </div>
        <p className="novedad-descripcion">
          {DOMPurify.sanitize(novedad.descripcion, { ALLOWED_TAGS: [] })}
        </p>
        <div className="novedad-footer">
          <span className="fecha">{formatearFecha(novedad.createdAt)}</span>
          <div className="novedad-actions">
            <button onClick={() => onEditar(novedad)} className="btn-editar">
              Editar
            </button>
            <button
              onClick={() => onEliminar(novedad.id)}
              className="btn-eliminar"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NovedadCard;
