export const MOODS = [
    { label: 'Felice', score: 2, color: '#4caf50' },        // Green
    { label: 'Arrabbiato', score: -2, color: '#f44336' },   // Red
    { label: 'Triste', score: -2, color: '#f44336' },       // Red
    { label: 'Assonnato', score: 0, color: '#9e9e9e' },     // Grey/Neutral
    { label: 'Pazzo', score: 1, color: '#8bc34a' },         // Light Green (Zoomies are kinda happy?)
    { label: 'Rintontito', score: -1, color: '#ff9800' },   // Orange/Negative-ish
    { label: 'Rilassato', score: 1, color: '#8bc34a' },     // Light Green
    { label: 'Affettuoso', score: 2, color: '#4caf50' },    // Green
    { label: 'Giocherellone', score: 2, color: '#4caf50' }, // Green
    { label: 'Spaventato', score: -2, color: '#f44336' },   // Red
    { label: 'Dolorante', score: -2, color: '#b71c1c' }     // Dark Red
];

// Nutritional values per 100g/ml or per unit as specified
export const FOOD_DATABASE = [
    {
        id: 'rc_renal_special',
        category: 'Secco',
        name: 'Royal Canin Renal Special',
        protein: 26.0,
        fat: 17.0,
        carbs: 37.5,
        calories: 392.0,
        phosphorus: 0.45,
        sodium: 0.40,
        calcium: 0.63,
        unit: 'g',
        allergens: 'Cereali, Maiale, Pollo, Pesce, Soia'
    },
    {
        id: 'rc_renal_loaf',
        category: 'Umido',
        name: 'Royal Canin Renal Loaf',
        protein: 7.5,
        fat: 6.5,
        carbs: 5.9,
        calories: 105.3,
        phosphorus: 0.10,
        sodium: 0.09,
        calcium: 0.15,
        unit: 'g',
        allergens: 'Pollo, Maiale, Salmone, Cereali'
    },
    {
        id: 'vetlife_hepatic',
        category: 'Umido',
        name: 'VetLife Hepatic',
        protein: 7.50,
        fat: 4.80,
        carbs: 7.45,
        calories: 97.9,
        phosphorus: 0.18,
        sodium: 0.10,
        calcium: 0.22,
        unit: 'g',
        allergens: 'Pollo, Uova, Pesce, Quinoa'
    },
    {
        id: 'gourmet_agnello',
        category: 'Umido',
        name: 'Gourmet Gold Tortini (Agnello)',
        protein: 17.0,
        fat: 4.0,
        carbs: 1.9,
        calories: 101.0,
        phosphorus: 0.23,
        sodium: 0.16,
        calcium: 0.27,
        unit: 'g',
        allergens: 'Agnello, Pesce, Glutine'
    },
    {
        id: 'ciao_dashi',
        category: 'Umido',
        name: 'CIAO Dashi Delights',
        protein: 11.2,
        fat: 0.5,
        carbs: 1.2,
        calories: 46.0,
        phosphorus: 0.015,
        sodium: 0.15,
        calcium: 0.002,
        unit: 'g',
        allergens: 'Pollo, Tonno'
    },
    {
        id: 'ciao_churu',
        category: 'Snack',
        name: 'CIAO Churu',
        protein: 8.5,
        fat: 0.5,
        carbs: 3.4,
        calories: 44.0,
        phosphorus: 0.025,
        sodium: 0.20,
        calcium: 0.003,
        unit: 'pz',
        weightPerUnit: 14,
        allergens: 'Tonno, Pollo, Molluschi, Formaggio'
    }
];
