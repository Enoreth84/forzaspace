import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, LogType } from '../services/db';
import DateTimeSelector from '../components/DateTimeSelector';
import NotesField from '../components/NotesField';

const PRESETS = [
  { id: 'wet', name: "Umido", defaultDosage: '85g' },
  { id: 'dry', name: "Secco", defaultDosage: '20g' },
  { id: 'snack', name: "Snack", defaultDosage: '1 pz' }
];

function LogFood() {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => {
    const initial = {};
    PRESETS.forEach(p => {
      initial[p.id] = { selected: false, dosage: p.defaultDosage };
    });
    return initial;
  });

  const [customName, setCustomName] = useState('');
  const [customDosage, setCustomDosage] = useState('');

  // New state
  const [timestamp, setTimestamp] = useState(Date.now());
  const [notes, setNotes] = useState('');

  const toggleItem = (id) => {
    setItems(prev => ({
      ...prev,
      [id]: { ...prev[id], selected: !prev[id].selected }
    }));
  };

  const updateDosage = (id, newDosage) => {
    setItems(prev => ({
      ...prev,
      [id]: { ...prev[id], dosage: newDosage }
    }));
  };

  const saveLog = async () => {
    const selectedFood = [];

    PRESETS.forEach(p => {
      if (items[p.id].selected) {
        selectedFood.push({
          name: p.name,
          quantity: items[p.id].dosage // Using 'quantity' for food to distinguish semantics
        });
      }
    });

    if (customName.trim()) {
      selectedFood.push({
        name: customName,
        quantity: customDosage || 'N/A'
      });
    }

    if (selectedFood.length === 0) {
      alert("Seleziona almeno un cibo o inseriscine uno manuale.");
      return;
    }

    try {
      await db.transaction('rw', db.logs, async () => {
        // Use selected timestamp
        const dateStr = new Date(timestamp).toISOString().split('T')[0];

        for (const food of selectedFood) {
          await db.logs.add({
            type: LogType.FOOD,
            timestamp: timestamp,
            date: dateStr,
            details: food,
            notes: notes
          });
        }
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Errore nel salvataggio");
    }
  };

  return (
    <div className="page-container">
      <h1>Registra Cibo </h1>

      <div className="card">
        <DateTimeSelector timestamp={timestamp} onChange={setTimestamp} />

        <h3>Menu</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {PRESETS.map(p => (
            <div key={p.id} style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '0.5rem',
              border: items[p.id].selected ? '2px solid var(--primary-color)' : '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: items[p.id].selected ? 'rgba(var(--primary-rgb), 0.05)' : 'transparent'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={items[p.id].selected}
                  onChange={() => toggleItem(p.id)}
                  style={{ transform: 'scale(1.2)' }}
                />
                {p.name}
              </label>

              {items[p.id].selected && (
                <div style={{ marginTop: '0.5rem', marginLeft: '1.8rem' }}>
                  <label style={{ fontSize: '0.9rem', color: '#666' }}>Quantità:</label>
                  <input
                    type="text"
                    value={items[p.id].dosage}
                    onChange={(e) => updateDosage(p.id, e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <h3 style={{ marginTop: '1.5rem' }}>Altro / Extra</h3>
        <input
          type="text"
          placeholder="Nome Cibo (es. Pollo)"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="Quantità"
          value={customDosage}
          onChange={(e) => setCustomDosage(e.target.value)}
          style={{ width: '100%' }}
        />

        <div style={{ marginTop: '1.5rem' }}>
          <NotesField value={notes} onChange={setNotes} />
        </div>

        <button
          onClick={saveLog}
          className="action-button"
          style={{ marginTop: '1.5rem' }}
        >
          Salva Cibo
        </button>
      </div>
    </div>
  );
}

export default LogFood;
