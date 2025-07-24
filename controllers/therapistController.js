const Therapist = require('../models/Therapist');

// Create new therapist profile
exports.createTherapist = async (req, res) => {
  try {
    const therapist = new Therapist(req.body);
    await therapist.save();
    res.status(201).json(therapist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all therapists
exports.getTherapists = async (req, res) => {
  try {
    const therapists = await Therapist.find();
    res.json(therapists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};