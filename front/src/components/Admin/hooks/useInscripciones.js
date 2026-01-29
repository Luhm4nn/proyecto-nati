import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";

export function useInscripciones() {
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const [inscripciones, setInscripciones] = useState([]);
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
        confirmada: 0,
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
            const estados = ["todas", "pendiente", "confirmada"];

            const requests = estados.map((estado) =>
                fetch(
                    `${apiUrl}/inscripciones?${estado !== "todas" ? `estado=${estado}&` : ""}page=1&limit=1`,
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
            console.error("Error cargando contadores:", error);
        }
    };

    const cargarInscripciones = async (page = 1) => {
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

            const response = await fetch(`${apiUrl}/inscripciones?${params}`, {
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
                setInscripciones(result.data);
                setPaginacion(result.pagination);
            } else {
                setInscripciones([]);
                showError("Error al cargar las inscripciones");
            }
        } catch (error) {
            showError("Error al cargar las inscripciones");
        } finally {
            setLoading(false);
        }
    };

    const cambiarEstado = async (id, nuevoEstado) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/inscripciones/${id}`, {
                method: "PATCH",
                headers: getAuthHeaders(),
                body: JSON.stringify({ estado: nuevoEstado }),
            });

            if (!response.ok) throw new Error("Error al actualizar el estado");

            showSuccess(`Estado actualizado a: ${nuevoEstado}`);
            cargarInscripciones(paginacion.page);
            cargarContadores();
        } catch (error) {
            showError("Error al actualizar el estado");
        }
    };

    const confirmarInscripcion = async (id) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/inscripciones/${id}/confirmar`, {
                method: "PATCH",
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al confirmar la inscripción");
            }

            showSuccess("Inscripción confirmada y mail enviado al alumno");
            cargarInscripciones(paginacion.page);
            cargarContadores();
        } catch (error) {
            showError(error.message || "Error al confirmar la inscripción");
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
            name: "",
        });
    };

    const confirmarEliminacion = async () => {
        await eliminarInscripcion(deleteModal.id);
        cerrarModalEliminar();
    };

    const eliminarInscripcion = async (id) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/inscripciones/${id}`, {
                method: "DELETE",
                headers: getAuthHeaders(),
            });

            if (response.ok) {
                showSuccess("Inscripción eliminada correctamente");
                cargarInscripciones(paginacion.page);
                cargarContadores();
            }
        } catch (error) {
            showError("Error al eliminar la inscripción");
        }
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
        cargarInscripciones,
        deleteModal,
        cerrarModalEliminar,
        confirmarEliminacion,
    };
}
