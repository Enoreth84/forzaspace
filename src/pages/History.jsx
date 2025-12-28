import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, LogType } from '../services/db';

function History() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    db.logs.orderBy('timestamp').reverse().toArray()
      .then(setLogs)
      .catch(console.error);
  }, []);

  const formatDetails = (log) => {
    switch(log.type) {
      case LogType.MEDICINE:
        const medName = typeof log.details === 'object' ? log.details.name : log.details;
        const medDose = typeof log.details === 'object' ? ` (${log.details.dosage})` : '';
        return ` ${medName}${medDose}`;
      case LogType.PEE:
        return ` Pipì ${log.details.blood ? ' Sangue' : ''}`;
      case LogType.POO:
        return ` Pupù (${log.details.consistency})`;
      case LogType.MOOD:
        return ` Mood: ${log.details}`;
      case LogType.WEIGHT:
         return ` Peso: ${log.details} kg`;
      default:
        return ' Nota';
    }
  };

  return (
    <div className="page-container">
      <h1>Storico Completo </h1>
      <div className="card">
        {logs.length === 0 ? <p>Nessun dato registrato.</p> : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {logs.map(log => (
              <li key={log.id} style={{ 
                padding: '1rem 0', 
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                    {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </div>
                  <div style={{ fontWeight: '500', marginTop: '0.2rem' }}>
                    {formatDetails(log)}
                  </div>
                </div>
                <Link to={`/edit/${log.id}`} style={{ textDecoration: 'none', fontSize: '1.2rem', padding: '0.5rem' }}>
                  
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Link to="/" style={{ display: 'block', marginTop: '1.5rem', textAlign: 'center' }}>
         Torna alla Home
      </Link>
    </div>
  );
}

export default History;
