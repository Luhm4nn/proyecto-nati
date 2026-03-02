import './FilePreviewModal.css';
import { XMarkIcon, ArrowDownTrayIcon } from '../UI/Icons';

function FilePreviewModal({ isOpen, onClose, fileUrl, fileName }) {
  if (!isOpen) return null;

  const isPDF = fileUrl?.toLowerCase().endsWith('.pdf');

  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div
        className="preview-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="preview-modal-header">
          <h3>{fileName}</h3>
          <div className="preview-header-actions">
            <a
              href={fileUrl}
              download={fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="preview-download-btn"
              title="Descargar"
            >
              <ArrowDownTrayIcon />
            </a>
            <button
              className="preview-close-btn"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <XMarkIcon />
            </button>
          </div>
        </div>
        <div className="preview-modal-body">
          {isPDF ? (
            <iframe src={fileUrl} title={fileName} className="preview-iframe" />
          ) : (
            <div className="preview-no-supported">
              <p>
                La previsualización no está disponible para este tipo de
                archivo.
              </p>
              <a
                href={fileUrl}
                download={fileName}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-download"
              >
                <ArrowDownTrayIcon />
                Descargar Archivo
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilePreviewModal;
