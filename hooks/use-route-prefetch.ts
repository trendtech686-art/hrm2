/**
 * Route Prefetch Hook
 * 
 * Prefetches routes during idle time to improve navigation performance.
 * Uses Next.js router.prefetch() under the hood.
 */

import * as React from 'react';
import { useRouter } from 'next/navigation';

// Routes to prefetch during idle time
const PREFETCH_ROUTES = [
  '/dashboard',
  '/employees',
  '/customers',
  '/products',
  '/orders',
  '/settings',
];

/**
 * Hook to prefetch routes during browser idle time
 * 
 * @example
 * ```tsx
 * function App() {
 *   useIdlePreload();
 *   return <div>...</div>;
 * }
 * ```
 */
export function useIdlePreload() {
  const router = useRouter();
  const prefetchedRef = React.useRef(false);

  React.useEffect(() => {
    // Only run once
    if (prefetchedRef.current) return;

    // Use requestIdleCallback if available, otherwise setTimeout
    const schedulePreload = (callback: () => void) => {
      if ('requestIdleCallback' in window) {
        (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback?.(callback, { timeout: 2000 });
      } else {
        setTimeout(callback, 200);
      }
    };

    schedulePreload(() => {
      PREFETCH_ROUTES.forEach((route) => {
        try {
          router.prefetch(route);
        } catch {
          // Ignore prefetch errors - non-critical
        }
      });
      prefetchedRef.current = true;
    });
  }, [router]);
}

/**
 * Hook to prefetch a specific route
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const prefetch = usePrefetch();
 *   
 *   return (
 *     <div onMouseEnter={() => prefetch('/some-route')}>
 *       Hover to prefetch
 *     </div>
 *   );
 * }
 * ```
 */
export function usePrefetch() {
  const router = useRouter();

  return React.useCallback((route: string) => {
    try {
      router.prefetch(route);
    } catch {
      // Ignore prefetch errors - non-critical
    }
  }, [router]);
}
