# Image Compressor Web App - Phase 1 MVP

A full-stack web application for compressing images with adjustable quality settings. Built with React, Express, and Sharp.

## 📚 Documentation

- **[README.md](README.md)** - You are here! Complete project overview
- **[TESTING.md](TESTING.md)** - Troubleshooting guide and testing checklist
- **[MVP-PLAN.md](MVP-PLAN.md)** - Development plan, fixes, and roadmap

## Features

- **Drag & Drop Upload**: Easy file upload with visual feedback
- **Adjustable Quality**: Slider control from 1-100% compression quality
- **Real-time Comparison**: Side-by-side preview of original vs compressed images
- **Detailed Statistics**: See file sizes, compression ratio, and space saved
- **Multiple Formats**: Support for JPEG, PNG, and WebP images
- **Secure**: File validation, size limits, rate limiting, and CORS protection
- **Fast**: In-memory processing with Sharp library

## Tech Stack

### Frontend
- React 18
- Vite (build tool)
- Tailwind CSS (styling)
- React Dropzone (file upload)
- Axios (HTTP client)

### Backend
- Node.js + Express
- Sharp (image processing)
- Multer (file upload handling)
- Helmet (security headers)
- Express Rate Limit (API protection)
- CORS (cross-origin requests)

## Project Structure

```
image-compressor/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Security & validation
│   │   ├── routes/         # API endpoints
│   │   └── utils/          # Image compression logic
│   ├── server.js           # Express server
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API client
│   │   ├── styles/         # CSS files
│   │   └── App.jsx         # Main component
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd image-compressor
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Running the Application

You'll need two terminal windows - one for backend, one for frontend.

### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
```

The backend will start on **http://localhost:5000**

You should see:
```
🚀 Server running on http://localhost:5000
📁 Environment: development
```

### Terminal 2: Start Frontend Dev Server

```bash
cd frontend
npm run dev
```

The frontend will start on **http://localhost:3000**

You should see:
```
VITE ready in XXX ms

➜  Local:   http://localhost:3000/
```

### 3. Open in Browser

Navigate to **http://localhost:3000** in your web browser.

## How to Use

1. **Upload an Image**
   - Drag & drop an image onto the upload area, OR
   - Click the upload area to browse files
   - Supported formats: JPG, PNG, WebP (max 10MB)

2. **Adjust Compression Quality**
   - Use the slider to set compression quality (1-100%)
   - Higher values = better quality, larger file size
   - Lower values = more compression, smaller file size

3. **Compress**
   - Click "Compress Image" button
   - Wait for processing (usually < 1 second)

4. **Download**
   - View the comparison between original and compressed
   - See detailed statistics (file sizes, compression ratio)
   - Click "Download" to save the compressed image
   - Click "New Image" to compress another file

## API Endpoints

### POST `/api/compress/upload`
Compress an uploaded image

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `image`: Image file (required)
  - `quality`: Number 1-100 (optional, default: 80)
  - `format`: Output format (optional, auto-detected)

**Response:**
- Content-Type: `image/jpeg|png|webp`
- Headers:
  - `X-Original-Size`: Original file size in bytes
  - `X-Compressed-Size`: Compressed file size in bytes
  - `X-Compression-Ratio`: Compression percentage

### POST `/api/compress/info`
Get information about an image

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `image`: Image file (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "width": 1920,
    "height": 1080,
    "format": "jpeg",
    "size": 524288,
    "channels": 3,
    "hasAlpha": false
  }
}
```

### GET `/api/health`
Health check endpoint

**Response:**
```json
{
  "status": "OK",
  "message": "Image Compressor API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Security Features

- **File Type Validation**: Only allows JPEG, PNG, and WebP files
- **File Size Limit**: Maximum 10MB per upload
- **Rate Limiting**: 10 requests per minute per IP
- **CORS Protection**: Only allows requests from localhost:3000
- **Security Headers**: Helmet.js middleware for HTTP security
- **Error Handling**: Sanitized error messages (no stack traces in production)
- **Memory Storage**: Files processed in memory (not saved to disk)

## Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,image/webp
FRONTEND_URL=http://localhost:3000
```

## Quality Guide

- **90-100%**: Best for printing, minimal visible compression
- **70-89%**: Recommended for web, great balance of quality/size
- **50-69%**: Good for thumbnails, visible compression
- **1-49%**: Maximum compression, lower quality

## Troubleshooting

### Backend won't start
- Make sure port 5000 is not in use
- Check that all dependencies are installed: `npm install`
- Verify .env file exists with correct values

### Frontend won't start
- Make sure port 3000 is not in use
- Check that all dependencies are installed: `npm install`
- Clear node_modules and reinstall if needed

### CORS errors
- Ensure backend is running on port 5000
- Ensure frontend is running on port 3000
- Check FRONTEND_URL in backend/.env matches frontend URL

### Image upload fails
- Check file size (must be < 10MB)
- Check file type (must be JPG, PNG, or WebP)
- Check browser console for detailed error messages

## Coming in Phase 2

- Lossless compression option
- Batch upload (multiple images)
- Format conversion (PNG to JPEG, etc.)
- Zip download for multiple files
- Enhanced compression algorithms

## Development

### Backend Development

The backend uses Node.js with `--watch` flag for auto-restart:

```bash
cd backend
npm run dev
```

### Frontend Development

Vite provides hot module replacement (HMR):

```bash
cd frontend
npm run dev
```

Changes to React components will update instantly in the browser.

## Building for Production

### Backend

The backend doesn't require a build step. Just run:

```bash
cd backend
npm start
```

### Frontend

Build optimized production files:

```bash
cd frontend
npm run build
```

This creates a `dist/` folder with optimized static files.

Preview the production build:

```bash
npm run preview
```

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
