export enum CuisineType {
  JAPANESE = '和食',
  WESTERN = '洋食',
  CHINESE = '中華',
  OMOTENASHI = 'おもてなし',
  ELABORATE = '凝った料理',
  OTHER = 'その他'
}

export interface UserPreferences {
  budget: number;
  cuisine: CuisineType;
  customCuisine?: string; // Used if CuisineType.OTHER is selected
}

export interface Ingredient {
  name: string;
  quantity: string;
  isDiscounted: boolean; // True if identified from the flyer
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cookingTimeMinutes: number;
  ingredients: Ingredient[];
  instructions: string[];
  estimatedCost: number;
  savingsNote: string; // Explains why this is good based on the flyer
}

export interface AnalysisResult {
  isFlyer: boolean;
  joke?: string; // Content if isFlyer is false
  recipes: Recipe[];
  detectedDeals: string[]; // List of main items found on sale
}

// For Gemini Schema
export interface GeminiRecipeResponse {
  isFlyer: boolean;
  joke?: string;
  recipes?: {
    title: string;
    description: string;
    cookingTimeMinutes: number;
    ingredients: {
      name: string;
      quantity: string;
      isDiscounted: boolean;
    }[];
    instructions: string[];
    estimatedCost: number;
    savingsNote: string;
  }[];
  detectedDeals?: string[];
}