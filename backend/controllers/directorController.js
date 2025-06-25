const { getAllTrainers, updateTrainerStatus } = require('../models/userModel');

exports.getAllTrainers = (req, res) => {
  getAllTrainers((err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch trainers' });
    res.json(rows);
  });
};

exports.setTrainerActiveStatus = (req, res) => {
  const { id } = req.params;
  const { active } = req.body;
  updateTrainerStatus(id, active, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update trainer status' });
    res.json({ message: 'Status updated' });
  });
};
