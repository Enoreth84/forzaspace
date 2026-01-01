import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, LogType } from '../services/db';
import DateTimeSelector from '../components/DateTimeSelector';
import NotesField from '../components/NotesField';
import CategoryHistory from '../components/CategoryHistory';

const PRESETS = [
  { id: 'evexia', name: "EVEXIA FAST (ANTIDOLORIFICO)", defaultDosage: '0.25 ML' },
  { id: 'semintra', name: "SEMINTRA (INSUFF. RENALE)", defaultDosage: '0.75 ML' },
  { id: 'deflacam', name: "DEFLACAM (ANTINFIAMM.)", defaultDosage: 'DOSE 1.5KG' },
  { id: 'gastrovom', name: "GASTROVOM (GASTROPROTE.)", defaultDosage: '1 ML' },
  { id: 'urys', name: "URYS (INTEGRITA' MUCOSA)", defaultDosage: '0.5 ML', options: ['0.5 ML', '1 ML'] },
  { id: 'dolorina', name: "DOLORINA", defaultDosage: '2 ML' },
  { id: 'cerenia', name: "CERENIA INIETTABILE", defaultDosage: '1 dose' },
  { id: 'ringer', name: "RINGER LATTATO", defaultDosage: '60 ML' },
  { id: 'nefrys', name: "NEFRYS", defaultDosage: '0.5 ML' },
  { id: 'mirataz', name: "MIRATAZ", defaultDosage: '1 dose' }
];

function LogMedicine() {
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
    const selectedMedicines = [];

    PRESETS.forEach(p => {
      if (items[p.id].selected) {
        selectedMedicines.push({
          name: p.name,
          dosage: items[p.id].dosage
        });
      }
    });

    if (customName.trim()) {
      selectedMedicines.push({
        name: customName,
        dosage: customDosage || 'N/A'
      });
    }

    if (selectedMedicines.length === 0) {
      alert("Seleziona almeno una medicina o inseriscine una manuale.");
      return;
    }

    try {
      await db.transaction('rw', db.logs, async () => {
        // Use selected timestamp
        const dateStr = new Date(timestamp).toISOString().split('T')[0];

        for (const med of selectedMedicines) {
          await db.logs.add({
            type: LogType.MEDICINE,
            timestamp: timestamp,
            date: dateStr,
            details: med,
            notes: notes // Add notes
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
      <h1>Registra Medicina </h1>

      <div className="card">
        <DateTimeSelector timestamp={timestamp} onChange={setTimestamp} />

        <h3>Lista Prescritta</h3>
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
                  <label style={{ fontSize: '0.9rem', color: '#666' }}>Dosaggio:</label>
                  {p.options ? (
                    <select
                      value={items[p.id].dosage}
                      onChange={(e) => updateDosage(p.id, e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}
                    >
                      {p.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={items[p.id].dosage}
                      onChange={(e) => updateDosage(p.id, e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <h3 style={{ marginTop: '1.5rem' }}>Altro / Manuale</h3>
        <input
          type="text"
          placeholder="Nome Medicina"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="Dosaggio"
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
          Salva Medicine
        </button>
      </div>

      <CategoryHistory type={LogType.MEDICINE} />
    </div>
  );
}

export default LogMedicine;
