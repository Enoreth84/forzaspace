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
        carbs: 40.5,
        calories: 392,
        unit: 'g',
        allergens: 'Mais, Riso, Maiale, Pollo, Frumento, Pesce, Soia'
    },
    {
        id: 'rc_renal_loaf',
        category: 'Umido',
        name: 'Royal Canin Renal Loaf',
        protein: 7.5,
        fat: 6.5,
        carbs: 5.9,
        calories: 105.3,
        unit: 'g',
        allergens: 'Pollo, Maiale, Salmone (Pesce), Cereali'
    },
    {
        id: 'gourmet_agnello',
        category: 'Umido',
        name: 'Gourmet Gold Tortini (Agnello)',
        protein: 17.0,
        fat: 4.0,
        carbs: 1.9,
        calories: 101,
        unit: 'g',
        allergens: 'Agnello, Pesce, Fagiolini, Glutine'
    },
    {
        id: 'vetlife_hepatic',
        category: 'Umido',
        name: 'VetLife Hepatic',
        protein: 7.5,
        fat: 4.8,
        carbs: 7.45,
        calories: 97.9,
        unit: 'g',
        allergens: 'Pollo, Uova, Pesce, Quinoa'
    },
    {
        id: 'ciao_dashi',
        category: 'Umido',
        name: 'CIAO Dashi Delights',
        protein: 11.2,
        fat: 0.5,
        carbs: 1.2,
        calories: 46.0,
        unit: 'g',
        allergens: 'Pollo, Pesce (Tonno)'
    },
    {
        id: 'ciao_churu',
        category: 'Snack',
        name: 'CIAO Churu',
        protein: 8.5,
        fat: 0.5,
        carbs: 3.4,
        calories: 44.0,
        unit: 'pz', // Assuming 1 piece ~ 14g usually, but we'll track normalized to 100g data or treat as 'g' if user inputs g. 
        // User specific req: "CIAO Churu (Vari gusti) ... 44 kcal (100g? or per piece?)". 
        // Usually Churu is ~6-9kcal per tube (14g). 
        // 44kcal/100g seems low for Churu (usually ~60kcal/100g). 
        // I will assume the user provided values are PER 100g unless otherwise clear. 
        // If user enters '1 pz', we need a conversion. 
        // Let's stick to GRAMS input for everything to be safe for nutrition, or standard weight per piece.
        // I'll default Churu input to stick (14g) but calculate using the provider 100g stats.
        weightPerUnit: 14,
        allergens: 'Pesce, Pollo, Molluschi, Latticini'
    }
];
