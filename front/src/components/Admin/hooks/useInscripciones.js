import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../contexts/ToastContext';
import { useLoading } from '../../../contexts/LoadingContext';

export function useInscripciones(options = {}) {
  const { onDataChange } = options;
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { startLoading, stopLoading } = useLoading();
  const [inscripciones, setInscripciones] = useState([]);
  const [filtro, setFiltro] = useState('todas');
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
    confirmada: 0,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    name: '',
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    id: null,
    name: '',
  });

  const [showModalInscripcion, setShowModalInscripcion] = useState(false);
  const [formInscripcion, setFormInscripcion] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    cursoId: '',
    dictadoCursoId: '',
  });
  const [cursosDropdown, setCursosDropdown] = useState([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  const cargarContadores = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const estados = ['todas', 'pendiente', 'confirmada'];

      const requests = estados.map((estado) =>
        fetch(
          `${apiUrl}/inscripciones?${estado !== 'todas' ? `estado=${estado}&` : ''}page=1&limit=1`,
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
        confirmada: results[2]?.pagination?.total || 0,
      });
    } catch (error) {
      console.error('Error cargando contadores:', error);
    }
  };

  const cargarInscripciones = async (page = 1) => {
    setLoading(true);
    startLoading('Cargando inscripciones...');
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const params = new URLSearchParams({
        page: page.toString(),
        limit: paginacion.limit.toString(),
      });

      if (filtro !== 'todas') {
        params.append('estado', filtro);
      }

      const response = await fetch(`${apiUrl}/inscripciones?${params}`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const result = await response.json();

      if (result?.data && result?.pagination) {
        setInscripciones(result.data);
        setPaginacion(result.pagination);
      } else {
        setInscripciones([]);
        showError('Error al cargar las inscripciones');
      }
    } catch (error) {
      showError('Error al cargar las inscripciones');
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    startLoading('Actualizando estado...');
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/inscripciones/${id}/estado`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!response.ok) throw new Error();

      showSuccess('Estado actualizado');
      await cargarInscripciones(paginacion.page);
      await cargarContadores();
      if (onDataChange) onDataChange();
    } catch (error) {
      showError('Error al actualizar el estado');
    } finally {
      stopLoading();
    }
  };

  const confirmarInscripcion = async (id) => {
    startLoading('Confirmando inscripción...');
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/inscripciones/${id}/confirmar`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Error al confirmar la inscripción'
        );
      }

      showSuccess('Inscripción confirmada y mail enviado al alumno');
      await cargarInscripciones(paginacion.page);
      await cargarContadores();
      if (onDataChange) onDataChange();
    } catch (error) {
      showError(error.message || 'Error al confirmar la inscripción');
    } finally {
      stopLoading();
    }
  };

  const abrirModalEliminar = (inscripcion) => {
    setDeleteModal({
      isOpen: true,
      id: inscripcion.id,
      name: `${inscripcion.nombre} ${inscripcion.apellido}`,
    });
  };

  const cerrarModalEliminar = () => {
    setDeleteModal({
      isOpen: false,
      id: null,
      name: '',
    });
  };

  const abrirModalConfirmar = (inscripcion) => {
    setConfirmModal({
      isOpen: true,
      id: inscripcion.id,
      name: `${inscripcion.nombre} ${inscripcion.apellido}`,
    });
  };

  const cerrarModalConfirmar = () => {
    setConfirmModal({
      isOpen: false,
      id: null,
      name: '',
    });
  };

  const confirmarAceptacion = async () => {
    await confirmarInscripcion(confirmModal.id);
    cerrarModalConfirmar();
  };

  const confirmarEliminacion = async () => {
    await eliminarInscripcion(deleteModal.id);
    cerrarModalEliminar();
  };

  const eliminarInscripcion = async (id) => {
    startLoading('Eliminando inscripción...');
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/inscripciones/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        showSuccess('Inscripción eliminada correctamente');
        await cargarInscripciones(paginacion.page);
        await cargarContadores();
        if (onDataChange) onDataChange();
      } else {
        throw new Error();
      }
    } catch (error) {
      showError('Error al eliminar la inscripción');
    } finally {
      stopLoading();
    }
  };

  const cargarCursosDropdown = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/cursos`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setCursosDropdown(data);
      }
    } catch (error) {
      console.error('Error cargando cursos para dropdown:', error);
    }
  };

  const abrirModalInscripcion = async () => {
    await cargarCursosDropdown();
    setFormInscripcion({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      cursoId: '',
      dictadoCursoId: '',
    });
    setShowModalInscripcion(true);
  };

  const cerrarModalInscripcion = () => {
    setShowModalInscripcion(false);
  };

  const handleInscripcionChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cursoId') {
      const curso = cursosDropdown.find((c) => c.id === parseInt(value));
      const dictados = curso?.dictadosCurso || [];

      setFormInscripcion((prev) => ({
        ...prev,
        [name]: value,
        // Si solo hay un dictado, seleccionarlo automáticamente
        dictadoCursoId: dictados.length === 1 ? dictados[0].id.toString() : '',
      }));
    } else {
      setFormInscripcion((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const guardarInscripcionAdmin = async (e) => {
    e.preventDefault();

    if (
      !formInscripcion.nombre ||
      !formInscripcion.apellido ||
      !formInscripcion.email ||
      !formInscripcion.dictadoCursoId
    ) {
      showError('Por favor completa los campos requeridos');
      return;
    }

    startLoading('Guardando inscripción...');
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/inscripciones/admin`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          nombre: formInscripcion.nombre,
          apellido: formInscripcion.apellido,
          email: formInscripcion.email,
          telefono: formInscripcion.telefono || 'N/A',
          dictadoCursoId: parseInt(formInscripcion.dictadoCursoId),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar inscripción');
      }

      showSuccess('Inscripción creada con éxito');
      cerrarModalInscripcion();
      await cargarInscripciones(1);
      await cargarContadores();
      if (onDataChange) onDataChange();
    } catch (error) {
      showError(error.message || 'Error al crear la inscripción');
    } finally {
      stopLoading();
    }
  };

  // Función para agrupar inscripciones por curso y dictado
  const agruparInscripciones = () => {
    const grupos = {};

    inscripciones.forEach((inscripcion) => {
      const dictado = inscripcion.dictadoCurso;
      const curso = dictado?.curso;

      if (!dictado || !curso) return;

      const cursoKey = curso.id;
      const dictadoKey = dictado.id;

      if (!grupos[cursoKey]) {
        grupos[cursoKey] = {
          curso,
          dictados: {},
        };
      }

      if (!grupos[cursoKey].dictados[dictadoKey]) {
        grupos[cursoKey].dictados[dictadoKey] = {
          dictado,
          inscripciones: [],
        };
      }

      grupos[cursoKey].dictados[dictadoKey].inscripciones.push(inscripcion);
    });

    // Convertir a array y ordenar
    return Object.values(grupos)
      .sort((a, b) => a.curso.titulo.localeCompare(b.curso.titulo))
      .map((grupo) => ({
        curso: grupo.curso,
        dictados: Object.values(grupo.dictados).sort((a, b) => {
          // Ordenar por fecha de inicio del dictado
          return (
            new Date(a.dictado.fechaInicio) - new Date(b.dictado.fechaInicio)
          );
        }),
      }));
  };

  useEffect(() => {
    cargarInscripciones(1);
  }, [filtro]);

  useEffect(() => {
    cargarContadores();
  }, []);

  return {
    inscripciones,
    filtro,
    setFiltro,
    loading,
    paginacion,
    contadores,
    cambiarEstado,
    confirmarInscripcion,
    abrirModalEliminar,
    abrirModalConfirmar,
    cargarInscripciones,
    deleteModal,
    confirmModal,
    cerrarModalEliminar,
    cerrarModalConfirmar,
    confirmarEliminacion,
    confirmarAceptacion,
    agruparInscripciones,
    showModalInscripcion,
    formInscripcion,
    cursosDropdown,
    handleInscripcionChange,
    abrirModalInscripcion,
    cerrarModalInscripcion,
    guardarInscripcionAdmin,
  };
}
