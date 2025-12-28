import { useState } from 'react';
import { exportDB, importDB } from '../services/db';

function Settings() {
  const [status, setStatus] = useState('');

  const handleBackup = async () => {
    try {
      const json = await exportDB();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cat_log_backup.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatus('Backup scaricato con successo!');
    } catch (err) {
      console.error(err);
      setStatus('Errore durante il backup.');
    }
  };

  const handleRestore = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const success = await importDB(e.target.result);
        if (success) {
          setStatus('Dati ripristinati con successo!');
        } else {
          setStatus('Errore durante il ripristino. File non valido?');
        }
      } catch (err) {
        console.error(err);
        setStatus('Errore durante il ripristino.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="page-container">
      <h1>Impostazioni</h1>
      
      <div className="card">
        <h2>Backup & Ripristino</h2>
        <p>Salva i tuoi dati o ripristinali da un file precedente.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <button onClick={handleBackup} className="action-button">
             Scarica Backup (Salva Dati)
          </button>

          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Carica file di backup (Ripristina):</label>
            <input 
              type="file" 
              accept=".json" 
              onChange={handleRestore}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {status && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{status}</p>}
      </div>
    </div>
  );
}

export default Settings;

