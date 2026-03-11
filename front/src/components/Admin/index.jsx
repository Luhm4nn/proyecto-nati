import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionTimeout } from '../../hooks/useSessionTimeout';
import AdminHeader from './AdminHeader';
import AdminTabs from './AdminTabs';
import ConsultasTab from './ConsultasTab';
import TestimoniosTab from './TestimoniosTab';
import NovedadesTab from './NovedadesTab';
import MaterialesTab from './MaterialesTab';
import CursosTab from './CursosTab';
import TransferenciaTab from './TransferenciaTab';
import { useConsultas } from './hooks/useConsultas';
import { useInscripciones } from './hooks/useInscripciones';
import { useDatosTransferencia } from './hooks/useDatosTransferencia';
import { useTestimonios } from './hooks/useTestimonios';
import { useNovedades } from './hooks/useNovedades';
import { useMateriales } from './hooks/useMateriales';
import { useCursos } from './hooks/useCursos';
import { useCorreosMasivos } from './hooks/useCorreosMasivos';
import InscripcionesTab from './InscripcionesTab';
import CorreosTab from './CorreosTab';
import { formatearFecha, getEstadoColor } from './utils/helpers';
import LogoutConfirmationModal from './LogoutConfirmationModal';
import './Admin.css';

function Admin() {
  const navigate = useNavigate();
  useSessionTimeout();
  const [activeTab, setActiveTab] = useState('inscripciones');
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const consultasData = useConsultas();
  const cursosData = useCursos();
  const inscripcionesData = useInscripciones({
    onDataChange: cursosData.cargarCursos,
  });
  const testimoniosData = useTestimonios();
  const novedadesData = useNovedades();
  const materialesData = useMateriales();
  const transferenciaData = useDatosTransferencia();
  const correosData = useCorreosMasivos();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
    setShowLogoutModal(false);
  };

  return (
    <div className="admin">
      <div className="admin-container">
        <AdminHeader user={user} onLogout={() => setShowLogoutModal(true)} />

        <AdminTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasPendingInscripciones={inscripcionesData.contadores?.pendiente > 0}
          hasPendingConsultas={consultasData.contadores?.pendiente > 0}
        />

        {activeTab === 'consultas' && (
          <ConsultasTab
            consultas={consultasData.consultas}
            loading={consultasData.loading}
            filtro={consultasData.filtro}
            setFiltro={consultasData.setFiltro}
            contadores={consultasData.contadores}
            paginacion={consultasData.paginacion}
            onCambiarEstado={consultasData.cambiarEstado}
            onEliminar={consultasData.abrirModalEliminar}
            onCambiarPagina={consultasData.cargarConsultas}
            formatearFecha={formatearFecha}
            getEstadoColor={getEstadoColor}
            deleteModal={consultasData.deleteModal}
            onCerrarModalEliminar={consultasData.cerrarModalEliminar}
            onConfirmarEliminacion={consultasData.confirmarEliminacion}
          />
        )}

        {activeTab === 'inscripciones' && (
          <InscripcionesTab
            inscripciones={inscripcionesData.inscripciones}
            loading={inscripcionesData.loading}
            filtro={inscripcionesData.filtro}
            setFiltro={inscripcionesData.setFiltro}
            contadores={inscripcionesData.contadores}
            paginacion={inscripcionesData.paginacion}
            onCambiarEstado={inscripcionesData.cambiarEstado}
            onConfirmar={inscripcionesData.abrirModalConfirmar}
            onEliminar={inscripcionesData.abrirModalEliminar}
            onVer={inscripcionesData.abrirPreview}
            onCambiarPagina={inscripcionesData.cargarInscripciones}
            formatearFecha={formatearFecha}
            getEstadoColor={getEstadoColor}
            deleteModal={inscripcionesData.deleteModal}
            onCerrarModalEliminar={inscripcionesData.cerrarModalEliminar}
            onConfirmarEliminacion={inscripcionesData.confirmarEliminacion}
            confirmModal={inscripcionesData.confirmModal}
            onCerrarModalConfirmar={inscripcionesData.cerrarModalConfirmar}
            onConfirmarAceptacion={inscripcionesData.confirmarAceptacion}
            previewModal={inscripcionesData.previewModal}
            onCerrarPreview={inscripcionesData.cerrarPreview}
            showModalInscripcion={inscripcionesData.showModalInscripcion}
            onAbrirModalInscripcion={inscripcionesData.abrirModalInscripcion}
            onCerrarModalInscripcion={inscripcionesData.cerrarModalInscripcion}
            formInscripcion={inscripcionesData.formInscripcion}
            onInscripcionChange={inscripcionesData.handleInscripcionChange}
            onInscripcionSubmit={inscripcionesData.guardarInscripcionAdmin}
            cursosDropdown={inscripcionesData.cursosDropdown}
          />
        )}

        {activeTab === 'testimonios' && (
          <TestimoniosTab
            testimonios={testimoniosData.testimonios}
            loading={testimoniosData.loading}
            formTestimonio={testimoniosData.formTestimonio}
            onFormChange={testimoniosData.handleTestimonioChange}
            onFormSubmit={testimoniosData.guardarTestimonio}
            onCancelar={testimoniosData.cancelarEdicion}
            onEditar={testimoniosData.editarTestimonio}
            onEliminar={testimoniosData.abrirModalEliminar}
            formatearFecha={formatearFecha}
            deleteModal={testimoniosData.deleteModal}
            onCerrarModalEliminar={testimoniosData.cerrarModalEliminar}
            onConfirmarEliminacion={testimoniosData.confirmarEliminacion}
          />
        )}

        {activeTab === 'novedades' && (
          <NovedadesTab
            novedades={novedadesData.novedades}
            loading={novedadesData.loading}
            formNovedad={novedadesData.formNovedad}
            previewImagen={novedadesData.previewImagen}
            onFormChange={novedadesData.handleNovedadChange}
            onImagenChange={novedadesData.handleImagenChange}
            onFormSubmit={novedadesData.guardarNovedad}
            onCancelar={novedadesData.cancelarEdicion}
            onEditar={novedadesData.editarNovedad}
            onEliminar={novedadesData.abrirModalEliminar}
            formatearFecha={formatearFecha}
            deleteModal={novedadesData.deleteModal}
            onCerrarModalEliminar={novedadesData.cerrarModalEliminar}
            onConfirmarEliminacion={novedadesData.confirmarEliminacion}
          />
        )}

        {activeTab === 'materiales' && (
          <MaterialesTab
            materiales={materialesData.materiales}
            loading={materialesData.loading}
            formMaterial={materialesData.formMaterial}
            onFormChange={materialesData.handleMaterialChange}
            onArchivoChange={materialesData.handleArchivoChange}
            onFormSubmit={materialesData.guardarMaterial}
            onCancelar={materialesData.cancelarEdicion}
            onEditar={materialesData.editarMaterial}
            onEliminar={materialesData.abrirModalEliminar}
            onVer={materialesData.abrirPreview}
            formatearFecha={formatearFecha}
            deleteModal={materialesData.deleteModal}
            onCerrarModalEliminar={materialesData.cerrarModalEliminar}
            onConfirmarEliminacion={materialesData.confirmarEliminacion}
            previewModal={materialesData.previewModal}
            onCerrarPreview={materialesData.cerrarPreview}
          />
        )}

        {activeTab === 'cursos' && (
          <CursosTab
            cursos={cursosData.cursos}
            loading={cursosData.loading}
            formCurso={cursosData.formCurso}
            onCursoChange={cursosData.handleCursoChange}
            onItemChange={cursosData.handleItemChange}
            onAgregarItem={cursosData.agregarItem}
            onEliminarItem={cursosData.eliminarItem}
            onCursoSubmit={cursosData.guardarCurso}
            onCancelar={cursosData.cancelarEdicion}
            onEditar={cursosData.editarCurso}
            onEliminar={cursosData.abrirModalEliminarCurso}
            showDictadoModal={cursosData.showDictadoModal}
            cursoSeleccionado={cursosData.cursoSeleccionado}
            formDictado={cursosData.formDictado}
            onDictadoChange={cursosData.handleDictadoChange}
            onToggleDia={cursosData.toggleDiaSemana}
            onAbrirModalDictado={cursosData.abrirModalDictado}
            onCerrarModalDictado={cursosData.cerrarModalDictado}
            onDictadoSubmit={cursosData.guardarDictado}
            onEliminarDictado={cursosData.abrirModalEliminarDictado}
            formatearFecha={formatearFecha}
            deleteModal={cursosData.deleteModal}
            onCerrarModalEliminar={cursosData.cerrarModalEliminar}
            onConfirmarEliminacion={cursosData.confirmarEliminacion}
          />
        )}

        {activeTab === 'transferencia' && (
          <TransferenciaTab
            datosNacional={transferenciaData.datosNacional}
            datosInternacional={transferenciaData.datosInternacional}
            datosDolares={transferenciaData.datosDolares}
            loading={transferenciaData.loading}
            onChangeNacional={transferenciaData.handleChangeNacional}
            onChangeInternacional={transferenciaData.handleChangeInternacional}
            onChangeDolares={transferenciaData.handleChangeDolares}
            onSubmit={transferenciaData.guardarDatos}
          />
        )}

        {activeTab === 'correos' && (
          <CorreosTab
            emails={correosData.emails}
            form={correosData.form}
            loading={correosData.loading}
            handleFormChange={correosData.handleFormChange}
            toggleEmail={correosData.toggleEmail}
            addEmail={correosData.addEmail}
            removeEmail={correosData.removeEmail}
            enviarCorreos={correosData.enviarCorreos}
            copiarPrompt={correosData.copiarPrompt}
          />
        )}

        <LogoutConfirmationModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      </div>
    </div>
  );
}

export default Admin;
