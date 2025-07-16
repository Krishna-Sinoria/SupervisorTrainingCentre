const express = require('express');
const router = express.Router();
const db = require('../db/database'); // ✅ REQUIRED to query trainerId
const { addTrainee, getAllTrainees } = require('../models/traineeModel');
//const { authenticate, requireRole } = require('../middleware.js/authMiddleware');


// ==============================
// TEMP TEST ROUTE
// GET /api/trainees/test
// ==============================
router.get('/test', (req, res) => {
  res.send('✅ Trainee route is working!');
});

// ==============================
// GET /api/trainees
// → Fetch all trainees
// ==============================
router.get('/', (req, res) => {
  getAllTrainees((err, trainees) => {
    if (err) {
      console.error('❌ Error fetching trainees:', err.message);
      return res.status(500).json({ error: 'Failed to fetch trainees' });
    }
    res.status(200).json(trainees);
  });
});

// ==============================
// POST /api/trainees
// → Add a new trainee
// ==============================
router.post('/', (req, res) => {
  const traineeData = req.body;
  const requiredFields = [
    'serialNo', 'fullName', 'fatherName', 'motherName', 'dateOfBirth',
    'dateOfAppointment', 'dateOfSparing', 'category', 'bloodGroup', 'maritalStatus',
    'employeeName', 'pfNumber', 'modeOfAppointment',
    'batch', 'selectCategory', 'selectCourse',
    'unit', 'workingUnder', 'stationCode',
    'phoneNumber', 'email', 'address',
    'class10Marks', 'class12Marks', 'degreeType', 'degreeName', 'graduationMarks'
  ];

  // const missingFields = requiredFields.filter(field => !traineeData[field]);
  // if (missingFields.length > 0) {
  //   return res.status(400).json({
  //     error: `Missing required fields: ${missingFields.join(', ')}`
  //   });
  // }

  const missingFields = requiredFields.filter(field => {
  if (field === 'workingUnder' && req.body.trainerId) {
    return false; // skip check for workingUnder if trainerId already present
  }
  return !traineeData[field];
});

  // Step 2: Map trainer name to trainerId (unless already provided)
  if (!traineeData.trainerId && traineeData.workingUnder !== 'Other') {
    const trainerName = traineeData.workingUnder;
   // const query = `SELECT id FROM users WHERE name = ? AND role = 'trainer' LIMIT 1`;
   const query = `SELECT id FROM trainers WHERE fullName = ? LIMIT 1`;
 
    db.get(query, [trainerName], (err, row) => {
      if (err) {
        console.error('❌ DB Error fetching trainerId:', err.message);
        return res.status(500).json({ error: 'Trainer lookup failed' });
      }

      traineeData.trainerId = row?.id || '';
      // console.log("🧾 [LOOKUP] Final traineeData before insert:", traineeData); // ✅ log here

      addTrainee(traineeData, (err, id) => {
        if (err) {
          console.error('❌ Error saving trainee:', err.message);
          return res.status(500).json({ error: 'Failed to save trainee.' });
        }
        res.status(201).json({ message: '✅ Trainee added successfully', id });
      });
    });
  } else {
    // ✅ Trainer already set manually (like for director)
    // console.log("🧾 [NO LOOKUP] Final traineeData before insert:", traineeData); // ✅ log here too

    addTrainee(traineeData, (err, id) => {
      if (err) {
        console.error('❌ Error saving trainee:', err.message);
        return res.status(500).json({ error: 'Failed to save trainee.' });
      }
      res.status(201).json({ message: '✅ Trainee added successfully', id });
    });
  }
  
});
 



// router.get('/assigned', authenticate, requireRole('trainer'), (req, res) => {
//   const trainerId = req.user.id.toString(); // ensure string
//   const query = `SELECT * FROM trainees WHERE trainerId = ?`;

//   db.all(query, [trainerId], (err, rows) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(rows);
//   });
// });


module.exports = router;


db.all(`PRAGMA table_info(users)`, [], (err, rows) => {
  console.log("Users table schema:");
  console.table(rows);
});
