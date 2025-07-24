const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createBooking,
  updateBookingStatus,
  getMyBookings,
} = require('../controllers/bookingController');

// Book a session (patient)
router.post('/create', auth, createBooking);

// Update status (therapist)
router.put('/update/:id', auth, updateBookingStatus);

// Get all user bookings
router.get('/mine', auth, getMyBookings);

module.exports = router;