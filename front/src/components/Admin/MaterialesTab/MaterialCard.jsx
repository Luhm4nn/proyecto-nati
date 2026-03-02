import DOMPurify from 'dompurify';
import {
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon,
} from '../../shared/UI/Icons';

function MaterialCard({
  material,
  onEditar,
  onEliminar,
  onVer,
  formatearFecha,
}) {
  // Función para obtener la extensión o tipo de archivo para mostrar un icono
  const getFileIcon = (url) => {
    if (!url) return '📄';
    const extension = url.split('.').pop().toLowerCase();
    if (extension === 'pdf') return '📕';
    if (['doc', 'docx'].includes(extension)) return '📘';
    if (['xls', 'xlsx'].includes(extension)) return '📗';
    if (['ppt', 'pptx'].includes(extension)) return '📙';
    return '📄';
  };

  const getFileLabel = (url) => {
    if (!url) return 'Archivo';
    const extension = url.split('.').pop().toUpperCase();
    return extension || 'DOC';
  };

  return (
    <div className="material-card">
      <div className="material-icon-container">
        <span className="material-icon">{getFileIcon(material.docUrl)}</span>
        <span className="material-type-badge">
          {getFileLabel(material.docUrl)}
        </span>
      </div>
      <div className="material-content">
        <div className="material-header">
          <h3>{DOMPurify.sanitize(material.nombre, { ALLOWED_TAGS: [] })}</h3>
        </div>
        <div className="material-footer">
          <span className="fecha">
            Subido el: {formatearFecha(material.createdAt)}
          </span>
          <div className="material-actions">
            <button onClick={() => onVer(material)} className="btn-ver">
              Ver Archivo
            </button>
            <a
              href={material.docUrl}
              download={material.nombre}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-descargar"
              title="Descargar"
            >
              <ArrowDownTrayIcon />
            </a>
            <button
              onClick={() => onEditar(material)}
              className="btn-editar"
              title="Editar"
            >
              <PencilIcon />
              <span className="btn-label">Editar</span>
            </button>
            <button
              onClick={() => onEliminar(material)}
              className="btn-eliminar"
              title="Eliminar"
            >
              <TrashIcon />
              <span className="btn-label">Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaterialCard;
