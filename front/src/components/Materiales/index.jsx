import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownTrayIcon, ArrowLeftIcon } from '../shared/UI/Icons';
import FilePreviewModal from '../shared/FilePreviewModal';
import './Materiales.css';

function Materiales() {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    url: '',
    name: '',
  });

  useEffect(() => {
    const cargarMateriales = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/materiales`);
        if (response.ok) {
          const data = await response.json();
          setMateriales(data);
        }
      } catch (error) {
        console.error('Error al cargar materiales:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarMateriales();
  }, []);

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

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="materiales-page">
      <div className="materiales-page-header">
        <Link to="/" className="materiales-back-link">
          <ArrowLeftIcon />
          Volver al inicio
        </Link>
        <h1>Materiales de Estudio</h1>
        <p>
          Accedé a todos los recursos y documentos disponibles para tu
          aprendizaje.
        </p>
      </div>

      <div className="materiales-page-content">
        {loading ? (
          <div className="materiales-loading">Cargando materiales...</div>
        ) : materiales.length === 0 ? (
          <div className="materiales-empty">
            <p>No hay materiales disponibles por el momento.</p>
          </div>
        ) : (
          <div className="materiales-list">
            {materiales.map((material) => (
              <div key={material.id} className="material-item">
                <div className="material-item-icon">
                  <span>{getFileIcon(material.docUrl)}</span>
                  <span className="material-item-badge">
                    {getFileLabel(material.docUrl)}
                  </span>
                </div>
                <div className="material-item-info">
                  <h3>{material.nombre}</h3>
                  <span className="material-item-date">
                    {formatearFecha(material.createdAt)}
                  </span>
                </div>
                <div className="material-item-actions">
                  <button
                    className="material-btn-ver"
                    onClick={() =>
                      setPreviewModal({
                        isOpen: true,
                        url: material.docUrl,
                        name: material.nombre,
                      })
                    }
                  >
                    Ver
                  </button>
                  <a
                    href={material.docUrl}
                    download={material.nombre}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="material-btn-download"
                    title="Descargar"
                  >
                    <ArrowDownTrayIcon />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FilePreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, url: '', name: '' })}
        fileUrl={previewModal.url}
        fileName={previewModal.name}
      />
    </div>
  );
}

export default Materiales;
