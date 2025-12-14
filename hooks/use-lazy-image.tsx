import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for lazy loading images using Intersection Observer
 * 
 * @param options - IntersectionObserver options
 * @returns Object containing ref, isInView, and isLoaded states
 * 
 * @example
 * ```tsx
 * const { ref, isInView, isLoaded, setIsLoaded } = useLazyImage();
 * 
 * return (
 *   <div ref={ref}>
 *     {isInView && (
 *       <img 
 *         src={imageUrl} 
 *         onLoad={() => setIsLoaded(true)}
 *         className={isLoaded ? 'opacity-100' : 'opacity-0'}
 *       />
 *     )}
 *   </div>
 * );
 * ```
 */
export function useLazyImage(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: load immediately if not supported
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // Once in view, we don't need to observe anymore
            observer.unobserve(element);
          }
        });
      },
      {
        root: null, // viewport
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return { ref, isInView, isLoaded, setIsLoaded };
}

/**
 * Placeholder skeleton component for lazy loading
 */
export const ImageSkeleton = ({ className = '' }: { className?: string }) => (
  <div 
    className={`animate-pulse bg-gradient-to-r from-muted via-muted/70 to-muted bg-[length:200%_100%] ${className}`}
    style={{
      animation: 'shimmer 1.5s ease-in-out infinite',
    }}
  />
);
