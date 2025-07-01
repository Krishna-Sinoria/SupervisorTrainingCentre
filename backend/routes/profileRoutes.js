// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.post('/', profileController.saveProfile);
router.get('/', profileController.getAllProfiles);
router.get('/:id', profileController.getProfile);

module.exports = router;
