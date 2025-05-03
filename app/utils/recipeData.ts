// Import recipe data directly as a fallback
import recipeData from '../../data.json';
import { searchRecipesApi, getRecipeByIdApi, getMultipleRandomRecipes } from './api';

export interface Recipe {
  id: number;
  title: string;
  image: string;
  description: string;
  ingredients: string[];
  steps: string[];
}

// Cache the data in memory
let cachedRecipes: Recipe[] = recipeData as Recipe[];
let cachedSearchResults: Map<string, Recipe[]> = new Map();
let featuredRecipesCache: Recipe[] | null = null;

// Get all recipes (uses mock data as fallback)
export async function getAllRecipes(): Promise<Recipe[]> {
  try {
    // If we have cached recipes from prior API calls, use those
    if (cachedRecipes.length > 6) {
      return cachedRecipes;
    }
    
    // Otherwise try to get some recipes from the API
    const apiRecipes = await searchRecipesApi('');
    
    if (apiRecipes && apiRecipes.length > 0) {
      cachedRecipes = apiRecipes;
      return apiRecipes;
    }
    
    // Fallback to mock data
    return cachedRecipes;
  } catch (error) {
    console.error('Error getting all recipes:', error);
    return cachedRecipes; // Fallback to mock data
  }
}

// Get recipe by ID (uses API with mock data fallback)
export async function getRecipeById(id: number): Promise<Recipe | undefined> {
  try {
    // Try to fetch from API first
    const apiRecipe = await getRecipeByIdApi(id);
    
    if (apiRecipe) {
      return apiRecipe;
    }
    
    // Fallback to mock data
    return cachedRecipes.find(recipe => recipe.id === id);
  } catch (error) {
    console.error('Error getting recipe by ID:', error);
    // Fallback to mock data
    return cachedRecipes.find(recipe => recipe.id === id);
  }
}

// Search recipes (uses API with mock data fallback)
export async function searchRecipes(query: string): Promise<Recipe[]> {
  try {
    if (!query) {
      return await getAllRecipes();
    }
    
    // Check cache first
    if (cachedSearchResults.has(query)) {
      return cachedSearchResults.get(query) || [];
    }
    
    // Try to fetch from API
    const apiResults = await searchRecipesApi(query);
    
    if (apiResults && apiResults.length > 0) {
      // Cache the results
      cachedSearchResults.set(query, apiResults);
      return apiResults;
    }
    
    // Fallback to filtering mock data
    const searchTerms = query.toLowerCase().split(' ');
    const mockResults = cachedRecipes.filter(recipe => {
      const titleMatches = searchTerms.some(term => 
        recipe.title.toLowerCase().includes(term)
      );
      
      const descriptionMatches = searchTerms.some(term => 
        recipe.description.toLowerCase().includes(term)
      );
      
      const ingredientMatches = recipe.ingredients.some(ingredient => 
        searchTerms.some(term => 
          ingredient.toLowerCase().includes(term)
        )
      );
      
      return titleMatches || descriptionMatches || ingredientMatches;
    });
    
    // Cache the results
    cachedSearchResults.set(query, mockResults);
    return mockResults;
  } catch (error) {
    console.error('Error searching recipes:', error);
    
    // Fallback to filtering mock data
    const searchTerms = query.toLowerCase().split(' ');
    return cachedRecipes.filter(recipe => {
      const titleMatches = searchTerms.some(term => 
        recipe.title.toLowerCase().includes(term)
      );
      
      const descriptionMatches = searchTerms.some(term => 
        recipe.description.toLowerCase().includes(term)
      );
      
      const ingredientMatches = recipe.ingredients.some(ingredient => 
        searchTerms.some(term => 
          ingredient.toLowerCase().includes(term)
        )
      );
      
      return titleMatches || descriptionMatches || ingredientMatches;
    });
  }
}

// Get featured recipes (random recipes from API or top from mock data)
export async function getFeaturedRecipes(count: number = 6): Promise<Recipe[]> {
  try {
    // Return cached featured recipes if available
    if (featuredRecipesCache && featuredRecipesCache.length >= count) {
      return featuredRecipesCache.slice(0, count);
    }
    
    // Try to get random recipes from API
    const randomRecipes = await getMultipleRandomRecipes(count);
    
    if (randomRecipes && randomRecipes.length > 0) {
      featuredRecipesCache = randomRecipes;
      return randomRecipes;
    }
    
    // Fallback to mock data
    featuredRecipesCache = cachedRecipes.slice(0, count);
    return featuredRecipesCache;
  } catch (error) {
    console.error('Error getting featured recipes:', error);
    // Fallback to mock data
    return cachedRecipes.slice(0, count);
  }
} 