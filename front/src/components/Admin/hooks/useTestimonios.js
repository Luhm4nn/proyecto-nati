import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";

export function useTestimonios() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [testimonios, setTestimonios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formTestimonio, setFormTestimonio] = useState({
    id: null,
    nombreCompleto: "",
    texto: "",
    activo: true,
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
        setFormTestimonio({
          id: null,
          nombreCompleto: "",
          texto: "",
          activo: true,
        });
        cargarTestimonios();
      } else {
        const error = await response.json();
        if (error.message && Array.isArray(error.message)) {
          error.message.forEach((msg) => showError(msg));
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

  const abrirModalEliminar = (testimonio) => {
    setDeleteModal({
      isOpen: true,
      id: testimonio.id,
      name: testimonio.nombreCompleto,
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
    await eliminarTestimonio(deleteModal.id);
    cerrarModalEliminar();
  };

  const eliminarTestimonio = async (id) => {
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
    setFormTestimonio({
      id: null,
      nombreCompleto: "",
      texto: "",
      activo: true,
    });
  };

  useEffect(() => {
    cargarTestimonios();
  }, []);

  return {
    testimonios,
    loading,
    formTestimonio,
    handleTestimonioChange,
    guardarTestimonio,
    editarTestimonio,
    abrirModalEliminar,
    cancelarEdicion,
    deleteModal,
    cerrarModalEliminar,
    confirmarEliminacion,
  };
}
