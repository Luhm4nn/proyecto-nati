import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { useSessionTimeout } from "../../hooks/useSessionTimeout";
import { useToast } from "../../contexts/ToastContext";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();
  useSessionTimeout(); // Auto-logout después de 30min de inactividad
  const [solicitudes, setSolicitudes] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    cargarSolicitudes();
  }, [filtro]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const cargarSolicitudes = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const url =
        filtro === "todas"
          ? `${apiUrl}/solicitudes`
          : `${apiUrl}/solicitudes?estado=${filtro}`;

      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await response.json();
      setSolicitudes(data);
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
      showError("Error al cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await fetch(`${apiUrl}/solicitudes/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      showSuccess(`Estado actualizado a: ${nuevoEstado}`);
      cargarSolicitudes();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      showError("Error al actualizar el estado");
    }
  };

  const eliminarSolicitud = async (id) => {
    if (!confirm("¿Estás segura de eliminar esta solicitud?")) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/solicitudes/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        showSuccess("Solicitud eliminada correctamente");
      }
      cargarSolicitudes();
    } catch (error) {
      console.error("Error al eliminar solicitud:", error);
      showError("Error al eliminar la solicitud");
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "pendiente":
        return "estado-pendiente";
      case "revisada":
        return "estado-revisada";
      case "contactada":
        return "estado-contactada";
      default:
        return "";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin">
      <div className="admin-container">
        <div className="admin-header-bar">
          <div>
            <h1 className="admin-title">Panel de Administración</h1>
            <p className="admin-subtitle">Gestión de Solicitudes de Clases</p>
          </div>
          <div className="user-info">
            <span>Hola, {user?.nombre}</span>
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="filtros">
          <button
            className={filtro === "todas" ? "filtro-btn active" : "filtro-btn"}
            onClick={() => setFiltro("todas")}
          >
            Todas ({solicitudes.length})
          </button>
          <button
            className={
              filtro === "pendiente" ? "filtro-btn active" : "filtro-btn"
            }
            onClick={() => setFiltro("pendiente")}
          >
            Pendientes
          </button>
          <button
            className={
              filtro === "revisada" ? "filtro-btn active" : "filtro-btn"
            }
            onClick={() => setFiltro("revisada")}
          >
            Revisadas
          </button>
          <button
            className={
              filtro === "contactada" ? "filtro-btn active" : "filtro-btn"
            }
            onClick={() => setFiltro("contactada")}
          >
            Contactadas
          </button>
        </div>

        {loading ? (
          <div className="loading">Cargando solicitudes...</div>
        ) : solicitudes.length === 0 ? (
          <div className="empty-state">
            No hay solicitudes{" "}
            {filtro !== "todas" ? `en estado "${filtro}"` : ""}
          </div>
        ) : (
          <div className="solicitudes-table">
            {solicitudes.map((sol) => (
              <div key={sol.id} className="solicitud-card">
                <div className="solicitud-header">
                  <div>
                    <h3>
                      {DOMPurify.sanitize(sol.nombre, { ALLOWED_TAGS: [] })}
                    </h3>
                    <span
                      className={`estado-badge ${getEstadoColor(sol.estado)}`}
                    >
                      {sol.estado}
                    </span>
                  </div>
                  <span className="fecha">{formatearFecha(sol.createdAt)}</span>
                </div>

                <div className="solicitud-body">
                  <p>
                    <strong>Email:</strong> {sol.email}
                  </p>
                  {sol.telefono && (
                    <p>
                      <strong>Teléfono:</strong>{" "}
                      {DOMPurify.sanitize(sol.telefono, { ALLOWED_TAGS: [] })}
                    </p>
                  )}
                  <p>
                    <strong>Mensaje:</strong>{" "}
                    {DOMPurify.sanitize(sol.mensaje, { ALLOWED_TAGS: [] })}
                  </p>
                </div>

                <div className="solicitud-actions">
                  <select
                    value={sol.estado}
                    onChange={(e) => cambiarEstado(sol.id, e.target.value)}
                    className="estado-select"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="revisada">Revisada</option>
                    <option value="contactada">Contactada</option>
                  </select>
                  <button
                    onClick={() => eliminarSolicitud(sol.id)}
                    className="btn-eliminar"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
