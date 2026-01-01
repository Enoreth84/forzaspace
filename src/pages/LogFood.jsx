import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, LogType } from '../services/db';
import { FOOD_DATABASE } from '../services/constants';
import DateTimeSelector from '../components/DateTimeSelector';
import NotesField from '../components/NotesField';
import CategoryHistory from '../components/CategoryHistory';

function LogFood() {
  const navigate = useNavigate();
  // State for selection
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');

  // Custom food fallback
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState('');

  // Common state
  const [timestamp, setTimestamp] = useState(Date.now());
  const [notes, setNotes] = useState('');

  // Group products by category
  const categories = [...new Set(FOOD_DATABASE.map(f => f.category))];
  const filteredProducts = selectedCategory
    ? FOOD_DATABASE.filter(f => f.category === selectedCategory)
    : [];

  const handleProductChange = (e) => {
    const val = e.target.value;
    if (val === 'custom') {
      setIsCustom(true);
      setSelectedProduct('');
    } else {
      setIsCustom(false);
      setSelectedProduct(val);
      // Auto-set default quantity for snacks?
      if (val === 'ciao_churu') setQuantity('1'); // default to 1 piece
      else setQuantity('');
    }
  };

  const saveLog = async () => {
    if (!isCustom && !selectedProduct) {
      alert("Seleziona un prodotto.");
      return;
    }
    if ((isCustom && !customName) || !quantity) {
      alert("Inserisci nome e quantità.");
      return;
    }

    try {
      const dateStr = new Date(timestamp).toISOString().split('T')[0];
      let details = {};

      if (isCustom) {
        details = {
          name: customName,
          quantity: `${quantity}g`, // Assume grams for custom
          calories: 0, // Unknown
          protein: 0,
          fat: 0,
          carbs: 0
        };
      } else {
        const product = FOOD_DATABASE.find(f => f.id === selectedProduct);
        const qtyVal = parseFloat(quantity);

        let multiplier = qtyVal / 100; // Default: quantity is grams, stats are per 100g
        let unitLabel = 'g';

        if (product.unit === 'pz' || product.id === 'ciao_churu') {
          // Special handling for Churu/Snacks if input is 'pieces'
          // If user inputs '1', and we know weightPerUnit is 14g
          const weight = qtyVal * (product.weightPerUnit || 14);
          multiplier = weight / 100;
          unitLabel = ' pz';
        }

        details = {
          id: product.id,
          name: product.name,
          quantity: `${quantity}${unitLabel}`,
          calories: (product.calories * multiplier).toFixed(1),
          protein: (product.protein * multiplier).toFixed(1),
          fat: (product.fat * multiplier).toFixed(1),
          carbs: (product.carbs * multiplier).toFixed(1)
        };
      }

      await db.logs.add({
        type: LogType.FOOD,
        timestamp: timestamp,
        date: dateStr,
        details: details,
        notes: notes
      });

      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Errore nel salvataggio");
    }
  };

  return (
    <div className="page-container">
      <h1>Registra Cibo </h1>

      <div className="card">
        <DateTimeSelector timestamp={timestamp} onChange={setTimestamp} />

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Categoria:</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setSelectedProduct(''); setIsCustom(false); }}
                className={selectedCategory === cat ? 'action-button' : 'card'}
                style={{
                  padding: '0.5rem 1rem',
                  width: 'auto',
                  backgroundColor: selectedCategory === cat ? 'var(--primary-color)' : 'white',
                  color: selectedCategory === cat ? 'white' : 'black',
                  border: selectedCategory === cat ? 'none' : '1px solid #ddd'
                }}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => { setSelectedCategory(''); setSelectedProduct(''); setIsCustom(true); }}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: isCustom ? '#eee' : 'white',
                cursor: 'pointer'
              }}
            >
              Altro
            </button>
          </div>
        </div>

        {!isCustom && selectedCategory && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Prodotto:</label>
            <select
              value={selectedProduct}
              onChange={handleProductChange}
              className="input-field"
              style={{ width: '100%', padding: '0.8rem' }}
            >
              <option value="">-- Seleziona --</option>
              {filteredProducts.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
              <option value="custom">Altro (Manuale)</option>
            </select>
          </div>
        )}

        {isCustom && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Nome Cibo:</label>
            <input
              type="text"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              className="input-field"
              style={{ width: '100%', padding: '0.8rem' }}
              placeholder="Es. Pollo lesso"
            />
          </div>
        )}

        {(selectedProduct || isCustom) && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Quantità {selectedProduct === 'ciao_churu' ? '(Pezzi)' : '(Grammi)'}:
            </label>
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className="input-field"
              style={{ width: '100%', padding: '0.8rem', fontSize: '1.2rem' }}
              placeholder="0"
            />
          </div>
        )}

        <div style={{ marginTop: '1.5rem' }}>
          <NotesField value={notes} onChange={setNotes} />
        </div>

        <button
          onClick={saveLog}
          className="action-button"
          style={{ marginTop: '1.5rem' }}
        >
          Salva Cibo
        </button>
      </div>

      <CategoryHistory type={LogType.FOOD} />
    </div>
  );
}

export default LogFood;
