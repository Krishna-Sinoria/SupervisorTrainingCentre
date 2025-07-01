// controllers/marksheetController.js
const db = require('../db/database');

exports.saveMarksheet = (req, res) => {
  const {
    traineeId,
    traineeName,
    trainerId,
    marks,
    total,
    maxTotal,
    percentage,
    grade,
    result,
    issuedDate
  } = req.body;

  if (
    !traineeId ||
    !traineeName ||
    !trainerId ||
    !marks ||
    total == null ||
    maxTotal == null ||
    percentage == null ||
    !grade ||
    !result ||
    !issuedDate
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const marksJSON = JSON.stringify(marks);

  const query = `
    INSERT INTO marksheets (
      traineeId,
      traineeName,
      trainerId,
      marks,
      total,
      maxTotal,
      percentage,
      grade,
      result,
      issuedDate
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    traineeId,
    traineeName,
    trainerId,
    marksJSON,
    total,
    maxTotal,
    percentage,
    grade,
    result,
    issuedDate
  ];

  db.run(query, params, function(err) {
    if (err) {
      console.error('Error saving marksheet:', err);
      return res.status(500).json({ error: 'Failed to save marksheet' });
    }
    res.status(201).json({ message: 'Marksheet saved successfully', id: this.lastID });
  });
};
