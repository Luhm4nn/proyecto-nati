function FiltrosInscripciones({ filtro, setFiltro, contadores }) {
    const filtros = [
        { id: "todas", label: "Todas", count: contadores.todas },
        { id: "pendiente", label: "Pendientes", count: contadores.pendiente },
        { id: "confirmada", label: "Confirmadas", count: contadores.confirmada },
    ];

    return (
        <div className="filtros-container">
            <div className="filtros-buttons">
                {filtros.map((f) => (
                    <button
                        key={f.id}
                        className={`filtro-btn ${filtro === f.id ? "active" : ""}`}
                        onClick={() => setFiltro(f.id)}
                    >
                        {f.label}
                        <span className="filtro-count">{f.count}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default FiltrosInscripciones;
