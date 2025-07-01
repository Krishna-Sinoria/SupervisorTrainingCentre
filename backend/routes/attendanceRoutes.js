const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/', attendanceController.markAttendance);
router.get('/', attendanceController.getAllAttendance); 
router.get('/:trainee_id', attendanceController.getTraineeAttendance);

module.exports = router;
