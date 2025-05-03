'use client';

import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import MicrophoneButton from '../../components/MicrophoneButton';
import VoiceCommandsHelp from '../../components/VoiceCommandsHelp';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getRecipeById } from '../../utils/recipeData';
import { getImageUrl } from '../../utils/placeholderImages';
import { useVoice } from '../../context/VoiceContext';
import type { Recipe } from '../../utils/recipeData';

interface RecipePageProps {
  params: {
    id: string;
  };
}

export default function RecipePage({ params }: RecipePageProps) {
  const recipeId = parseInt(params.id, 10);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentStepIndex, setCurrentStepIndex } = useVoice();
  const router = useRouter();
  
  // Load recipe data and reset step index when recipe changes
  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const fetchedRecipe = await getRecipeById(recipeId);
        if (fetchedRecipe) {
          setRecipe(fetchedRecipe);
          setCurrentStepIndex(0);
        } else {
          setError('Recipe not found');
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipe();
  }, [recipeId, setCurrentStepIndex]);
  
  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <NavBar />
        {/* Spacer to account for fixed navbar */}
        <div className="h-16"></div>
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner text="Loading recipe..." />
        </div>
      </main>
    );
  }
  
  if (error) {
    return (
      <main className="min-h-screen bg-white">
        <NavBar />
        {/* Spacer to account for fixed navbar */}
        <div className="h-16"></div>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded mb-6" role="alert">
            <p className="font-medium">{error}</p>
          </div>
          <button 
            onClick={() => router.back()} 
            className="mt-4 px-6 py-2 bg-[#F5A623] text-white rounded-md hover:bg-[#e09215]"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }
  
  if (!recipe) {
    notFound();
  }
  
  const imageUrl = getImageUrl(recipe.image);
  
  return (
    <main className="min-h-screen bg-white">
      <NavBar />
      
      {/* Spacer to account for fixed navbar */}
      <div className="h-16"></div>
      
      {/* Recipe Header/Image */}
      <div className="relative w-full h-[300px] md:h-[400px]">
        <Image
          src={imageUrl}
          alt={recipe.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      
      {/* Recipe Title */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#4A4A4A] text-center mb-6">
          {recipe.title}
        </h1>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-4">
          {recipe.description}
        </p>
        
        <p className="text-center text-sm text-gray-500 italic mb-10">
          Try saying <strong>"Next step"</strong> or <strong>"Set a timer for 5 minutes"</strong>
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Ingredients */}
          <div id="ingredients-section">
            <h2 className="text-2xl font-bold text-[#4A4A4A] mb-4">Ingredients</h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700">
                  <input
                    type="checkbox"
                    id={`ingredient-${index}`}
                    className="mt-1 h-5 w-5 accent-[#F5A623]"
                  />
                  <label
                    htmlFor={`ingredient-${index}`}
                    className="cursor-pointer"
                  >
                    {ingredient}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Instructions */}
          <div id="instructions-section">
            <h2 className="text-2xl font-bold text-[#4A4A4A] mb-4">Instructions</h2>
            <ol className="space-y-6">
              {recipe.steps.map((step, index) => (
                <li 
                  key={index} 
                  id={`step-${index}`}
                  className={`text-gray-700 p-2 rounded-md transition-colors ${
                    currentStepIndex === index ? 'bg-yellow-100' : ''
                  }`}
                >
                  <span className="inline-block bg-[#F5A623] text-white font-bold rounded-full w-8 h-8 text-center leading-8 mr-3">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      
      <MicrophoneButton />
      <VoiceCommandsHelp />
    </main>
  );
} 