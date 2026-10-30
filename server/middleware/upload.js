const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { PHOTOS_DIR, DOCUMENTS_DIR, MAX_PHOTO_SIZE, MAX_DOC_SIZE } = require('../config/config');

// Safe disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'photo') {
      cb(null, PHOTOS_DIR);
    } else {
      cb(null, DOCUMENTS_DIR);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = `${Date.now()}_${uuidv4().substring(0, 8)}`;
    cb(null, `${file.fieldname}_${safeBase}${ext}`);
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === 'photo') {
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];

    if (allowedExts.includes(ext) && allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid photo format. Only JPG, JPEG, PNG, and WEBP files are allowed. Received: ${file.mimetype}`));
    }
  } else {
    // Document uploads
    const allowedExts = ['.pdf'];
    const allowedMimes = ['application/pdf'];

    if (allowedExts.includes(ext) && allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid document format for ${file.fieldname}. Only PDF files are accepted. Received: ${file.mimetype}`));
    }
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: Math.max(MAX_PHOTO_SIZE, MAX_DOC_SIZE), // 5MB
    files: 5 // max 5 files total per submission
  },
  fileFilter
});

const uploadFields = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
  { name: 'certificates', maxCount: 1 },
  { name: 'portfolioDoc', maxCount: 1 },
  { name: 'additionalDoc', maxCount: 1 }
]);

// Wrapper to catch multer errors gracefully
function handleUpload(req, res, next) {
  uploadFields(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'One or more uploaded files exceed the maximum allowed size of 5 MB.'
        });
      }
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
}

module.exports = {
  handleUpload
};
