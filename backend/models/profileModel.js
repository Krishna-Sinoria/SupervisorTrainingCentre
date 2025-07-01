// models/profileModel.js
const db = require('../db/database');

// Create or Update Profile
const saveProfile = (profile, callback) => {
  const {
    id, name, email, phone, address,
    department, position, photo, role,
    joinDate, active
  } = profile;

  const query = `
    INSERT INTO profile (id, name, email, phone, address, department, position, photo, role, joinDate, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
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
  db.run(query, [id, name, email, phone, address, department, position, photo, role, joinDate, active], callback);
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
