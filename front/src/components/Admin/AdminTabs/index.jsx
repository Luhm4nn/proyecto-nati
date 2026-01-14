import "./AdminTabs.css";

function AdminTabs({ activeTab, setActiveTab }) {
  return (
    <div className="tabs">
      <button
        className={activeTab === "solicitudes" ? "tab-btn active" : "tab-btn"}
        onClick={() => setActiveTab("solicitudes")}
      >
        Solicitudes
      </button>
      <button
        className={activeTab === "testimonios" ? "tab-btn active" : "tab-btn"}
        onClick={() => setActiveTab("testimonios")}
      >
        Testimonios
      </button>
      <button
        className={activeTab === "novedades" ? "tab-btn active" : "tab-btn"}
        onClick={() => setActiveTab("novedades")}
      >
        Novedades
      </button>
      <button
        className={activeTab === "cursos" ? "tab-btn active" : "tab-btn"}
        onClick={() => setActiveTab("cursos")}
      >
        Cursos
      </button>
    </div>
  );
}

export default AdminTabs;
