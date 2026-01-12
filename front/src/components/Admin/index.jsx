import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionTimeout } from "../../hooks/useSessionTimeout";
import AdminHeader from "./AdminHeader";
import AdminTabs from "./AdminTabs";
import SolicitudesTab from "./SolicitudesTab";
import TestimoniosTab from "./TestimoniosTab";
import NovedadesTab from "./NovedadesTab";
import { useSolicitudes } from "./hooks/useSolicitudes";
import { useTestimonios } from "./hooks/useTestimonios";
import { useNovedades } from "./hooks/useNovedades";
import { formatearFecha, getEstadoColor } from "./utils/helpers";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();
  useSessionTimeout();
  const [activeTab, setActiveTab] = useState("solicitudes");
  const [user, setUser] = useState(null);

  const solicitudesData = useSolicitudes();
  const testimoniosData = useTestimonios();
  const novedadesData = useNovedades();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin">
      <div className="admin-container">
        <AdminHeader user={user} onLogout={handleLogout} />

        <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "solicitudes" && (
          <SolicitudesTab
            solicitudes={solicitudesData.solicitudes}
            loading={solicitudesData.loading}
            filtro={solicitudesData.filtro}
            setFiltro={solicitudesData.setFiltro}
            contadores={solicitudesData.contadores}
            paginacion={solicitudesData.paginacion}
            onCambiarEstado={solicitudesData.cambiarEstado}
            onEliminar={solicitudesData.eliminarSolicitud}
            onCambiarPagina={solicitudesData.cargarSolicitudes}
            formatearFecha={formatearFecha}
            getEstadoColor={getEstadoColor}
          />
        )}

        {activeTab === "testimonios" && (
          <TestimoniosTab
            testimonios={testimoniosData.testimonios}
            loading={testimoniosData.loading}
            formTestimonio={testimoniosData.formTestimonio}
            onFormChange={testimoniosData.handleTestimonioChange}
            onFormSubmit={testimoniosData.guardarTestimonio}
            onCancelar={testimoniosData.cancelarEdicion}
            onEditar={testimoniosData.editarTestimonio}
            onEliminar={testimoniosData.eliminarTestimonio}
            formatearFecha={formatearFecha}
          />
        )}

        {activeTab === "novedades" && (
          <NovedadesTab
            novedades={novedadesData.novedades}
            loading={novedadesData.loading}
            formNovedad={novedadesData.formNovedad}
            previewImagen={novedadesData.previewImagen}
            onFormChange={novedadesData.handleNovedadChange}
            onImagenChange={novedadesData.handleImagenChange}
            onFormSubmit={novedadesData.guardarNovedad}
            onCancelar={novedadesData.cancelarEdicion}
            onEditar={novedadesData.editarNovedad}
            onEliminar={novedadesData.eliminarNovedad}
            formatearFecha={formatearFecha}
          />
        )}
      </div>
    </div>
  );
}

export default Admin;
