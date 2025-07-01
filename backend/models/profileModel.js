// models/profileModel.js
const db = require('../db/database');

// Create or Update Profile
const saveProfile = (profile, callback) => {
  const {
    userId, name, email, phone, address,
    department, position, photo, role,
    joinDate, active
  } = profile;

  const query = `
    INSERT INTO profile (userId, name, email, phone, address, department, position, photo, role, joinDate, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(userId) DO UPDATE SET
      name = excluded.name,
      email = excluded.email,
      phone = excluded.phone,
      address = excluded.address,
      department = excluded.department,
      position = excluded.position,
      photo = excluded.photo,
      role = excluded.role,
      joinDate = excluded.joinDate,
      active = excluded.active
  `;
  db.run(query, [userId, name, email, phone, address, department, position, photo, role, joinDate, active], (err) => {
    if (err) {
      console.error('❌ DB error in saveProfile():', err.message); // <-- add this line
    }
    callback(err);
  });
};

// Get Profile by ID
const getProfileById = (id, callback) => {
  const query = `SELECT * FROM profile WHERE id = ?`;
  db.get(query, [id], callback);
};

const getAllProfiles = (callback) => {
  db.all(`SELECT * FROM profile ORDER BY name`, [], callback);
};

module.exports = {
  saveProfile,
  getProfileById,
  getAllProfiles
};
