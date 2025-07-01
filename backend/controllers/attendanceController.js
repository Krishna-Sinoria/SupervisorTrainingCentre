const Attendance = require('../models/attendanceModel');

// POST /api/attendance
const markAttendance = (req, res) => {
  const { trainee_id, date, status } = req.body;

  if (!trainee_id || !date || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  Attendance.markAttendance(trainee_id, date, status, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to mark attendance' });
    }
    res.json({ success: true });
  });
};

// GET /api/attendance/:trainee_id
const getTraineeAttendance = (req, res) => {
  const { trainee_id } = req.params;
  Attendance.getAttendanceByTrainee(trainee_id, (err, records) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch attendance' });
    }
    res.json(records);
  });
};

const getAllAttendance = (req, res) => {
  Attendance.getAllAttendance((err, records) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch attendance' });
    }
    res.json(records);
  });
};
module.exports = {
  markAttendance,
  getTraineeAttendance,
  getAllAttendance
};
