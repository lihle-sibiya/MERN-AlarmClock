import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function App() {
    // State variables
    const [alarms, setAlarms] = useState([]); // Remove type annotations
    const [time, setTime] = useState('');
    const [message, setMessage] = useState('');
    const audioRef = useRef(new Audio('/alarm-clock.mp3')); // Ensure the path is correct

    // Fetch alarms from the server
    const fetchAlarms = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/alarms');
            console.log("Fetched alarms:", response.data);
            setAlarms(response.data);
        } catch (error) {
            console.error("Error fetching alarms:", error);
        }
    };

    // Add a new alarm
    const addAlarm = async () => {
        if (time && message) {
            await axios.post('http://localhost:5000/api/alarms', { time, message });
            setTime('');
            setMessage('');
            fetchAlarms(); // Refresh the alarms list
        } else {
            alert("Please set both time and message for the alarm.");
        }
    };

    // Delete an alarm by ID
    const deleteAlarm = async (id) => {
        await axios.delete(`http://localhost:5000/api/alarms/${id}`);
        fetchAlarms(); // Refresh the alarms list
    };

    // Check alarms and notify if any are due
    const checkAlarms = () => {
        const now = new Date();
        alarms.forEach(alarm => {
            const alarmTime = new Date();
            const [hour, minute] = alarm.time.split(':');
            alarmTime.setHours(Number(hour), Number(minute), 0, 0); // Ensure hour/minute are numbers
            if (now >= alarmTime && now < alarmTime.getTime() + 60000) {
                notifyUser(alarm.message);
            }
        });
    };

    // Notify the user with an alert and play the alarm sound
    const notifyUser = (message) => {
        console.log(`Playing alarm for message: ${message}`);
        audioRef.current.play().catch(err => console.error("Error playing audio:", err));
        alert(`Alarm: ${message}`);
    };

    // Fetch alarms and set up interval to check them
    useEffect(() => {
        const fetchAndCheckAlarms = async () => {
            await fetchAlarms();
            checkAlarms();
        };

        fetchAndCheckAlarms(); // Fetch alarms and check immediately
        const interval = setInterval(checkAlarms, 60000); // Check every minute
        
        return () => clearInterval(interval); // Clean up on unmount
    }, []); // Run this effect only once on mount

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
                        <button onClick={() => deleteAlarm(alarm._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
