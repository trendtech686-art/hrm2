/**
 * Thumbnail generation utilities
 * Automatically creates optimized thumbnails for images
 */

export interface ThumbnailOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg';
}

/**
 * Generate thumbnail from File
 * @param file - Original image file
 * @param options - Thumbnail options
 * @returns Promise<{ original: string, thumbnail: string }>
 */
export async function generateThumbnailFromFile(
  file: File,
  options?: ThumbnailOptions
): Promise<{ original: string; thumbnail: string }> {
  const { width = 200, height = 200, quality = 0.7, format = 'webp' } = options || {};

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Create full size canvas first
        const fullCanvas = document.createElement('canvas');
        let fullWidth = img.width;
        let fullHeight = img.height;

        // Limit full size to max 1200px
        const maxFull = 1200;
        if (fullWidth > maxFull || fullHeight > maxFull) {
          const ratio = Math.min(maxFull / fullWidth, maxFull / fullHeight);
          fullWidth = Math.floor(fullWidth * ratio);
          fullHeight = Math.floor(fullHeight * ratio);
        }

        fullCanvas.width = fullWidth;
        fullCanvas.height = fullHeight;

        const fullCtx = fullCanvas.getContext('2d');
        if (!fullCtx) {
          reject(new Error('Cannot get full canvas context'));
          return;
        }

        fullCtx.drawImage(img, 0, 0, fullWidth, fullHeight);

        // Create thumbnail canvas
        const thumbCanvas = document.createElement('canvas');
        
        // Calculate thumbnail dimensions (maintain aspect ratio)
        let thumbWidth = width;
        let thumbHeight = height;
        const aspectRatio = fullWidth / fullHeight;

        if (aspectRatio > 1) {
          thumbHeight = Math.floor(width / aspectRatio);
        } else {
          thumbWidth = Math.floor(height * aspectRatio);
        }

        thumbCanvas.width = thumbWidth;
        thumbCanvas.height = thumbHeight;

        const thumbCtx = thumbCanvas.getContext('2d');
        if (!thumbCtx) {
          reject(new Error('Cannot get thumbnail canvas context'));
          return;
        }

        thumbCtx.drawImage(img, 0, 0, thumbWidth, thumbHeight);

        // Convert both to data URLs
        try {
          const mimeType = format === 'webp' ? 'image/webp' : 'image/jpeg';
          const original = fullCanvas.toDataURL(mimeType, 0.85);
          const thumbnail = thumbCanvas.toDataURL(mimeType, quality);

          resolve({ original, thumbnail });
        } catch (error) {
          // Fallback to JPEG
          const original = fullCanvas.toDataURL('image/jpeg', 0.85);
          const thumbnail = thumbCanvas.toDataURL('image/jpeg', quality);
          resolve({ original, thumbnail });
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
 * Generate thumbnail from data URL
 * @param dataUrl - Original image data URL
 * @param options - Thumbnail options
 * @returns Promise<string> - Thumbnail data URL
 */
export async function generateThumbnailFromDataUrl(
  dataUrl: string,
  options?: ThumbnailOptions
): Promise<string> {
  const { width = 200, height = 200, quality = 0.7, format = 'webp' } = options || {};

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      
      // Calculate dimensions (maintain aspect ratio)
      let thumbWidth = width;
      let thumbHeight = height;
      const aspectRatio = img.width / img.height;

      if (aspectRatio > 1) {
        thumbHeight = Math.floor(width / aspectRatio);
      } else {
        thumbWidth = Math.floor(height * aspectRatio);
      }

      canvas.width = thumbWidth;
      canvas.height = thumbHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Cannot get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, thumbWidth, thumbHeight);

      try {
        const mimeType = format === 'webp' ? 'image/webp' : 'image/jpeg';
        const thumbnail = canvas.toDataURL(mimeType, quality);
        resolve(thumbnail);
      } catch (error) {
        // Fallback to JPEG
        const thumbnail = canvas.toDataURL('image/jpeg', quality);
        resolve(thumbnail);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = dataUrl;
  });
}

/**
 * Batch generate thumbnails
 * @param files - Array of image files
 * @param options - Thumbnail options
 * @returns Promise<Array<{ original: string, thumbnail: string }>>
 */
export async function generateThumbnailsBatch(
  files: File[],
  options?: ThumbnailOptions
): Promise<Array<{ original: string; thumbnail: string }>> {
  const promises = files.map((file) => generateThumbnailFromFile(file, options));
  return Promise.all(promises);
}
