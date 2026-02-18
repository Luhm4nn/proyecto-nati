import "./ConsultasTab.css";
import FiltrosConsultas from "./FiltrosConsultas";
import ConsultaCard from "./ConsultaCard";
import Paginacion from "./Paginacion";
import DeleteConfirmationModal from "../../shared/DeleteConfirmationModal";

function ConsultasTab({
  consultas,
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
  deleteModal,
  onCerrarModalEliminar,
  onConfirmarEliminacion,
}) {
  return (
    <div className="tab-content">
      <FiltrosConsultas
        filtro={filtro}
        setFiltro={setFiltro}
        contadores={contadores}
      />

      {loading ? (
        <div className="loading">Cargando consultas...</div>
      ) : consultas.length === 0 ? (
        <div className="empty-state">
          No hay consultas{" "}
          {filtro !== "todas" ? `en estado "${filtro}"` : ""}
        </div>
      ) : (
        <>
          <div className="consultas-grid">
            {consultas.map((con) => (
              <ConsultaCard
                key={con.id}
                consulta={con}
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

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={onCerrarModalEliminar}
        onConfirm={onConfirmarEliminacion}
        title="Eliminar Consulta"
        message="¿Estás seguro de que deseas eliminar esta consulta?"
        itemName={deleteModal.name}
      />
    </div>
  );
}

export default ConsultasTab;

