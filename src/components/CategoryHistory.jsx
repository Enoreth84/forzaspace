import { useState, useEffect } from 'react';
import { db, LogType } from '../services/db';

function CategoryHistory({ type, limit = 5 }) {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        // Fetch logs on mount
        fetchLogs();
    }, [type]);

    const fetchLogs = async () => {
        try {
            const allLogs = await db.logs.where('type').equals(type).reverse().limit(limit).toArray();
            setLogs(allLogs);
        } catch (err) {
            console.error("Error fetching history:", err);
        }
    };

    const formatDetails = (log) => {
        switch (log.type) {
            case LogType.FOOD:
                return typeof log.details === 'object' ? `${log.details.quantity} (${log.details.name})` : log.details;
            case LogType.MEDICINE:
                let details = `${log.details.name} - ${log.details.dosage}`;
                if (log.details.site) {
                    details += ` (${log.details.site})`;
                }
                return details;
            case LogType.PEE:
                return log.details.blood ? 'SANGUE!' : 'Normale';
            case LogType.POO:
                return log.details.consistency || 'Normale';
            case LogType.WEIGHT:
                return `${log.details} kg`;
            case LogType.MOOD:
                return log.details;
            case LogType.NOTE:
                return log.details; // Notes content
            default:
                return JSON.stringify(log.details);
        }
    };

    if (logs.length === 0) return null;

    return (
        <div className="card" style={{ marginTop: '2rem', backgroundColor: '#f9f9f9' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#666' }}>Ultimi inserimenti</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {logs.map(log => (
                    <div key={log.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #eee',
                        paddingBottom: '0.5rem',
                        fontSize: '0.9rem'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 'bold' }}>{new Date(log.timestamp).toLocaleDateString()}</span>
                            <span style={{ color: '#888', fontSize: '0.8rem' }}>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div style={{ textAlign: 'right', maxWidth: '60%' }}>
                            <div>{formatDetails(log)}</div>
                            {log.notes && <div style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>"{log.notes}"</div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoryHistory;
