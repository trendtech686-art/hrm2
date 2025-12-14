import * as React from 'react';
import { cn } from '../../lib/utils';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  placeholder?: string;
  alt: string;
  className?: string;
  showSpinner?: boolean;
}

/**
 * Progressive image viewer that is safe under React StrictMode.
 * Renders the real `<img>` immediately and fades it in once loaded,
 * optionally showing a placeholder/spinner while loading.
 */
export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  placeholder,
  alt,
  className,
  showSpinner = true,
  onLoad,
  onError,
  ...imgProps
}) => {
  const [loaded, setLoaded] = React.useState(false);
  const [errored, setErrored] = React.useState(false);

  const handleLoad = React.useCallback<React.ReactEventHandler<HTMLImageElement>>((event) => {
    setLoaded(true);
    setErrored(false);
    onLoad?.(event as any);
  }, [onLoad]);

  const handleError = React.useCallback<React.ReactEventHandler<HTMLImageElement>>((event) => {
    setErrored(true);
    onError?.(event as any);
  }, [onError]);

  const hasValidSrc = Boolean(src && src.trim());

  return (
    <div className={cn('relative overflow-hidden bg-muted/20', className)}>
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

      {hasValidSrc && !errored ? (
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
          {...imgProps}
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
