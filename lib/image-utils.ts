/**
 * Image Optimization Utilities
 * - Compress images
 * - Convert to WebP format
 * - Resize images
 * - Generate thumbnails
 * - Progressive loading with blur placeholders
 */

/**
 * Generate blur placeholder (tiny low-quality version)
 * @param dataUrl - Original image data URL
 * @returns Promise<string> - Tiny blur placeholder (base64)
 */
export async function generateBlurPlaceholder(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      // Create tiny canvas (10x10 or smaller)
      const canvas = document.createElement('canvas');
      const aspectRatio = img.width / img.height;
      
      if (aspectRatio > 1) {
        canvas.width = 10;
        canvas.height = Math.floor(10 / aspectRatio);
      } else {
        canvas.height = 10;
        canvas.width = Math.floor(10 * aspectRatio);
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Cannot get canvas context'));
        return;
      }
      
      // Draw tiny image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL with very low quality
      try {
        const blurDataUrl = canvas.toDataURL('image/jpeg', 0.1);
        resolve(blurDataUrl);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = dataUrl;
  });
}

/**
 * Compress and convert image to WebP format
 * @param file - Original image file
 * @param maxWidth - Maximum width (default: 1200)
 * @param maxHeight - Maximum height (default: 1200)
 * @param quality - Compression quality 0-1 (default: 0.8)
 * @returns Promise<string> - Base64 WebP data URL
 */
export async function compressImageToWebP(
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Cannot get canvas context'));
          return;
        }
        
        // Draw image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to WebP
        try {
          const webpDataUrl = canvas.toDataURL('image/webp', quality);
          resolve(webpDataUrl);
        } catch (error) {
          // Fallback to JPEG if WebP not supported
          const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(jpegDataUrl);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Compress multiple images in parallel
 * @param files - Array of image files
 * @param options - Compression options
 * @returns Promise<string[]> - Array of compressed WebP data URLs
 */
export async function compressMultipleImages(
  files: File[],
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  }
): Promise<string[]> {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.8 } = options || {};
  
  const promises = files.map(file => 
    compressImageToWebP(file, maxWidth, maxHeight, quality)
  );
  
  return Promise.all(promises);
}

/**
 * Create thumbnail from image
 * @param dataUrl - Original image data URL
 * @param size - Thumbnail size (default: 200)
 * @param quality - Compression quality 0-1 (default: 0.7)
 * @returns Promise<string> - Thumbnail data URL
 */
export async function createThumbnail(
  dataUrl: string,
  size: number = 200,
  quality: number = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      // Calculate square crop
      const minDimension = Math.min(img.width, img.height);
      const sx = (img.width - minDimension) / 2;
      const sy = (img.height - minDimension) / 2;
      
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Cannot get canvas context'));
        return;
      }
      
      // Draw cropped and resized image
      ctx.drawImage(
        img,
        sx, sy, minDimension, minDimension,
        0, 0, size, size
      );
      
      // Convert to WebP
      try {
        const webpDataUrl = canvas.toDataURL('image/webp', quality);
        resolve(webpDataUrl);
      } catch (error) {
        // Fallback to JPEG
        const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(jpegDataUrl);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = dataUrl;
  });
}

/**
 * Get file size in KB
 * @param dataUrl - Image data URL
 * @returns number - Size in KB
 */
export function getImageSizeKB(dataUrl: string): number {
  // Remove data URL prefix
  const base64 = dataUrl.split(',')[1] || dataUrl;
  
  // Calculate size (base64 is ~33% larger than binary)
  const sizeBytes = (base64.length * 3) / 4;
  const sizeKB = sizeBytes / 1024;
  
  return Math.round(sizeKB);
}

/**
 * Check if browser supports WebP
 * @returns boolean
 */
export function supportsWebP(): boolean {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  try {
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    return false;
  }
}
