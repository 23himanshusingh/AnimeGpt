/* eslint-disable */
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

// Register a new user
exports.register = async (req, res) => {
  try {
    const email = String(req.body.email).trim().toLowerCase();
    const password = String(req.body.password);

    // Uniqueness check
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);

    // Whitelist only expected fields
    const user = new User({ email, password: hashed });
    await user.save();

    const token = signToken(user);
    return res.status(201).json({ token });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const email = String(req.body.email).trim().toLowerCase();
    const password = String(req.body.password);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = signToken(user);
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get current user info
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}; 