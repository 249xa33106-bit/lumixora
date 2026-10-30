const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDatabase } = require('../db/database');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/config');

async function getSetupStatus(req, res) {
  try {
    const db = getDatabase();
    return res.status(200).json({
      success: true,
      hasAdmin: db.hasAdminUser()
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve setup status.'
    });
  }
}

async function setupInitialAdmin(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are all required.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.'
      });
    }

    const db = getDatabase();
    if (db.hasAdminUser()) {
      return res.status(400).json({
        success: false,
        message: 'An administrator account already exists. Please log in.'
      });
    }

    const user = db.createAdminUser({ email, password, name });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      success: true,
      message: 'Master administrator account created successfully.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Failed to setup administrator.'
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const db = getDatabase();
    const user = db.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'An unexpected internal error occurred during authentication.'
    });
  }
}

async function getMe(req, res) {
  try {
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve administrator profile.'
    });
  }
}

module.exports = {
  getSetupStatus,
  setupInitialAdmin,
  login,
  getMe
};
