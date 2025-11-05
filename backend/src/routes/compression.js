import express from 'express';
import { upload, validateFile } from '../middleware/fileValidation.js';
import {
  compressImageHandler,
  getImageInfoHandler,
  healthCheck
} from '../controllers/compressionController.js';

const router = express.Router();

/**
 * POST /api/compress/upload
 * Compress an uploaded image
 */
router.post('/upload', upload.single('image'), validateFile, compressImageHandler);

/**
 * POST /api/compress/info
 * Get information about an uploaded image
 */
router.post('/info', upload.single('image'), validateFile, getImageInfoHandler);

/**
 * GET /api/compress/health
 * Health check endpoint
 */
router.get('/health', healthCheck);

export default router;
