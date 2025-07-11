const db = require('../db/database');

// Add new trainer
// Add new trainer and return inserted ID
function addTrainer(data, callback) {
  const { fullName, email, phone, designation, department } = data;
  const query = `
    INSERT INTO trainers (fullName, email, phone, designation, department)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.run(query, [fullName, email, phone, designation, department], function (err) {
    if (err) return callback(err);
    callback(null, this.lastID);  // Return just the ID
  });
}


// Get all trainers
function getAllTrainers(callback) {
  const query = `SELECT * FROM trainers ORDER BY id DESC`;
  db.all(query, [], callback);
}

// Get one trainer
function getTrainerById(id, callback) {
  const query = `SELECT * FROM trainers WHERE id = ?`;
  db.get(query, [id], callback);
}

// // Update trainer
 function updateTrainer(id, data, callback) {
//   const { fullName, email, phone, designation, department } = data;
//   const query = `
//     UPDATE trainers
//     SET fullName = ?, email = ?, phone = ?, designation = ?, department = ?
//     WHERE id = ?
//   `;
//   db.run(query, [fullName, email, phone, designation, department, id], function (err) {
//     callback(err, { changes: this?.changes });
//   });

const { fullName, email, phone, designation, department, active } = data;
const query = `
  UPDATE trainers
  SET fullName = ?, email = ?, phone = ?, designation = ?, department = ?, active = ?
  WHERE id = ?
`;
db.run(query, [fullName, email, phone, designation, department, active, id], function (err) {
  callback(err, { changes: this?.changes });
});
 }



// Delete trainer
function deleteTrainer(id, callback) {
  const query = `DELETE FROM trainers WHERE id = ?`;
  db.run(query, [id], function (err) {
    callback(err, { deleted: this?.changes });
  });
}

module.exports = {
  addTrainer,
  getAllTrainers,
  getTrainerById,
  updateTrainer,
  deleteTrainer
};
