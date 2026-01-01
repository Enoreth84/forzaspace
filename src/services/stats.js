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
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        peeCount: 0,
        pooCount: 0,
      };
    }

    switch (log.type) {
      case LogType.FOOD:
        const qty = typeof log.details === 'object' ? log.details.quantity : '0';
        dailyStats[date].foodTotal += parseQuantity(qty);
        // Nutrition
        if (typeof log.details === 'object') {
          dailyStats[date].calories += parseFloat(log.details.calories || 0);
          dailyStats[date].protein += parseFloat(log.details.protein || 0);
          dailyStats[date].fat += parseFloat(log.details.fat || 0);
          dailyStats[date].carbs += parseFloat(log.details.carbs || 0);
        }
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

export const processMoodStats = (logs, moodConstants) => {
  return logs
    .filter(log => log.type === LogType.MOOD)
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(log => {
      // Log details is the mood label string
      // Safety check: ensure details is a string
      const label = (typeof log.details === 'string') ? log.details.trim() : 'Sconosciuto';

      const constant = moodConstants.find(m => m.label === label);
      const score = constant ? constant.score : 0;

      return {
        timestamp: log.timestamp,
        dateStr: new Date(log.timestamp).toLocaleDateString([], { day: '2-digit', month: '2-digit' }),
        timeStr: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mood: label,
        score: score
      };
    });
};
