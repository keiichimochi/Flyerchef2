import React, { useState } from 'react';
import { ChefHat, ArrowRight, RotateCcw, Info, Smile } from 'lucide-react';
import FlyerUploader from './components/FlyerUploader';
import PreferencesForm from './components/PreferencesForm';
import RecipeCard from './components/RecipeCard';
import LoadingOverlay from './components/LoadingOverlay';
import { CuisineType, UserPreferences, AnalysisResult } from './types';
import { analyzeFlyerAndSuggestRecipes } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [image, setImage] = useState<File | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: 1000,
    cuisine: CuisineType.JAPANESE,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = (file: File) => {
    setImage(file);
    setError(null);
  };

  const handleImageClear = () => {
    setImage(null);
    setResult(null);
    setStep(1);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!image) {
      setError("チラシファイルをアップロードしてください");
      return;
    }
    if (preferences.budget <= 0) {
      setError("予算を正しく入力してください");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const analysisResult = await analyzeFlyerAndSuggestRecipes(image, preferences);
      setResult(analysisResult);
      setStep(3);
    } catch (e: any) {
      setError(e.message || "解析に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const resetApp = () => {
    setStep(1);
    setImage(null);
    setResult(null);
    setError(null);
    setPreferences({
        budget: 1000,
        cuisine: CuisineType.JAPANESE
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {isLoading && <LoadingOverlay />}

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-orange-500 p-2 rounded-lg text-white">
              <ChefHat size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Flyer Chef AI</h1>
          </div>
          {step === 3 && (
            <button 
                onClick={resetApp}
                className="text-sm font-medium text-gray-500 hover:text-orange-500 flex items-center"
            >
                <RotateCcw className="w-4 h-4 mr-1" />
                最初から
            </button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-6">
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 1 & 2: Input Container */}
        {(step === 1 || step === 2) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-8 animate-fade-in-up">
            
            <section>
                <div className="flex items-center mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm mr-3">1</span>
                    <h2 className="text-lg font-bold text-gray-800">チラシを読み込む</h2>
                </div>
                <FlyerUploader 
                    selectedImage={image} 
                    onImageSelected={handleImageSelected}
                    onClear={handleImageClear}
                />
            </section>

            <section className={!image ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
                <div className="flex items-center mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm mr-3">2</span>
                    <h2 className="text-lg font-bold text-gray-800">希望を入力</h2>
                </div>
                <PreferencesForm 
                    preferences={preferences} 
                    onPreferencesChange={setPreferences} 
                    disabled={!image}
                />
            </section>

            <div className="pt-4">
                <button
                    onClick={handleAnalyze}
                    disabled={!image}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center text-lg"
                >
                    レシピを提案してもらう
                    <ArrowRight className="ml-2 w-5 h-5" />
                </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && result && (
            <div className="space-y-6 animate-fade-in-up">
                
                {result.isFlyer ? (
                  <>
                    {/* Detected Deals Summary */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                        <h2 className="font-bold text-lg mb-2 opacity-90">見つかった特売品</h2>
                        <div className="flex flex-wrap gap-2">
                            {result.detectedDeals.map((deal, idx) => (
                                <span key={idx} className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium border border-white/30">
                                    {deal}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">おすすめレシピ 3選</h2>
                        <span className="text-sm text-gray-500">予算: {preferences.budget}円 / {preferences.cuisine === CuisineType.OTHER ? preferences.customCuisine : preferences.cuisine}</span>
                    </div>

                    <div className="grid gap-6">
                        {result.recipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                  </>
                ) : (
                  /* Not a flyer - Show Joke */
                  <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-200 p-8 text-center max-w-lg mx-auto transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="inline-block bg-orange-100 p-6 rounded-full mb-6">
                      <Smile className="w-16 h-16 text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">これはチラシちゃいますやん！</h2>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8 relative">
                      <div className="text-4xl absolute -top-4 -left-2">❝</div>
                      <p className="text-xl text-gray-700 font-medium leading-relaxed italic">
                        {result.joke}
                      </p>
                      <div className="text-4xl absolute -bottom-8 -right-2 text-gray-300">❞</div>
                    </div>
                    
                    <button 
                      onClick={resetApp}
                      className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-all"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      別の画像で試す
                    </button>
                  </div>
                )}
            </div>
        )}
      </main>
    </div>
  );
};

export default App;