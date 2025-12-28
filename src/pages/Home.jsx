import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, LogType } from '../services/db';
import { Pill, Droplets, Smile, Scale, AlertTriangle, Clock, Trash2 } from 'lucide-react';

export default function Home() {
    const logs = useLiveQuery(() => db.logs.orderBy('timestamp').reverse().limit(20).toArray());

    const deleteLog = (id) => {
        if (confirm('Eliminare questo evento?')) {
            db.logs.delete(id);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case LogType.MEDICINE: return <Pill size={20} color="var(--color-medicine)" />;
            case LogType.PEE: return <Droplets size={20} color="var(--color-pee)" />;
            case LogType.POO: return <div style={{ fontSize: '20px' }}>💩</div>;
            case LogType.MOOD: return <Smile size={20} color="var(--color-mood)" />;
            case LogType.WEIGHT: return <Scale size={20} color="var(--color-weight)" />;
            default: return <Clock size={20} />;
        }
    };

    const renderDetails = (log) => {
        switch (log.type) {
            case LogType.MEDICINE:
                return <span><b>{log.details.name}</b> {log.details.dosage && `(${log.details.dosage})`}</span>;
            case LogType.PEE:
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>Pipì</span>
                        {log.details.hasBlood && (
                            <span style={{ color: 'var(--color-error)', display: 'flex', alignItems: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                <AlertTriangle size={14} /> Sangue
                            </span>
                        )}
                        {log.photo && <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>📷 Foto</span>}
                    </div>
                );
            case LogType.POO:
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>Cacca</span>
                        {log.details.consistency && <span style={{ color: 'var(--color-text-secondary)' }}>- {log.details.consistency}</span>}
                        {log.photo && <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>📷 Foto</span>}
                    </div>
                );
            case LogType.MOOD:
                return (
                    <div>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {log.details.moods?.map(m => (
                                <span key={m} style={{ background: 'var(--color-bg-secondary)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>
                                    {m}
                                </span>
                            ))}
                        </div>
                        {log.details.note && <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>"{log.details.note}"</div>}
                    </div>
                );
            case LogType.WEIGHT:
                return <span><b>{log.details.weight}</b> kg</span>;
            default:
                return null;
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
    }

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Panoramica</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>Ecco come sta il tuo gatto oggi</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Attività Recenti</h2>

                {!logs || logs.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '2rem' }}>
                        <p>Nessuna attività registrata ancora.</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Usa il menu in basso per iniziare.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {logs.map(log => (
                            <div key={log.id} className="card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: 0 }}>
                                <div style={{ flexShrink: 0, marginTop: '2px' }}>
                                    {getIcon(log.type)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                            {formatDate(log.timestamp)} • {formatTime(log.timestamp)}
                                        </span>
                                        <button onClick={() => deleteLog(log.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div>
                                        {renderDetails(log)}
                                    </div>
                                    {log.photo && (
                                        <div style={{ marginTop: '8px', borderRadius: '8px', overflow: 'hidden', maxHeight: '150px' }}>
                                            <img
                                                src={URL.createObjectURL(log.photo)}
                                                alt="Log"
                                                style={{ width: '100%', objectFit: 'cover' }}
                                                onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
