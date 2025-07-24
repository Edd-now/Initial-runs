const express = require('express');
const router = express.Router();
const therapistController = require('../controllers/therapistController');

router.post('/', therapistController.createTherapist);
router.get('/', therapistController.getTherapists);

module.exports = router;