import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, LogType } from '../services/db';
import DateTimeSelector from '../components/DateTimeSelector';
import NotesField from '../components/NotesField';
import CategoryHistory from '../components/CategoryHistory';

function LogWeight() {
  const navigate = useNavigate();
  const [weight, setWeight] = useState('');

  // New state
  const [timestamp, setTimestamp] = useState(Date.now());
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight) return;

    try {
      const dateStr = new Date(timestamp).toISOString().split('T')[0];

      await db.logs.add({
        type: LogType.WEIGHT,
        timestamp: timestamp,
        date: dateStr,
        details: parseFloat(weight).toFixed(2),
        notes: notes
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
      <div className="card">
        <DateTimeSelector timestamp={timestamp} onChange={setTimestamp} />

        <form onSubmit={handleSubmit}>
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

          <NotesField value={notes} onChange={setNotes} />

          <button type="submit" className="action-button" style={{ marginTop: '1rem' }}>Salva Peso</button>
        </form>
      </div>

      <CategoryHistory type={LogType.WEIGHT} />
    </div>
  );
}

export default LogWeight;
