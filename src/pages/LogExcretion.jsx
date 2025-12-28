import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, LogType } from '../services/db';

function LogExcretion() {
  const navigate = useNavigate();
  const [type, setType] = useState(LogType.PEE);
  const [hasBlood, setHasBlood] = useState(false);
  const [consistency, setConsistency] = useState('Normale');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const details = type === LogType.PEE 
        ? { blood: hasBlood }
        : { consistency };

      await db.logs.add({
        type,
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0],
        details
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Errore nel salvataggio');
    }
  };

  return (
    <div className="page-container">
      <h1>Bisogni </h1>
      
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            type="button" 
            onClick={() => setType(LogType.PEE)}
            className={type === LogType.PEE ? 'action-button' : 'card'}
            style={{ flex: 1, border: type === LogType.PEE ? 'none' : '1px solid #ddd' }}
          >
             Pipì
          </button>
          <button 
            type="button" 
            onClick={() => setType(LogType.POO)}
            className={type === LogType.POO ? 'action-button' : 'card'}
            style={{ flex: 1, border: type === LogType.POO ? 'none' : '1px solid #ddd', backgroundColor: type === LogType.POO ? 'var(--color-poo)' : '' }}
          >
             Pupù
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card">
        {type === LogType.PEE ? (
          <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', fontSize: '1.2rem' }}>
            <input 
              type="checkbox" 
              checked={hasBlood} 
              onChange={(e) => setHasBlood(e.target.checked)}
              style={{ transform: 'scale(1.5)' }}
            />
            C'è sangue? 
          </label>
        ) : (
          <div>
             <label>Consistenza:</label>
             <select 
               value={consistency} 
               onChange={(e) => setConsistency(e.target.value)}
               style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
             >
               <option>Normale</option>
               <option>Dura</option>
               <option>Molle</option>
               <option>Liquida</option>
             </select>
          </div>
        )}
        
        <button type="submit" className="action-button" style={{ marginTop: '1.5rem' }}>
          Salva {type === LogType.PEE ? 'Pipì' : 'Pupù'}
        </button>
      </form>
    </div>
  );
}

export default LogExcretion;
