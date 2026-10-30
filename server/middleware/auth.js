const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const { getDatabase } = require('../db/database');

function authenticateAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Administrator authentication token is missing.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const db = getDatabase();
    const user = db.getUserByEmail(decoded.email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session or administrator account no longer exists.'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication session. Please log in again.'
    });
  }
}

module.exports = {
  authenticateAdmin
};
