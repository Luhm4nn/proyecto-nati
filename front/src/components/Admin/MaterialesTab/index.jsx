import './MaterialesTab.css';
import MaterialForm from './MaterialForm';
import MaterialCard from './MaterialCard';
import DeleteConfirmationModal from '../../shared/DeleteConfirmationModal';
import FilePreviewModal from '../../shared/FilePreviewModal';

function MaterialesTab({
  materiales,
  loading,
  formMaterial,
  onFormChange,
  onArchivoChange,
  onFormSubmit,
  onCancelar,
  onEditar,
  onEliminar,
  onVer,
  formatearFecha,
  deleteModal,
  onCerrarModalEliminar,
  onConfirmarEliminacion,
  previewModal,
  onCerrarPreview,
}) {
  return (
    <div className="tab-content">
      <MaterialForm
        formMaterial={formMaterial}
        onChange={onFormChange}
        onArchivoChange={onArchivoChange}
        onSubmit={onFormSubmit}
        onCancelar={onCancelar}
      />

      {loading ? (
        <div className="loading">Cargando materiales...</div>
      ) : materiales.length === 0 ? (
        <div className="empty-state">No hay materiales cargados</div>
      ) : (
        <div className="content-list">
          <h2>Materiales Existentes</h2>
          <div className="materiales-grid">
            {materiales.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                onEditar={onEditar}
                onEliminar={onEliminar}
                onVer={onVer}
                formatearFecha={formatearFecha}
              />
            ))}
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={onCerrarModalEliminar}
        onConfirm={onConfirmarEliminacion}
        title="Eliminar Material"
        message="¿Estás seguro de que deseas eliminar este material? Esta acción no se puede deshacer."
        itemName={deleteModal.name}
      />
      <FilePreviewModal
        isOpen={previewModal.isOpen}
        onClose={onCerrarPreview}
        fileUrl={previewModal.url}
        fileName={previewModal.name}
      />
    </div>
  );
}

export default MaterialesTab;
