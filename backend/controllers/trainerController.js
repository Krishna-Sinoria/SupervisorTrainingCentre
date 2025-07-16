const trainerModel = require('../models/trainerModel');

// CREATE
// exports.createTrainer = (req, res) => {
//   trainerModel.addTrainer(req.body, (err, result) => {
//     if (err) return res.status(500).json({ error: 'Failed to add trainer' });
//     res.status(201).json({ message: 'Trainer added', id: result.id });
//   });
// };

exports.createTrainer = (req, res) => {
  // Map frontend fields to backend expected fields
  const mappedData = {
    fullName: req.body.name || req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    designation: req.body.position || req.body.designation,
    department: req.body.department
  };

  // Check required fields
  if (!mappedData.fullName || !mappedData.email || !mappedData.designation) {
    return res.status(400).json({ error: 'Missing required fields: name, email, or position' });
  }

  trainerModel.addTrainer(mappedData, (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: 'Failed to add trainer' });
    }
    res.status(201).json({ message: 'Trainer added', id: result.id });
  });
};


// READ ALL
exports.getAllTrainers = (req, res) => {
  trainerModel.getAllTrainers((err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch trainers' });
    res.json(rows);
  });
};

// READ ONE
exports.getTrainerById = (req, res) => {
  trainerModel.getTrainerById(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch trainer' });
    if (!row) return res.status(404).json({ error: 'Trainer not found' });
    res.json(row);
  });
};

// UPDATE
// exports.updateTrainer = (req, res) => {
//   trainerModel.updateTrainer(req.params.id, req.body, (err, result) => {
//     if (err) return res.status(500).json({ error: 'Failed to update trainer' });
//     if (result.changes === 0) return res.status(404).json({ error: 'Trainer not found' });
//     res.json({ message: 'Trainer updated' });
//   });
// };


exports.updateTrainer = (req, res) => {
  // Map frontend fields to expected backend fields
  const mappedData = {
    fullName: req.body.name || req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    designation: req.body.position || req.body.designation,
    department: req.body.department,
    active: req.body.active ? 1 : 0 // If you want to update active column as well
  };

  trainerModel.updateTrainer(req.params.id, mappedData, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to update trainer' });
    if (result.changes === 0) return res.status(404).json({ error: 'Trainer not found' });
    res.json({ message: 'Trainer updated' });
  });
};

// DELETE
exports.deleteTrainer = (req, res) => {
  trainerModel.deleteTrainer(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete trainer' });
    if (result.deleted === 0) return res.status(404).json({ error: 'Trainer not found' });
    res.json({ message: 'Trainer deleted' });
  });
};

const { addTrainer } = require('../models/trainerModel');
const { createUserWithTrainerId } = require('../models/userModel');

exports.addTrainerWithUser = (req, res) => {
  const {
    fullName, email, phone, designation, department,
    password, position, address, joinDate, photo
  } = req.body;

  // 1. Add to trainers table
  addTrainer({ fullName, email, phone, designation, department }, (err, trainerId) => {
    if (err) return res.status(500).json({ error: 'Failed to add trainer' });

    // 2. Add to users table with linked trainerId
    const user = {
      name: fullName,
      email,
      password,
      role: 'trainer',
      position,
      phone,
      address,
      department,
      joinDate,
      photo,
      trainerId // 🔗 Foreign key
    };

    createUserWithTrainerId(user, (err2) => {
      if (err2) return res.status(500).json({ error: 'Failed to create user account' });

      res.status(201).json({ success: true, message: 'Trainer and user created successfully', id: trainerId });

    });
  });
};
