import { useState, useEffect, useRef } from 'react';
import { db, LogType } from '../services/db';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Link } from 'react-router-dom';
import { processStats, processWeightStats, processMoodStats } from '../services/stats';
import { MOODS } from '../services/constants';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, Cell, ReferenceLine
} from 'recharts';

function Export() {
    const [rangeType, setRangeType] = useState('7'); // '7', '14', '30', 'custom'
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');

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

    // Data for charts
    const [chartData, setChartData] = useState({ daily: [], weight: [], mood: [] });
    const chartsRef = useRef(null);

    useEffect(() => {
        loadData();
    }, [rangeType, customStart, customEnd]);

    const loadData = async () => {
        let startTs, endTs;
        const now = new Date();

        if (rangeType === 'custom') {
            if (!customStart || !customEnd) return;
            startTs = new Date(customStart).getTime();
            const endDate = new Date(customEnd);
            endDate.setHours(23, 59, 59, 999);
            endTs = endDate.getTime();
        } else {
            const days = parseInt(rangeType);
            const startDate = new Date();
            startDate.setDate(now.getDate() - days);
            startDate.setHours(0, 0, 0, 0);
            startTs = startDate.getTime();
            endTs = now.getTime();
        }

        const logs = await db.logs
            .where('timestamp')
            .between(startTs, endTs, true, true)
            .toArray();

        const stats = processStats(logs);
        const weights = processWeightStats(logs);
        const moods = processMoodStats(logs, MOODS);

        setChartData({
            daily: stats,
            weight: weights,
            mood: moods
        });
    };

    const toggleCategory = (type) => {
        setCategories(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const generatePDF = async () => {
        setLoading(true);
        try {
            // 1. Capture Charts
            let chartsImgData = null;
            if (chartsRef.current) {
                const canvas = await html2canvas(chartsRef.current, { scale: 2 });
                chartsImgData = canvas.toDataURL('image/png');
            }

            // 2. Fetch Logs for Table
            let startTs, endTs;
            const now = new Date();
            if (rangeType === 'custom') {
                startTs = new Date(customStart).getTime();
                const endDate = new Date(customEnd);
                endDate.setHours(23, 59, 59, 999);
                endTs = endDate.getTime();
            } else {
                const days = parseInt(rangeType);
                const startDate = new Date();
                startDate.setDate(now.getDate() - days);
                startDate.setHours(0, 0, 0, 0);
                startTs = startDate.getTime();
                endTs = now.getTime();
            }

            const logs = await db.logs
                .where('timestamp')
                .between(startTs, endTs, true, true)
                .toArray();

            const filteredLogs = logs
                .filter(log => categories[log.type])
                .sort((a, b) => b.timestamp - a.timestamp); // Sort Newest First

            const doc = new jsPDF('p', 'mm', 'a4'); // Portrait, Millimeters, A4
            let finalY = 20;

            // Title
            doc.setFontSize(18);
            doc.text(`Report Salute Gatto`, 14, 20);
            doc.setFontSize(11);
            doc.text(`Periodo: ${new Date(startTs).toLocaleDateString()} - ${new Date(endTs).toLocaleDateString()}`, 14, 28);
            finalY = 35;

            // Add Charts Image
            if (chartsImgData) {
                const imgProps = doc.getImageProperties(chartsImgData);
                const pdfWidth = doc.internal.pageSize.getWidth() - 28;
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                if (finalY + pdfHeight > 280) {
                    doc.addPage();
                    finalY = 20;
                }

                doc.addImage(chartsImgData, 'PNG', 14, finalY, pdfWidth, pdfHeight);
                finalY += pdfHeight + 10;
            }

            // Prepare Table Data with Separators
            const tableBody = [];
            let lastDate = '';

            filteredLogs.forEach(log => {
                const dateObj = new Date(log.timestamp);
                const dateStr = dateObj.toLocaleDateString();

                // Separator row
                if (dateStr !== lastDate) {
                    tableBody.push([{ content: dateStr, colSpan: 3, styles: { fillColor: [240, 240, 240], fontStyle: 'bold', halign: 'center' } }]);
                    lastDate = dateStr;
                }

                const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let typeLabel = '';
                let details = '';

                switch (log.type) {
                    case LogType.FOOD:
                        typeLabel = 'Cibo';
                        details = typeof log.details === 'object' ? `${log.details.name} (${log.details.quantity})` : log.details;
                        break;
                    case LogType.MEDICINE:
                        typeLabel = 'Medicina';
                        details = `${log.details.name} - ${log.details.dosage}`;
                        if (log.details.site) {
                            details += ` (${log.details.site})`;
                        }
                        break;
                    case LogType.PEE:
                        typeLabel = 'Pipì';
                        details = log.details.blood ? 'SANGUE!' : 'Normale';
                        break;
                    case LogType.POO:
                        typeLabel = 'Pupù';
                        details = log.details.consistency || 'Normale';
                        break;
                    case LogType.WEIGHT:
                        typeLabel = 'Peso';
                        details = `${log.details} kg`;
                        break;
                    case LogType.MOOD:
                        typeLabel = 'Umore';
                        details = log.details;
                        break;
                    case LogType.NOTE:
                        typeLabel = 'Nota';
                        details = log.details;
                        break;
                    default:
                        typeLabel = log.type;
                }

                if (log.notes) details += `\n[Note: ${log.notes}]`;

                tableBody.push([time, typeLabel, details]);
            });

            autoTable(doc, {
                head: [['Ora', 'Categoria', 'Dettagli']],
                body: tableBody,
                startY: finalY,
                styles: { fontSize: 10, cellPadding: 3 },
                headStyles: { fillColor: [66, 165, 245] },
                columnStyles: {
                    0: { cellWidth: 20 },
                    1: { cellWidth: 30 },
                    2: { cellWidth: 'auto' }
                },
                margin: { top: 20 }
            });

            doc.save(`cat_report_${new Date().toISOString().split('T')[0]}.pdf`);

        } catch (err) {
            console.error(err);
            alert("Errore nella generazione del PDF: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}`;
    };

    return (
        <div className="page-container">
            <h1>Esporta Dati </h1>

            <div className="card">
                <h3>Intervallo Temporale</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {['7', '14', '30'].map(d => (
                        <button
                            key={d}
                            onClick={() => { setRangeType(d); }}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: rangeType === d ? 'var(--primary-color)' : '#f0f0f0',
                                color: rangeType === d ? 'white' : '#333',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            {d} gg
                        </button>
                    ))}
                    <button
                        onClick={() => setRangeType('custom')}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: rangeType === 'custom' ? 'var(--primary-color)' : '#f0f0f0',
                            color: rangeType === 'custom' ? 'white' : '#333',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Personalizzato
                    </button>
                </div>

                {rangeType === 'custom' && (
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', background: '#f9f9f9', padding: '0.5rem' }}>
                        <label>
                            Dal: <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} />
                        </label>
                        <label>
                            Al: <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} />
                        </label>
                    </div>
                )}

                <h3>Categorie</h3>
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

                {/* Hidden/Preview Charts Area */}
                <div style={{ marginBottom: '1rem', overflowX: 'auto' }}>
                    <h4>Anteprima Grafici (Inclusi nel PDF)</h4>
                    {/* Fixed width 1000px ensures high resolution capture for PDF without overlapping labels */}
                    <div ref={chartsRef} style={{ padding: '30px', background: 'white', border: '1px solid #eee', width: '1000px', margin: '0 auto' }}>
                        <h5 style={{ textAlign: 'center', margin: '10px 0', fontSize: '18px' }}>Riepilogo Grafico</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

                            {/* Mood Chart */}
                            <div style={{ width: '100%', height: '300px' }}>
                                <h6 style={{ textAlign: 'center', margin: '5px' }}>Andamento Umore</h6>
                                <ResponsiveContainer>
                                    <BarChart data={chartData.mood} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="dateStr" fontSize={12} />
                                        <YAxis domain={[-3, 3]} hide />
                                        <Bar dataKey="score">
                                            {chartData.mood.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.score >= 0 ? '#4caf50' : '#f44336'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Weight Chart */}
                            <div style={{ width: '100%', height: '350px' }}>
                                <h6 style={{ textAlign: 'center', margin: '5px' }}>Peso (kg)</h6>
                                <ResponsiveContainer>
                                    {/* Increased left margin to fit Y-axis labels */}
                                    <LineChart data={chartData.weight} margin={{ top: 20, right: 30, left: 50, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="dateStr" fontSize={12} />
                                        <YAxis domain={['auto', 'auto']} />
                                        <Line
                                            type="monotone"
                                            dataKey="weight"
                                            stroke="#ff7300"
                                            strokeWidth={3}
                                            dot={{ r: 4 }}
                                            label={{ position: 'top', dy: -10, fontSize: 10, fill: '#333' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Daily Activity Chart */}
                            <div style={{ width: '100%', height: '400px' }}>
                                <h6 style={{ textAlign: 'center', margin: '5px' }}>Attività Giornaliera (Cibo/Bisogni)</h6>
                                <ResponsiveContainer>
                                    <BarChart data={chartData.daily} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" tickFormatter={formatDate} fontSize={12} />
                                        {/* Added YAxis for scale reference */}
                                        <YAxis />
                                        <Legend />
                                        <Bar dataKey="foodTotal" fill="#82ca9d" name="Cibo (g)" label={{ position: 'top', fontSize: 10, fill: '#666' }} />
                                        <Bar dataKey="peeCount" fill="#8884d8" name="Pipì (N)" />
                                        <Bar dataKey="pooCount" fill="#ffc658" name="Pupù (N)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={generatePDF}
                    disabled={loading}
                    className="action-button"
                >
                    {loading ? 'Generazione in corso...' : 'Scarica Report Completo'}
                </button>
            </div>

            <Link to="/" style={{ display: 'block', marginTop: '1rem', textAlign: 'center' }}>
                Torna alla Home
            </Link>
        </div>
    );
}

export default Export;
