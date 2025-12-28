import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db, LogType } from '../services/db';

function Home() {
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    db.logs.orderBy('timestamp').reverse().limit(5).toArray()
      .then(setRecentLogs)
      .catch(console.error);
  }, []);

  const formatLog = (log) => {
    const time = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let content = '';
    
    switch(log.type) {
      case LogType.MEDICINE:
        const medName = typeof log.details === 'object' ? log.details.name : log.details;
        const medDose = typeof log.details === 'object' ? ` (${log.details.dosage})` : '';
        content = ` ${medName}${medDose}`;
        break;
      case LogType.PEE:
        content = ` Pipì ${log.details.blood ? ' Sangue' : ''}`;
        break;
      case LogType.POO:
        content = ` Pupù (${log.details.consistency})`;
        break;
      case LogType.MOOD:
        content = ` Mood: ${log.details}`;
        break;
      case LogType.WEIGHT:
         content = ` Peso: ${log.details} kg`;
        break;
      default:
        content = ' Nota';
    }
    return `${time} - ${content}`;
  };

  return (
    <div className="page-container">
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Forza Space </h1>
        <p style={{ color: '#666' }}>Benvenuto nel diario del tuo gatto</p>
      </header>
      
      <div className="grid-container">
        <Link to="/log/medicine" className="card action-card">
          <span style={{ fontSize: '2rem' }}></span>
          <span>Medicine</span>
        </Link>
        <Link to="/log/excretion" className="card action-card">
          <span style={{ fontSize: '2rem' }}></span>
          <span>Bisogni</span>
        </Link>
        <Link to="/log/mood" className="card action-card">
          <span style={{ fontSize: '2rem' }}></span>
          <span>Umore</span>
        </Link>
        <Link to="/log/weight" className="card action-card">
          <span style={{ fontSize: '2rem' }}></span>
          <span>Peso</span>
        </Link>
        <Link to="/settings" className="card action-card" style={{ gridColumn: '1 / -1', background: '#f8f9fa' }}>
            <span style={{ fontSize: '2rem' }}></span>
            <span>Impostazioni & Backup</span>
        </Link>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Ultime Attività</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {recentLogs?.map(log => (
            <li key={log.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
              {formatLog(log)}
            </li>
          ))}
          {!recentLogs?.length && <li style={{ color: '#999', fontStyle: 'italic' }}>Nessuna attività recente</li>}
        </ul>
        <Link to="/history" style={{ display: 'block', marginTop: '1rem', textAlign: 'center', color: 'var(--primary-color)' }}>
          Vedi tutto lo storico
        </Link>
      </div>
    </div>
  );
}

export default Home;

