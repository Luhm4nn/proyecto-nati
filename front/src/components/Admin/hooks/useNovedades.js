import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";

export function useNovedades() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [novedades, setNovedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formNovedad, setFormNovedad] = useState({
    id: null,
    titulo: "",
    descripcion: "",
    imagen: null,
  });
  const [previewImagen, setPreviewImagen] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    name: "",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const cargarNovedades = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/novedades`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await response.json();
      setNovedades(data);
    } catch (error) {
      showError("Error al cargar las novedades");
    } finally {
      setLoading(false);
    }
  };

  const handleNovedadChange = (e) => {
    const { name, value } = e.target;
    setFormNovedad({
      ...formNovedad,
      [name]: value,
    });
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setFormNovedad({ ...formNovedad, imagen: null });
      setPreviewImagen(null);
      return;
    }

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      showError("Formato de imagen no válido. Usa JPEG, PNG o WebP");
      e.target.value = '';
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError("La imagen no debe superar 5MB");
      e.target.value = '';
      return;
    }

    setFormNovedad({ ...formNovedad, imagen: file });
    
    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImagen(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const guardarNovedad = async (e) => {
    e.preventDefault();

    if (formNovedad.titulo.trim().length < 5) {
      showError("El título debe tener al menos 5 caracteres");
      return;
    }
    if (formNovedad.titulo.trim().length > 100) {
      showError("El título no puede superar 100 caracteres");
      return;
    }
    if (formNovedad.descripcion.trim().length < 10) {
      showError("La descripción debe tener al menos 10 caracteres");
      return;
    }
    if (formNovedad.descripcion.trim().length > 500) {
      showError("La descripción no puede superar 500 caracteres");
      return;
    }

    const isEdit = formNovedad.id !== null;
    
    if (!isEdit && !formNovedad.imagen) {
      showError("Debes seleccionar una imagen");
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const formData = new FormData();
      formData.append('titulo', formNovedad.titulo.trim());
      formData.append('descripcion', formNovedad.descripcion.trim());
      
      if (formNovedad.imagen) {
        formData.append('imagen', formNovedad.imagen);
      }

      const url = isEdit
        ? `${apiUrl}/novedades/${formNovedad.id}`
        : `${apiUrl}/novedades`;

      const response = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: getAuthHeaders(),
        body: formData,
      });

      if (response.ok) {
        showSuccess(
          isEdit
            ? "Novedad actualizada correctamente"
            : "Novedad creada correctamente"
        );
        setFormNovedad({
          id: null,
          titulo: "",
          descripcion: "",
          imagen: null,
        });
        setPreviewImagen(null);
        cargarNovedades();
        
        // Limpiar input file
        const fileInput = document.getElementById('imagen');
        if (fileInput) fileInput.value = '';
      } else {
        const error = await response.json();
        if (error.message && Array.isArray(error.message)) {
          error.message.forEach((msg) => showError(msg));
        } else {
          showError(error.message || "Error al guardar la novedad");
        }
      }
    } catch (error) {
      showError("Error de conexión. Verifica tu red e intenta nuevamente.");
    }
  };

  const editarNovedad = (novedad) => {
    setFormNovedad({
      id: novedad.id,
      titulo: novedad.titulo,
      descripcion: novedad.descripcion,
      imagen: null,
    });
    setPreviewImagen(novedad.imagenUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const abrirModalEliminar = (novedad) => {
    setDeleteModal({
      isOpen: true,
      id: novedad.id,
      name: novedad.titulo,
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
    await eliminarNovedad(deleteModal.id);
    cerrarModalEliminar();
  };

  const eliminarNovedad = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/novedades/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        showSuccess("Novedad eliminada correctamente");
        cargarNovedades();
      }
    } catch (error) {
      showError("Error al eliminar la novedad");
    }
  };

  const cancelarEdicion = () => {
    setFormNovedad({
      id: null,
      titulo: "",
      descripcion: "",
      imagen: null,
    });
    setPreviewImagen(null);
    
    // Limpiar input file
    const fileInput = document.getElementById('imagen');
    if (fileInput) fileInput.value = '';
  };

  useEffect(() => {
    cargarNovedades();
  }, []);

  return {
    novedades,
    loading,
    formNovedad,
    previewImagen,
    handleNovedadChange,
    handleImagenChange,
    guardarNovedad,
    editarNovedad,
    abrirModalEliminar,
    cancelarEdicion,
    cargarNovedades,
    deleteModal,
    cerrarModalEliminar,
    confirmarEliminacion,
  };
}
