'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '../utils/placeholderImages';
import type { Recipe } from '../utils/recipeData';

interface RecipeCardProps {
  recipe: Recipe;
  layout?: 'grid' | 'list';
}

export default function RecipeCard({ recipe, layout = 'grid' }: RecipeCardProps) {
  const { id, title, image, description } = recipe;
  const imageUrl = getImageUrl(image);
  
  if (layout === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md transition-shadow hover:shadow-lg">
        <div className="md:flex">
          <div className="md:w-1/3 relative">
            <div className="aspect-w-16 aspect-h-9 md:h-full">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
          <div className="p-4 md:w-2/3 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#4A4A4A] mb-2">{title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
            </div>
            <Link
              href={`/recipe/${id}`}
              className="bg-[#F5A623] hover:bg-[#e09215] text-white font-medium px-4 py-2 rounded self-start transition-colors"
            >
              View Recipe
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg flex flex-col h-full">
      <div className="relative pt-[56.25%]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h2 className="text-lg font-bold text-[#4A4A4A] mb-2">{title}</h2>
        <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{description}</p>
        <Link
          href={`/recipe/${id}`}
          className="bg-[#F5A623] hover:bg-[#e09215] text-white font-medium px-4 py-2 rounded self-start transition-colors"
        >
          View Recipe
        </Link>
      </div>
    </div>
  );
} 