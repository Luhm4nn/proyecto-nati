import "./NovedadesTab.css";
import NovedadForm from "./NovedadForm";
import NovedadCard from "./NovedadCard";

function NovedadesTab({
  novedades,
  loading,
  formNovedad,
  previewImagen,
  onFormChange,
  onImagenChange,
  onFormSubmit,
  onCancelar,
  onEditar,
  onEliminar,
  formatearFecha,
}) {
  return (
    <div className="tab-content">
      <NovedadForm
        formNovedad={formNovedad}
        previewImagen={previewImagen}
        onChange={onFormChange}
        onImagenChange={onImagenChange}
        onSubmit={onFormSubmit}
        onCancelar={onCancelar}
      />

      {loading ? (
        <div className="loading">Cargando novedades...</div>
      ) : novedades.length === 0 ? (
        <div className="empty-state">No hay novedades creadas</div>
      ) : (
        <div className="content-list">
          <h2>Novedades Existentes</h2>
          {novedades.map((novedad) => (
            <NovedadCard
              key={novedad.id}
              novedad={novedad}
              onEditar={onEditar}
              onEliminar={onEliminar}
              formatearFecha={formatearFecha}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default NovedadesTab;
