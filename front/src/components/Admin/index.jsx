import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { useSessionTimeout } from "../../hooks/useSessionTimeout";
import { useToast } from "../../contexts/ToastContext";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();
  useSessionTimeout();
  const [activeTab, setActiveTab] = useState("solicitudes");
  const [solicitudes, setSolicitudes] = useState([]);
  const [testimonios, setTestimonios] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [contadores, setContadores] = useState({
    todas: 0,
    pendiente: 0,
    revisada: 0,
    contactada: 0,
  });
  const [formTestimonio, setFormTestimonio] = useState({
    id: null,
    nombreCompleto: "",
    texto: "",
    activo: true,
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    if (activeTab === "solicitudes") {
      setPaginacion(prev => ({ ...prev, page: 1 }));
      cargarSolicitudes(1);
    } else if (activeTab === "testimonios") {
      cargarTestimonios();
    }
  }, [filtro, activeTab]);

  const cargarContadores = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const estados = ['todas', 'pendiente', 'revisada', 'contactada'];
      
      const requests = estados.map(estado =>
        fetch(
          `${apiUrl}/solicitudes?${estado !== 'todas' ? `estado=${estado}&` : ''}page=1&limit=1`,
          { headers: getAuthHeaders() }
        ).then(async r => {
          if (!r.ok) return null;
          return r.json();
        })
      );
      
      const results = await Promise.all(requests);
      
      setContadores({
        todas: results[0]?.pagination?.total || 0,
        pendiente: results[1]?.pagination?.total || 0,
        revisada: results[2]?.pagination?.total || 0,
        contactada: results[3]?.pagination?.total || 0,
      });
    } catch (error) {
      setContadores({
        todas: 0,
        pendiente: 0,
        revisada: 0,
        contactada: 0,
      });
    }
  };

  useEffect(() => {
    if (activeTab === 'solicitudes') {
      cargarContadores();
    }
  }, [activeTab]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const cargarSolicitudes = async (page = 1) => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const params = new URLSearchParams({
        page: page.toString(),
        limit: paginacion.limit.toString(),
      });
      
      if (filtro !== "todas") {
        params.append("estado", filtro);
      }

      const response = await fetch(`${apiUrl}/solicitudes?${params}`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const result = await response.json();
      
      if (result?.data && result?.pagination) {
        setSolicitudes(result.data);
        setPaginacion(result.pagination);
        
        setContadores(prev => ({
          ...prev,
          [filtro]: result.pagination.total
        }));
      } else {
        setSolicitudes([]);
        showError("Error al cargar las solicitudes");
      }
    } catch (error) {
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
      cargarContadores();
    } catch (error) {
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
      cargarContadores();
    } catch (error) {
      showError("Error al eliminar la solicitud");
    }
  };

  const cargarTestimonios = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/testimonios?todos=true`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await response.json();
      setTestimonios(data);
    } catch (error) {
      showError("Error al cargar los testimonios");
    } finally {
      setLoading(false);
    }
  };

  const handleTestimonioChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormTestimonio({
      ...formTestimonio,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const guardarTestimonio = async (e) => {
    e.preventDefault();

    if (formTestimonio.nombreCompleto.trim().length < 2) {
      showError("El nombre debe tener al menos 2 caracteres");
      return;
    }
    if (formTestimonio.nombreCompleto.trim().length > 100) {
      showError("El nombre no puede superar 100 caracteres");
      return;
    }
    if (formTestimonio.texto.trim().length < 10) {
      showError("El testimonio debe tener al menos 10 caracteres");
      return;
    }
    if (formTestimonio.texto.trim().length > 500) {
      showError("El testimonio no puede superar 500 caracteres");
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const isEdit = formTestimonio.id !== null;
      const url = isEdit
        ? `${apiUrl}/testimonios/${formTestimonio.id}`
        : `${apiUrl}/testimonios`;

      const body = {
        nombreCompleto: formTestimonio.nombreCompleto.trim(),
        texto: formTestimonio.texto.trim(),
        activo: formTestimonio.activo,
      };

      const response = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });

      if (response.ok) {
        showSuccess(
          isEdit
            ? "Testimonio actualizado correctamente"
            : "Testimonio creado correctamente"
        );
        setFormTestimonio({ id: null, nombreCompleto: "", texto: "", activo: true });
        cargarTestimonios();
      } else {
        const error = await response.json();
        if (error.message && Array.isArray(error.message)) {
          error.message.forEach(msg => showError(msg));
        } else {
          showError(error.message || "Error al guardar el testimonio");
        }
      }
    } catch (error) {
      showError("Error de conexión. Verifica tu red e intenta nuevamente.");
    }
  };

  const editarTestimonio = (testimonio) => {
    setFormTestimonio({
      id: testimonio.id,
      nombreCompleto: testimonio.nombreCompleto,
      texto: testimonio.texto,
      activo: testimonio.activo,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarTestimonio = async (id) => {
    if (!confirm("¿Estás segura de eliminar este testimonio?")) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/testimonios/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        showSuccess("Testimonio eliminado correctamente");
        cargarTestimonios();
      }
    } catch (error) {
      showError("Error al eliminar el testimonio");
    }
  };

  const cancelarEdicion = () => {
    setFormTestimonio({ id: null, nombreCompleto: "", texto: "", activo: true });
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
            <p className="admin-subtitle">Gestión de Solicitudes y Testimonios</p>
          </div>
          <div className="user-info">
            <span>Hola, {user?.nombre}</span>
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="tabs">
          <button
            className={activeTab === "solicitudes" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("solicitudes")}
          >
            Solicitudes
          </button>
          <button
            className={activeTab === "testimonios" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("testimonios")}
          >
            Testimonios
          </button>
        </div>

        {activeTab === "solicitudes" && (
          <div className="tab-content">
            <div className="filtros">
              <button
                className={filtro === "todas" ? "filtro-btn active" : "filtro-btn"}
                onClick={() => setFiltro("todas")}
              >
                Todas ({contadores.todas})
              </button>
              <button
                className={
                  filtro === "pendiente" ? "filtro-btn active" : "filtro-btn"
                }
                onClick={() => setFiltro("pendiente")}
              >
                Pendientes ({contadores.pendiente})
              </button>
              <button
                className={
                  filtro === "revisada" ? "filtro-btn active" : "filtro-btn"
                }
                onClick={() => setFiltro("revisada")}
              >
                Revisadas ({contadores.revisada})
              </button>
              <button
                className={
                  filtro === "contactada" ? "filtro-btn active" : "filtro-btn"
                }
                onClick={() => setFiltro("contactada")}
              >
                Contactadas ({contadores.contactada})
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
            
            {paginacion.totalPages > 1 && (
              <div className="paginacion">
                <button
                  className="paginacion-btn"
                  onClick={() => cargarSolicitudes(paginacion.page - 1)}
                  disabled={paginacion.page === 1}
                >
                  Anterior
                </button>
                <span className="paginacion-info">
                  Página {paginacion.page} de {paginacion.totalPages}
                </span>
                <button
                  className="paginacion-btn"
                  onClick={() => cargarSolicitudes(paginacion.page + 1)}
                  disabled={paginacion.page === paginacion.totalPages}
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "testimonios" && (
          <div className="tab-content">
            <div className="testimonio-form-section">
              <h2>{formTestimonio.id ? "Editar Testimonio" : "Agregar Nuevo Testimonio"}</h2>
              <form onSubmit={guardarTestimonio} className="testimonio-form">
                <div className="form-group">
                  <label htmlFor="nombreCompleto">
                    Nombre Completo 
                    <span className="char-count">
                      {formTestimonio.nombreCompleto.length}/100
                    </span>
                  </label>
                  <input
                    type="text"
                    id="nombreCompleto"
                    name="nombreCompleto"
                    value={formTestimonio.nombreCompleto}
                    onChange={handleTestimonioChange}
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="Ej: María González"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="texto">
                    Testimonio
                    <span className="char-count">
                      {formTestimonio.texto.length}/500
                    </span>
                  </label>
                  <textarea
                    id="texto"
                    name="texto"
                    value={formTestimonio.texto}
                    onChange={handleTestimonioChange}
                    required
                    minLength={10}
                    maxLength={500}
                    rows={4}
                    placeholder="Escribe el testimonio del alumno..."
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="activo"
                      checked={formTestimonio.activo}
                      onChange={handleTestimonioChange}
                    />
                    Testimonio activo (visible en la web)
                  </label>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-guardar">
                    {formTestimonio.id ? "Actualizar" : "Guardar"}
                  </button>
                  {formTestimonio.id && (
                    <button
                      type="button"
                      onClick={cancelarEdicion}
                      className="btn-cancelar"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {loading ? (
              <div className="loading">Cargando testimonios...</div>
            ) : testimonios.length === 0 ? (
              <div className="empty-state">No hay testimonios creados</div>
            ) : (
              <div className="testimonios-list">
                <h2>Testimonios Existentes</h2>
                {testimonios.map((test) => (
                  <div key={test.id} className="testimonio-card">
                    <div className="testimonio-header">
                      <h3>{DOMPurify.sanitize(test.nombreCompleto, { ALLOWED_TAGS: [] })}</h3>
                      <span className={`status-badge ${test.activo ? 'activo' : 'inactivo'}`}>
                        {test.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <p className="testimonio-texto">
                      "{DOMPurify.sanitize(test.texto, { ALLOWED_TAGS: [] })}"
                    </p>
                    <div className="testimonio-footer">
                      <span className="fecha">{formatearFecha(test.createdAt)}</span>
                      <div className="testimonio-actions">
                        <button
                          onClick={() => editarTestimonio(test)}
                          className="btn-editar"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarTestimonio(test.id)}
                          className="btn-eliminar"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
