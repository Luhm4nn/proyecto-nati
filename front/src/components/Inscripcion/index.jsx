import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { useLoading } from '../../contexts/LoadingContext';
import { CheckIcon, LightBulbIcon, ArrowLeftIcon } from '../shared/UI/Icons';
import Footer from '../Footer';
import InscripcionForm from './InscripcionForm';
import './Inscripcion.css';
import ReactCountryFlag from 'react-country-flag';
import {
  calculateMonthDuration,
  formatearRangoHorario,
  formatearFechaSinHora,
} from '../../utils/dateUtils';

function Inscripcion() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useToast();
  const { startLoading, stopLoading } = useLoading();
  const formRef = useRef(null);

  // Estados para la inscripción
  const [selectedDictado, setSelectedDictado] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [datosTransferencia, setDatosTransferencia] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCurso = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/cursos/${id}`);

        if (!response.ok) {
          throw new Error('No se pudo cargar la información del curso');
        }

        const data = await response.json();
        setCurso(data);
      } catch (err) {
        console.error('Error fetching curso:', err);
        setError('No se pudo cargar la información del curso.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCurso();
    }

    const fetchDatosTransferencia = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/datos-transferencia`);
        if (response.ok) {
          const data = await response.json();
          setDatosTransferencia(data);
        }
      } catch (err) {
        console.error('Error fetching datos transferencia:', err);
      }
    };

    fetchDatosTransferencia();
  }, [id]);

  const formatearFecha = (fechaString) => {
    if (!fechaString) return '';
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  const handleSelectDictado = (dictado) => {
    setSelectedDictado(dictado);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmitInscripcion = async (formData, comprobanteFile) => {
    if (formData.email !== formData.emailConfirmacion) {
      showError('Los correos electrónicos no coinciden');
      return;
    }

    if (!comprobanteFile) {
      showError('Por favor adjunta el comprobante de pago');
      return;
    }

    setSubmitting(true);
    startLoading('Procesando tu inscripción...');
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const data = new FormData();

      // Campos del DTO
      data.append('nombre', formData.nombre);
      data.append('apellido', formData.apellido);
      data.append('email', formData.email);
      data.append('emailConfirmacion', formData.emailConfirmacion);
      data.append('telefono', formData.telefono);
      data.append('dictadoCursoId', selectedDictado.id);

      // Archivo
      data.append('comprobante', comprobanteFile);

      const response = await fetch(`${apiUrl}/inscripciones`, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Error al procesar la inscripción'
        );
      }

      showSuccess('¡Inscripción enviada con éxito!');
      setUserEmail(formData.email);
      setEnviado(true);
    } catch (err) {
      console.error('Error submitting inscripcion:', err);
      showError(err.message || 'Hubo un error al enviar tu inscripción.');
    } finally {
      setSubmitting(false);
      stopLoading();
    }
  };

  if (loading)
    return (
      <>
        <div className="loading-spinner-container">
          <div className="spinner"></div>
        </div>
        <Footer />
      </>
    );

  if (enviado) {
    return (
      <>
        <div className="inscripcion-page">
          <div className="inscripcion-container">
            <div className="form-card success-container">
              <div className="success-icon">
                <div className="success-icon-inner">
                  <CheckIcon className="w-10 h-10" />
                </div>
              </div>
              <h2>¡Inscripción Exitosa!</h2>
              <div className="success-details">
                <p>
                  Muchas gracias por inscribirte en el curso{' '}
                  <strong>{curso.titulo}</strong>.
                </p>
                <p>
                  Valor del curso:{' '}
                  <strong>
                    AR$ {curso.valor?.toLocaleString('es-AR')} | €{' '}
                    {curso.valorInternacional?.toLocaleString('es-ES')}
                  </strong>
                </p>
                <p>
                  Tu inscripción ha sido recibida correctamente. Próximamente
                  recibirás un correo en <strong>{userEmail}</strong> una vez
                  que nuestros administrativos confirmen tu inscripción y el
                  comprobante adjunto.
                </p>
              </div>
              <div className="success-notice">
                <span className="notice-icon">
                  <LightBulbIcon className="w-6 h-6" />
                </span>
                <p>
                  Por favor, mantente atento a tu bandeja de entrada y revisa
                  también la carpeta de <strong>spam</strong>.
                </p>
              </div>
              <Link to="/#cursos" className="btn-back-home">
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !curso)
    return (
      <>
        <div className="inscripcion-page">
          <div className="inscripcion-container text-center">
            <h2 className="text-2xl mb-4">Error</h2>
            <p className="mb-4">{error || 'Curso no encontrado'}</p>
            <Link to="/#cursos" className="btn-primary">
              Volver a Cursos
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <div className="inscripcion-page">
        <div className="inscripcion-container">
          <Link to="/#cursos" className="inscripcion-back">
            <ArrowLeftIcon className="w-4 h-4" /> Volver a Cursos
          </Link>

          <div className="inscripcion-header">
            <h1 className="inscripcion-title">{curso.titulo}</h1>
          </div>

          <div className="inscripcion-content">
            <div className="inscripcion-feature-card">
              <div className="feature-card-left">
                <h2 className="inscripcion-section-title">¿Qué aprenderás?</h2>
                <p className="inscripcion-description-text">
                  {curso.descripcion}
                </p>
                <div className="inscripcion-price-tag">
                  <span className="price-label">Valor del curso:</span>
                  <span className="price-amount">
                    AR$ {curso.valor?.toLocaleString('es-AR')} | €{' '}
                    {curso.valorInternacional?.toLocaleString('es-ES')}
                    {curso.valorDolares > 0 && (
                      <> | US$ {curso.valorDolares?.toLocaleString('en-US')}</>
                    )}
                  </span>
                </div>
              </div>

              <div className="feature-card-right">
                {curso.items && curso.items.length > 0 ? (
                  <div className="inscripcion-points">
                    {curso.items.map((item, index) => (
                      <div key={index} className="point-item">
                        <span className="point-icon">
                          <CheckIcon className="w-4 h-4" />
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary italic">
                    No hay detalles específicos disponibles.
                  </p>
                )}
              </div>
            </div>

            <div className="inscripcion-dictados-section">
              <h2 className="inscripcion-section-title">Horarios de Cursado</h2>

              <div className="dictados-grid">
                {curso.dictadosCurso &&
                curso.dictadosCurso.filter((d) => d.activo).length > 0 ? (
                  curso.dictadosCurso
                    .filter((d) => d.activo)
                    .map((dictado) => {
                      const sinCupos =
                        dictado.cupos > 0 && dictado.cuposDisponibles <= 0;
                      return (
                        <div
                          key={dictado.id}
                          className={`dictado-card-full ${sinCupos ? 'sin-cupos' : ''}`}
                        >
                          <div className="dictado-header-full">
                            <div className="dictado-days-full">
                              {dictado.diasSemana.join(', ')}
                            </div>
                            <span className="dictado-duration-badge">
                              {calculateMonthDuration(
                                dictado.fechaInicio,
                                dictado.fechaFin
                              )}{' '}
                              {calculateMonthDuration(
                                dictado.fechaInicio,
                                dictado.fechaFin
                              ) === 1
                                ? 'mes'
                                : 'meses'}
                            </span>
                          </div>

                          <div className="dictado-body-full">
                            <div className="dictado-info-item">
                              <span className="info-label">Horario:</span>
                              <span
                                className="info-value"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                {formatearRangoHorario(
                                  dictado.horarioInicio,
                                  dictado.horarioFin
                                ) && (
                                  <>
                                    {
                                      formatearRangoHorario(
                                        dictado.horarioInicio,
                                        dictado.horarioFin
                                      ).horarioArg
                                    }
                                    <ReactCountryFlag
                                      countryCode="AR"
                                      svg
                                      style={{
                                        width: '1.2em',
                                        height: '1.2em',
                                      }}
                                    />{' '}
                                    \
                                    {
                                      formatearRangoHorario(
                                        dictado.horarioInicio,
                                        dictado.horarioFin
                                      ).horarioEur
                                    }
                                    <ReactCountryFlag
                                      countryCode="ES"
                                      svg
                                      style={{
                                        width: '1.2em',
                                        height: '1.2em',
                                      }}
                                    />
                                    <ReactCountryFlag
                                      countryCode="DE"
                                      svg
                                      style={{
                                        width: '1.2em',
                                        height: '1.2em',
                                      }}
                                    />
                                  </>
                                )}
                              </span>
                            </div>
                            <div className="dictado-info-item">
                              <span className="info-label">Fechas:</span>
                              <span className="info-value">
                                {formatearFechaSinHora(dictado.fechaInicio)} al{' '}
                                {formatearFechaSinHora(dictado.fechaFin)}
                              </span>
                            </div>
                            {dictado.cupos > 0 && (
                              <div className="dictado-info-item cupos-info">
                                <span className="info-label">Cupos:</span>
                                <span
                                  className={`info-value ${sinCupos ? 'text-error' : ''}`}
                                >
                                  {sinCupos
                                    ? '¡Completo!'
                                    : `${dictado.cuposDisponibles ?? 0} disponibles de ${dictado.cupos}`}
                                </span>
                              </div>
                            )}
                          </div>

                          <button
                            className={`btn-select-dictado-full ${selectedDictado?.id === dictado.id ? 'selected' : ''}`}
                            onClick={() =>
                              !sinCupos && handleSelectDictado(dictado)
                            }
                            disabled={sinCupos}
                          >
                            {sinCupos
                              ? 'Sin cupos'
                              : selectedDictado?.id === dictado.id
                                ? 'Seleccionado'
                                : 'Seleccionar este horario'}
                          </button>
                        </div>
                      );
                    })
                ) : (
                  <div className="no-dictados">
                    <p>No hay horarios disponibles por el momento.</p>
                    <Link
                      to="/#preguntas"
                      className="text-primary hover:underline text-sm mt-2 block"
                    >
                      Consultar por nuevas fechas
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {selectedDictado && (
              <div ref={formRef}>
                <InscripcionForm
                  selectedDictado={selectedDictado}
                  datosTransferencia={datosTransferencia}
                  onSubmit={handleSubmitInscripcion}
                  submitting={submitting}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Inscripcion;
