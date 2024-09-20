import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [alarms, setAlarms] = useState([]);
    const [time, setTime] = useState('');
    const [message, setMessage] = useState('');

    const fetchAlarms = async () => {
        const response = await axios.get('/api/alarms');
        setAlarms(response.data);
    };

    const addAlarm = async () => {
        if (time) {
            await axios.post('/api/alarms', { time, message });
            setTime('');
            setMessage('');
            fetchAlarms();
        }
    };

    useEffect(() => {
        fetchAlarms();
    }, []);

    return (
        <div>
            <h1>Alarm Clock</h1>
            <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
            />
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Alarm message"
            />
            <button onClick={addAlarm}>Set Alarm</button>
            <h2>Alarms</h2>
            <ul>
                {alarms.map((alarm) => (
                    <li key={alarm._id}>
                        {alarm.time} - {alarm.message}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
