import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionTimeout } from "../../hooks/useSessionTimeout";
import AdminHeader from "./AdminHeader";
import AdminTabs from "./AdminTabs";
import SolicitudesTab from "./SolicitudesTab";
import TestimoniosTab from "./TestimoniosTab";
import NovedadesTab from "./NovedadesTab";
import CursosTab from "./CursosTab";
import { useSolicitudes } from "./hooks/useSolicitudes";
import { useTestimonios } from "./hooks/useTestimonios";
import { useNovedades } from "./hooks/useNovedades";
import { useCursos } from "./hooks/useCursos";
import { formatearFecha, getEstadoColor } from "./utils/helpers";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();
  useSessionTimeout();
  const [activeTab, setActiveTab] = useState("solicitudes");
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const solicitudesData = useSolicitudes();
  const testimoniosData = useTestimonios();
  const novedadesData = useNovedades();
  const cursosData = useCursos();

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
    setShowLogoutModal(false);
  };

  return (
    <div className="admin">
      <div className="admin-container">
        <AdminHeader user={user} onLogout={() => setShowLogoutModal(true)} />

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
            onEliminar={solicitudesData.abrirModalEliminar}
            onCambiarPagina={solicitudesData.cargarSolicitudes}
            formatearFecha={formatearFecha}
            getEstadoColor={getEstadoColor}
            deleteModal={solicitudesData.deleteModal}
            onCerrarModalEliminar={solicitudesData.cerrarModalEliminar}
            onConfirmarEliminacion={solicitudesData.confirmarEliminacion}
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
            onEliminar={testimoniosData.abrirModalEliminar}
            formatearFecha={formatearFecha}
            deleteModal={testimoniosData.deleteModal}
            onCerrarModalEliminar={testimoniosData.cerrarModalEliminar}
            onConfirmarEliminacion={testimoniosData.confirmarEliminacion}
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
            onEliminar={novedadesData.abrirModalEliminar}
            formatearFecha={formatearFecha}
            deleteModal={novedadesData.deleteModal}
            onCerrarModalEliminar={novedadesData.cerrarModalEliminar}
            onConfirmarEliminacion={novedadesData.confirmarEliminacion}
          />
        )}

        {activeTab === "cursos" && (
          <CursosTab
            cursos={cursosData.cursos}
            loading={cursosData.loading}
            formCurso={cursosData.formCurso}
            onCursoChange={cursosData.handleCursoChange}
            onItemChange={cursosData.handleItemChange}
            onAgregarItem={cursosData.agregarItem}
            onEliminarItem={cursosData.eliminarItem}
            onCursoSubmit={cursosData.guardarCurso}
            onCancelar={cursosData.cancelarEdicion}
            onEditar={cursosData.editarCurso}
            onEliminar={cursosData.abrirModalEliminarCurso}
            showDictadoModal={cursosData.showDictadoModal}
            cursoSeleccionado={cursosData.cursoSeleccionado}
            formDictado={cursosData.formDictado}
            onDictadoChange={cursosData.handleDictadoChange}
            onToggleDia={cursosData.toggleDiaSemana}
            onAbrirModalDictado={cursosData.abrirModalDictado}
            onCerrarModalDictado={cursosData.cerrarModalDictado}
            onDictadoSubmit={cursosData.guardarDictado}
            onEliminarDictado={cursosData.abrirModalEliminarDictado}
            formatearFecha={formatearFecha}
            deleteModal={cursosData.deleteModal}
            onCerrarModalEliminar={cursosData.cerrarModalEliminar}
            onConfirmarEliminacion={cursosData.confirmarEliminacion}
          />
        )}



        <LogoutConfirmationModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      </div>
    </div>
  );
}

export default Admin;
