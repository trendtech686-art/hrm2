'use client';

import * as React from 'react';
import { simpleSearch } from '../lib/simple-search';

/**
 * @deprecated This hook is no longer needed. Use simpleSearch directly.
 * 
 * Hook để thực hiện search đơn giản (không cần Fuse.js)
 * 
 * @example
 * const { search, isLoading } = useFuseSearch(data, {
 *   keys: ['name', 'email'],
 * });
 * 
 * // Khi user nhập search
 * const results = await search(query);
 */
export function useFuseSearch<T extends object>(
  data: T[],
  options: { keys: (keyof T | string)[], threshold?: number }
) {
  // Search function - now synchronous with simpleSearch
  const search = React.useCallback(async (query: string): Promise<T[]> => {
    if (!query.trim()) {
      return data;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return simpleSearch(data as any[], query, { keys: options.keys as any[] }) as T[];
  }, [data, options.keys]);

  // Sync search function
  const searchSync = React.useCallback((query: string): T[] => {
    if (!query.trim()) {
      return data;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return simpleSearch(data as any[], query, { keys: options.keys as any[] }) as T[];
  }, [data, options.keys]);

  return {
    search,
    searchSync,
    isLoading: false,
    isReady: true,
    // Preload is now no-op (no lazy loading needed)
    preload: () => Promise.resolve(null),
  };
}

/**
 * @deprecated This hook is no longer needed. Use simpleSearch directly.
 * 
 * Hook đơn giản hơn - trả về filtered data trực tiếp
 */
export function useFuseFilter<T extends object>(
  data: T[],
  query: string,
  options: { keys: (keyof T | string)[], threshold?: number }
): T[] {
  return React.useMemo(() => {
    if (!query.trim()) {
      return data;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return simpleSearch(data as any[], query, { keys: options.keys as any[] }) as T[];
  }, [data, query, options.keys]);
}
