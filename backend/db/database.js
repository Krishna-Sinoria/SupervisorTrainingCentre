// db/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to local database file
const db = new sqlite3.Database(path.join(__dirname, 'stc.db'), (err) => {
  if (err) return console.error('❌ Failed to connect to DB:', err.message);
  console.log('✅ Connected to SQLite database.');
});

db.serialize(() => {
  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('director', 'trainer')) NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating users table:', err.message);
    } else {
      console.log('✅ Users table ready.');
      db.get(`SELECT COUNT(*) AS count FROM users`, (err, row) => {
        if (err) return console.error('❌ Count check failed:', err.message);
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
    }
  });

  // Create profile table
db.run(`
  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    department TEXT,
    position TEXT,
    photo TEXT,
    role TEXT,
    joinDate TEXT,
    active INTEGER DEFAULT 1,
    FOREIGN KEY (userId) REFERENCES users(id)
  )
`, (err) => {
  if (err) {
    console.error('❌ Error creating profile table:', err.message);
  } else {
    console.log('✅ Profile table ready.');

    // 👉 Check if profiles already exist
    db.get(`SELECT COUNT(*) AS count FROM profile`, (err, row) => {
      if (err) return console.error('❌ Failed to count profiles:', err.message);

      if (row.count === 0) {
        // Insert default profiles for all users
        db.all(`SELECT * FROM users`, (err, users) => {
          if (err) return console.error('❌ Failed to fetch users:', err.message);

          const stmt = db.prepare(`
            INSERT INTO profile (
              userId, name, email, phone, address, department, position, photo, role, joinDate, active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);

          users.forEach(user => {
            stmt.run(
              user.id,
              user.name,
              user.email,
              '', // phone
              '', // address
              '', // department
              '', // position
              '', // photo
              user.role,
              '', // joinDate
              1   // active
            );
          });

          stmt.finalize();
          console.log('📄 Default profiles inserted for all users.');
        });
      } else {
        console.log('ℹ️ Profiles already exist. Skipping insert.');
      }
    });
  }
});



  // Drop old trainees table
  db.run(`DROP TABLE IF EXISTS trainees`, (err) => {
    if (err) {
      console.error('❌ Failed to drop old trainees table:', err.message);
    } else {
      console.log('🗑️ Old trainees table dropped.');
    }
  });

  // Create new trainees table
  db.run(`
    CREATE TABLE IF NOT EXISTS trainees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      photo TEXT,
      serialNo TEXT,
      fullName TEXT,
      fatherName TEXT,
      motherName TEXT,
      dateOfBirth TEXT,
      dateOfAppointment TEXT,
      dateOfSparing TEXT,
      category TEXT,
      bloodGroup TEXT,
      maritalStatus TEXT,
      employeeName TEXT,
      pfNumber TEXT,
      nationality TEXT,
      modeOfAppointment TEXT,
      batch TEXT,
      selectCategory TEXT,
      selectCourse TEXT,
      courseDuration TEXT,
      unit TEXT,
      customWorkingUnder TEXT,
      workingUnder TEXT,
      stationCode TEXT,
      phoneNumber TEXT,
      email TEXT,
      address TEXT,
      class10Marks TEXT,
      class12Marks TEXT,
      degreeType TEXT,
      degreeName TEXT,
      graduationMarks TEXT,
      trainerId TEXT
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating trainees table:', err.message);
    } else {
      console.log('✅ Trainees table ready.');
    }
  });

  // Drop old attendance table
  db.run(`DROP TABLE IF EXISTS attendance`, (err) => {
    if (err) {
      console.error('❌ Failed to drop old attendance table:', err.message);
    } else {
      console.log('🗑️ Old attendance table dropped.');
    }
  });

 // Attendance Table Creation
db.run(`
  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trainee_id TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Absent')),
    UNIQUE(trainee_id, date)
  )
`);

// Drop old marksheets table
  db.run(`DROP TABLE IF EXISTS marksheets`, (err) => {
    if (err) {
      console.error('❌ Failed to drop old marksheets table:', err.message);
    } else {
      console.log('🗑️ Old marksheets table dropped.');
    }
  });

//Marksheet Table Creation
db.run(`
    CREATE TABLE IF NOT EXISTS marksheets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      traineeId INTEGER NOT NULL,
      traineeName TEXT NOT NULL,
      trainerId TEXT NOT NULL,
      marks TEXT NOT NULL,
      total INTEGER NOT NULL,
      maxTotal INTEGER NOT NULL,
      percentage TEXT NOT NULL,
      grade TEXT NOT NULL,
      result TEXT NOT NULL,
      issuedDate TEXT NOT NULL
    )
  `);


});

module.exports = db;
