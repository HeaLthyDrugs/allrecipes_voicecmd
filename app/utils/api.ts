import type { Recipe } from './recipeData';

// Map TheMealDB meal to our Recipe format
export function mapMealToRecipe(meal: any): Recipe {
  const ingredients: string[] = [];
  
  // Extract ingredients and measures
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim() !== '' && measure && measure.trim() !== '') {
      ingredients.push(`${measure.trim()} ${ingredient.trim()}`);
    } else if (ingredient && ingredient.trim() !== '') {
      ingredients.push(ingredient.trim());
    }
  }
  
  // Split instructions into steps
  const steps = meal.strInstructions
    .split(/\.\s+|\n+/)
    .map((step: string) => step.trim())
    .filter((step: string) => step.length > 0)
    .map((step: string) => step.endsWith('.') ? step : `${step}.`);
  
  // Create description from first sentence or use generic description
  const description = meal.strInstructions.split('.')[0] + '.' || 
    `A delicious ${meal.strMeal} recipe.`;
  
  return {
    id: parseInt(meal.idMeal, 10),
    title: meal.strMeal,
    image: meal.strMealThumb,
    description: description,
    ingredients: ingredients,
    steps: steps
  };
}

// Search recipes by query
export async function searchRecipesApi(query: string): Promise<Recipe[]> {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch recipes');
    }
    
    const data = await res.json();
    return data.meals ? data.meals.map(mapMealToRecipe) : [];
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
}

// Get recipe by ID
export async function getRecipeByIdApi(id: number): Promise<Recipe | null> {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch recipe');
    }
    
    const data = await res.json();
    return data.meals ? mapMealToRecipe(data.meals[0]) : null;
  } catch (error) {
    console.error('Error fetching recipe by ID:', error);
    return null;
  }
}

// Get random recipe
export async function getRandomRecipeApi(): Promise<Recipe | null> {
  try {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    
    if (!res.ok) {
      throw new Error('Failed to fetch random recipe');
    }
    
    const data = await res.json();
    return data.meals ? mapMealToRecipe(data.meals[0]) : null;
  } catch (error) {
    console.error('Error fetching random recipe:', error);
    return null;
  }
}

// Get multiple random recipes for featured section
export async function getMultipleRandomRecipes(count: number): Promise<Recipe[]> {
  try {
    // Make multiple calls to get random recipes
    const promises = Array(count).fill(0).map(() => getRandomRecipeApi());
    const recipes = await Promise.all(promises);
    
    // Filter out null values and ensure unique recipes by ID
    const validRecipes = recipes.filter(Boolean) as Recipe[];
    const uniqueRecipes = Array.from(
      new Map(validRecipes.map(recipe => [recipe.id, recipe])).values()
    );
    
    return uniqueRecipes;
  } catch (error) {
    console.error('Error fetching multiple random recipes:', error);
    return [];
  }
} 