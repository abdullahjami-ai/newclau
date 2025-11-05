const ImageComparison = ({ originalFile, compressedBlob, compressionStats }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const originalSize = originalFile?.size || 0;
  const compressedSize = parseInt(compressionStats?.compressedSize) || 0;
  const compressionRatio = compressionStats?.compressionRatio || 0;
  const savedSize = originalSize - compressedSize;
  const savedPercentage = ((savedSize / originalSize) * 100).toFixed(1);

  const mode = compressionStats?.mode || 'lossy';
  const formatConverted = compressionStats?.formatConverted || false;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Compression Results
        </h3>
        <div className="flex gap-2">
          {mode === 'lossless' && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              ✨ Lossless
            </span>
          )}
          {formatConverted && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
              🔄 Converted
            </span>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-xs text-blue-600 font-medium mb-1">Original Size</p>
          <p className="text-2xl font-bold text-blue-700">{formatFileSize(originalSize)}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-xs text-green-600 font-medium mb-1">Compressed Size</p>
          <p className="text-2xl font-bold text-green-700">{formatFileSize(compressedSize)}</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-xs text-purple-600 font-medium mb-1">Space Saved</p>
          <p className="text-2xl font-bold text-purple-700">{formatFileSize(savedSize)}</p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-xs text-orange-600 font-medium mb-1">Reduction</p>
          <p className="text-2xl font-bold text-orange-700">{savedPercentage}%</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-slate-600 mb-2">
          <span>Compression Progress</span>
          <span className="font-semibold">{compressionRatio}% reduced</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${compressionRatio}%` }}
          />
        </div>
      </div>

      {/* Image Preview */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium text-slate-600 mb-2">Original</p>
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
            <img
              src={URL.createObjectURL(originalFile)}
              alt="Original"
              className="w-full h-48 object-contain"
            />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-600 mb-2">Compressed</p>
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
            <img
              src={URL.createObjectURL(compressedBlob)}
              alt="Compressed"
              className="w-full h-48 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageComparison;
