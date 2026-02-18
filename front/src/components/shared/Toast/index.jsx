import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { 
  CheckIcon, 
  XMarkIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon 
} from "../UI/Icons";
import "./Toast.css";

const Toast = ({ message, type = "info", onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animación de entrada
    setTimeout(() => setIsVisible(true), 10);

    return () => setIsVisible(false);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckIcon className="w-5 h-5" />;
      case "error":
        return <XMarkIcon className="w-5 h-5" />;
      case "warning":
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      default:
        return <InformationCircleIcon className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`toast toast-${type} ${isVisible ? "toast-visible" : ""} ${
        isExiting ? "toast-exit" : ""
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{message}</div>
      <button
        className="toast-close"
        onClick={handleClose}
        aria-label="Cerrar notificación"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
};

export default Toast;
