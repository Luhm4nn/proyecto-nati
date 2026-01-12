import "./SolicitudesTab.css";
import FiltrosSolicitudes from "./FiltrosSolicitudes";
import SolicitudCard from "./SolicitudCard";
import Paginacion from "./Paginacion";

function SolicitudesTab({
  solicitudes,
  loading,
  filtro,
  setFiltro,
  contadores,
  paginacion,
  onCambiarEstado,
  onEliminar,
  onCambiarPagina,
  formatearFecha,
  getEstadoColor,
}) {
  return (
    <div className="tab-content">
      <FiltrosSolicitudes
        filtro={filtro}
        setFiltro={setFiltro}
        contadores={contadores}
      />

      {loading ? (
        <div className="loading">Cargando solicitudes...</div>
      ) : solicitudes.length === 0 ? (
        <div className="empty-state">
          No hay solicitudes{" "}
          {filtro !== "todas" ? `en estado "${filtro}"` : ""}
        </div>
      ) : (
        <>
          <div className="solicitudes-table">
            {solicitudes.map((sol) => (
              <SolicitudCard
                key={sol.id}
                solicitud={sol}
                onCambiarEstado={onCambiarEstado}
                onEliminar={onEliminar}
                formatearFecha={formatearFecha}
                getEstadoColor={getEstadoColor}
              />
            ))}
          </div>

          <Paginacion
            paginacion={paginacion}
            onCambiarPagina={onCambiarPagina}
          />
        </>
      )}
    </div>
  );
}

export default SolicitudesTab;
