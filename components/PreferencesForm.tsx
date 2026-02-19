import React, { useRef } from 'react';
import { CuisineType, UserPreferences } from '../types';
import { Utensils, Coins } from 'lucide-react';

interface PreferencesFormProps {
  preferences: UserPreferences;
  onPreferencesChange: (prefs: UserPreferences) => void;
  disabled?: boolean;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ preferences, onPreferencesChange, disabled }) => {
  const cuisineOptions = Object.values(CuisineType);
  const budgetPresets = [500, 1000, 1500, 2000];
  const inputRef = useRef<HTMLInputElement>(null);

  // 予算がプリセット値に含まれているか確認
  const isPresetSelected = (amount: number) => preferences.budget === amount;
  
  // 「任意」が選択されているか（プリセットに含まれていない値の場合）
  const isCustomSelected = !budgetPresets.includes(preferences.budget);

  const handleCuisineSelect = (c: CuisineType) => {
    onPreferencesChange({ ...preferences, cuisine: c });
  };

  const handleBudgetPreset = (amount: number) => {
    onPreferencesChange({ ...preferences, budget: amount });
  };

  const handleCustomBudgetSelect = () => {
    // 任意ボタンを押したら、入力フィールドにフォーカス
    inputRef.current?.focus();
    // 値は維持するか、必要ならリセットするが、ここでは維持して編集させるスタイルにする
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    onPreferencesChange({ ...preferences, budget: isNaN(val) ? 0 : val });
  };

  const handleCustomCuisineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPreferencesChange({ ...preferences, customCuisine: e.target.value });
  };

  return (
    <div className="space-y-8">
      {/* Budget Section */}
      <div className="space-y-4">
        <label className="flex items-center space-x-2 text-gray-800 font-bold text-lg">
          <Coins className="w-6 h-6 text-orange-500" />
          <span>予算 (円)</span>
        </label>
        
        <div className="flex flex-wrap gap-3">
          {budgetPresets.map((amount) => (
            <button
              key={amount}
              onClick={() => handleBudgetPreset(amount)}
              disabled={disabled}
              className={`flex-1 min-w-[80px] py-3 px-2 rounded-lg text-base font-bold transition-all shadow-sm ${
                isPresetSelected(amount)
                  ? 'bg-orange-500 text-white shadow-md ring-2 ring-orange-300 ring-offset-1 transform scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              {amount}
            </button>
          ))}
          <button
            onClick={handleCustomBudgetSelect}
            disabled={disabled}
            className={`flex-1 min-w-[80px] py-3 px-2 rounded-lg text-base font-bold transition-all shadow-sm ${
              isCustomSelected
                ? 'bg-orange-500 text-white shadow-md ring-2 ring-orange-300 ring-offset-1 transform scale-105'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600'
            }`}
          >
            任意
          </button>
        </div>

        <div className={`relative transition-all duration-300 ${isCustomSelected ? 'opacity-100 max-h-20' : 'opacity-60 max-h-20'}`}>
          <input
            ref={inputRef}
            type="number"
            value={preferences.budget > 0 ? preferences.budget : ''}
            onChange={handleBudgetChange}
            placeholder="金額を入力してください"
            disabled={disabled}
            className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-4 focus:ring-orange-200 outline-none transition-all text-lg font-semibold text-gray-800 ${
               isCustomSelected 
                 ? 'border-orange-400 bg-white' 
                 : 'border-gray-200 bg-gray-50 text-gray-500'
            }`}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">円</span>
        </div>
      </div>

      {/* Cuisine Section */}
      <div className="space-y-4">
        <label className="flex items-center space-x-2 text-gray-800 font-bold text-lg">
          <Utensils className="w-6 h-6 text-orange-500" />
          <span>食べたいもの</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {cuisineOptions.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => handleCuisineSelect(cuisine)}
              disabled={disabled}
              className={`py-4 px-2 rounded-lg text-sm font-bold transition-all shadow-sm ${
                preferences.cuisine === cuisine
                  ? 'bg-orange-500 text-white shadow-md ring-2 ring-orange-300 ring-offset-1 transform scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
        
        {/* Custom Cuisine Input */}
        {preferences.cuisine === CuisineType.OTHER && (
          <div className="animate-fade-in mt-2">
            <input
              type="text"
              value={preferences.customCuisine || ''}
              onChange={handleCustomCuisineChange}
              placeholder="食べたいものを具体的に入力 (例: イタリアン, 激辛料理)"
              disabled={disabled}
              className="w-full px-4 py-3 rounded-lg border-2 border-orange-400 focus:ring-4 focus:ring-orange-200 outline-none text-gray-800 font-medium placeholder-gray-400"
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PreferencesForm;