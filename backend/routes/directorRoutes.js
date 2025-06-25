const express = require('express');
const router = express.Router();
const { getAllTrainers, setTrainerActiveStatus } = require('../controllers/directorController');

router.get('/trainers', getAllTrainers);
router.put('/trainers/:id/status', setTrainerActiveStatus);

module.exports = router;
