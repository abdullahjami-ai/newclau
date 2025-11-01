import { compressImage, getImageInfo } from '../utils/imageCompressor.js';

/**
 * Handle image compression
 */
export const compressImageHandler = async (req, res, next) => {
  try {
    const { quality = 80, format, lossless = 'false' } = req.body;

    // Debug logging
    console.log('🔍 Compression Request:');
    console.log('  Quality:', quality);
    console.log('  Format:', format);
    console.log('  Lossless:', lossless);

    // Parse lossless parameter (comes as string from FormData)
    const isLossless = lossless === 'true' || lossless === true;

    // Validate quality (only if not lossless)
    const qualityNum = parseInt(quality);
    if (!isLossless && (isNaN(qualityNum) || qualityNum < 1 || qualityNum > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Quality must be between 1 and 100'
      });
    }

    // Get the uploaded file from multer
    const imageBuffer = req.file.buffer;
    const originalName = req.file.originalname;

    // Compress the image
    const result = await compressImage(imageBuffer, qualityNum, format, isLossless);

    // Set response headers
    const extension = result.metadata.compressed.format;
    const filename = `compressed_${Date.now()}_${originalName.split('.')[0]}.${extension}`;

    res.set({
      'Content-Type': `image/${extension}`,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'X-Original-Size': result.metadata.original.size,
      'X-Compressed-Size': result.metadata.compressed.size,
      'X-Compression-Ratio': result.metadata.compressionRatio,
      'X-Compression-Mode': result.metadata.mode,
      'X-Format-Converted': result.metadata.formatConverted
    });

    // Send the compressed image
    res.send(result.buffer);
  } catch (error) {
    next(error);
  }
};

/**
 * Get image information
 */
export const getImageInfoHandler = async (req, res, next) => {
  try {
    const imageBuffer = req.file.buffer;
    const info = await getImageInfo(imageBuffer);

    res.json({
      success: true,
      data: info
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Health check for compression service
 */
export const healthCheck = (req, res) => {
  res.json({
    success: true,
    message: 'Compression service is running',
    supportedFormats: ['jpeg', 'jpg', 'png', 'webp']
  });
};
