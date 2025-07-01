// routes/marksheetRoutes.js
const express = require('express');
const router = express.Router();
const marksheetController = require('../controllers/marksheetController');

router.post('/marksheet', marksheetController.saveMarksheet);

module.exports = router;
