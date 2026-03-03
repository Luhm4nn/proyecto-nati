import { useState } from 'react';
import { PlusIcon, EnvelopeIcon } from '../../shared/UI/Icons';
import '../ConsultasTab/ConsultasTab.css';
import FiltrosInscripciones from './FiltrosInscripciones';
import InscripcionCard from './InscripcionCard';
import InscripcionModal from './InscripcionModal';
import Paginacion from '../ConsultasTab/Paginacion';
import DeleteConfirmationModal from '../../shared/DeleteConfirmationModal';

import FilePreviewModal from '../../shared/FilePreviewModal';

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
  onVer,
  onCambiarPagina,
  formatearFecha,
  getEstadoColor,
  deleteModal,
  onCerrarModalEliminar,
  onConfirmarEliminacion,
  confirmModal,
  onCerrarModalConfirmar,
  onConfirmarAceptacion,
  previewModal,
  onCerrarPreview,
  showModalInscripcion,
  onAbrirModalInscripcion,
  onCerrarModalInscripcion,
  formInscripcion,
  onInscripcionChange,
  onInscripcionSubmit,
  cursosDropdown,
}) {
  // Estado para controlar qué dictados están expandidos
  const [dictadosExpandidos, setDictadosExpandidos] = useState({});

  const toggleDictado = (dictadoId) => {
    setDictadosExpandidos((prev) => ({
      ...prev,
      [dictadoId]: !prev[dictadoId],
    }));
  };

  return (
    <div className="tab-content">
      <FiltrosInscripciones
        filtro={filtro}
        setFiltro={setFiltro}
        contadores={contadores}
      />

      <div
        style={{
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <button
          onClick={onAbrirModalInscripcion}
          className="btn-guardar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
          }}
        >
          <PlusIcon className="w-5 h-5" /> Nueva Inscripción
        </button>
      </div>

      {loading ? (
        <div className="loading">Cargando inscripciones...</div>
      ) : inscripciones.length === 0 ? (
        <div className="empty-state">
          No hay inscripciones{' '}
          {filtro !== 'todas' ? `en estado "${filtro}"` : ''}
        </div>
      ) : (
        <>
          <div className="consultas-grid">
            {(() => {
              const gruposAgrupados = (() => {
                const grupos = {};

                inscripciones.forEach((inscripcion) => {
                  const dictado = inscripcion.dictadoCurso;
                  const curso = dictado?.curso;

                  if (!dictado || !curso) return;

                  const cursoKey = curso.id;
                  const dictadoKey = dictado.id;

                  if (!grupos[cursoKey]) {
                    grupos[cursoKey] = {
                      curso,
                      dictados: {},
                    };
                  }

                  if (!grupos[cursoKey].dictados[dictadoKey]) {
                    grupos[cursoKey].dictados[dictadoKey] = {
                      dictado,
                      inscripciones: [],
                    };
                  }

                  grupos[cursoKey].dictados[dictadoKey].inscripciones.push(
                    inscripcion
                  );
                });

                return Object.values(grupos)
                  .sort((a, b) => a.curso.titulo.localeCompare(b.curso.titulo))
                  .map((grupo) => ({
                    curso: grupo.curso,
                    dictados: Object.values(grupo.dictados).sort((a, b) => {
                      return (
                        new Date(a.dictado.fechaInicio) -
                        new Date(b.dictado.fechaInicio)
                      );
                    }),
                  }));
              })();

              return gruposAgrupados.map((grupoCurso) => (
                <div key={grupoCurso.curso.id} style={{ marginBottom: '2rem' }}>
                  <div
                    style={{
                      background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '1rem 1.5rem',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                    }}
                  >
                    {grupoCurso.curso.titulo}
                  </div>

                  {grupoCurso.dictados.map((grupoDictado) => {
                    const isExpanded =
                      dictadosExpandidos[grupoDictado.dictado.id] ?? true;

                    return (
                      <div
                        key={grupoDictado.dictado.id}
                        style={{ marginBottom: '1.5rem' }}
                      >
                        <div
                          onClick={() => toggleDictado(grupoDictado.dictado.id)}
                          style={{
                            background: '#f8f9fa',
                            padding: '0.75rem 1.5rem',
                            borderLeft: '4px solid #667eea',
                            marginBottom: isExpanded ? '0.75rem' : '0',
                            borderRadius: '4px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            userSelect: 'none',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = '#e9ecef')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = '#f8f9fa')
                          }
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '1.2rem',
                                transition: 'transform 0.2s ease',
                                transform: isExpanded
                                  ? 'rotate(90deg)'
                                  : 'rotate(0deg)',
                                display: 'inline-block',
                              }}
                            >
                              ▶
                            </span>
                            <div>
                              <strong>
                                {grupoDictado.dictado.diasSemana.join(', ')}
                              </strong>
                              {' • '}
                              {grupoDictado.dictado.horarioInicio} -{' '}
                              {grupoDictado.dictado.horarioFin}
                            </div>
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#666' }}>
                            {grupoDictado.inscripciones.length}{' '}
                            {grupoDictado.inscripciones.length === 1
                              ? 'inscripción'
                              : 'inscripciones'}
                          </div>
                        </div>

                        {isExpanded &&
                          grupoDictado.inscripciones.map((ins) => (
                            <InscripcionCard
                              key={ins.id}
                              inscripcion={ins}
                              onCambiarEstado={onCambiarEstado}
                              onConfirmar={onConfirmar}
                              onEliminar={onEliminar}
                              onVer={onVer}
                              formatearFecha={formatearFecha}
                              getEstadoColor={getEstadoColor}
                            />
                          ))}
                      </div>
                    );
                  })}
                </div>
              ));
            })()}
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

      <DeleteConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={onCerrarModalConfirmar}
        onConfirm={onConfirmarAceptacion}
        title="Confirmar Inscripción"
        message="¿Estás seguro de que deseas confirmar esta inscripción? Se enviará un correo electrónico al alumno notificándole que fue aceptada su inscripción."
        itemName={confirmModal.name}
        confirmText="Confirmar"
        confirmClass="btn-guardar"
        icon={<EnvelopeIcon className="w-12 h-12 text-primary" />}
      />

      <InscripcionModal
        show={showModalInscripcion}
        onClose={onCerrarModalInscripcion}
        form={formInscripcion}
        onChange={onInscripcionChange}
        onSubmit={onInscripcionSubmit}
        cursos={cursosDropdown}
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

export default InscripcionesTab;
