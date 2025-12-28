import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, LogType, updateLog } from '../services/db';

function EditLog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [details, setDetails] = useState({});

  useEffect(() => {
    db.logs.get(parseInt(id))
      .then(foundLog => {
        if (foundLog) {
          setLog(foundLog);
          const d = new Date(foundLog.timestamp);
          // Format for inputs: YYYY-MM-DD and HH:MM
          setDate(d.toISOString().split('T')[0]);
          setTime(d.toTimeString().slice(0, 5));
          setDetails(foundLog.details);
        } else {
          alert("Log non trovato");
          navigate('/history');
        }
        setLoading(false);
      })
      .catch(console.error);
  }, [id, navigate]);

  const handleSave = async () => {
    try {
      // Reconstruct timestamp from date/time inputs
      const newTimestamp = new Date(`${date}T${time}`).getTime();
      
      await updateLog(parseInt(id), {
        timestamp: newTimestamp,
        date: date,
        details: details
      });
      navigate('/history');
    } catch (err) {
      console.error(err);
      alert("Errore durante il salvataggio");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Sei sicuro di voler eliminare questa voce?")) {
      await db.logs.delete(parseInt(id));
      navigate('/history');
    }
  };

  const renderDetailInputs = () => {
    if (!log) return null;

    switch(log.type) {
      case LogType.MEDICINE:
         // Handle both old string format and new object format
         const isObj = typeof details === 'object';
         const name = isObj ? details.name : details;
         const dosage = isObj ? details.dosage : '';

         return (
           <>
             <label>Nome Medicina:</label>
             <input 
               type="text" 
               className="input-field" 
               style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
               value={name}
               onChange={e => setDetails(isObj ? { ...details, name: e.target.value } : e.target.value)}
             />
             {isObj && (
               <>
                 <label>Dosaggio:</label>
                 <input 
                   type="text" 
                   className="input-field" 
                   style={{ width: '100%', padding: '0.5rem' }}
                   value={dosage}
                   onChange={e => setDetails({ ...details, dosage: e.target.value })}
                 />
               </>
             )}
           </>
         );
      
      case LogType.WEIGHT:
        return (
          <>
            <label>Peso (kg):</label>
            <input 
              type="number" step="0.01" 
              className="input-field"
              style={{ width: '100%', padding: '0.5rem' }}
              value={details}
              onChange={e => setDetails(e.target.value)}
            />
          </>
        );

      case LogType.MOOD:
        return (
          <>
            <label>Umore:</label>
            <select 
               className="input-field"
               style={{ width: '100%', padding: '0.5rem' }}
               value={details}
               onChange={e => setDetails(e.target.value)}
            >
              <option> Felice</option>
              <option> Arrabbiato</option>
              <option> Triste</option>
              <option> Assonnato</option>
              <option> Pazzo</option>
            </select>
          </>
        );

      case LogType.PEE:
        return (
           <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <input 
               type="checkbox" 
               checked={details.blood || false}
               onChange={e => setDetails({ ...details, blood: e.target.checked })}
               style={{ transform: 'scale(1.2)' }}
             />
             C'è sangue?
           </label>
        );

      case LogType.POO:
        return (
          <>
             <label>Consistenza:</label>
             <select 
               className="input-field"
               style={{ width: '100%', padding: '0.5rem' }}
               value={details.consistency || 'Normale'}
               onChange={e => setDetails({ ...details, consistency: e.target.value })}
             >
               <option>Normale</option>
               <option>Dura</option>
               <option>Molle</option>
               <option>Liquida</option>
             </select>
          </>
        );

      default:
        return <p>Modifica dettagli non disponibile per questo tipo.</p>;
    }
  };

  if (loading) return <div className="page-container">Caricamento...</div>;

  return (
    <div className="page-container">
      <h1>Modifica Voce </h1>
      <div className="card">
        <label>Data:</label>
        <input 
          type="date" 
          value={date} 
          onChange={e => setDate(e.target.value)}
          className="input-field"
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        
        <label>Ora:</label>
        <input 
          type="time" 
          value={time} 
          onChange={e => setTime(e.target.value)}
          className="input-field"
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1.5rem' }}
        />

        <hr style={{ margin: '1.5rem 0', border: '0', borderTop: '1px solid #eee' }} />
        
        {renderDetailInputs()}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button 
            onClick={handleSave} 
            className="action-button"
            style={{ flex: 2 }}
          >
            Salva Modifiche
          </button>
          
          <button 
            onClick={handleDelete}
            style={{ 
              flex: 1, 
              background: '#ffebee', 
              color: '#d32f2f', 
              border: '1px solid #ffcdd2',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Elimina
          </button>
        </div>
      </div>
       <button onClick={() => navigate('/history')} style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer', width: '100%' }}>
         Annulla
       </button>
    </div>
  );
}

export default EditLog;
