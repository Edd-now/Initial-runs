const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emoji: { type: String }, // optional
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Mood', moodSchema);