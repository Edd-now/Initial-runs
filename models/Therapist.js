const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    default: '',
  },
  specialties: {
    type: [String],
    default: [],
  },
  ratePerSession: {
    type: Number,
    required: true, // since they'll be charging
  },
  currency: {
    type: String,
    default: 'NGN',
  },
  availableHours: {
    type: [String],
    default: [],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      rating: Number,
      comment: String,
    },
  ],
}, {
  timestamps: true
});

module.exports = mongoose.model('Therapist', therapistSchema);