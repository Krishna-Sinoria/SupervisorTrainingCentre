const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create local database file
const db = new sqlite3.Database(path.join(__dirname, 'stc.db'), (err) => {
  if (err) return console.error(err.message);
  console.log('✅ Connected to SQLite database.');
});

// Create table for users (director + trainers)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('director', 'trainer')) NOT NULL
  )`);

  // Insert hardcoded users only if table is empty
  db.get(`SELECT COUNT(*) as count FROM users`, (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`);
      stmt.run('Director', 'director@stc.in', 'director123', 'director');
      stmt.run('Trainer One', 'trainer1@stc.in', 'trainer123', 'trainer');
      stmt.run('Trainer Two', 'trainer2@stc.in', 'trainer123', 'trainer');
      stmt.run('Trainer Three', 'trainer3@stc.in', 'trainer123', 'trainer');
      stmt.finalize();
      console.log('🧑‍💼 Default users added to DB');
    }
  });
});

module.exports = db;
