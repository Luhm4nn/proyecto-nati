import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";
import { useLoading } from "../../../contexts/LoadingContext";

export function useConsultas() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { startLoading, stopLoading } = useLoading();
  const [consultas, setConsultas] = useState([]);
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
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    name: "",
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
          `${apiUrl}/consultas?${estado !== "todas" ? `estado=${estado}&` : ""}page=1&limit=1`,
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

  const cargarConsultas = async (page = 1) => {
    setLoading(true);
    startLoading("Cargando consultas...");
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const params = new URLSearchParams({
        page: page.toString(),
        limit: paginacion.limit.toString(),
      });

      if (filtro !== "todas") {
        params.append("estado", filtro);
      }

      const response = await fetch(`${apiUrl}/consultas?${params}`, {
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
        setConsultas(result.data);
        setPaginacion(result.pagination);

        setContadores((prev) => ({
          ...prev,
          [filtro]: result.pagination.total,
        }));
      } else {
        setConsultas([]);
        showError("Error al cargar las consultas");
      }
    } catch (error) {
      showError("Error al cargar las consultas");
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    startLoading("Actualizando estado...");
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/consultas/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (response.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (response.ok) {
        showSuccess(`Estado actualizado a: ${nuevoEstado}`);
      } else {
        showError("Error al actualizar el estado");
      }
      await cargarConsultas(paginacion.page);
      await cargarContadores();
    } catch (error) {
      showError("Error al actualizar el estado");
    } finally {
      stopLoading();
    }
  };

  const abrirModalEliminar = (consulta) => {
    setDeleteModal({
      isOpen: true,
      id: consulta.id,
      name: consulta.nombre,
    });
  };

  const cerrarModalEliminar = () => {
    setDeleteModal({
      isOpen: false,
      id: null,
      name: "",
    });
  };

  const confirmarEliminacion = async () => {
    await eliminarConsulta(deleteModal.id);
    cerrarModalEliminar();
  };

  const eliminarConsulta = async (id) => {
    startLoading("Eliminando consulta...");
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/consultas/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (response.ok) {
        showSuccess("Consulta eliminada correctamente");
      } else {
        showError("Error al eliminar la consulta");
      }
      await cargarConsultas(paginacion.page);
      await cargarContadores();
    } catch (error) {
      showError("Error al eliminar la consulta");
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    setPaginacion((prev) => ({ ...prev, page: 1 }));
    cargarConsultas(1);
  }, [filtro]);

  useEffect(() => {
    cargarContadores();
  }, []);

  return {
    consultas,
    filtro,
    setFiltro,
    loading,
    paginacion,
    contadores,
    cambiarEstado,
    abrirModalEliminar,
    cargarConsultas,
    deleteModal,
    cerrarModalEliminar,
    confirmarEliminacion,
  };
}
