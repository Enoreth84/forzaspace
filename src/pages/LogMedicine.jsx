import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, LogType } from '../services/db';
import { Pill, Clock, Syringe } from 'lucide-react';

export default function LogMedicine() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        dosage: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.name) return;

            const logDate = new Date(`${formData.date}T${formData.time}`);

            await db.logs.add({
                type: LogType.MEDICINE,
                timestamp: logDate.getTime(),
                date: formData.date,
                details: {
                    name: formData.name,
                    dosage: formData.dosage
                }
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
                <h1 className="page-title">Registra Medicina</h1>
            </div>

            <form onSubmit={handleSubmit} className="card">
                <div className="input-group">
                    <label className="input-label">Nome Medicina</label>
                    <div style={{ position: 'relative' }}>
                        <Pill size={18} style={{ position: 'absolute', top: '12px', left: '10px', color: 'var(--color-text-secondary)' }} />
                        <input
                            type="text"
                            className="input-control"
                            style={{ paddingLeft: '36px' }}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Es. Antibiotico"
                            required
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label">Dosaggio (Opzionale)</label>
                    <div style={{ position: 'relative' }}>
                        <Syringe size={18} style={{ position: 'absolute', top: '12px', left: '10px', color: 'var(--color-text-secondary)' }} />
                        <input
                            type="text"
                            className="input-control"
                            style={{ paddingLeft: '36px' }}
                            value={formData.dosage}
                            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                            placeholder="Es. 1 pillola / 5ml"
                        />
                    </div>
                </div>

                <div className="input-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label className="input-label">Data</label>
                        <input
                            type="date"
                            className="input-control"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    Salva Medicina
                </button>
            </form>
        </div>
    );
}
