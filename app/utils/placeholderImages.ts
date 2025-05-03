// Placeholder images from placeholder.com
// In a real app, you would use actual images stored in public/images

export const placeholderImages = {
  'chicken_soup.jpg': 'https://placehold.co/800x600/ffa500/ffffff?text=Chicken+Soup',
  'chocolate_chip_cookies.jpg': 'https://placehold.co/800x600/964B00/ffffff?text=Chocolate+Chip+Cookies',
  'spaghetti_bolognese.jpg': 'https://placehold.co/800x600/FF6347/ffffff?text=Spaghetti+Bolognese',
  'chicken_salad.jpg': 'https://placehold.co/800x600/7CFC00/ffffff?text=Chicken+Salad',
  'homemade_pizza.jpg': 'https://placehold.co/800x600/FF0000/ffffff?text=Homemade+Pizza',
  'beef_stir_fry.jpg': 'https://placehold.co/800x600/8B4513/ffffff?text=Beef+Stir+Fry',
  'banana_bread.jpg': 'https://placehold.co/800x600/FFD700/ffffff?text=Banana+Bread',
  'chicken_tikka_masala.jpg': 'https://placehold.co/800x600/FF4500/ffffff?text=Chicken+Tikka+Masala',
  'guacamole.jpg': 'https://placehold.co/800x600/90EE90/ffffff?text=Guacamole',
  'apple_pie.jpg': 'https://placehold.co/800x600/DB7093/ffffff?text=Apple+Pie',
};

/**
 * Gets the proper image URL for a recipe
 * Either returns the original URL if it's fully qualified (starts with http)
 * or a placeholder image if the URL is relative or missing
 */
export function getImageUrl(imageUrl: string | undefined): string {
  // If URL starts with http, it's already a full URL (from API)
  if (imageUrl && imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If URL starts with /, it's relative from the public folder (from mock data)
  if (imageUrl && imageUrl.startsWith('/')) {
    // Placeholder image mapping
    return getPlaceholderImage(imageUrl);
  }
  
  // If no image, use a default placeholder
  return 'https://via.placeholder.com/640x360/f5a623/FFFFFF?text=Recipe+Image';
}

/**
 * Maps local image paths to placeholder images for development
 */
function getPlaceholderImage(imagePath: string): string {
  // Map of recipe types to placeholder images
  const placeholders: Record<string, string> = {
    'chicken': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=640&h=360&fit=crop',
    'soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=640&h=360&fit=crop',
    'pasta': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=640&h=360&fit=crop',
    'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=640&h=360&fit=crop',
    'cookie': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=640&h=360&fit=crop',
    'pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=640&h=360&fit=crop',
    'beef': 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=640&h=360&fit=crop',
    'dessert': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=640&h=360&fit=crop',
    'bread': 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=640&h=360&fit=crop',
    'cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=640&h=360&fit=crop',
    'fish': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=640&h=360&fit=crop',
    'vegetable': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=640&h=360&fit=crop',
  };
  
  // Check if the image path contains any of the keywords
  for (const [keyword, url] of Object.entries(placeholders)) {
    if (imagePath.toLowerCase().includes(keyword)) {
      return url;
    }
  }
  
  // Default fallback
  return 'https://via.placeholder.com/640x360/f5a623/FFFFFF?text=Recipe+Image';
} 