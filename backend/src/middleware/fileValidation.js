import multer from 'multer';
import path from 'path';
import config from '../config/env.js';

// Configure multer storage
const storage = multer.memoryStorage(); // Store in memory for processing

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = config.ALLOWED_FILE_TYPES.split(',');

  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
    error.status = 400;
    return cb(error, false);
  }

  cb(null, true);
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(config.MAX_FILE_SIZE)
  }
});

// Validation middleware
export const validateFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }
  next();
};
