import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, LogType } from '../services/db';
import { Scale } from 'lucide-react';

export default function LogWeight() {
    const navigate = useNavigate();
    const [weight, setWeight] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState(new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!weight) return;

        try {
            const logDate = new Date(`${date}T${time}`);

            await db.logs.add({
                type: LogType.WEIGHT,
                timestamp: logDate.getTime(),
                date: date,
                details: {
                    weight: weight
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
                <h1 className="page-title">Peso Corporeo</h1>
            </div>

            <form onSubmit={handleSubmit} className="card">
                <div className="input-group">
                    <label className="input-label">Peso (kg)</label>
                    <div style={{ position: 'relative' }}>
                        <Scale size={18} style={{ position: 'absolute', top: '12px', left: '10px', color: 'var(--color-text-secondary)' }} />
                        <input
                            type="number"
                            step="0.01"
                            className="input-control"
                            style={{ paddingLeft: '36px', fontSize: '1.5rem', fontWeight: 'bold' }}
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>

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
                        <input
                            type="time"
                            className="input-control"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', backgroundColor: 'var(--color-weight)' }}>
                    Salva Peso
                </button>
            </form>
        </div>
    );
}
