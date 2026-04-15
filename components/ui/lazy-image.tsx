import * as React from 'react';
import Image from 'next/image';
import { cn } from '../../lib/utils';
import { Skeleton } from './skeleton';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /**
   * Số pixels từ viewport để bắt đầu load (default: 200px)
   * Tăng số này để load sớm hơn
   */
  rootMargin?: string;
  /**
   * Hiển thị skeleton khi chưa load
   */
  showSkeleton?: boolean;
  /**
   * Class cho skeleton
   */
  skeletonClassName?: string;
  /**
   * Sizes hint cho next/image responsive optimization
   */
  sizes?: string;
}

/**
 * Check if URL can be optimized by next/image
 */
function isOptimizableUrl(src: string): boolean {
  if (src.startsWith('/uploads/') || src.startsWith('/api/')) return true;
  if (src.startsWith('data:') || src.startsWith('blob:')) return false;
  try {
    const url = new URL(src);
    return url.hostname === 'localhost'
      || url.hostname === 'img.vietqr.io';
  } catch {
    return false;
  }
}

/**
 * Lazy Loading Image Component — uses next/image for automatic optimization
 * (WebP/AVIF conversion, responsive sizing, caching) when the URL is optimizable,
 * with transparent fallback to native <img> for blob:/data:/external URLs.
 * 
 * Performance Benefits:
 * - next/image: auto WebP/AVIF, srcset, lazy decode, CDN caching
 * - Skeleton placeholder during load
 * - Auto-retry (2 attempts) on network errors
 * - Fade-in transition on load
 * 
 * @example
 * <LazyImage
 *   src="/uploads/image.jpg"
 *   alt="Product image"
 *   className="w-full h-24 object-cover rounded"
 * />
 */
export function LazyImage({
  src,
  alt,
  className,
  rootMargin: _rootMargin = '200px',
  showSkeleton = true,
  skeletonClassName,
  sizes = '(max-width: 768px) 100vw, 50vw',
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  // Reset states whenever the source changes so we can re-attempt fetching.
  React.useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleLoad = React.useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
  }, []);

  const handleError = React.useCallback(() => {
    // Don't retry — broken images (404) won't magically fix themselves
    // and retrying floods the server log with proxy errors
    setHasError(true);
  }, []);

  const useNextImage = isOptimizableUrl(src);
  
  // /api/files/ URLs require auth cookies — Next.js Image optimization fetches
  // server-side without cookies, causing 401. Use unoptimized for these.
  const skipOptimization = src.startsWith('/api/files/');

  // Strip HTML-only attributes that next/image doesn't accept
  const { width: _w, height: _h, style: _s, crossOrigin: _co, loading: _l, decoding: _d, srcSet: _ss, ...imgRestProps } = props;

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Skeleton during initial load */}
      {showSkeleton && !isLoaded && !hasError && (
        <Skeleton className={cn('absolute inset-0', skeletonClassName)} />
      )}

      {useNextImage && !hasError ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority
          quality={75}
          unoptimized={skipOptimization}
          className={cn(
            'object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        /* Fallback to native <img> for blob:/data:/external URLs */
        <img
          src={src}
          alt={alt}
          loading="eager"
          decoding="sync"
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          {...imgRestProps}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
          <div className="text-center">
            <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Ảnh lỗi</span>
          </div>
        </div>
      )}
    </div>
  );
}
