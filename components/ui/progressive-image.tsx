import * as React from 'react';
import { cn } from '../../lib/utils';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  placeholder?: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}

/**
 * Progressive Image Component
 * Loads a blur placeholder first, then the full image
 * Automatically generates placeholder if not provided
 */
export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  placeholder,
  alt,
  className,
  onLoad,
  ...props
}) => {
  const [imageSrc, setImageSrc] = React.useState<string>(placeholder || '');
  const [imageLoading, setImageLoading] = React.useState<boolean>(true);
  const [blurPlaceholder, setBlurPlaceholder] = React.useState<string>('');

  // Validate src - prevent empty string
  const validSrc = src && src.trim() ? src : null;

  // Generate blur placeholder if not provided
  React.useEffect(() => {
    if (!placeholder && validSrc) {
      // For data URLs, create a tiny version
      if (validSrc.startsWith('data:')) {
        generateTinyPlaceholder(validSrc).then(setBlurPlaceholder);
      }
    }
  }, [validSrc, placeholder]);

  // Load full image
  React.useEffect(() => {
    if (!validSrc) {
      setImageLoading(false);
      return;
    }

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(validSrc);
      setImageLoading(false);
      onLoad?.();
    };

    img.onerror = () => {
      setImageLoading(false);
    };

    img.src = validSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [validSrc, onLoad]);

  const currentPlaceholder = placeholder || blurPlaceholder;

  // If no valid src, show empty state
  if (!validSrc && !currentPlaceholder) {
    return (
      <div className={cn('relative overflow-hidden bg-muted/30', className)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-12 h-12 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Blur placeholder */}
      {currentPlaceholder && imageLoading && (
        <img
          src={currentPlaceholder}
          alt={alt}
          className={cn(
            'absolute inset-0 w-full h-full object-cover',
            'blur-lg scale-110 transition-opacity duration-300',
            imageLoading ? 'opacity-100' : 'opacity-0'
          )}
          aria-hidden="true"
        />
      )}
      
      {/* Full image */}
      {(imageSrc || currentPlaceholder) && (
        <img
          src={imageSrc || currentPlaceholder}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            imageLoading ? 'opacity-0' : 'opacity-100'
          )}
          {...props}
        />
      )}
      
      {/* Loading spinner */}
      {imageLoading && !currentPlaceholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

/**
 * Generate tiny placeholder from data URL
 */
async function generateTinyPlaceholder(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const aspectRatio = img.width / img.height;
      
      // Create 10px thumbnail
      if (aspectRatio > 1) {
        canvas.width = 10;
        canvas.height = Math.floor(10 / aspectRatio);
      } else {
        canvas.height = 10;
        canvas.width = Math.floor(10 * aspectRatio);
      }
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        try {
          const tiny = canvas.toDataURL('image/jpeg', 0.1);
          resolve(tiny);
        } catch {
          resolve(dataUrl);
        }
      } else {
        resolve(dataUrl);
      }
    };
    
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
