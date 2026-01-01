import React from 'react';
import { Link } from 'react-router-dom';

function Guidelines() {
    const guidelines = [
        {
            component: 'Fosforo (P)',
            ideal: '0,10% - 0,20%',
            limit: '< 0,50%',
            notes: 'Il fosforo è il parametro più critico; valori alti accelerano la distruzione dei nephroni rimasti.'
        },
        {
            component: 'Proteine',
            ideal: '7,5% - 10% (Umido)',
            limit: '26% (Secco)',
            notes: 'Devono essere di altissima qualità (L.I.P.) per produrre meno scorie azotate possibili.'
        },
        {
            component: 'Sodio (Na)',
            ideal: '0,09% - 0,15%',
            limit: '0,40%',
            notes: 'Il controllo del sodio è essenziale per gestire l\'ipertensione sistemica frequente nello stadio IV.'
        },
        {
            component: 'Calcio (Ca)',
            ideal: '0,15% - 0,25%',
            limit: '0,63%',
            notes: 'Livelli ridotti servono a prevenire la formazione di calcoli di ossalato e calcificazioni tissutali.'
        },
        {
            component: 'Calorie (x 4,5kg)',
            ideal: '230 - 250 kcal/die',
            limit: 'N.D.',
            notes: 'È vitale mantenere il peso corporeo; la perdita di peso accelera il declino generale.'
        },
        {
            component: 'Idratazione',
            ideal: '225 - 270 ml/die',
            limit: 'N.D.',
            notes: 'Un gatto in stadio IV non può concentrare le urine; deve bere molto per non disidratarsi.'
        }
    ];

    return (
        <div className="page-container">
            <h1>Linee Guida Cliniche 🩺</h1>
            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f0f0f0', textAlign: 'left' }}>
                            <th style={{ padding: '0.5rem', borderBottom: '2px solid #ddd' }}>Componente</th>
                            <th style={{ padding: '0.5rem', borderBottom: '2px solid #ddd' }}>Target Ideale</th>
                            <th style={{ padding: '0.5rem', borderBottom: '2px solid #ddd', color: '#d32f2f' }}>Limite Max</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guidelines.map((g, i) => (
                            <React.Fragment key={i}>
                                <tr style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>{g.component}</td>
                                    <td style={{ padding: '0.5rem', color: '#388e3c' }}>{g.ideal}</td>
                                    <td style={{ padding: '0.5rem', color: '#d32f2f', fontWeight: 'bold' }}>{g.limit}</td>
                                </tr>
                                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                                    <td colSpan="3" style={{ padding: '0.2rem 0.5rem 0.8rem 0.5rem', fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>
                                        {g.notes}
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <Link to="/" style={{ display: 'block', marginTop: '1.5rem', textAlign: 'center' }}>
                Torna alla Home
            </Link>
        </div>
    );
}

export default Guidelines;
