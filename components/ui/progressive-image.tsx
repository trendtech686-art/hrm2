import * as React from 'react';
import Image from 'next/image';
import { cn } from '../../lib/utils';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  placeholder?: string;
  alt: string;
  className?: string;
  showSpinner?: boolean;
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
      || url.hostname === 'phukiengiaxuong.com.vn'
      || url.hostname === 'img.vietqr.io';
  } catch {
    return false;
  }
}

/**
 * Progressive image viewer — uses next/image for automatic optimization
 * (WebP/AVIF, responsive sizing, CDN caching) when the URL is optimizable,
 * with transparent fallback to native <img> for blob:/data:/external URLs.
 *
 * Safe under React StrictMode. Fades in once loaded, optionally
 * showing a placeholder/spinner while loading.
 */
export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  placeholder,
  alt,
  className,
  showSpinner = true,
  sizes = '(max-width: 768px) 100vw, 50vw',
  onLoad,
  onError,
  ...imgProps
}) => {
  const [loaded, setLoaded] = React.useState(false);
  const [errored, setErrored] = React.useState(false);

  // Reset states when src changes
  React.useEffect(() => {
    setLoaded(false);
    setErrored(false);
  }, [src]);

  const handleLoad = React.useCallback<React.ReactEventHandler<HTMLImageElement>>((event) => {
    setLoaded(true);
    setErrored(false);
    onLoad?.(event);
  }, [onLoad]);

  const handleError = React.useCallback<React.ReactEventHandler<HTMLImageElement>>((event) => {
    setErrored(true);
    onError?.(event);
  }, [onError]);

  const hasValidSrc = Boolean(src && src.trim());
  const useNextImage = hasValidSrc && !errored && isOptimizableUrl(src);

  // /api/files/ URLs require auth cookies — Next.js Image optimization fetches
  // server-side without cookies, causing 401. Use unoptimized for these.
  const skipOptimization = src.startsWith('/api/files/');

  // Strip HTML-only attributes that next/image doesn't accept
  const { width: _w, height: _h, style: _s, crossOrigin: _co, loading: _l, decoding: _d, srcSet: _ss, ...restImgProps } = imgProps;

  return (
    <div className={cn('relative overflow-hidden bg-muted/20', className)}>
      {/* Placeholder / spinner while loading */}
      {!loaded && !errored && (
        <>
          {placeholder ? (
            <img
              src={placeholder}
              alt="placeholder"
              className="absolute inset-0 h-full w-full object-cover blur-sm scale-105"
              aria-hidden="true"
            />
          ) : showSpinner ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : null}
        </>
      )}

      {useNextImage ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={75}
          unoptimized={skipOptimization}
          className={cn(
            'object-cover transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => {
            setLoaded(true);
            setErrored(false);
          }}
          onError={() => setErrored(true)}
        />
      ) : hasValidSrc && !errored ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
          {...restImgProps}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/60">
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
};
