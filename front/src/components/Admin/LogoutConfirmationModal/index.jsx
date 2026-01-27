import { useEffect } from 'react';
import './LogoutConfirmationModal.css';

function LogoutConfirmationModal({ isOpen, onClose, onConfirm }) {
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
    <div className="logout-modal-overlay" onClick={onClose}>
      <div className="logout-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="logout-modal-header">
          <h2>Cerrar Sesión</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="logout-modal-body">
          <div className="logout-icon">👋</div>
          <p className="logout-message">
            ¿Estás seguro de que deseas cerrar sesión?
          </p>
        </div>

        <div className="logout-modal-actions">
          <button onClick={onClose} className="btn-cancelar">
            Cancelar
          </button>
          <button onClick={onConfirm} className="btn-logout-confirm">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirmationModal;
