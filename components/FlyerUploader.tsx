import React, { useRef, useState } from 'react';
import { Upload, X, FileImage, FileText } from 'lucide-react';

interface FlyerUploaderProps {
  onImageSelected: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
}

const FlyerUploader: React.FC<FlyerUploaderProps> = ({ onImageSelected, selectedImage, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    onImageSelected(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear();
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const isPdf = selectedImage?.type === 'application/pdf';

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,application/pdf"
        className="hidden"
      />

      {!selectedImage ? (
        <div
          onClick={triggerUpload}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all duration-300 h-64"
        >
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <Upload className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-lg font-semibold text-gray-700">チラシをアップロード</p>
          <p className="text-sm text-gray-500 mt-2 text-center">
            クリックしてファイルを選択するか、<br />カメラで撮影してください<br />
            <span className="text-xs text-gray-400">（画像またはPDFに対応）</span>
          </p>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
          <div className="aspect-video w-full bg-gray-100 relative flex items-center justify-center overflow-hidden">
             {isPdf ? (
                <div className="flex flex-col items-center justify-center text-gray-500 p-6">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                        <FileText className="w-12 h-12 text-red-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">PDFドキュメント</span>
                    <span className="text-xs text-gray-400 mt-1">プレビューは表示されません</span>
                </div>
             ) : previewUrl ? (
                <img src={previewUrl} alt="Flyer Preview" className="object-contain w-full h-full" />
             ) : (
                <FileImage className="w-12 h-12 text-gray-400" />
             )}
          </div>
          <div className="p-4 flex justify-between items-center bg-white border-t border-gray-100">
            <div className="flex items-center overflow-hidden mr-2">
                {isPdf ? <FileText className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" /> : <FileImage className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />}
                <span className="text-sm font-medium text-gray-700 truncate">
                {selectedImage.name}
                </span>
            </div>
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlyerUploader;