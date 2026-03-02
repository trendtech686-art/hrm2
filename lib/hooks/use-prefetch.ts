/**
 * Prefetch Hook
 * 
 * Prefetch data on hover/focus for instant navigation
 * 
 * @example
 * const prefetch = usePrefetch();
 * 
 * <tr onMouseEnter={() => prefetch(`/orders/${id}`)}>
 *   ...
 * </tr>
 */

'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';

/**
 * Hook to prefetch routes on hover
 */
export function usePrefetch() {
  const router = useRouter();
  const prefetchedRoutes = useRef(new Set<string>());

  const prefetch = useCallback((href: string) => {
    // Only prefetch once
    if (prefetchedRoutes.current.has(href)) {
      return;
    }

    prefetchedRoutes.current.add(href);
    router.prefetch(href);
  }, [router]);

  return prefetch;
}

/**
 * Hook to prefetch on hover with delay
 * Prevents prefetching on quick mouse movements
 */
export function usePrefetchOnHover(delay = 100) {
  const router = useRouter();
  const prefetchedRoutes = useRef(new Set<string>());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startPrefetch = useCallback((href: string) => {
    if (prefetchedRoutes.current.has(href)) {
      return;
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      prefetchedRoutes.current.add(href);
      router.prefetch(href);
    }, delay);
  }, [router, delay]);

  const cancelPrefetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    onMouseEnter: startPrefetch,
    onMouseLeave: cancelPrefetch,
    onFocus: startPrefetch,
    onBlur: cancelPrefetch,
  };
}

/**
 * Component props helper for prefetch
 * 
 * @example
 * const { prefetchProps } = usePrefetchLink(`/orders/${id}`);
 * 
 * <Link {...prefetchProps}>View Order</Link>
 */
export function usePrefetchLink(href: string, delay = 100) {
  const { onMouseEnter, onMouseLeave, onFocus, onBlur } = usePrefetchOnHover(delay);

  return {
    prefetchProps: {
      onMouseEnter: () => onMouseEnter(href),
      onMouseLeave,
      onFocus: () => onFocus(href),
      onBlur,
    },
    href,
  };
}
