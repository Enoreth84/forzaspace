import { useState, useEffect } from 'react';
import { db } from '../services/db';
import { processStats, processWeightStats, processMoodStats } from '../services/stats';
import { MOODS } from '../services/constants';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, Cell, ReferenceLine, AreaChart, Area
} from 'recharts';

function Charts() {
  const [dailyData, setDailyData] = useState([]);
  const [weightData, setWeightData] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [range, setRange] = useState(7); // default 7 days

  useEffect(() => {
    db.logs.orderBy('timestamp').toArray()
      .then(logs => {
        // Daily stats (Food, Excretion)
        const stats = processStats(logs);
        const slicedStats = stats.slice(-range);
        setDailyData(slicedStats);

        // Weight stats
        const weights = processWeightStats(logs);

        // Mood stats
        const moods = processMoodStats(logs, MOODS);

        if (slicedStats.length > 0) {
          const startTime = slicedStats[0].timestamp;
          setWeightData(weights.filter(w => w.timestamp >= startTime));
          setMoodData(moods.filter(m => m.timestamp >= startTime));
        } else {
          setWeightData(weights.slice(-range * 2));
          setMoodData(moods.slice(-range * 5));
        }
      })
      .catch(console.error);
  }, [range]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}`;
  };

  // Gradient offset calculation for Mood Area Chart
  const gradientOffset = () => {
    if (!moodData || moodData.length === 0) return 0; // Safety check

    const dataMax = Math.max(...moodData.map((i) => i.score));
    const dataMin = Math.min(...moodData.map((i) => i.score));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

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
        <h3>Andamento Umore </h3>
        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '-0.5rem', marginBottom: '1rem' }}>
          Area Verde = Positivo, Area Rossa = Negativo
        </p>
        <div style={{ height: '250px', width: '100%', fontSize: '0.8rem' }}>
          <ResponsiveContainer>
            <AreaChart data={moodData}>
              <defs>
                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={off} stopColor="#4caf50" stopOpacity={0.6} />
                  <stop offset={off} stopColor="#f44336" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['auto', 'auto']}
                tickFormatter={(ts) => new Date(ts).toLocaleDateString([], { day: '2-digit', month: '2-digit' })}
              />
              <YAxis domain={[-3, 3]} ticks={[-2, 0, 2]} />
              <Tooltip
                labelFormatter={(ts) => new Date(ts).toLocaleString([], { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                formatter={(value, name, props) => [props.payload.mood, 'Umore']}
              />
              <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#8884d8"
                fill="url(#splitColor)"
                name="Punteggio"
                dot={{ r: 4, fill: '#888' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Peso (kg) </h3>
        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '-0.5rem', marginBottom: '1rem' }}>
          Monitoraggio puntuale (Data e Ora)
        </p>
        <div style={{ height: '250px', width: '100%', fontSize: '0.8rem' }}>
          <ResponsiveContainer>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['auto', 'auto']}
                tickFormatter={(ts) => new Date(ts).toLocaleDateString([], { day: '2-digit', month: '2-digit' })}
              />
              <YAxis domain={['auto', 'auto']} padding={{ top: 20, bottom: 20 }} />
              <Tooltip
                labelFormatter={(ts) => new Date(ts).toLocaleString([], { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
              />
              <Line type="monotone" dataKey="weight" stroke="#ff7300" strokeWidth={2} dot={{ r: 4 }} name="Peso (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Calorie Giornaliere (kcal) </h3>
          <Link to="/guidelines" style={{ fontSize: '0.8rem', color: '#1976d2' }}>Vedi Linee Guida</Link>
        </div>
        <div style={{ height: '250px', width: '100%', fontSize: '0.8rem' }}>
          <ResponsiveContainer>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis domain={[0, 'auto']} />
              <Tooltip labelFormatter={formatDate} />
              {/* Target Zone 230-250 */}
              <ReferenceLine y={230} stroke="green" strokeDasharray="3 3" label={{ value: "Min (230)", position: 'insideTopLeft', fill: 'green', fontSize: 10 }} />
              <ReferenceLine y={250} stroke="green" strokeDasharray="3 3" label={{ value: "Max (250)", position: 'insideTopLeft', fill: 'green', fontSize: 10 }} />
              <Bar dataKey="calories" fill="#ffca28" name="Kcal" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Qualità Dieta (Densità %) </h3>
        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '-0.5rem', marginBottom: '1rem' }}>
          Monitoraggio rispetto ai limiti massimi (Linee Rosse)
        </p>
        <div style={{ height: '300px', width: '100%', fontSize: '0.8rem' }}>
          <ResponsiveContainer>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis domain={[0, 0.8]} />
              <Tooltip labelFormatter={formatDate} />
              <Legend />

              {/* Limits */}
              <ReferenceLine y={0.5} stroke="red" strokeDasharray="3 3" label={{ value: "Max P (0.5%)", fill: 'red', fontSize: 10 }} />

              <Line type="monotone" dataKey="phosPct" stroke="#8884d8" name="Fosforo %" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="sodPct" stroke="#82ca9d" name="Sodio %" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="calcPct" stroke="#ffc658" name="Calcio %" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Macronutrienti (g) </h3>
        <div style={{ height: '250px', width: '100%', fontSize: '0.8rem' }}>
          <ResponsiveContainer>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis />
              <Tooltip labelFormatter={formatDate} />
              <Legend />
              <Bar dataKey="protein" stackId="a" fill="#42a5f5" name="Proteine" />
              <Bar dataKey="fat" stackId="a" fill="#ef5350" name="Grassi" />
              <Bar dataKey="carbs" stackId="a" fill="#66bb6a" name="Carboidrati" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Minerali (g) </h3>
        <div style={{ height: '250px', width: '100%', fontSize: '0.8rem' }}>
          <ResponsiveContainer>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis />
              <Tooltip labelFormatter={formatDate} />
              <Legend />
              <Bar dataKey="phosphorus" fill="#7b1fa2" name="Fosforo" />
              <Bar dataKey="sodium" fill="#0097a7" name="Sodio" />
              <Bar dataKey="calcium" fill="#fbc02d" name="Calcio" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Peso Totale Cibo (g) </h3>
        <div style={{ height: '250px', width: '100%', fontSize: '0.8rem' }}>
          <ResponsiveContainer>
            <BarChart data={dailyData}>
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
            <BarChart data={dailyData}>
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

      <Link to="/" style={{ display: 'block', marginTop: '1rem', textAlign: 'center' }}>
        Torna alla Home
      </Link>
    </div>
  );
}

export default Charts;
