const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    bio,
    specialties,
    ratePerSession,
    currency,
    availableHours,
  } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ msg: 'Name, email, password, and role are required' });
  }

  try {
    // Check for existing user
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already in use' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Common user fields
    const userData = {
      name,
      email,
      password: hashed,
      role,
    };

    // Add therapist fields only if role is 'therapist'
    if (role === 'therapist') {
      userData.bio = bio || '';
      userData.specialties = specialties || [];
      userData.ratePerSession = ratePerSession;
      userData.currency = currency || 'NGN';
      userData.availableHours = availableHours || [];
    }

    const user = new User(userData);
    await user.save();

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
  
      // Create token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
  
      res.status(200).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  };