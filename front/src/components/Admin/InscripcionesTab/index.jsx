import "../SolicitudesTab/SolicitudesTab.css";
import FiltrosInscripciones from "./FiltrosInscripciones";
import InscripcionCard from "./InscripcionCard";
import Paginacion from "../SolicitudesTab/Paginacion";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

function InscripcionesTab({
    inscripciones,
    loading,
    filtro,
    setFiltro,
    contadores,
    paginacion,
    onCambiarEstado,
    onConfirmar,
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
            <FiltrosInscripciones
                filtro={filtro}
                setFiltro={setFiltro}
                contadores={contadores}
            />

            {loading ? (
                <div className="loading">Cargando inscripciones...</div>
            ) : inscripciones.length === 0 ? (
                <div className="empty-state">
                    No hay inscripciones{" "}
                    {filtro !== "todas" ? `en estado "${filtro}"` : ""}
                </div>
            ) : (
                <>
                    <div className="solicitudes-table">
                        {inscripciones.map((ins) => (
                            <InscripcionCard
                                key={ins.id}
                                inscripcion={ins}
                                onCambiarEstado={onCambiarEstado}
                                onConfirmar={onConfirmar}
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
                title="Eliminar Inscripción"
                message="¿Estás seguro de que deseas eliminar esta inscripción?"
                itemName={deleteModal.name}
            />
        </div>
    );
}

export default InscripcionesTab;
