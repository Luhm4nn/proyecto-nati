import CursoForm from "./CursoForm";
import CursoCard from "./CursoCard";
import DictadoModal from "./DictadoModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import "./CursosTab.css";

function CursosTab({
  cursos,
  loading,
  formCurso,
  onCursoChange,
  onItemChange,
  onAgregarItem,
  onEliminarItem,
  onCursoSubmit,
  onCancelar,
  onEditar,
  onEliminar,
  showDictadoModal,
  cursoSeleccionado,
  formDictado,
  onDictadoChange,
  onToggleDia,
  onAbrirModalDictado,
  onCerrarModalDictado,
  onDictadoSubmit,
  onEliminarDictado,
  formatearFecha,
  deleteModal,
  onCerrarModalEliminar,
  onConfirmarEliminacion,
}) {
  const getDeleteMessage = () => {
    if (deleteModal.type === "curso") {
      return "¿Estás seguro de que deseas eliminar este curso? Se eliminarán también todos sus dictados asociados.";
    }
    return "¿Estás seguro de que deseas eliminar este dictado?";
  };

  return (
    <div className="tab-content">
      <CursoForm
        formCurso={formCurso}
        onChange={onCursoChange}
        onItemChange={onItemChange}
        onAgregarItem={onAgregarItem}
        onEliminarItem={onEliminarItem}
        onSubmit={onCursoSubmit}
        onCancelar={onCancelar}
      />

      {loading ? (
        <div className="loading">Cargando cursos...</div>
      ) : cursos.length === 0 ? (
        <div className="empty-state">No hay cursos creados</div>
      ) : (
        <div className="content-list">
          <h2>Cursos Existentes</h2>
          {cursos.map((curso) => (
            <CursoCard
              key={curso.id}
              curso={curso}
              onEditar={onEditar}
              onEliminar={onEliminar}
              onAgregarDictado={onAbrirModalDictado}
              onEditarDictado={onAbrirModalDictado}
              onEliminarDictado={onEliminarDictado}
              formatearFecha={formatearFecha}
            />
          ))}
        </div>
      )}

      <DictadoModal
        show={showDictadoModal}
        curso={cursoSeleccionado}
        formDictado={formDictado}
        onChange={onDictadoChange}
        onToggleDia={onToggleDia}
        onSubmit={onDictadoSubmit}
        onClose={onCerrarModalDictado}
        onEliminarDictado={onEliminarDictado}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={onCerrarModalEliminar}
        onConfirm={onConfirmarEliminacion}
        title={deleteModal.type === "curso" ? "Eliminar Curso" : "Eliminar Dictado"}
        message={getDeleteMessage()}
        itemName={deleteModal.name}
      />
    </div>
  );
}

export default CursosTab;
