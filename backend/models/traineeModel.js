const db = require('../db/database');

// ✅ Add new trainee
function addTrainee(data, callback) {
  const query = `
    INSERT INTO trainees (
      photo, serialNo, fullName, fatherName, motherName,
      dateOfBirth, dateOfAppointment, dateOfSparing, category, bloodGroup,
      maritalStatus, employeeName, pfNumber, nationality, modeOfAppointment,
      batch, selectCategory, selectCourse, courseDuration, unit,
      customWorkingUnder, workingUnder, stationCode, phoneNumber, email,
      address, class10Marks, class12Marks, degreeType, degreeName,
      graduationMarks, trainerId
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.photo || '',
    data.serialNo,
    data.fullName,
    data.fatherName,
    data.motherName,
    data.dateOfBirth,
    data.dateOfAppointment,
    data.dateOfSparing,
    data.category,
    data.bloodGroup,
    data.maritalStatus,
    data.employeeName,
    data.pfNumber,
    data.nationality || 'Indian',
    data.modeOfAppointment,
    data.batch,
    data.selectCategory,
    data.selectCourse,
    data.courseDuration || '',
    data.unit,
    data.customWorkingUnder || '',
    data.workingUnder,
    data.stationCode,
    data.phoneNumber,
    data.email,
    data.address,
    data.class10Marks,
    data.class12Marks,
    data.degreeType,
    data.degreeName,
    data.graduationMarks,
    Number(data.trainerId)
  ];

  db.run(query, values, function (err) {
    callback(err, this?.lastID);
  });
}

// ✅ Get all trainees
function getAllTrainees(callback) {
  db.all('SELECT * FROM trainees', [], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
}

// ✅ Delete trainee by ID
function deleteTrainee(id, callback) {
  db.run('DELETE FROM trainees WHERE id = ?', [id], callback);
}

// ✅ Update trainee by ID
function updateTrainee(id, updates, callback) {
  const fields = Object.keys(updates);
  const values = Object.values(updates);

  const query = `
    UPDATE trainees
    SET ${fields.map(field => `${field} = ?`).join(', ')}
    WHERE id = ?
  `;

  db.run(query, [...values, id], callback);
}

module.exports = {
  addTrainee,
  getAllTrainees,
  deleteTrainee,
  updateTrainee
};
