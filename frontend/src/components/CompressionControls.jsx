import { useState } from 'react';

const CompressionControls = ({ onCompress, isCompressing, fileName }) => {
  const [quality, setQuality] = useState(80);

  const handleCompress = () => {
    onCompress(quality);
  };

  const getQualityLabel = (value) => {
    if (value >= 90) return 'High Quality';
    if (value >= 70) return 'Balanced';
    if (value >= 50) return 'Moderate';
    return 'Maximum Compression';
  };

  const getQualityColor = (value) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 70) return 'text-blue-600';
    if (value >= 50) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className="card space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Selected Image
        </h3>
        <p className="text-sm text-slate-600 truncate">{fileName}</p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-slate-700">
            Compression Quality
          </label>
          <span className={`text-2xl font-bold ${getQualityColor(quality)}`}>
            {quality}%
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="100"
          value={quality}
          onChange={(e) => setQuality(parseInt(e.target.value))}
          className="input-range"
          disabled={isCompressing}
        />

        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>Max Compression</span>
          <span className={`font-medium ${getQualityColor(quality)}`}>
            {getQualityLabel(quality)}
          </span>
          <span>Best Quality</span>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 space-y-2">
        <h4 className="text-sm font-semibold text-slate-700">Quality Guide:</h4>
        <ul className="text-xs text-slate-600 space-y-1">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">•</span>
            <span><strong>90-100%:</strong> Best for printing, minimal compression</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span><strong>70-89%:</strong> Great for web, good balance</span>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-600 mr-2">•</span>
            <span><strong>50-69%:</strong> Smaller files, visible compression</span>
          </li>
          <li className="flex items-start">
            <span className="text-orange-600 mr-2">•</span>
            <span><strong>1-49%:</strong> Maximum compression, lower quality</span>
          </li>
        </ul>
      </div>

      <button
        onClick={handleCompress}
        disabled={isCompressing}
        className="btn-primary w-full"
      >
        {isCompressing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Compressing...
          </span>
        ) : (
          'Compress Image'
        )}
      </button>
    </div>
  );
};

export default CompressionControls;
