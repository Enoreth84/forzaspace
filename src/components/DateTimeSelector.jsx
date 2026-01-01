import { useState, useEffect } from 'react';

function DateTimeSelector({ timestamp, onChange }) {
    // Local state to handle the inputs
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        if (timestamp) {
            const d = new Date(timestamp);
            // Format YYYY-MM-DD
            const dateStr = d.toLocaleDateString('sv'); // 'sv' locale outputs YYYY-MM-DD
            // Format HH:MM
            const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

            setDate(dateStr);
            setTime(timeStr);
        }
    }, [timestamp]);

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setDate(newDate);
        updateParent(newDate, time);
    };

    const handleTimeChange = (e) => {
        const newTime = e.target.value;
        setTime(newTime);
        updateParent(date, newTime);
    };

    const updateParent = (d, t) => {
        if (d && t) {
            const newDateTime = new Date(`${d}T${t}`);
            onChange(newDateTime.getTime());
        }
    };

    return (
        <div style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fafafa' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                Data e Ora
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    style={{ flex: 1, padding: '0.3rem' }}
                />
                <input
                    type="time"
                    value={time}
                    onChange={handleTimeChange}
                    style={{ width: '80px', padding: '0.3rem' }}
                />
            </div>
        </div>
    );
}

export default DateTimeSelector;
