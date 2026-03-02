import { useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import {
  UserIcon,
  EnvelopeIcon,
  ArrowPathIcon,
  PhoneIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  CheckIcon,
} from '../shared/UI/Icons';

function InscripcionForm({
  selectedDictado,
  datosTransferencia,
  onSubmit,
  submitting,
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    emailConfirmacion: '',
    telefono: '',
  });
  const [comprobante, setComprobante] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setComprobante(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, comprobante);
  };

  if (!selectedDictado) return null;

  return (
    <div className="inscripcion-form-section">
      <div className="form-card">
        <h2 className="inscripcion-section-title">Datos Personales</h2>
        <p className="form-instruction">
          Completa tus datos para finalizar la inscripción a la comisión de los{' '}
          <span className="highlight-day">
            {selectedDictado.diasSemana.join(', ')}
          </span>
          .
        </p>

        <div className="condiciones-pago-box">
          <h3>Condiciones de pago</h3>
          <div className="condiciones-pago-content">
            <p>
              Los pagos se realizan del <strong>1 al 10</strong> de cada mes.
            </p>
            <p>
              Pasado ese plazo, se aplicará un recargo por mora del{' '}
              <strong>10%</strong> sobre el valor de la cuota.
            </p>
            <p className="aranceles-nota">
              Los aranceles están sujetos a actualización y/o modificación
              trimestral, conforme a la dinámica económica vigente.
            </p>
          </div>
        </div>

        {datosTransferencia && datosTransferencia.length > 0 && (
          <div className="datos-pago-box">
            <h3>Información de Pago</h3>
            <p>
              Realiza la transferencia a la cuenta que corresponda según tu
              moneda y adjunta el comprobante debajo:
            </p>

            {/* Nacional */}
            {(() => {
              const nacional =
                datosTransferencia.find((d) => d.tipo === 'nacional') ||
                datosTransferencia.find((d) => d.id === 1);
              return nacional && nacional.nombreCuenta ? (
                <div
                  className="datos-pago-grid"
                  style={{ marginBottom: '1.5rem' }}
                >
                  <div
                    className="dato-pago-item"
                    style={{ gridColumn: '1 / -1' }}
                  >
                    <span
                      className="dato-label"
                      style={{
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <ReactCountryFlag
                        countryCode="AR"
                        svg
                        style={{ width: '1.4em', height: '1.4em' }}
                      />{' '}
                      Transferencia Nacional (ARS)
                    </span>
                  </div>
                  <div className="dato-pago-item">
                    <span className="dato-label">Titular:</span>
                    <span className="dato-value">{nacional.nombreCuenta}</span>
                  </div>
                  <div className="dato-pago-item">
                    <span className="dato-label">Alias:</span>
                    <span className="dato-value">{nacional.alias}</span>
                  </div>
                  <div className="dato-pago-item">
                    <span className="dato-label">CVU/CBU:</span>
                    <span className="dato-value">{nacional.cvu}</span>
                  </div>
                </div>
              ) : null;
            })()}

            {/* Internacional */}
            {(() => {
              const internacional =
                datosTransferencia.find((d) => d.tipo === 'internacional') ||
                datosTransferencia.find((d) => d.id === 2);
              return internacional && internacional.nombreCuenta ? (
                <div className="datos-pago-grid">
                  <div
                    className="dato-pago-item"
                    style={{ gridColumn: '1 / -1' }}
                  >
                    <span
                      className="dato-label"
                      style={{
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <ReactCountryFlag
                        countryCode="EU"
                        svg
                        style={{ width: '1.4em', height: '1.4em' }}
                      />
                      <ReactCountryFlag
                        countryCode="ES"
                        svg
                        style={{ width: '1.4em', height: '1.4em' }}
                      />
                      <ReactCountryFlag
                        countryCode="DE"
                        svg
                        style={{ width: '1.4em', height: '1.4em' }}
                      />
                      Transferencia Internacional (EUR)
                    </span>
                  </div>
                  <div className="dato-pago-item">
                    <span className="dato-label">Titular:</span>
                    <span className="dato-value">
                      {internacional.nombreCuenta}
                    </span>
                  </div>
                  <div className="dato-pago-item">
                    <span className="dato-label">SWIFT / BIC:</span>
                    <span className="dato-value">{internacional.alias}</span>
                  </div>
                  <div className="dato-pago-item">
                    <span className="dato-label">IBAN:</span>
                    <span className="dato-value">{internacional.cvu}</span>
                  </div>
                </div>
              ) : null;
            })()}

            {/* Dólares */}
            {(() => {
              const dolares =
                datosTransferencia.find((d) => d.tipo === 'dolares') ||
                datosTransferencia.find((d) => d.id === 3);
              return dolares && dolares.nombreCuenta ? (
                <div className="datos-pago-grid" style={{ marginTop: '1.5rem' }}>
                  <div
                    className="dato-pago-item"
                    style={{ gridColumn: '1 / -1' }}
                  >
                    <span
                      className="dato-label"
                      style={{
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <ReactCountryFlag
                        countryCode="US"
                        svg
                        style={{ width: '1.4em', height: '1.4em' }}
                      />{' '}
                      Transferencia en Dólares (USD)
                    </span>
                  </div>
                  <div className="dato-pago-item">
                    <span className="dato-label">Titular:</span>
                    <span className="dato-value">{dolares.nombreCuenta}</span>
                  </div>
                  <div className="dato-pago-item">
                    <span className="dato-label">Info Adicional:</span>
                    <span className="dato-value">{dolares.alias}</span>
                  </div>
                  <div className="dato-pago-item">
                    <span className="dato-label">Cuenta/ACH/IBAN:</span>
                    <span className="dato-value">{dolares.cvu}</span>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}

        <form className="inscripcion-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre">
                <span className="label-icon">
                  <UserIcon />
                </span>{' '}
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                placeholder="Tu nombre"
              />
            </div>
            <div className="form-group">
              <label htmlFor="apellido">
                <span className="label-icon">
                  <UserIcon />
                </span>{' '}
                Apellido
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                required
                placeholder="Tu apellido"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">
                <span className="label-icon">
                  <EnvelopeIcon />
                </span>{' '}
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="tu@email.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="emailConfirmacion">
                <span className="label-icon">
                  <ArrowPathIcon />
                </span>{' '}
                Confirmar Email
              </label>
              <input
                type="email"
                id="emailConfirmacion"
                name="emailConfirmacion"
                value={formData.emailConfirmacion}
                onChange={handleInputChange}
                required
                placeholder="Repite tu email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefono">
                <span className="label-icon">
                  <PhoneIcon />
                </span>{' '}
                Teléfono (WhatsApp)
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="+54 9 11 ..."
              />
            </div>
            <div className="form-group file-group">
              <label htmlFor="comprobante">
                <span className="label-icon">
                  <DocumentTextIcon />
                </span>{' '}
                Comprobante de Pago
              </label>
              <div
                className={`file-upload-box ${comprobante ? 'has-file' : ''}`}
              >
                <input
                  type="file"
                  id="comprobante"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  required
                />
                <div className="file-upload-content">
                  <span className="upload-icon">
                    {comprobante ? (
                      <CheckIcon className="w-6 h-6" />
                    ) : (
                      <ArrowUpTrayIcon className="w-6 h-6" />
                    )}
                  </span>
                  <div className="upload-text">
                    <span className="primary-text">
                      {comprobante ? comprobante.name : 'Elegir archivo'}
                    </span>
                    <span className="secondary-text">
                      PDF o Imagen (Máx. 5MB)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit-inscripcion"
              disabled={submitting}
            >
              {submitting ? (
                <span className="btn-content">
                  <span className="btn-spinner"></span> Enviando...
                </span>
              ) : (
                'Finalizar Inscripción'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InscripcionForm;
