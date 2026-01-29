import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";

export function useCursos() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formCurso, setFormCurso] = useState({
    id: null,
    titulo: "",
    descripcion: "",
    items: [""],
    activo: true,
  });
  const [showDictadoModal, setShowDictadoModal] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [formDictado, setFormDictado] = useState({
    id: null,
    horarioInicio: "",
    horarioFin: "",
    fechaInicio: "",
    fechaFin: "",
    duracionEstimada: 1,
    diasSemana: [],
    cupos: 0,
    activo: true,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null,
    id: null,
    name: "",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const cargarCursos = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/cursos`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await response.json();
      setCursos(data);
    } catch (error) {
      showError("Error al cargar los cursos");
    } finally {
      setLoading(false);
    }
  };

  const handleCursoChange = (e) => {
    const { name, value } = e.target;
    setFormCurso({
      ...formCurso,
      [name]: value,
    });
  };

  const handleItemChange = (index, value) => {
    const newItems = [...formCurso.items];
    newItems[index] = value;
    setFormCurso({
      ...formCurso,
      items: newItems,
    });
  };

  const agregarItem = () => {
    setFormCurso({
      ...formCurso,
      items: [...formCurso.items, ""],
    });
  };

  const eliminarItem = (index) => {
    const newItems = formCurso.items.filter((_, i) => i !== index);
    setFormCurso({
      ...formCurso,
      items: newItems.length > 0 ? newItems : [""],
    });
  };

  const guardarCurso = async (e) => {
    e.preventDefault();

    const itemsFiltrados = formCurso.items.filter((item) => item.trim() !== "");

    if (!formCurso.titulo || !formCurso.descripcion || itemsFiltrados.length === 0) {
      showError("Por favor completa todos los campos");
      return;
    }

    const cursoData = {
      titulo: formCurso.titulo,
      descripcion: formCurso.descripcion,
      items: itemsFiltrados,
      activo: formCurso.activo,
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const url = formCurso.id
        ? `${apiUrl}/cursos/${formCurso.id}`
        : `${apiUrl}/cursos`;
      const method = formCurso.id ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cursoData),
      });

      if (response.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar el curso");
      }

      showSuccess(
        formCurso.id ? "Curso actualizado exitosamente" : "Curso creado exitosamente"
      );
      cancelarEdicion();
      cargarCursos();
    } catch (error) {
      showError(error.message || "Error al guardar el curso");
    }
  };

  const editarCurso = (curso) => {
    setFormCurso({
      id: curso.id,
      titulo: curso.titulo,
      descripcion: curso.descripcion,
      items: curso.items.length > 0 ? curso.items : [""],
      activo: curso.activo ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const abrirModalEliminarCurso = (curso) => {
    setDeleteModal({
      isOpen: true,
      type: "curso",
      id: curso.id,
      name: curso.titulo,
    });
  };

  const abrirModalEliminarDictado = (dictado, cursoTitulo) => {
    setDeleteModal({
      isOpen: true,
      type: "dictado",
      id: dictado.id,
      name: `${cursoTitulo} - ${dictado.horarioInicio}`,
    });
  };

  const cerrarModalEliminar = () => {
    setDeleteModal({
      isOpen: false,
      type: null,
      id: null,
      name: "",
    });
  };

  const confirmarEliminacion = async () => {
    if (deleteModal.type === "curso") {
      await eliminarCurso(deleteModal.id);
    } else if (deleteModal.type === "dictado") {
      await eliminarDictado(deleteModal.id);
    }
    cerrarModalEliminar();
  };

  const eliminarCurso = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/cursos/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) throw new Error("Error al eliminar el curso");

      showSuccess("Curso eliminado exitosamente");
      cargarCursos();
    } catch (error) {
      showError("Error al eliminar el curso");
    }
  };

  const cancelarEdicion = () => {
    setFormCurso({
      id: null,
      titulo: "",
      descripcion: "",
      items: [""],
      activo: true,
    });
  };

  const abrirModalDictado = (curso, dictado = null) => {
    setCursoSeleccionado(curso);
    if (dictado) {
      setFormDictado({
        id: dictado.id,
        horarioInicio: dictado.horarioInicio,
        horarioFin: dictado.horarioFin,
        fechaInicio: dictado.fechaInicio.split("T")[0],
        fechaFin: dictado.fechaFin.split("T")[0],
        duracionEstimada: dictado.duracionEstimada,
        diasSemana: dictado.diasSemana,
        cupos: dictado.cupos || 0,
        activo: dictado.activo ?? true,
      });
    } else {
      setFormDictado({
        id: null,
        horarioInicio: "",
        horarioFin: "",
        fechaInicio: "",
        fechaFin: "",
        duracionEstimada: 1,
        diasSemana: [],
        cupos: 0,
        activo: true,
      });
    }
    setShowDictadoModal(true);
  };

  const cerrarModalDictado = () => {
    setShowDictadoModal(false);
    setCursoSeleccionado(null);
    setFormDictado({
      id: null,
      horarioInicio: "",
      horarioFin: "",
      fechaInicio: "",
      fechaFin: "",
      duracionEstimada: 1,
      diasSemana: [],
      cupos: 0,
      activo: true,
    });
  };

  const handleDictadoChange = (e) => {
    const { name, value } = e.target;
    setFormDictado({
      ...formDictado,
      [name]: value,
    });
  };

  const toggleDiaSemana = (dia) => {
    setFormDictado({
      ...formDictado,
      diasSemana: formDictado.diasSemana.includes(dia)
        ? formDictado.diasSemana.filter((d) => d !== dia)
        : [...formDictado.diasSemana, dia],
    });
  };

  const guardarDictado = async (e) => {
    e.preventDefault();

    if (
      !formDictado.horarioInicio ||
      !formDictado.horarioFin ||
      !formDictado.fechaInicio ||
      !formDictado.fechaFin ||
      formDictado.diasSemana.length === 0
    ) {
      showError("Por favor completa todos los campos");
      return;
    }

    const dictadoData = {
      cursoId: cursoSeleccionado.id,
      horarioInicio: formDictado.horarioInicio,
      horarioFin: formDictado.horarioFin,
      fechaInicio: formDictado.fechaInicio,
      fechaFin: formDictado.fechaFin,
      duracionEstimada: parseInt(formDictado.duracionEstimada, 10),
      diasSemana: formDictado.diasSemana,
      cupos: parseInt(formDictado.cupos, 10) || 0,
      activo: formDictado.activo,
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const url = formDictado.id
        ? `${apiUrl}/cursos/dictados/${formDictado.id}`
        : `${apiUrl}/cursos/dictados`;
      const method = formDictado.id ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dictadoData),
      });

      if (response.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar el dictado");
      }

      showSuccess(
        formDictado.id
          ? "Dictado actualizado exitosamente"
          : "Dictado creado exitosamente"
      );
      cerrarModalDictado();
      cargarCursos();
    } catch (error) {
      showError(error.message || "Error al guardar el dictado");
    }
  };

  const eliminarDictado = async (dictadoId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/cursos/dictados/${dictadoId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) throw new Error("Error al eliminar el dictado");

      showSuccess("Dictado eliminado exitosamente");
      cargarCursos();
    } catch (error) {
      showError("Error al eliminar el dictado");
    }
  };

  useEffect(() => {
    cargarCursos();
  }, []);

  return {
    cursos,
    loading,
    formCurso,
    handleCursoChange,
    handleItemChange,
    agregarItem,
    eliminarItem,
    guardarCurso,
    editarCurso,
    abrirModalEliminarCurso,
    cancelarEdicion,
    showDictadoModal,
    cursoSeleccionado,
    formDictado,
    handleDictadoChange,
    toggleDiaSemana,
    abrirModalDictado,
    cerrarModalDictado,
    guardarDictado,
    abrirModalEliminarDictado,
    deleteModal,
    cerrarModalEliminar,
    confirmarEliminacion,
  };
}
