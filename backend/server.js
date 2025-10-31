import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compressionRoutes from './src/routes/compression.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { rateLimiter } from './src/middleware/rateLimiter.js';
import config, { debugEnv } from './src/config/env.js';

const app = express();
const PORT = config.PORT;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimiter);

// Routes
app.use('/api/compress', compressionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Image Compressor API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Environment: ${config.NODE_ENV}`);
  console.log(`📦 Max file size: ${config.MAX_FILE_SIZE} bytes`);

  // Show debug info if needed
  debugEnv();
});

export default app;
