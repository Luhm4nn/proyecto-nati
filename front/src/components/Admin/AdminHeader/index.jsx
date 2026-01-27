import { Link } from "react-router-dom";
import "./AdminHeader.css";

function AdminHeader({ user, onLogout }) {
  return (
    <div className="admin-header-bar">
      <div>
        <h1 className="admin-title">Panel de Administración</h1>
        <p className="admin-subtitle">Gestión de Solicitudes, Testimonios, Novedades y Cursos</p>
      </div>
      <div className="user-info">
        <Link to="/" className="back-home-link">
          Volver a la Web
        </Link>
        <span>Hola, {user?.nombre}</span>
        <button onClick={onLogout} className="logout-btn">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default AdminHeader;
