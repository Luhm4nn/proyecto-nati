import './AdminTabs.css';

function AdminTabs({ activeTab, setActiveTab, hasPendingInscripciones, hasPendingConsultas }) {
  const tabs = [
    { id: 'inscripciones', label: 'Inscripciones', hasBadge: hasPendingInscripciones },
    { id: 'cursos', label: 'Cursos' },
    { id: 'novedades', label: 'Novedades' },
    { id: 'materiales', label: 'Materiales' },
    { id: 'consultas', label: 'Consultas', hasBadge: hasPendingConsultas },
    { id: 'testimonios', label: 'Testimonios' },
    { id: 'transferencia', label: 'Transferencia' },
    { id: 'correos', label: 'Correos' },
  ];

  return (
    <>
      <select
        className="admin-dropdown"
        value={activeTab}
        onChange={(e) => setActiveTab(e.target.value)}
      >
        {tabs.map((tab) => (
          <option key={tab.id} value={tab.id}>
            {tab.label} {tab.hasBadge ? '●' : ''}
          </option>
        ))}
      </select>

      <div className="tabs tabs-buttons">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.hasBadge && <span className="pending-badge" />}
          </button>
        ))}
      </div>
    </>
  );
}

export default AdminTabs;
