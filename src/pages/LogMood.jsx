import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, LogType } from '../services/db';
import { MOODS } from '../services/constants';
import DateTimeSelector from '../components/DateTimeSelector';
import NotesField from '../components/NotesField';

function LogMood() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(MOODS[0]); // Default to first mood logic object

  // New state
  const [timestamp, setTimestamp] = useState(Date.now());
  const [notes, setNotes] = useState('');

  const saveLog = async (e) => {
    e.preventDefault();
    try {
      const dateStr = new Date(timestamp).toISOString().split('T')[0];

      await db.logs.add({
        type: LogType.MOOD,
        timestamp: timestamp,
        date: dateStr,
        details: selectedMood.label, // Save string label for compatibility
        notes: notes
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Errore nel salvataggio");
    }
  };

  return (
    <div className="page-container">
      <h1>Come sta il gatto? </h1>

      <div className="card">
        <DateTimeSelector timestamp={timestamp} onChange={setTimestamp} />

        <form onSubmit={saveLog}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1rem 0' }}>
            {MOODS.map(m => (
              <button
                key={m.label}
                type="button"
                onClick={() => setSelectedMood(m)}
                style={{
                  padding: '1rem',
                  fontSize: '1.1rem',
                  backgroundColor: selectedMood.label === m.label ? m.color : '#f8f9fa',
                  color: selectedMood.label === m.label ? 'white' : '#333',
                  border: selectedMood.label === m.label ? 'none' : '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'transform 0.1s',
                  transform: selectedMood.label === m.label ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          <NotesField value={notes} onChange={setNotes} />

          <button type="submit" className="action-button" style={{ marginTop: '1rem' }}>Salva Umore</button>
        </form>
      </div>
    </div>
  );
}

export default LogMood;
