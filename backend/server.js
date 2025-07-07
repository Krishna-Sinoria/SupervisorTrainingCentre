// backend/server.js
const express = require('express');
const cors = require('cors');
const db = require('./db/database');

const authRoutes = require('./routes/authRoutes');
const traineeRoutes = require('./routes/traineeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const marksheetRoutes = require('./routes/marksheetRoutes');
const profileRoutes = require('./routes/profileRoutes');
const trainerRoutes = require('./routes/trainerRoutes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ✅ Simple test route (must come before other routes)
app.get('/api/ping', (req, res) => {
  res.send('✅ API is alive');
});

// ✅ Mount actual routes
app.use('/api/trainees', traineeRoutes);
app.use('/api', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api', marksheetRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/trainers', trainerRoutes);


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
