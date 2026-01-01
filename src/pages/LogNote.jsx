import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, LogType } from '../services/db';
import DateTimeSelector from '../components/DateTimeSelector';
import NotesField from '../components/NotesField';

function LogNote() {
    const navigate = useNavigate();
    const [timestamp, setTimestamp] = useState(Date.now());
    const [note, setNote] = useState('');

    const saveLog = async () => {
        if (!note.trim()) {
            alert("Inserisci una nota.");
            return;
        }

        try {
            const dateObj = new Date(timestamp);
            const dateStr = dateObj.toISOString().split('T')[0];

            await db.logs.add({
                type: LogType.NOTE,
                timestamp: timestamp,
                date: dateStr,
                details: note, // For notes, details IS the note content
                notes: note    // Redundant but consistent with others if we query 'notes' field
            });
            navigate('/');
        } catch (err) {
            console.error(err);
            alert("Errore nel salvataggio");
        }
    };

    return (
        <div className="page-container">
            <h1>Diario / Note </h1>

            <div className="card">
                <DateTimeSelector timestamp={timestamp} onChange={setTimestamp} />

                <NotesField value={note} onChange={setNote} />

                <button
                    onClick={saveLog}
                    className="action-button"
                    style={{ marginTop: '1rem' }}
                >
                    Salva Nota
                </button>
            </div>
        </div>
    );
}

export default LogNote;
