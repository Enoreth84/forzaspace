import { useState } from 'react';
import { db, LogType } from '../services/db';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Link } from 'react-router-dom';

function Export() {
    const [range, setRange] = useState(7);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState({
        [LogType.FOOD]: true,
        [LogType.MEDICINE]: true,
        [LogType.PEE]: true,
        [LogType.POO]: true,
        [LogType.WEIGHT]: true,
        [LogType.MOOD]: true,
        [LogType.NOTE]: true,
    });

    const toggleCategory = (type) => {
        setCategories(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const generatePDF = async () => {
        setLoading(true);
        try {
            const now = new Date();
            const pastDate = new Date();
            pastDate.setDate(now.getDate() - range);
            const timestampLimit = pastDate.getTime();

            const logs = await db.logs
                .where('timestamp')
                .aboveOrEqual(timestampLimit)
                .toArray();

            // Filter by selected categories
            const filteredLogs = logs.filter(log => categories[log.type]);

            // Sort by date desc
            filteredLogs.sort((a, b) => b.timestamp - a.timestamp);

            const doc = new jsPDF();

            doc.setFontSize(18);
            doc.text(`Report Salute Gatto - Ultimi ${range} giorni`, 14, 22);

            doc.setFontSize(11);
            doc.text(`Generato il: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 14, 30);

            const tableData = filteredLogs.map(log => {
                const date = new Date(log.timestamp).toLocaleString([], {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit'
                });

                let typeLabel = '';
                let details = '';

                switch (log.type) {
                    case LogType.FOOD:
                        typeLabel = 'Cibo';
                        details = typeof log.details === 'object' ? `${log.details.quantity} (${log.details.type})` : log.details;
                        if (log.notes) details += `\nNote: ${log.notes}`;
                        break;
                    case LogType.MEDICINE:
                        typeLabel = 'Medicina';
                        details = `${log.details.name} - ${log.details.dosage}`;
                        if (log.notes) details += `\nNote: ${log.notes}`;
                        break;
                    case LogType.PEE:
                        typeLabel = 'Pipì';
                        details = 'Registrata'; // Could add photo/blood info if structured
                        if (log.notes) details += `\nNote: ${log.notes}`;
                        break;
                    case LogType.POO:
                        typeLabel = 'Pupù';
                        details = 'Registrata'; // Could add consistency
                        if (log.notes) details += `\nNote: ${log.notes}`;
                        break;
                    case LogType.WEIGHT:
                        typeLabel = 'Peso';
                        details = `${log.details} kg`;
                        if (log.notes) details += `\nNote: ${log.notes}`;
                        break;
                    case LogType.MOOD:
                        typeLabel = 'Umore';
                        details = log.details;
                        if (log.notes) details += `\nNote: ${log.notes}`;
                        break;
                    case LogType.NOTE:
                        typeLabel = 'Nota';
                        details = log.details;
                        break;
                    default:
                        typeLabel = log.type;
                        details = JSON.stringify(log.details);
                }

                return [date, typeLabel, details];
            });

            autoTable(doc, {
                head: [['Data/Ora', 'Categoria', 'Dettagli']],
                body: tableData,
                startY: 35,
                styles: { fontSize: 10, cellPadding: 3 },
                headStyles: { fillColor: [66, 165, 245] },
                columnStyles: {
                    0: { cellWidth: 40 },
                    1: { cellWidth: 30 },
                    2: { cellWidth: 'auto' }
                }
            });

            doc.save(`cat_report_${now.toISOString().split('T')[0]}.pdf`);

        } catch (err) {
            console.error(err);
            alert("Errore nella generazione del PDF");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h1>Esporta Dati </h1>

            <div className="card">
                <h3>Intervallo Temporale</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {[7, 14, 30, 90].map(d => (
                        <button
                            key={d}
                            onClick={() => setRange(d)}
                            style={{
                                padding: '0.5rem',
                                flex: 1,
                                backgroundColor: range === d ? 'var(--primary-color)' : '#f0f0f0',
                                color: range === d ? 'white' : '#333',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            {d} gg
                        </button>
                    ))}
                </div>

                <h3>Categorie da Includere</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {Object.values(LogType).map(type => (
                        <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'capitalize' }}>
                            <input
                                type="checkbox"
                                checked={categories[type] !== false}
                                onChange={() => toggleCategory(type)}
                            />
                            {type === 'pee' ? 'Pipì' : type === 'poo' ? 'Pupù' : type}
                        </label>
                    ))}
                </div>

                <button
                    onClick={generatePDF}
                    disabled={loading}
                    className="action-button"
                >
                    {loading ? 'Generazione in corso...' : 'Scarica PDF'}
                </button>

                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem', textAlign: 'center' }}>
                    Il file PDF verrà scaricato sul tuo dispositivo. Potrai poi condividerlo via WhatsApp o Email.
                </p>
            </div>

            <Link to="/" style={{ display: 'block', marginTop: '1rem', textAlign: 'center' }}>
                Torna alla Home
            </Link>
        </div>
    );
}

export default Export;
