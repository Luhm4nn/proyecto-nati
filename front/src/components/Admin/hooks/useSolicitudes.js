import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";

export function useSolicitudes() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [solicitudes, setSolicitudes] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [loading, setLoading] = useState(true);
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

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const cargarContadores = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const estados = ["todas", "pendiente", "revisada", "contactada"];

      const requests = estados.map((estado) =>
        fetch(
          `${apiUrl}/solicitudes?${estado !== "todas" ? `estado=${estado}&` : ""}page=1&limit=1`,
          { headers: getAuthHeaders() }
        ).then(async (r) => {
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

        setContadores((prev) => ({
          ...prev,
          [filtro]: result.pagination.total,
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

  useEffect(() => {
    setPaginacion((prev) => ({ ...prev, page: 1 }));
    cargarSolicitudes(1);
  }, [filtro]);

  useEffect(() => {
    cargarContadores();
  }, []);

  return {
    solicitudes,
    filtro,
    setFiltro,
    loading,
    paginacion,
    contadores,
    cambiarEstado,
    eliminarSolicitud,
    cargarSolicitudes,
  };
}
