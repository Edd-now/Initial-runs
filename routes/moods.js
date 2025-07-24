const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');
const auth = require('../middleware/authMiddleware');

// Create a mood
router.post('/', auth, async (req, res) => {
  try {
    const mood = await Mood.create({
      name: req.body.name,
      emoji: req.body.emoji,
      user: req.user.id
    });
    res.status(201).json(mood);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create mood', error: err.message });
  }
});

// Get all moods for user
router.get('/', auth, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch moods', error: err.message });
  }
});

// Delete a mood
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Mood.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Mood not found' });
    res.json({ message: 'Mood deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete mood', error: err.message });
  }
});

module.exports = router;