import Dexie from 'dexie';

export const db = new Dexie('CatHealthDB');

db.version(1).stores({
  logs: '++id, type, timestamp, date'
});

export const LogType = {
  MEDICINE: 'medicine',
  PEE: 'pee',
  POO: 'poo',
  MOOD: 'mood',
  WEIGHT: 'weight'
};

// Export all data to JSON
export async function exportDB() {
  const allLogs = await db.logs.toArray();
  return JSON.stringify(allLogs);
}

// Import data from JSON
export async function importDB(jsonString) {
  try {
    const logs = JSON.parse(jsonString);
    if (!Array.isArray(logs)) throw new Error("Invalid backup file");
    
    await db.transaction('rw', db.logs, async () => {
        await db.logs.bulkPut(logs);
    });
    return true;
  } catch (error) {
    console.error("Import failed:", error);
    return false;
  }
}
