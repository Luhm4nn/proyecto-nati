import "./AdminHeader.css";

function AdminHeader({ user, onLogout }) {
  return (
    <div className="admin-header-bar">
      <div>
        <h1 className="admin-title">Panel de Administración</h1>
        <p className="admin-subtitle">Gestión de Solicitudes y Testimonios</p>
      </div>
      <div className="user-info">
        <span>Hola, {user?.nombre}</span>
        <button onClick={onLogout} className="logout-btn">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default AdminHeader;
