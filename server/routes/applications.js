const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { handleUpload } = require('../middleware/upload');

// Public endpoints for applicants
router.post('/apply', handleUpload, applicationController.submitApplication);
router.post('/track', applicationController.trackApplication);

module.exports = router;
