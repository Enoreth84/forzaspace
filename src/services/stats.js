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
        weight: null
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
        
      case LogType.WEIGHT:
        // Overwrite to keep the latest weight of the day
        dailyStats[date].weight = parseFloat(log.details);
        break;
    }
  });

  // Convert to array and sort by date ascending
  const sortedStats = Object.values(dailyStats).sort((a, b) => a.timestamp - b.timestamp);
  
  // Fill in missing weight data (carry forward previous weight)
  let lastWeight = null;
  sortedStats.forEach(stat => {
     if (stat.weight !== null) {
       lastWeight = stat.weight;
     } else if (lastWeight !== null) {
       stat.weight = lastWeight; // Interpolate for chart continuity
     }
  });

  return sortedStats;
};
