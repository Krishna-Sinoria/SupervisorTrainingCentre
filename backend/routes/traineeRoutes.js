// routes/traineeRoutes.js

const express = require('express');
const router = express.Router();
const { addTrainee, getAllTrainees } = require('../models/traineeModel');

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
  console.log('📥 Incoming trainee data:', req.body);
  const traineeData = req.body;

  // ✅ Correct required fields list
  const requiredFields = [
    // Personal Info
    'serialNo', 'fullName', 'fatherName', 'motherName', 'dateOfBirth',

    // Appointment Info
    'dateOfAppointment', 'dateOfSparing', 'category', 'bloodGroup', 'maritalStatus',
    'employeeName', 'pfNumber', 'modeOfAppointment',

    // Course Info
    'batch', 'selectCategory', 'selectCourse',

    // Working Info
    'unit', 'workingUnder', 'stationCode',

    // Contact Info
    'phoneNumber', 'email', 'address',

    // Qualification Info
    'class10Marks', 'class12Marks', 'degreeType', 'degreeName', 'graduationMarks'
  ];

  const missingFields = requiredFields.filter(field => !traineeData[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  // ✅ Insert into DB
  addTrainee(traineeData, (err, id) => {
    if (err) {
      console.error('❌ Error saving trainee:', err.message);
      return res.status(500).json({ error: 'Failed to save trainee.' });
    }

    res.status(201).json({ message: '✅ Trainee added successfully', id });
  });
});

module.exports = router;
