import { useState } from 'react';

// Compression presets
const PRESETS = {
  web: {
    name: 'Web Optimized',
    quality: 80,
    format: 'webp',
    lossless: false,
    description: 'Best for websites & social media',
    icon: '🌐'
  },
  email: {
    name: 'Email Friendly',
    quality: 65,
    format: 'jpeg',
    lossless: false,
    description: 'Smaller files for email attachments',
    icon: '📧'
  },
  print: {
    name: 'Print Quality',
    quality: 95,
    format: 'auto',
    lossless: true,
    description: 'High quality for printing',
    icon: '🖨️'
  },
  thumbnail: {
    name: 'Thumbnail',
    quality: 50,
    format: 'jpeg',
    lossless: false,
    description: 'Small previews & thumbnails',
    icon: '🖼️'
  }
};

const CompressionControls = ({ onCompress, isCompressing, fileName, originalFormat }) => {
  const [quality, setQuality] = useState(80);
  const [outputFormat, setOutputFormat] = useState('auto');
  const [lossless, setLossless] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);

  const handleCompress = () => {
    onCompress({
      quality: lossless ? 100 : quality,
      format: outputFormat,
      lossless
    });
  };

  const applyPreset = (presetKey) => {
    const preset = PRESETS[presetKey];
    setQuality(preset.quality);
    setOutputFormat(preset.format);
    setLossless(preset.lossless);
    setSelectedPreset(presetKey);
  };

  const handleQualityChange = (value) => {
    setQuality(parseInt(value));
    setSelectedPreset(null); // Clear preset when manually adjusting
  };

  const handleFormatChange = (format) => {
    setOutputFormat(format);
    setSelectedPreset(null);
  };

  const handleLosslessToggle = () => {
    setLossless(!lossless);
    setSelectedPreset(null);
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
    <div className="space-y-6">
      {/* File Info Card */}
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Selected Image
        </h3>
        <p className="text-sm text-slate-600 truncate">{fileName}</p>
        {originalFormat && (
          <p className="text-xs text-slate-500 mt-1">
            Format: {originalFormat.toUpperCase()}
          </p>
        )}
      </div>

      {/* Compression Presets */}
      <div className="card">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          ⚡ Quick Presets
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              disabled={isCompressing}
              className={`
                p-3 rounded-lg border-2 text-left transition-all
                ${selectedPreset === key
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-slate-200 hover:border-primary-300 bg-white'
                }
                ${isCompressing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{preset.icon}</span>
                <span className="font-semibold text-sm text-slate-700">
                  {preset.name}
                </span>
              </div>
              <p className="text-xs text-slate-500">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="card">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">
          🔧 Advanced Settings
        </h3>

        {/* Output Format Selection */}
        <div className="mb-4">
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Output Format
          </label>
          <select
            value={outputFormat}
            onChange={(e) => handleFormatChange(e.target.value)}
            disabled={isCompressing}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
          >
            <option value="auto">Auto (Keep Original)</option>
            <option value="jpeg">JPEG (Best for photos)</option>
            <option value="png">PNG (Best for graphics)</option>
            <option value="webp">WebP (Modern & efficient)</option>
          </select>
          <p className="text-xs text-slate-500 mt-1">
            {outputFormat === 'auto' && `Will output as ${originalFormat?.toUpperCase() || 'original format'}`}
            {outputFormat === 'jpeg' && 'Smaller files, good for photos'}
            {outputFormat === 'png' && 'Lossless, good for graphics with transparency'}
            {outputFormat === 'webp' && '25-35% smaller than JPEG, modern browsers'}
          </p>
        </div>

        {/* Lossless Toggle */}
        <div className="mb-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-sm font-medium text-slate-700">Lossless Compression</span>
              <p className="text-xs text-slate-500">Perfect quality preservation</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={lossless}
                onChange={handleLosslessToggle}
                disabled={isCompressing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </div>
          </label>
        </div>

        {/* Quality Slider (disabled if lossless) */}
        <div className={lossless ? 'opacity-50' : ''}>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-slate-700">
              Compression Quality
            </label>
            <span className={`text-2xl font-bold ${lossless ? 'text-green-600' : getQualityColor(quality)}`}>
              {lossless ? '100%' : `${quality}%`}
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="100"
            value={quality}
            onChange={(e) => handleQualityChange(e.target.value)}
            className="input-range"
            disabled={isCompressing || lossless}
          />

          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>Max Compression</span>
            <span className={`font-medium ${lossless ? 'text-green-600' : getQualityColor(quality)}`}>
              {lossless ? 'Lossless' : getQualityLabel(quality)}
            </span>
            <span>Best Quality</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-lg p-3 mt-4">
          <p className="text-xs text-blue-800">
            <strong>Tip:</strong> {lossless
              ? 'Lossless mode preserves perfect quality but may result in larger files.'
              : outputFormat === 'webp'
                ? 'WebP format offers the best compression - try it for web use!'
                : 'Use presets for quick optimization or adjust settings manually.'
            }
          </p>
        </div>
      </div>

      {/* Compress Button */}
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
