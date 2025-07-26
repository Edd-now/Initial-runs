const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['patient', 'therapist'], required: true },

    // Therapist-only fields
    bio: { type: String, default: '' },
    specialties: { type: [String], default: [] },
    ratePerSession: { type: Number }, // optional unless role === therapist
    currency: { type: String, default: 'NGN' },
    availableHours: { type: [String], default: [] },
    ratings: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: Number,
        comment: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);