const User = require('../models/User');

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({
      message: 'It was lovely to have you with us. Your account has been deleted successfully.'
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete account', error: err.message });
  }
};
