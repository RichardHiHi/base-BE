const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const settingsRoutes = require('./routes/setting');
const attendanceRoutes = require('./routes/attendance');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/settings', settingsRoutes);
app.use('/attendance', attendanceRoutes);

module.exports = app;
