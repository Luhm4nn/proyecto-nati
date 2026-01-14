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
            {...solicitudesData}
            formatearFecha={formatearFecha}
            getEstadoColor={getEstadoColor}
          />
        )}

        {activeTab === "testimonios" && (
          <TestimoniosTab
            {...testimoniosData}
            formatearFecha={formatearFecha}
          />
        )}

        {activeTab === "novedades" && (
          <NovedadesTab
            {...novedadesData}
            formatearFecha={formatearFecha}
          />
        )}

        {activeTab === "cursos" && (
          <CursosTab
            {...cursosData}
            formatearFecha={formatearFecha}
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
