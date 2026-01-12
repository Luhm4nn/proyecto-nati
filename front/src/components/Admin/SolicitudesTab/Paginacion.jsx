function Paginacion({ paginacion, onCambiarPagina }) {
  if (paginacion.totalPages <= 1) return null;

  return (
    <div className="paginacion">
      <button
        className="paginacion-btn"
        onClick={() => onCambiarPagina(paginacion.page - 1)}
        disabled={paginacion.page === 1}
      >
        Anterior
      </button>
      <span className="paginacion-info">
        Página {paginacion.page} de {paginacion.totalPages}
      </span>
      <button
        className="paginacion-btn"
        onClick={() => onCambiarPagina(paginacion.page + 1)}
        disabled={paginacion.page === paginacion.totalPages}
      >
        Siguiente
      </button>
    </div>
  );
}

export default Paginacion;
