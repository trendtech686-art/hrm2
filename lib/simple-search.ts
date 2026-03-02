/**
 * Simple Vietnamese-aware search utility
 * Replaces Fuse.js for better performance with large datasets
 * 
 * @module lib/simple-search
 */

import { removeVietnameseAccents } from './filename-utils';

export interface SearchOptions<T> {
  /** Keys to search in the object */
  keys: (keyof T)[];
  /** Whether to use accent-insensitive search (default: true) */
  accentInsensitive?: boolean;
}

/**
 * Simple search function that matches query against specified keys
 * Supports Vietnamese accent-insensitive search
 * 
 * @param items - Array of items to search
 * @param query - Search query string
 * @param options - Search options including keys to search
 * @returns Filtered array of matching items
 */
export function simpleSearch<T extends Record<string, unknown>>(
  items: T[],
  query: string,
  options: SearchOptions<T>
): T[] {
  if (!query || query.trim() === '') {
    return items;
  }

  const { keys, accentInsensitive = true } = options;
  const normalizedQuery = query.toLowerCase().trim();
  const queryNoAccent = accentInsensitive 
    ? removeVietnameseAccents(normalizedQuery).toLowerCase() 
    : normalizedQuery;

  return items.filter(item => {
    return keys.some(key => {
      const value = item[key];
      if (value == null) return false;
      
      const stringValue = String(value).toLowerCase();
      
      // Check original text
      if (stringValue.includes(normalizedQuery)) {
        return true;
      }
      
      // Check accent-stripped text (for Vietnamese search)
      if (accentInsensitive) {
        const valueNoAccent = removeVietnameseAccents(stringValue).toLowerCase();
        if (valueNoAccent.includes(queryNoAccent)) {
          return true;
        }
      }
      
      return false;
    });
  });
}

/**
 * Paginated search function
 * 
 * @param items - Array of items to search
 * @param query - Search query string
 * @param page - Page number (1-indexed)
 * @param limit - Items per page
 * @param options - Search options
 * @returns Object with paginated items and hasNextPage flag
 */
export function paginatedSearch<T extends Record<string, unknown>>(
  items: T[],
  query: string,
  page: number,
  limit: number,
  options: SearchOptions<T>
): { items: T[]; hasNextPage: boolean; total: number } {
  const filtered = simpleSearch(items, query, options);
  
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedItems = filtered.slice(start, end);

  return {
    items: paginatedItems,
    hasNextPage: end < filtered.length,
    total: filtered.length,
  };
}
