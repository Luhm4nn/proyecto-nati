import { useEffect } from 'react';
import './DeleteConfirmationModal.css';

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title, message, itemName }) {
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
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="delete-modal-body">
          <div className="delete-icon">⚠️</div>
          <p className="delete-message">
            {message || '¿Estás seguro de que deseas eliminar este elemento?'}
          </p>
          {itemName && (
            <p className="delete-item-name">"{itemName}"</p>
          )}
          <p className="delete-warning">Esta acción no se puede deshacer.</p>
        </div>

        <div className="delete-modal-actions">
          <button onClick={onClose} className="btn-cancelar">
            Cancelar
          </button>
          <button onClick={onConfirm} className="btn-delete-confirm">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
