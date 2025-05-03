'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { searchRecipes } from '../utils/recipeData';
import NavBar from '../components/NavBar';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import MicrophoneButton from '../components/MicrophoneButton';
import VoiceCommandsHelp from '../components/VoiceCommandsHelp';
import LoadingSpinner from '../components/LoadingSpinner';
import { useVoice } from '../context/VoiceContext';
import type { Recipe } from '../utils/recipeData';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { responseMessage } = useVoice();
  
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const searchResults = await searchRecipes(query);
        setRecipes(searchResults);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('Failed to fetch recipes. Please try again.');
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipes();
  }, [query]);
  
  return (
    <main className="min-h-screen bg-white">
      <NavBar />
      
      {/* Spacer to account for fixed navbar */}
      <div className="h-16"></div>
      
      {/* Search Results Header */}
      <section className="py-10 px-4 bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-[#4A4A4A] mb-6">
            {query ? `Search Results for "${query}"` : 'All Recipes'}
          </h1>
          <SearchBar initialQuery={query} />
        </div>
      </section>
      
      {/* Search Results */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6" role="alert">
              {error}
            </div>
          )}
          
          {loading ? (
            <LoadingSpinner text={`Searching for ${query ? query : 'recipes'}...`} />
          ) : recipes.length > 0 ? (
            <div className="space-y-6">
              {/* Voice result announcement for screen readers */}
              {responseMessage.includes('Found') && (
                <div className="sr-only" aria-live="polite">{responseMessage}</div>
              )}
              
              <p className="text-gray-600 mb-6">
                Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
              </p>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {recipes.map(recipe => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    layout="list" 
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl text-gray-600 mb-4">No recipes found</h2>
              <p className="text-gray-500">
                Try a different search term or browse our categories
              </p>
            </div>
          )}
        </div>
      </section>
      
      <MicrophoneButton />
      <VoiceCommandsHelp />
    </main>
  );
} 