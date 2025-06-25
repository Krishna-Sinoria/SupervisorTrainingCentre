const db = require('../db/database');

exports.findUserByEmail = (email, callback) => {
  db.get('SELECT * FROM users WHERE email = ?', [email], callback);
};

exports.createUser = (user, callback) => {
  const { id, name, email, password, role, position, phone, address, department, joinDate, photo } = user;
  db.run(
    `INSERT INTO users (id, name, email, password, role, position, phone, address, department, joinDate, photo) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, name, email, password, role, position, phone, address, department, joinDate, photo],
    callback
  );
};

exports.getAllTrainers = (callback) => {
  db.all('SELECT * FROM users WHERE role = "trainer"', callback);
};

exports.updateTrainerStatus = (id, active, callback) => {
  db.run('UPDATE users SET active = ? WHERE id = ?', [active, id], callback);
};
