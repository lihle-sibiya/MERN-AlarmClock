const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/alarmClock', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
