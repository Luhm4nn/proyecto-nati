import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import './TransferenciaTab.css';

function TransferenciaTab({
    datosNacional,
    datosInternacional,
    datosDolares,
    loading,
    onChangeNacional,
    onChangeInternacional,
    onChangeDolares,
    onSubmit
}) {
    if (loading) {
        return <div className="tab-content loading">Cargando datos...</div>;
    }

    return (
        <div className="tab-content">
            {/* Nacional */}
            <div className="form-card">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ReactCountryFlag countryCode="AR" svg style={{ width: '1.4em', height: '1.4em' }} /> Transferencia Nacional (ARS)
                </h2>
                <p className="form-instruction">
                    Datos para alumnos que pagan en pesos argentinos.
                </p>

                <form onSubmit={(e) => onSubmit(e, 'nacional')} className="admin-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="nombreCuentaNac">Nombre de la Cuenta</label>
                            <input
                                type="text"
                                id="nombreCuentaNac"
                                name="nombreCuenta"
                                value={datosNacional.nombreCuenta}
                                onChange={onChangeNacional}
                                placeholder="Ej: Natalia Luhmann"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="aliasNac">Alias</label>
                            <input
                                type="text"
                                id="aliasNac"
                                name="alias"
                                value={datosNacional.alias}
                                onChange={onChangeNacional}
                                placeholder="Ej: aleman.para.vos"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cvuNac">CVU / CBU</label>
                            <input
                                type="text"
                                id="cvuNac"
                                name="cvu"
                                value={datosNacional.cvu}
                                onChange={onChangeNacional}
                                placeholder="00000031000XXXXXXXXX"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary">
                            Guardar Nacional
                        </button>
                    </div>
                </form>
            </div>

            {/* Internacional */}
            <div className="form-card" style={{ marginTop: '2rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ReactCountryFlag countryCode="EU" svg style={{ width: '1.4em', height: '1.4em' }} />
                    <ReactCountryFlag countryCode="ES" svg style={{ width: '1.4em', height: '1.4em' }} />
                    <ReactCountryFlag countryCode="DE" svg style={{ width: '1.4em', height: '1.4em' }} />
                    Transferencia Internacional (EUR)
                </h2>
                <p className="form-instruction">
                    Datos para alumnos que pagan desde el exterior en euros.
                </p>

                <form onSubmit={(e) => onSubmit(e, 'internacional')} className="admin-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="nombreCuentaInt">Nombre del Titular</label>
                            <input
                                type="text"
                                id="nombreCuentaInt"
                                name="nombreCuenta"
                                value={datosInternacional.nombreCuenta}
                                onChange={onChangeInternacional}
                                placeholder="Ej: Natalia Luhmann"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="aliasInt">SWIFT / BIC</label>
                            <input
                                type="text"
                                id="aliasInt"
                                name="alias"
                                value={datosInternacional.alias}
                                onChange={onChangeInternacional}
                                placeholder="Ej: DEUTDEFF"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cvuInt">IBAN</label>
                            <input
                                type="text"
                                id="cvuInt"
                                name="cvu"
                                value={datosInternacional.cvu}
                                onChange={onChangeInternacional}
                                placeholder="Ej: DE89370400440532013000"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary">
                            Guardar Internacional
                        </button>
                    </div>
                </form>
            </div>

            {/* Dólares */}
            <div className="form-card" style={{ marginTop: '2rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ReactCountryFlag countryCode="US" svg style={{ width: '1.4em', height: '1.4em' }} /> Transferencia en Dólares (USD)
                </h2>
                <p className="form-instruction">
                    Datos para alumnos que pagan en dólares estadounidenses (Ej: Wise, Revolut, etc).
                </p>

                <form onSubmit={(e) => onSubmit(e, 'dolares')} className="admin-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="nombreCuentaDol">Nombre del Titular</label>
                            <input
                                type="text"
                                id="nombreCuentaDol"
                                name="nombreCuenta"
                                value={datosDolares.nombreCuenta}
                                onChange={onChangeDolares}
                                placeholder="Ej: Natalia Luhmann"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="aliasDol">Info Adicional (Swift/Email/etc)</label>
                            <input
                                type="text"
                                id="aliasDol"
                                name="alias"
                                value={datosDolares.alias}
                                onChange={onChangeDolares}
                                placeholder="Ej: natalialuhmann@email.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cvuDol">Número de Cuenta / IBAN / ACH</label>
                            <input
                                type="text"
                                id="cvuDol"
                                name="cvu"
                                value={datosDolares.cvu}
                                onChange={onChangeDolares}
                                placeholder="Ej: 123456789"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary">
                            Guardar Dólares
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TransferenciaTab;
