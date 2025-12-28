import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, LogType } from '../services/db';

const PRESETS = [
  { id: 'evexia', name: 'EVEXIA FAST (ANTIDOLORIFICO)', defaultDosage: '0.25 ML' },
  { id: 'semintra', name: 'SEMINTRA (INSUFF. RENALE)', defaultDosage: 'DOSE 3KG' },
  { id: 'deflacam', name: 'DEFLACAM (ANTINFIAMM.)', defaultDosage: 'DOSE 1.5KG' },
  { id: 'gastrovom', name: 'GASTROVOM (GASTROPROTE.)', defaultDosage: '1 ML' },
  { id: 'urys', name: 'URYS (INTEGRITA'' MUCOSA)', defaultDosage: '0.5 ML', options: ['0.5 ML', '1 ML'] },
  { id: 'drenalase', name: 'DRENALASE PET MINI', defaultDosage: '1 cp/gg' }
];

function LogMedicine() {
  const navigate = useNavigate();
  // Initialize state
  const [items, setItems] = useState(() => {
    const initial = {};
    PRESETS.forEach(p => {
      initial[p.id] = { selected: false, dosage: p.defaultDosage };
    });
    return initial;
  });
  
  const [customName, setCustomName] = useState('');
  const [customDosage, setCustomDosage] = useState('');

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
      alert('Seleziona almeno una medicina o inseriscine una manuale.');
      return;
    }

    try {
      await db.transaction('rw', db.logs, async () => {
        const now = Date.now();
        const dateStr = new Date().toISOString().split('T')[0];
        
        for (const med of selectedMedicines) {
          await db.logs.add({
            type: LogType.MEDICINE,
            timestamp: now,
            date: dateStr,
            details: med
          });
        }
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Errore nel salvataggio');
    }
  };

  return (
    <div className="page-container">
      <h1>Registra Medicina </h1>
      
      <div className="card">
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

        <button 
          onClick={saveLog} 
          className="action-button"
          style={{ marginTop: '1.5rem' }}
        >
          Salva Medicine
        </button>
      </div>
    </div>
  );
}

export default LogMedicine;
