const User = require('../models/User');

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};

exports.getAllTherapists = async (req, res) => {
    try {
      const therapists = await User.find({ role: 'therapist' }).select('-password');
      res.json(therapists);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch therapists', error: err.message });
    }
  };
  
  exports.getTherapistById = async (req, res) => {
    try {
      const therapist = await User.findById(req.params.id).select('-password');
      if (!therapist || therapist.role !== 'therapist') {
        return res.status(404).json({ message: 'Therapist not found' });
      }
      res.json(therapist);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch therapist', error: err.message });
    }
  };

exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({
      message: 'It was lovely to have you with us. Your account has been deleted successfully.'
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete account', error: err.message });
  }
};
