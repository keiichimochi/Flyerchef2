import React from 'react';
import { Sparkles } from 'lucide-react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      <div className="relative">
        <div className="absolute inset-0 bg-orange-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <div className="relative bg-white p-4 rounded-full shadow-lg">
          <Sparkles className="w-10 h-10 text-orange-500 animate-spin-slow" />
        </div>
      </div>
      <h3 className="mt-6 text-xl font-bold text-gray-800">チラシを解析中...</h3>
      <p className="text-gray-500 mt-2 text-center max-w-xs">
        Geminiが特売品を見つけて、あなたにぴったりのレシピを考えています
      </p>
      
      <div className="mt-8 flex space-x-2">
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default LoadingOverlay;