const db = require('../db/database');


// Insert or Update Attendance
const markAttendance = (traineeId, date, status, callback) => {
  const query = `
    INSERT INTO attendance (trainee_id, date, status)
    VALUES (?, ?, ?)
    ON CONFLICT(trainee_id, date) DO UPDATE SET status = excluded.status
  `;
  db.run(query, [traineeId, date, status], callback);
};

// Get Attendance by Trainee ID
const getAttendanceByTrainee = (traineeId, callback) => {
  const query = `SELECT * FROM attendance WHERE trainee_id = ? ORDER BY date ASC`;
  db.all(query, [traineeId], callback);
};

// Get Attendance for a Specific Date (optional)
const getAttendanceByDate = (date, callback) => {
  const query = `SELECT * FROM attendance WHERE date = ?`;
  db.all(query, [date], callback);
};

const getAllAttendance = (callback) => {
  const query = `SELECT * FROM attendance ORDER BY date DESC`;
  db.all(query, [], callback);
};


module.exports = {
  markAttendance,
  getAttendanceByTrainee,
  getAttendanceByDate,
  getAllAttendance
};
