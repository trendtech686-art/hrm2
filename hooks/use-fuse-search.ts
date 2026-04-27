'use client';

import { useCallback, useMemo } from 'react';
import { simpleSearch, type SearchOptions } from '../lib/simple-search';

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
  const search = useCallback(async (query: string): Promise<T[]> => {
    if (!query.trim()) {
      return data;
    }
    const searchOptions: SearchOptions<T> = { keys: options.keys as (keyof T)[] };
    return simpleSearch(data, query, searchOptions);
  }, [data, options.keys]);

  // Sync search function
  const searchSync = useCallback((query: string): T[] => {
    if (!query.trim()) {
      return data;
    }
    const searchOptions: SearchOptions<T> = { keys: options.keys as (keyof T)[] };
    return simpleSearch(data, query, searchOptions);
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
  return useMemo(() => {
    if (!query.trim()) {
      return data;
    }
    const searchOptions: SearchOptions<T> = { keys: options.keys as (keyof T)[] };
    return simpleSearch(data, query, searchOptions);
  }, [data, query, options.keys]);
}
