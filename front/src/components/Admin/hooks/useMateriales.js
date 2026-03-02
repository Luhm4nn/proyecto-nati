import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../contexts/ToastContext';
import { useLoading } from '../../../contexts/LoadingContext';

export function useMateriales() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { startLoading, stopLoading } = useLoading();
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMaterial, setFormMaterial] = useState({
    id: null,
    nombre: '',
    archivo: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    name: '',
  });
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    url: '',
    name: '',
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const cargarMateriales = async () => {
    setLoading(true);
    startLoading('Cargando materiales...');
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/materiales`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const data = await response.json();
      setMateriales(data);
    } catch (error) {
      showError('Error al cargar los materiales');
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  const handleMaterialChange = (e) => {
    const { name, value } = e.target;
    setFormMaterial({
      ...formMaterial,
      [name]: value,
    });
  };

  const handleArchivoChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setFormMaterial({ ...formMaterial, archivo: null });
      return;
    }

    // Validar tipo de archivo (PDF, DOC, DOCX, etc.)
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];

    // Si queremos ser más permisivos o restrictivos, podemos ajustar esto.
    // El usuario pidió "pdf o documento en general".

    if (file.size > 10 * 1024 * 1024) {
      showError('El archivo no debe superar 10MB');
      e.target.value = '';
      return;
    }

    setFormMaterial({ ...formMaterial, archivo: file });
  };

  const guardarMaterial = async (e) => {
    e.preventDefault();

    if (formMaterial.nombre.trim().length < 3) {
      showError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    const isEdit = formMaterial.id !== null;

    if (!isEdit && !formMaterial.archivo) {
      showError('Debes seleccionar un archivo');
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const formData = new FormData();
      formData.append('nombre', formMaterial.nombre.trim());

      if (formMaterial.archivo) {
        formData.append('archivo', formMaterial.archivo);
      }

      startLoading(
        isEdit ? 'Actualizando material...' : 'Subiendo material...'
      );

      const url = isEdit
        ? `${apiUrl}/materiales/${formMaterial.id}`
        : `${apiUrl}/materiales`;

      const response = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });

      if (response.ok) {
        showSuccess(
          isEdit
            ? 'Material actualizado correctamente'
            : 'Material subido correctamente'
        );
        setFormMaterial({
          id: null,
          nombre: '',
          archivo: null,
        });
        await cargarMateriales();

        // Limpiar input file
        const fileInput = document.getElementById('archivo');
        if (fileInput) fileInput.value = '';
      } else {
        const error = await response.json();
        showError(error.message || 'Error al guardar el material');
      }
    } catch (error) {
      showError('Error de conexión. Verifica tu red e intenta nuevamente.');
    } finally {
      stopLoading();
    }
  };

  const editarMaterial = (material) => {
    setFormMaterial({
      id: material.id,
      nombre: material.nombre,
      archivo: null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const abrirModalEliminar = (material) => {
    setDeleteModal({
      isOpen: true,
      id: material.id,
      name: material.nombre,
    });
  };

  const cerrarModalEliminar = () => {
    setDeleteModal({
      isOpen: false,
      id: null,
      name: '',
    });
  };

  const abrirPreview = (material) => {
    setPreviewModal({
      isOpen: true,
      url: material.docUrl,
      name: material.nombre,
    });
  };

  const cerrarPreview = () => {
    setPreviewModal({
      isOpen: false,
      url: '',
      name: '',
    });
  };

  const confirmarEliminacion = async () => {
    await eliminarMaterial(deleteModal.id);
    cerrarModalEliminar();
  };

  const eliminarMaterial = async (id) => {
    startLoading('Eliminando material...');
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/materiales/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        showSuccess('Material eliminado correctamente');
        await cargarMateriales();
      }
    } catch (error) {
      showError('Error al eliminar el material');
    } finally {
      stopLoading();
    }
  };

  const cancelarEdicion = () => {
    setFormMaterial({
      id: null,
      nombre: '',
      archivo: null,
    });

    const fileInput = document.getElementById('archivo');
    if (fileInput) fileInput.value = '';
  };

  useEffect(() => {
    cargarMateriales();
  }, []);

  return {
    materiales,
    loading,
    formMaterial,
    handleMaterialChange,
    handleArchivoChange,
    guardarMaterial,
    editarMaterial,
    abrirModalEliminar,
    cancelarEdicion,
    cargarMateriales,
    deleteModal,
    cerrarModalEliminar,
    confirmarEliminacion,
    previewModal,
    abrirPreview,
    cerrarPreview,
  };
}
