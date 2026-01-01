function NotesField({ value, onChange }) {
    return (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                Note (opzionale)
            </label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Aggiungi dettagli, osservazioni..."
                style={{
                    width: '100%',
                    minHeight: '60px',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontFamily: 'inherit'
                }}
            />
        </div>
    );
}

export default NotesField;
