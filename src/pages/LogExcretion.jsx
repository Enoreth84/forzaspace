import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, LogType } from '../services/db';
import DateTimeSelector from '../components/DateTimeSelector';
import NotesField from '../components/NotesField';

function LogExcretion() {
  const navigate = useNavigate();
  const [type, setType] = useState('pee'); // 'pee' or 'poo'
  const [details, setDetails] = useState({});
  const [photo, setPhoto] = useState(null);

  // New state
  const [timestamp, setTimestamp] = useState(Date.now());
  const [notes, setNotes] = useState('');

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const saveLog = async () => {
    const dateStr = new Date(timestamp).toISOString().split('T')[0];

    const logData = {
      type: type === 'pee' ? LogType.PEE : LogType.POO,
      timestamp: timestamp,
      date: dateStr,
      notes: notes,
      details: {
        ...details,
        photo: photo // Add photo to details
      }
    };

    try {
      await db.logs.add(logData);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Errore nel salvataggio");
    }
  };

  return (
    <div className="page-container">
      <h1>Log Bisogni </h1>

      <div className="card">
        <DateTimeSelector timestamp={timestamp} onChange={setTimestamp} />

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button
            className={`action-button ${type === 'pee' ? '' : 'outline'}`}
            style={{ backgroundColor: type === 'pee' ? 'var(--primary-color)' : '#f0f0f0', color: type === 'pee' ? 'white' : 'black' }}
            onClick={() => { setType('pee'); setDetails({}); }}
          >
            Pipì
          </button>
          <button
            className={`action-button ${type === 'poo' ? '' : 'outline'}`}
            style={{ backgroundColor: type === 'poo' ? 'var(--primary-color)' : '#f0f0f0', color: type === 'poo' ? 'white' : 'black' }}
            onClick={() => { setType('poo'); setDetails({}); }}
          >
            Pupù
          </button>
        </div>

        {type === 'pee' && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem' }}>
            <input
              type="checkbox"
              checked={details.blood || false}
              onChange={e => setDetails({ ...details, blood: e.target.checked })}
              style={{ transform: 'scale(1.3)' }}
            />
            C'è sangue?
          </label>
        )}

        {type === 'poo' && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Consistenza:</label>
            <select
              className="input-field"
              style={{ width: '100%', padding: '0.8rem' }}
              value={details.consistency || 'Normale'}
              onChange={e => setDetails({ ...details, consistency: e.target.value })}
            >
              <option>Normale</option>
              <option>Dura</option>
              <option>Molle</option>
              <option>Liquida</option>
            </select>
          </div>
        )}

        <div style={{ marginBottom: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}> Foto (Opzionale):</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoChange}
            style={{ width: '100%' }}
          />
          {photo && (
            <div style={{ marginTop: '0.5rem' }}>
              <img src={photo} alt="Anteprima" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <button onClick={() => setPhoto(null)} style={{ display: 'block', marginTop: '0.5rem', padding: '0.3rem', background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '4px', color: '#d32f2f' }}>Rimuovi foto</button>
            </div>
          )}
        </div>

        <NotesField value={notes} onChange={setNotes} />

        <button onClick={saveLog} className="action-button" style={{ marginTop: '1rem' }}>Salva</button>
      </div>
    </div>
  );
}

export default LogExcretion;
