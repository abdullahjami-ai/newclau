import { useState } from 'react';
import FileUpload from './components/FileUpload';
import CompressionControls from './components/CompressionControls';
import ImageComparison from './components/ImageComparison';
import { compressImage } from './services/api';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressedBlob, setCompressedBlob] = useState(null);
  const [compressionStats, setCompressionStats] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState(null);
  const [originalFormat, setOriginalFormat] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setCompressedBlob(null);
    setCompressionStats(null);
    setError(null);

    // Detect original format from file type
    const format = file.type.split('/')[1];
    setOriginalFormat(format);
  };

  const handleCompress = async (options) => {
    if (!selectedFile) return;

    setIsCompressing(true);
    setError(null);

    try {
      const result = await compressImage(
        selectedFile,
        options.quality,
        options.format,
        options.lossless
      );

      setCompressedBlob(result.blob);
      setCompressionStats({
        originalSize: result.headers['x-original-size'],
        compressedSize: result.headers['x-compressed-size'],
        compressionRatio: result.headers['x-compression-ratio'],
        mode: result.headers['x-compression-mode'],
        formatConverted: result.headers['x-format-converted'] === 'true'
      });
    } catch (err) {
      console.error('Compression error:', err);

      // Handle blob error responses
      if (err.response?.data instanceof Blob) {
        const text = await err.response.data.text();
        try {
          const errorData = JSON.parse(text);
          setError(errorData.message || 'Failed to compress image. Please try again.');
        } catch {
          setError('Failed to compress image. Please try again.');
        }
      } else {
        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to compress image. Please check your connection and try again.'
        );
      }
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob) return;

    // Determine the correct file extension from the blob type
    const blobType = compressedBlob.type; // e.g., "image/webp"
    const extension = blobType.split('/')[1]; // e.g., "webp"

    // Get original filename without extension
    const originalName = selectedFile.name.split('.')[0];

    // Create new filename with correct extension
    const filename = `compressed_${originalName}.${extension}`;

    const url = URL.createObjectURL(compressedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setCompressedBlob(null);
    setCompressionStats(null);
    setError(null);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            Image Compressor
          </h1>
          <p className="text-lg text-slate-600">
            Compress your images with adjustable quality - Fast, secure, and free
          </p>
          <div className="flex justify-center gap-3 mt-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No upload to server (stays local)
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100% Free
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Fast Processing
            </span>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <FileUpload
              onFileSelect={handleFileSelect}
              disabled={isCompressing}
            />

            {selectedFile && !compressedBlob && (
              <CompressionControls
                onCompress={handleCompress}
                isCompressing={isCompressing}
                fileName={selectedFile.name}
                originalFormat={originalFormat}
              />
            )}

            {compressedBlob && (
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="btn-primary flex-1"
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </span>
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary"
                >
                  New Image
                </button>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            {compressedBlob && selectedFile && (
              <ImageComparison
                originalFile={selectedFile}
                compressedBlob={compressedBlob}
                compressionStats={compressionStats}
              />
            )}

            {!selectedFile && (
              <div className="card text-center py-12">
                <svg className="w-24 h-24 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-slate-600 mb-2">
                  No Image Selected
                </h3>
                <p className="text-sm text-slate-500">
                  Upload an image to get started
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-500">
          <p>Built with React, Express, and Sharp • Phase 2 🚀</p>
          <p className="text-xs mt-1">Features: Format Conversion • Lossless Compression • Quick Presets</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
