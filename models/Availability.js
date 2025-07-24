const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema(
  {
    therapist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    timeSlots: [
      {
        start: { type: String, required: true }, // e.g., "14:00"
        end: { type: String, required: true },   // e.g., "15:00"
        isBooked: { type: Boolean, default: false }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Availability', AvailabilitySchema);