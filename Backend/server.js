const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/alarmClock');


const alarmSchema = new mongoose.Schema({
    time: String,
    message: String,
});

const Alarm = mongoose.model('Alarm', alarmSchema);

app.get('/api/alarms', async (req, res) => {
    const alarms = await Alarm.find();
    res.json(alarms);
});

app.post('/api/alarms', async (req, res) => {
    const alarm = new Alarm(req.body);
    await alarm.save();
    res.status(201).send(alarm);
});

app.delete('/api/alarms/:id', async (req, res) => {
    await Alarm.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
