import "./TestimoniosTab.css";
import TestimonioForm from "./TestimonioForm";
import TestimonioCard from "./TestimonioCard";

function TestimoniosTab({
  testimonios,
  loading,
  formTestimonio,
  onFormChange,
  onFormSubmit,
  onCancelar,
  onEditar,
  onEliminar,
  formatearFecha,
}) {
  return (
    <div className="tab-content">
      <TestimonioForm
        formTestimonio={formTestimonio}
        onChange={onFormChange}
        onSubmit={onFormSubmit}
        onCancelar={onCancelar}
      />

      {loading ? (
        <div className="loading">Cargando testimonios...</div>
      ) : testimonios.length === 0 ? (
        <div className="empty-state">No hay testimonios creados</div>
      ) : (
        <div className="content-list">
          <h2>Testimonios Existentes</h2>
          {testimonios.map((test) => (
            <TestimonioCard
              key={test.id}
              testimonio={test}
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

export default TestimoniosTab;
