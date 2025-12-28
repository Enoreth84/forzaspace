import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, LogType } from '../services/db';
import { Smile, Frown, Zap, Moon } from 'lucide-react';

const MOOD_OPTIONS = [
    { id: 'mogio', label: 'Mogio', icon: <Frown size={16} /> },
    { id: 'attivo', label: 'Attivo', icon: <Zap size={16} /> },
    { id: 'vivace', label: 'Vivace', icon: <Smile size={16} /> },
    { id: 'solitario', label: 'Solitario', icon: <Moon size={16} /> },
    { id: 'compagnone', label: 'Compagnone', icon: <Smile size={16} /> },
    { id: 'appetente', label: 'Ha mangiato', icon: <Smile size={16} /> },
    { id: 'inappetente', label: 'Inappetente', icon: <Frown size={16} /> },
];

export default function LogMood() {
    const navigate = useNavigate();
    const [selectedMoods, setSelectedMoods] = useState([]);
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState(new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }));

    const toggleMood = (id) => {
        if (selectedMoods.includes(id)) {
            setSelectedMoods(selectedMoods.filter(m => m !== id));
        } else {
            setSelectedMoods([...selectedMoods, id]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedMoods.length === 0 && !note) {
            alert("Seleziona almeno un umore o scrivi una nota.");
            return;
        }

        try {
            const logDate = new Date(`${date}T${time}`);

            await db.logs.add({
                type: LogType.MOOD,
                timestamp: logDate.getTime(),
                date: date,
                details: {
                    moods: selectedMoods,
                    note: note
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
                <h1 className="page-title">Come sta oggi?</h1>
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
                        <input
                            type="time"
                            className="input-control"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
                    {MOOD_OPTIONS.map(mood => (
                        <button
                            key={mood.id}
                            type="button"
                            className={`btn ${selectedMoods.includes(mood.id) ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
                            onClick={() => toggleMood(mood.id)}
                        >
                            {mood.icon}
                            {mood.label}
                        </button>
                    ))}
                </div>

                <div className="input-group">
                    <label className="input-label">Note extra</label>
                    <textarea
                        className="input-control"
                        rows="3"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Dettagli aggiuntivi..."
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', backgroundColor: 'var(--color-mood)' }}>
                    Salva Umore
                </button>
            </form>
        </div>
    );
}
