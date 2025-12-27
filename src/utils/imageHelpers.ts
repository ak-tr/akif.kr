import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Checks if AVIF and WebP versions exist for an image path
 * @param imagePath - The original image path (e.g., "/static/images/foo.jpg")
 * @returns Object with avifExists and webpExists booleans
 */
export function checkModernFormats(imagePath: string): { avifExists: boolean; webpExists: boolean } {
  // Only check paths that are local static images
  if (!imagePath.startsWith('/static/images/') && !imagePath.startsWith('static/images/')) {
    return { avifExists: false, webpExists: false };
  }

  // Normalize path - remove leading slash if present
  const normalizedPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // Check if it's a supported format
  const supportedExtensions = ['.png', '.jpg', '.jpeg'];
  const hasSupportedExtension = supportedExtensions.some(ext => 
    normalizedPath.toLowerCase().endsWith(ext)
  );

  if (!hasSupportedExtension) {
    return { avifExists: false, webpExists: false };
  }

  // Get the base path without extension
  const pathWithoutExt = normalizedPath.replace(/\.(png|jpg|jpeg)$/i, '');
  const publicDir = join(process.cwd(), 'public');
  
  const avifPath = join(publicDir, `${pathWithoutExt}.avif`);
  const webpPath = join(publicDir, `${pathWithoutExt}.webp`);

  return {
    avifExists: existsSync(avifPath),
    webpExists: existsSync(webpPath),
  };
}

/**
 * Generates the AVIF path for an image
 */
export function getAvifPath(imagePath: string): string {
  return imagePath.replace(/\.(png|jpg|jpeg)$/i, '.avif');
}

/**
 * Generates the WebP path for an image
 */
export function getWebpPath(imagePath: string): string {
  return imagePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
}

