/**
 * Utility functions for handling images and URLs
 */

/**
 * Converts a Supabase image URL to a proxied URL to avoid CORS issues
 * @param url The original Supabase image URL
 * @returns The proxied URL
 */
export function getProxiedImageUrl(url: string): string {
  // If not a URL or is already a local API URL, return as is
  if (!url || url.startsWith('/api/')) {
    return url;
  }

  // If it's a placeholder URL, return as is
  if (url.includes('/api/placeholder/')) {
    return url;
  }

  // Check if it's a Supabase storage URL
  if (url.includes('supabase') && url.includes('/storage/v1/object/')) {
    // Use our proxy API to avoid CORS issues
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }

  // Return unchanged for other URLs
  return url;
}

/**
 * Creates a placeholder URL for when images can't be loaded
 * @param text Text to display on the placeholder
 * @param width Width of the placeholder
 * @param height Height of the placeholder
 * @returns A placeholder URL
 */
export function createPlaceholderUrl(text: string, width: number = 800, height: number = 400): string {
  return `/api/placeholder/${width}/${height}?text=${encodeURIComponent(text)}`;
}

/**
 * Processes an image object to ensure all URLs are correctly formatted
 * @param img The image object to process
 * @param index Optional index for generating default captions
 * @returns Processed image object with correct URLs
 */
export function processImageUrls(img: any, index: number = 0): any {
  // If this is a data URL, use it directly
  if (img.dataUrl) {
    console.log(`Image ${index} has data URL, using directly`);
    return {
      ...img,
      src: img.dataUrl,
      placeholder: img.dataUrl,
      caption: img.caption || `Figure ${index + 1}`,
      alt: img.alt || img.caption || `Image ${index + 1}`
    };
  }
  
  // Default placeholder if needed
  const defaultPlaceholder = createPlaceholderUrl(`Image ${index + 1}`, 800 + (index % 5) * 50, 400 + (index % 3) * 50);
  
  // Get the image URL from either src or placeholder property
  const imageUrl = img.src || img.placeholder || defaultPlaceholder;
  
  // If the URL is already a data URL, use it directly
  if (imageUrl && imageUrl.startsWith('data:')) {
    console.log(`Image ${index} URL is a data URL`);
    return {
      ...img,
      src: imageUrl,
      placeholder: imageUrl,
      caption: img.caption || `Figure ${index + 1}`,
      alt: img.alt || img.caption || `Image ${index + 1}`
    };
  }
  
  // Otherwise, convert to proxied URL to avoid CORS issues
  const proxiedUrl = getProxiedImageUrl(imageUrl);
  
  return {
    ...img,
    src: proxiedUrl,
    placeholder: proxiedUrl,
    caption: img.caption || `Figure ${index + 1}`,
    alt: img.alt || img.caption || `Image ${index + 1}`
  };
} 