import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";
import { useLoading } from "../../../contexts/LoadingContext";

export function useDatosTransferencia() {
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const { startLoading, stopLoading } = useLoading();
    const [datosNacional, setDatosNacional] = useState({
        id: 1,
        alias: "",
        cvu: "",
        nombreCuenta: "",
        tipo: "nacional",
    });
    const [datosInternacional, setDatosInternacional] = useState({
        id: 2,
        alias: "",
        cvu: "",
        nombreCuenta: "",
        tipo: "internacional",
    });
    const [datosDolares, setDatosDolares] = useState({
        id: 3,
        alias: "",
        cvu: "",
        nombreCuenta: "",
        tipo: "dolares",
    });
    const [loading, setLoading] = useState(true);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    };

    const cargarDatos = async () => {
        setLoading(true);
        startLoading("Cargando datos de transferencia...");
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/datos-transferencia`);
            if (!response.ok) throw new Error("Error al cargar los datos");
            const data = await response.json();

            const nacional = data.find((d) => d.tipo === "nacional") || data.find((d) => d.id === 1);
            const internacional = data.find((d) => d.tipo === "internacional") || data.find((d) => d.id === 2);
            const dolares = data.find((d) => d.tipo === "dolares") || data.find((d) => d.id === 3);

            if (nacional) {
                setDatosNacional({
                    id: nacional.id,
                    alias: nacional.alias || "",
                    cvu: nacional.cvu || "",
                    nombreCuenta: nacional.nombreCuenta || "",
                    tipo: "nacional",
                });
            }
            if (internacional) {
                setDatosInternacional({
                    id: internacional.id,
                    alias: internacional.alias || "",
                    cvu: internacional.cvu || "",
                    nombreCuenta: internacional.nombreCuenta || "",
                    tipo: "internacional",
                });
            }
            if (dolares) {
                setDatosDolares({
                    id: dolares.id,
                    alias: dolares.alias || "",
                    cvu: dolares.cvu || "",
                    nombreCuenta: dolares.nombreCuenta || "",
                    tipo: "dolares",
                });
            }
        } catch (error) {
            showError("Error al cargar los datos de transferencia");
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    const handleChangeNacional = (e) => {
        const { name, value } = e.target;
        setDatosNacional((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangeInternacional = (e) => {
        const { name, value } = e.target;
        setDatosInternacional((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangeDolares = (e) => {
        const { name, value } = e.target;
        setDatosDolares((prev) => ({ ...prev, [name]: value }));
    };

    const guardarDatos = async (e, tipo) => {
        e.preventDefault();
        let datos;
        if (tipo === "nacional") {
            datos = datosNacional;
        } else if (tipo === "internacional") {
            datos = datosInternacional;
        } else {
            datos = datosDolares;
        }

        startLoading("Guardando cambios...");
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/datos-transferencia/${datos.id}`, {
                method: "PATCH",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    alias: datos.alias,
                    cvu: datos.cvu,
                    nombreCuenta: datos.nombreCuenta,
                }),
            });

            if (response.status === 401) {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al guardar los datos");
            }

            let msg = "Datos de transferencia ";
            if (tipo === "nacional") msg += "nacional actualizados";
            else if (tipo === "internacional") msg += "internacional actualizados";
            else msg += "en dólares actualizados";

            showSuccess(msg);
        } catch (error) {
            showError(error.message || "Error al guardar los datos");
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    return {
        datosNacional,
        datosInternacional,
        datosDolares,
        loading,
        handleChangeNacional,
        handleChangeInternacional,
        handleChangeDolares,
        guardarDatos,
        recargar: cargarDatos,
    };
}
