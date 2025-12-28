import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, LogType } from '../services/db';
import { Droplets, Clock, AlertTriangle, FileText } from 'lucide-react'; // Removing Poo icon import if not available, using AlertTriangle as placeholder or text. actually Droplet is fine.
import PhotoUpload from '../components/PhotoUpload';

export default function LogExcretion() {
    const navigate = useNavigate();
    const [type, setType] = useState('pee'); // 'pee' or 'poo'
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState(new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }));
    const [hasBlood, setHasBlood] = useState(false);
    const [consistency, setConsistency] = useState('');
    const [photo, setPhoto] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const logDate = new Date(`${date}T${time}`);

            const details = type === 'pee'
                ? { hasBlood }
                : { consistency };

            await db.logs.add({
                type: type === 'pee' ? LogType.PEE : LogType.POO,
                timestamp: logDate.getTime(),
                date: date,
                details: details,
                photo: photo // Dexie can store Blobs directly
            });

            navigate('/');
        } catch (error) {
            console.error("Failed to save log:", error);
            alert("Errore nel salvataggio");
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Registra Bisogni</h1>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                    type="button"
                    className={`btn ${type === 'pee' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, backgroundColor: type === 'pee' ? 'var(--color-pee)' : undefined, color: type === 'pee' ? '#333' : undefined }}
                    onClick={() => setType('pee')}
                >
                    <Droplets size={20} /> Pipì
                </button>
                <button
                    type="button"
                    className={`btn ${type === 'poo' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, backgroundColor: type === 'poo' ? 'var(--color-poo)' : undefined }}
                    onClick={() => setType('poo')}
                >
                    💩 Cacca
                </button>
            </div>

            <form onSubmit={handleSubmit} className="card">

                <div className="input-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label className="input-label">Data</label>
                        <input
                            type="date"
                            className="input-control"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="input-label">Ora</label>
                        <div style={{ position: 'relative' }}>
                            <Clock size={16} style={{ position: 'absolute', top: '12px', left: '10px', color: 'var(--color-text-secondary)' }} />
                            <input
                                type="time"
                                className="input-control"
                                style={{ paddingLeft: '32px' }}
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                {type === 'pee' && (
                    <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                        <AlertTriangle size={24} color={hasBlood ? 'var(--color-error)' : 'var(--color-text-secondary)'} />
                        <div style={{ flex: 1 }}>
                            <label className="input-label" style={{ marginBottom: 0, cursor: 'pointer' }} htmlFor="blood-check">
                                C'era sangue?
                            </label>
                        </div>
                        <input
                            id="blood-check"
                            type="checkbox"
                            checked={hasBlood}
                            onChange={(e) => setHasBlood(e.target.checked)}
                            style={{ width: '20px', height: '20px' }}
                        />
                    </div>
                )}

                {type === 'poo' && (
                    <div className="input-group">
                        <label className="input-label">Consistenza / Note</label>
                        <div style={{ position: 'relative' }}>
                            <FileText size={18} style={{ position: 'absolute', top: '12px', left: '10px', color: 'var(--color-text-secondary)' }} />
                            <input
                                type="text"
                                className="input-control"
                                style={{ paddingLeft: '36px' }}
                                value={consistency}
                                onChange={(e) => setConsistency(e.target.value)}
                                placeholder="Es. Dura, Molle, Normale..."
                            />
                        </div>
                    </div>
                )}

                <PhotoUpload onPhotoSelect={setPhoto} />

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                        width: '100%',
                        marginTop: '1rem',
                        backgroundColor: type === 'pee' ? 'var(--color-pee)' : 'var(--color-poo)',
                        color: type === 'pee' ? '#333' : 'white'
                    }}
                >
                    Salva {type === 'pee' ? 'Pipì' : 'Cacca'}
                </button>
            </form>
        </div>
    );
}
