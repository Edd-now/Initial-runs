const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  setAvailability,
  getAvailability
} = require('../controllers/availabilityController');

router.post('/set', auth, setAvailability); // therapist only
router.get('/:therapistId', auth, getAvailability); // for patient to view

module.exports = router;