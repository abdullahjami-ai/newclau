import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onFileSelect, disabled }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 1,
    maxSize: 10485760, // 10MB
    disabled
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
        transition-all duration-200
        ${isDragActive
          ? 'border-primary-500 bg-primary-50'
          : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-4">
        <svg
          className={`w-16 h-16 ${isDragActive ? 'text-primary-500' : 'text-slate-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        {isDragActive ? (
          <p className="text-lg font-medium text-primary-600">Drop your image here</p>
        ) : (
          <>
            <p className="text-lg font-medium text-slate-700">
              Drag & drop your image here
            </p>
            <p className="text-sm text-slate-500">
              or click to browse
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Supports: JPG, PNG, WebP (max 10MB)
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
