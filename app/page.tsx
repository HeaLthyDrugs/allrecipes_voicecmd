'use client';

import NavBar from './components/NavBar';
import SearchBar from './components/SearchBar';
import RecipeCard from './components/RecipeCard';
import MicrophoneButton from './components/MicrophoneButton';
import VoiceCommandsHelp from './components/VoiceCommandsHelp';
import VoiceIntroModal from './components/VoiceIntroModal';
import LoadingSpinner from './components/LoadingSpinner';
import { getFeaturedRecipes } from './utils/recipeData';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Recipe } from './utils/recipeData';

export default function Home() {
  // Use state to hold recipes and loading state
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load recipes on client-side after component mounts
  useEffect(() => {
    const loadFeaturedRecipes = async () => {
      try {
        setLoading(true);
        const featured = await getFeaturedRecipes(6);
        setFeaturedRecipes(featured);
        setRecipes(featured);
        setError(null);
      } catch (err) {
        console.error('Error loading featured recipes:', err);
        setError('Failed to load recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadFeaturedRecipes();
  }, []);
  
  const categories = [
    'Main Dishes',
    'Desserts',
    'Breakfast',
    'Appetizers',
    'Soup',
    'Salad',
    'Vegetarian'
  ];

  return (
    <main className="min-h-screen bg-white">
      <NavBar />

      {/* Spacer to account for fixed navbar */}
      <div className="h-16"></div>

      {/* Hero Section with Search */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#4A4A4A] mb-6">
            Find and Share Your Favorite Recipes
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
            Discover thousands of recipes to make delicious meals with less stress and more joy.
            <span className="block mt-2 text-sm italic">
              Try saying <strong>"Find me a chicken recipe"</strong> or <strong>"Search for desserts"</strong>
            </span>
          </p>
          <div className="mb-4">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#4A4A4A] mb-8">
            Featured Recipes
          </h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6" role="alert">
              {error}
            </div>
          )}
          
          {loading ? (
            <LoadingSpinner text="Loading featured recipes..." />
          ) : featuredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No featured recipes available at the moment.</p>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#4A4A4A] mb-6">
            Browse Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <Link 
                key={category}
                href={`/search?q=${encodeURIComponent(category)}`}
                className="bg-[#F5A623] hover:bg-[#e09215] text-white font-medium px-6 py-3 rounded-full transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      <MicrophoneButton />
      <VoiceCommandsHelp />
      <VoiceIntroModal />
    </main>
  );
}
