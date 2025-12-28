import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, LogType } from '../services/db';

function LogWeight() {
  const navigate = useNavigate();
  const [weight, setWeight] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight) return;
    
    try {
      await db.logs.add({
        type: LogType.WEIGHT,
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0],
        details: parseFloat(weight).toFixed(2)
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Errore nel salvataggio');
    }
  };

  return (
    <div className="page-container">
      <h1>Peso </h1>
      <form onSubmit={handleSubmit} className="card">
        <label>Peso in Kg:</label>
        <input
          type="number"
          step="0.01"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="input-field"
          style={{ width: '100%', padding: '0.8rem', margin: '1rem 0', fontSize: '1.2rem' }}
          placeholder="es. 4.5"
          required
        />
        <button type="submit" className="action-button">Salva Peso</button>
      </form>
    </div>
  );
}

export default LogWeight;
