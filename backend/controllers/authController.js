const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log('[DEBUG] Registration request received for:', email);

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user
    console.log('[DEBUG] Creating new user...');
    const user = await User.create({
      name,
      email,
      password
    });
    console.log('[DEBUG] User created with ID:', user._id);

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    console.error('[DEBUG Error in registerUser]:', error.message);
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('[DEBUG] Login request received for:', email);

    // Check for user email
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('[DEBUG] User not found with email:', email);
      res.status(401);
      throw new Error('Invalid credentials');
    }

    console.log('[DEBUG] User found, checking password...');
    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      console.log('[DEBUG] Password matched! Generating token...');
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      console.log('[DEBUG] Password did NOT match.');
      res.status(401);
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    console.error('[DEBUG Error in loginUser]:', error.message);
    next(error);
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};
