const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

// Middleware that allows token via Authorization header OR query parameter (for direct file downloads/images)
function authenticateAdminOrTokenQuery(req, res, next) {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required to view secure files.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired file authorization token.'
    });
  }
}

// Protected admin routes
router.use('/applicants', authenticateAdmin);
router.get('/applicants', adminController.getApplicants);
router.get('/applicants/:id', adminController.getApplicantById);
router.patch('/applicants/:id/status', adminController.updateApplicationStatus);
router.post('/applicants/:id/notes', adminController.addInternalNote);

router.get('/metrics', authenticateAdmin, adminController.getMetrics);
router.get('/export-csv', authenticateAdmin, adminController.exportCsv);

// Secure file access (authenticated via Bearer or query token)
router.get('/files/:type/:filename', authenticateAdminOrTokenQuery, adminController.serveSecureFile);

module.exports = router;
