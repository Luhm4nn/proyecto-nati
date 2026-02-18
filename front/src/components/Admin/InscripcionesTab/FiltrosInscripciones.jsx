function FiltrosInscripciones({ filtro, setFiltro, contadores }) {
    const filtros = [
        { id: "todas", label: "Todas", count: contadores.todas || 0 },
        { id: "pendiente", label: "Pendientes", count: contadores.pendiente || 0 },
        { id: "confirmada", label: "Confirmadas", count: contadores.confirmada || 0 },
    ];

    return (
        <div className="filtros">
            {filtros.map((f) => (
                <button
                    key={f.id}
                    className={`filtro-btn ${filtro === f.id ? "active" : ""}`}
                    onClick={() => setFiltro(f.id)}
                >
                    {f.label} ({f.count})
                </button>
            ))}
        </div>
    );
}

export default FiltrosInscripciones;
