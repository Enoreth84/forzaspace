import { useState, useEffect } from 'react';
import { db } from '../services/db';
import { processStats } from '../services/stats';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

function Charts() {
  const [data, setData] = useState([]);
  const [range, setRange] = useState(7); // default 7 days

  useEffect(() => {
    db.logs.orderBy('timestamp').toArray()
      .then(logs => {
        const stats = processStats(logs);
        // Slice based on range (take last N items)
        const sliced = stats.slice(-range);
        setData(sliced);
      })
      .catch(console.error);
  }, [range]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}`;
  };

  return (
    <div className="page-container">
      <h1>Statistiche </h1>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button 
          onClick={() => setRange(7)} 
          className={range === 7 ? 'action-button' : 'card'}
          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', width: 'auto', border: range === 7 ? 'none' : '1px solid #ddd' }}
        >
          7 Giorni
        </button>
        <button 
          onClick={() => setRange(30)} 
          className={range === 30 ? 'action-button' : 'card'}
          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', width: 'auto', border: range === 30 ? 'none' : '1px solid #ddd' }}
        >
          30 Giorni
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Cibo Consumato (g) </h3>
        <div style={{ height: '250px', width: '100%', fontSize: '0.8rem' }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis />
              <Tooltip labelFormatter={formatDate} />
              <Bar dataKey="foodTotal" fill="#82ca9d" name="Cibo (g)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Bisogni (N°) </h3>
        <div style={{ height: '250px', width: '100%', fontSize: '0.8rem' }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis allowDecimals={false} />
              <Tooltip labelFormatter={formatDate} />
              <Legend />
              <Bar dataKey="peeCount" fill="#8884d8" name="Pipì" stackId="a" />
              <Bar dataKey="pooCount" fill="#ffc658" name="Pupù" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Peso (kg) </h3>
        <div style={{ height: '250px', width: '100%', fontSize: '0.8rem' }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis domain={['auto', 'auto']} padding={{ top: 20, bottom: 20 }} />
              <Tooltip labelFormatter={formatDate} />
              <Line type="monotone" dataKey="weight" stroke="#ff7300" strokeWidth={2} dot={{ r: 4 }} name="Peso (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Link to="/" style={{ display: 'block', marginTop: '1rem', textAlign: 'center' }}>
         Torna alla Home
      </Link>
    </div>
  );
}

export default Charts;
