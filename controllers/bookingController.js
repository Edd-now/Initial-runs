const Booking = require('../models/Booking');
const Availability = require('../models/Availability');

// Patient requests a booking
exports.createBooking = async (req, res) => {
    const { therapistId, scheduledTime, notes } = req.body;
    const patientId = req.user.id;
  
    try {
      const booking = new Booking({
        patient: patientId,
        therapist: therapistId,
        scheduledTime,
        notes,
      });
  
      // Extract date + hour:min to match against availability
      const scheduledDate = new Date(scheduledTime);
      const dateOnly = scheduledDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const hourMin = scheduledDate.toTimeString().slice(0, 5); // HH:MM
  
      // Find therapist availability for that date
      const availability = await Availability.findOne({
        therapist: therapistId,
        date: new Date(dateOnly),
      });
  
      if (!availability) {
        return res.status(400).json({ msg: 'No availability found for selected date' });
      }
  
      // Find slot matching the start time
      const slot = availability.timeSlots.find(
        (slot) => slot.start === hourMin && slot.isBooked === false
      );
  
      if (!slot) {
        return res.status(400).json({ msg: 'Selected time slot is unavailable or already booked' });
      }
  
      // Mark it as booked
      slot.isBooked = true;
      await availability.save();

      // Generate unique video room link
const crypto = require('crypto');
const roomId = crypto.randomBytes(6).toString('hex'); // short + random
booking.videoRoomLink = `https://meet.jit.si/headnest-${roomId}`;
  
      // Save booking
      await booking.save();
  
      res.status(201).json({ msg: 'Booking confirmed and slot reserved', booking });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Booking failed' });
    }
  };

// Therapist updates status

exports.updateBookingStatus = async (req, res) => {
    const { id } = req.params;
    const { status, newTime } = req.body;
  
    try {
      const booking = await Booking.findById(id);
      if (!booking) return res.status(404).json({ msg: 'Booking not found' });
  
      // Free up original slot
      const originalDate = new Date(booking.scheduledTime);
      const originalDateOnly = originalDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const originalTime = originalDate.toTimeString().slice(0, 5); // HH:MM
  
      const availability = await Availability.findOne({
        therapist: booking.therapist,
        date: new Date(originalDateOnly),
        
      });
      const Notification = require('../models/Notification');

let notifMessage = '';
if (status === 'accepted') {
  notifMessage = 'Your session was accepted by the therapist.';
} else if (status === 'declined') {
  notifMessage = 'Your session was declined by the therapist.';
} else if (status === 'rescheduled') {
  notifMessage = `Your session was rescheduled to ${new Date(newTime).toLocaleString()}.`;
}

if (notifMessage) {
  await Notification.create({
    user: booking.patient,
    message: notifMessage,
    link: `/bookings/${booking._id}`
  });
}
  
      if (availability) {
        const originalSlot = availability.timeSlots.find(
          (slot) => slot.start === originalTime
        );
        if (originalSlot) originalSlot.isBooked = false;
      }
  
      if (status === 'rescheduled') {
        if (!newTime) return res.status(400).json({ msg: 'New time required for reschedule' });
  
        // Update new time
        booking.scheduledTime = newTime;
  
        // Book new slot
        const newDate = new Date(newTime);
        const newDateOnly = newDate.toISOString().split('T')[0];
        const newTimeOnly = newDate.toTimeString().slice(0, 5);
  
        let newAvailability = await Availability.findOne({
          therapist: booking.therapist,
          date: new Date(newDateOnly),
        });
  
        if (!newAvailability) {
          return res.status(400).json({ msg: 'No availability found for new time' });
        }
  
        const newSlot = newAvailability.timeSlots.find(
          (slot) => slot.start === newTimeOnly && slot.isBooked === false
        );
  
        if (!newSlot) {
          return res.status(400).json({ msg: 'New time slot unavailable or already booked' });
        }
  
        newSlot.isBooked = true;
        await newAvailability.save();
      }
  
      booking.status = status;
      await booking.save();
      if (availability) await availability.save();
  
      res.status(200).json({ msg: 'Booking updated', booking });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Failed to update booking' });
    }
  };

// Get all bookings for a user
exports.getMyBookings = async (req, res) => {
  const userId = req.user.id;

  try {
    const bookings = await Booking.find({
      $or: [{ patient: userId }, { therapist: userId }],
    })
      .populate('patient', 'name email')
      .populate('therapist', 'name email')
      .sort({ scheduledTime: 1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to retrieve bookings' });
  }
};