import { LogType } from './db';

const parseQuantity = (qtyStr) => {
  if (!qtyStr) return 0;
  // Extract number from string like "85g", "20g", "1 pz"
  const match = qtyStr.toString().match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[0]) : 0;
};

export const processStats = (logs) => {
  const dailyStats = {};

  logs.forEach(log => {
    const date = log.date; // already YYYY-MM-DD
    
    if (!dailyStats[date]) {
      dailyStats[date] = {
        date,
        timestamp: log.timestamp, // keep for sorting
        foodTotal: 0,
        peeCount: 0,
        pooCount: 0,
        // Weight is handled separately now for graphs, 
        // but we might keep a daily avg if needed. 
        // We'll skip weight in this aggregate for now.
      };
    }

    switch(log.type) {
      case LogType.FOOD:
        const qty = typeof log.details === 'object' ? log.details.quantity : '0';
        dailyStats[date].foodTotal += parseQuantity(qty);
        break;
      
      case LogType.PEE:
        dailyStats[date].peeCount += 1;
        break;
        
      case LogType.POO:
        dailyStats[date].pooCount += 1;
        break;
    }
  });

  return Object.values(dailyStats).sort((a, b) => a.timestamp - b.timestamp);
};

export const processWeightStats = (logs) => {
  return logs
    .filter(log => log.type === LogType.WEIGHT)
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(log => ({
      timestamp: log.timestamp,
      dateStr: new Date(log.timestamp).toLocaleDateString([], { day: '2-digit', month: '2-digit' }),
      timeStr: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      weight: parseFloat(log.details)
    }));
};
