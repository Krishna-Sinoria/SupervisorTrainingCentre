const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');

router.post('/', trainerController.createTrainer);
router.get('/', trainerController.getAllTrainers);
router.get('/:id', trainerController.getTrainerById);
router.put('/:id', trainerController.updateTrainer);
router.delete('/:id', trainerController.deleteTrainer);
router.post('/addWithUser', trainerController.addTrainerWithUser);


module.exports = router;

