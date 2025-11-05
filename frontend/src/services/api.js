import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Compress an image
 * @param {File} file - The image file to compress
 * @param {number} quality - Compression quality (1-100)
 * @param {string} format - Output format (optional)
 * @param {boolean} lossless - Use lossless compression (optional)
 * @returns {Promise}
 */
export const compressImage = async (file, quality, format = null, lossless = false) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('quality', quality);
  formData.append('lossless', lossless.toString());

  if (format && format !== 'auto') {
    formData.append('format', format);
  }

  const response = await axios.post(`${API_BASE_URL}/compress/upload`, formData, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return {
    blob: response.data,
    headers: response.headers
  };
};

/**
 * Get image information
 * @param {File} file - The image file
 * @returns {Promise}
 */
export const getImageInfo = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axios.post(`${API_BASE_URL}/compress/info`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};

/**
 * Check API health
 * @returns {Promise}
 */
export const checkHealth = async () => {
  const response = await axios.get(`${API_BASE_URL}/health`);
  return response.data;
};
