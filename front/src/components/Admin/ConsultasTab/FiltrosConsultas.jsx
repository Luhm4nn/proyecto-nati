function FiltrosConsultas({ filtro, setFiltro, contadores }) {
  return (
    <div className="filtros">
      <button
        className={filtro === "todas" ? "filtro-btn active" : "filtro-btn"}
        onClick={() => setFiltro("todas")}
      >
        Todas ({contadores.todas || 0})
      </button>
      <button
        className={filtro === "pendiente" ? "filtro-btn active" : "filtro-btn"}
        onClick={() => setFiltro("pendiente")}
      >
        Pendientes ({contadores.pendiente || 0})
      </button>
      <button
        className={filtro === "revisada" ? "filtro-btn active" : "filtro-btn"}
        onClick={() => setFiltro("revisada")}
      >
        Revisadas ({contadores.revisada || 0})
      </button>
      <button
        className={filtro === "contactada" ? "filtro-btn active" : "filtro-btn"}
        onClick={() => setFiltro("contactada")}
      >
        Contactadas ({contadores.contactada || 0})
      </button>
    </div>
  );
}

export default FiltrosConsultas;
