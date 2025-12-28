import Dexie from 'dexie';

export const db = new Dexie('CatHealthDB');

db.version(1).stores({
  logs: '++id, type, timestamp, date' // Primary key and indexed props
});

export const LogType = {
  MEDICINE: 'medicine',
  PEE: 'pee',
  POO: 'poo',
  MOOD: 'mood',
  WEIGHT: 'weight'
};

/*
Log Object Structure Example:
{
  type: LogType.MEDICINE,
  timestamp: Date.now(),
  date: "2023-10-27", // ISO Date string for easy grouping
  details: {
    name: "Antibiotic",
    dosage: "1 pill"
  }
}

{
  type: LogType.PEE,
  timestamp: Date.now(),
  date: "2023-10-27",
  details: {
    blood: boolean,
    notes: string
  },
  photo: Blob | null
}
*/
