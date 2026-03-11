import React, { useState } from 'react';

function CorreosTab({
    emails,
    form,
    loading,
    handleFormChange,
    toggleEmail,
    addEmail,
    removeEmail,
    enviarCorreos,
    copiarPrompt
}) {
    const [newEmail, setNewEmail] = useState('');

    const handleAddEmail = (e) => {
        e.preventDefault();
        if (newEmail.trim()) {
            addEmail(newEmail.trim());
            setNewEmail('');
        }
    };

    return (
        <div className="tab-content">
            <div className="tab-header">
                <h2>Enviar Correo Masivo</h2>
                <p className="tab-description">
                    Envía un correo a los alumnos inscriptos en cursos activos. Puedes agregar o quitar alumnos de la lista.
                </p>
            </div>

            <div className="correos-container" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div className="correos-form" style={{ flex: '1 1 50%', minWidth: '300px' }}>
                    <form className="admin-form" onSubmit={enviarCorreos}>
                        <div className="form-group">
                            <label>Asunto</label>
                            <input
                                type="text"
                                name="asunto"
                                value={form.asunto}
                                onChange={handleFormChange}
                                placeholder="Ej: Material de estudio módulo 1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ margin: 0 }}>Cuerpo del Correo (HTML soportado)</label>
                                <button
                                    type="button"
                                    onClick={copiarPrompt}
                                    className="btn-editar"
                                    style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '20px' }}
                                    title="Copia un prompt para generar el texto con ChatGPT u otra IA"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                                    </svg>
                                    Copiar prompt sugerido
                                </button>
                            </div>
                            <textarea
                                name="cuerpo"
                                value={form.cuerpo}
                                onChange={handleFormChange}
                                placeholder="<p>Hola a todos,</p><p>Adjunto material...</p>"
                                rows="10"
                                required
                            ></textarea>
                        </div>

                        {form.cuerpo && (
                            <div className="form-group">
                                <label>Vista Previa del Mensaje:</label>
                                <div
                                    style={{
                                        border: '1px solid #ddd',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        backgroundColor: '#fff',
                                        marginTop: '0.5rem',
                                        minHeight: '100px',
                                        maxHeight: '300px',
                                        overflowY: 'auto'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: form.cuerpo }}
                                />
                            </div>
                        )}

                        <button type="submit" className="submit-btn" disabled={loading}>
                            Enviar a {emails.filter(e => e.selected).length} destinatario(s)
                        </button>
                    </form>
                </div>

                <div className="correos-lista" style={{ flex: '1 1 30%', minWidth: '300px', backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
                    <h3>Destinatarios</h3>

                    <form onSubmit={handleAddEmail} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="Agregar otro email..."
                            style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', borderRadius: '6px' }}>
                            Agregar
                        </button>
                    </form>

                    {loading ? (
                        <p>Cargando destinatarios sugeridos...</p>
                    ) : emails.length === 0 ? (
                        <p className="no-data">No hay destinatarios en la lista</p>
                    ) : (
                        <div className="emails-list" style={{ maxHeight: '600px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {emails.map((item, index) => (
                                <div
                                    key={index}
                                    className="email-item"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.5rem',
                                        backgroundColor: 'white',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        opacity: item.selected ? 1 : 0.6
                                    }}
                                >
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0, width: '100%' }}>
                                        <input
                                            type="checkbox"
                                            checked={item.selected}
                                            onChange={() => toggleEmail(item.email)}
                                        />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            {item.nombre && <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#333' }}>{item.nombre}</span>}
                                            <span style={{ fontSize: '0.85rem', color: '#666' }}>{item.email}</span>
                                        </div>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => removeEmail(item.email)}
                                        style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '1.2rem', padding: '0 0.5rem' }}
                                        title="Eliminar de la lista"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CorreosTab;
