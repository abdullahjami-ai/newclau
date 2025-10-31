import sharp from 'sharp';

/**
 * Compress image with specified quality
 * @param {Buffer} imageBuffer - The image buffer
 * @param {number} quality - Quality percentage (1-100)
 * @param {string} format - Output format (jpeg, png, webp)
 * @returns {Promise<{buffer: Buffer, metadata: Object}>}
 */
export const compressImage = async (imageBuffer, quality = 80, format = null) => {
  try {
    // Get original metadata
    const metadata = await sharp(imageBuffer).metadata();

    // Determine output format
    const outputFormat = format || metadata.format;

    let compressor = sharp(imageBuffer);

    // Apply compression based on format
    switch (outputFormat) {
      case 'jpeg':
      case 'jpg':
        compressor = compressor.jpeg({
          quality: parseInt(quality),
          progressive: true,
          mozjpeg: true // Use mozjpeg for better compression
        });
        break;

      case 'png':
        compressor = compressor.png({
          quality: parseInt(quality),
          compressionLevel: 9,
          adaptiveFiltering: true
        });
        break;

      case 'webp':
        compressor = compressor.webp({
          quality: parseInt(quality),
          effort: 6 // Higher effort = better compression
        });
        break;

      default:
        throw new Error(`Unsupported format: ${outputFormat}`);
    }

    // Get compressed buffer
    const compressedBuffer = await compressor.toBuffer();

    // Get new metadata
    const newMetadata = await sharp(compressedBuffer).metadata();

    return {
      buffer: compressedBuffer,
      metadata: {
        original: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          size: imageBuffer.length
        },
        compressed: {
          width: newMetadata.width,
          height: newMetadata.height,
          format: newMetadata.format,
          size: compressedBuffer.length
        },
        compressionRatio: ((1 - compressedBuffer.length / imageBuffer.length) * 100).toFixed(2)
      }
    };
  } catch (error) {
    throw new Error(`Image compression failed: ${error.message}`);
  }
};

/**
 * Get image information without compression
 * @param {Buffer} imageBuffer - The image buffer
 * @returns {Promise<Object>}
 */
export const getImageInfo = async (imageBuffer) => {
  try {
    const metadata = await sharp(imageBuffer).metadata();

    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: imageBuffer.length,
      space: metadata.space,
      channels: metadata.channels,
      hasAlpha: metadata.hasAlpha
    };
  } catch (error) {
    throw new Error(`Failed to get image info: ${error.message}`);
  }
};
