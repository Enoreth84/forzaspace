import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, LogType } from '../services/db';

const MOODS = [' Felice', ' Arrabbiato', ' Triste', ' Assonnato', ' Pazzo', ' Rintontito'];

function LogMood() {
  const navigate = useNavigate();
  const [mood, setMood] = useState(MOODS[0]);

  const saveLog = async (e) => {
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
      alert("Errore nel salvataggio");
    }
  };

  return (
    <div className="page-container">
      <h1>Come sta il gatto? </h1>
      <form onSubmit={saveLog} className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1rem 0' }}>
          {MOODS.map(m => (
            <button 
              key={m} 
              type="button"
              onClick={() => setMood(m)}
              style={{ 
                padding: '1rem', 
                fontSize: '1.1rem', 
                backgroundColor: mood === m ? 'var(--primary-color)' : '#f8f9fa',
                color: mood === m ? 'white' : '#333',
                border: mood === m ? 'none' : '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
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
