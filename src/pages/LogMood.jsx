import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, LogType } from '../services/db';

const MOODS = [' Felice', ' Arrabbiato', ' Triste', ' Assonnato', ' Pazzo'];

function LogMood() {
  const navigate = useNavigate();
  const [mood, setMood] = useState(MOODS[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await db.logs.add({
        type: LogType.MOOD,
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0],
        details: mood
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Errore nel salvataggio');
    }
  };

  return (
    <div className="page-container">
      <h1>Umore </h1>
      <form onSubmit={handleSubmit} className="card">
        <label>Come sta il gatto?</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', margin: '1rem 0' }}>
          {MOODS.map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMood(m)}
              className={mood === m ? 'action-button' : 'card'}
              style={{ border: mood === m ? 'none' : '1px solid #ddd', padding: '1rem' }}
            >
              {m}
            </button>
          ))}
        </div>
        <button type="submit" className="action-button">Salva Umore</button>
      </form>
    </div>
  );
}

export default LogMood;
