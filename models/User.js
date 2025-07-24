const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['patient', 'therapist'], required: true },//added this before we got the extra info on therapists, can be removed
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);