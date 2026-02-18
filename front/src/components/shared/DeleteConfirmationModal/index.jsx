import { useEffect } from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '../UI/Icons';
import './DeleteConfirmationModal.css';

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  confirmText = 'Eliminar',
  confirmClass = 'btn-eliminar',
  icon = <ExclamationTriangleIcon className="w-12 h-12 text-warning" />
}) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-header">
          <h2>{title || 'Confirmar Eliminación'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="delete-modal-body">
          <div className="delete-icon">{icon}</div>
          <p className="delete-message">
            {message || '¿Estás seguro de que deseas eliminar este elemento?'}
          </p>
          {itemName && (
            <p className="delete-item-name">"{itemName}"</p>
          )}
          {confirmClass === 'btn-eliminar' && (
            <p className="delete-warning">Esta acción no se puede deshacer.</p>
          )}
        </div>

        <div className="delete-modal-actions">
          <button onClick={onClose} className="btn-cancelar">
            Cancelar
          </button>
          <button onClick={onConfirm} className={confirmClass}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
