import './AdminTabs.css';

function AdminTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'inscripciones', label: 'Inscripciones' },
    { id: 'cursos', label: 'Cursos' },
    { id: 'novedades', label: 'Novedades' },
    { id: 'consultas', label: 'Consultas' },
    { id: 'testimonios', label: 'Testimonios' },
    { id: 'transferencia', label: 'Transferencia' },
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
            {tab.label}
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
          </button>
        ))}
      </div>
    </>
  );
}

export default AdminTabs;
