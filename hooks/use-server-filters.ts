/**
 * useServerFilters - Hook for URL-based server-side filtering
 * 
 * BEST PRACTICES FOR REACT FILTERING:
 * 
 * 1. URL-BASED STATE (Recommended for list pages)
 *    - Filters stored in URL search params
 *    - Shareable/bookmarkable URLs
 *    - Browser back/forward works
 *    - SEO friendly
 * 
 * 2. DEBOUNCED SEARCH
 *    - Delays API calls while user is typing
 *    - Reduces server load
 *    - Better UX (no flashing)
 * 
 * 3. SERVER-SIDE FILTERING
 *    - Only fetch what you need
 *    - Database handles filtering (fast!)
 *    - Works with any data size
 * 
 * @example
 * ```tsx
 * function ProductsPage() {
 *   const {
 *     filters,
 *     setFilter,
 *     setSearch,
 *     pagination,
 *     setPagination,
 *     queryParams,
 *   } = useServerFilters({
 *     defaultFilters: { status: 'all', category: 'all' },
 *     defaultPageSize: 20,
 *   });
 *   
 *   // Use queryParams with React Query
 *   const { data, isLoading } = useQuery({
 *     queryKey: ['products', queryParams],
 *     queryFn: () => fetchProducts(queryParams),
 *   });
 *   
 *   return (
 *     <div>
 *       <SearchInput 
 *         value={filters.search} 
 *         onChange={(val) => setSearch(val)} // Auto debounced
 *       />
 *       <Select 
 *         value={filters.status}
 *         onValueChange={(val) => setFilter('status', val)}
 *       />
 *       <DataTable data={data} />
 *       <Pagination 
 *         page={pagination.page}
 *         onPageChange={(p) => setPagination({ page: p })}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */

import * as React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export interface ServerFilterConfig<TFilters extends Record<string, unknown>> {
  /** Default filter values */
  defaultFilters: TFilters;
  /** Default page size */
  defaultPageSize?: number;
  /** Debounce delay for search in ms (default: 300) */
  debounceMs?: number;
  /** Whether to sync filters to URL (default: true) */
  syncToUrl?: boolean;
}

export interface ServerFilterResult<TFilters extends Record<string, unknown>> {
  /** Current filter values */
  filters: TFilters & { search: string };
  /** Set a single filter value */
  setFilter: <K extends keyof TFilters>(key: K, value: TFilters[K]) => void;
  /** Set search (auto debounced) */
  setSearch: (value: string) => void;
  /** Immediate search value (for controlled input) */
  searchInput: string;
  /** Clear all filters */
  clearFilters: () => void;
  /** Pagination state */
  pagination: { page: number; pageSize: number };
  /** Set pagination */
  setPagination: (updates: Partial<{ page: number; pageSize: number }>) => void;
  /** Ready-to-use query params for API */
  queryParams: Record<string, string | number>;
  /** Sort state */
  sorting: { sortBy: string; sortOrder: 'asc' | 'desc' };
  /** Set sorting */
  setSorting: (sortBy: string, sortOrder?: 'asc' | 'desc') => void;
}

export function useServerFilters<TFilters extends Record<string, unknown>>(
  config: ServerFilterConfig<TFilters>
): ServerFilterResult<TFilters> {
  const {
    defaultFilters,
    defaultPageSize = 20,
    debounceMs = 300,
    syncToUrl = true,
  } = config;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize filters from URL or defaults
  const getInitialFilters = React.useCallback((): TFilters & { search: string } => {
    const result = { ...defaultFilters, search: '' } as TFilters & { search: string };
    
    if (syncToUrl) {
      searchParams.forEach((value, key) => {
        if (key in defaultFilters || key === 'search') {
          (result as Record<string, unknown>)[key] = value;
        }
      });
    }
    
    return result;
  }, [defaultFilters, searchParams, syncToUrl]);

  const [filters, setFilters] = React.useState<TFilters & { search: string }>(getInitialFilters);
  const [searchInput, setSearchInput] = React.useState(filters.search);
  const [pagination, setPaginationState] = React.useState({
    page: parseInt(searchParams.get('page') || '1', 10),
    pageSize: parseInt(searchParams.get('pageSize') || String(defaultPageSize), 10),
  });
  const [sorting, setSortingState] = React.useState({
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc',
  });

  // Debounce search
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const updateUrl = React.useCallback((newParams: Record<string, string | undefined>) => {
    if (!syncToUrl) return;
    
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === 'all') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [syncToUrl, searchParams, pathname, router]);

  const setFilter = React.useCallback(<K extends keyof TFilters>(key: K, value: TFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPaginationState(prev => ({ ...prev, page: 1 })); // Reset to page 1
    updateUrl({ [key as string]: String(value), page: '1' });
  }, [updateUrl]);

  const setSearch = React.useCallback((value: string) => {
    setSearchInput(value);
    
    // Debounce the actual filter update
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: value }));
      setPaginationState(prev => ({ ...prev, page: 1 }));
      updateUrl({ search: value, page: '1' });
    }, debounceMs);
  }, [debounceMs, updateUrl]);

  const clearFilters = React.useCallback(() => {
    const cleared = { ...defaultFilters, search: '' } as TFilters & { search: string };
    setFilters(cleared);
    setSearchInput('');
    setPaginationState({ page: 1, pageSize: defaultPageSize });
    
    if (syncToUrl) {
      router.replace(pathname, { scroll: false });
    }
  }, [defaultFilters, defaultPageSize, pathname, router, syncToUrl]);

  const setPagination = React.useCallback((updates: Partial<{ page: number; pageSize: number }>) => {
    setPaginationState(prev => {
      const newState = { ...prev, ...updates };
      updateUrl({ 
        page: String(newState.page), 
        pageSize: newState.pageSize !== defaultPageSize ? String(newState.pageSize) : undefined 
      });
      return newState;
    });
  }, [updateUrl, defaultPageSize]);

  const setSorting = React.useCallback((sortBy: string, sortOrder: 'asc' | 'desc' = 'desc') => {
    setSortingState({ sortBy, sortOrder });
    updateUrl({ sortBy, sortOrder });
  }, [updateUrl]);

  // Build query params for API
  const queryParams = React.useMemo(() => {
    const params: Record<string, string | number> = {
      page: pagination.page,
      limit: pagination.pageSize,
      sortBy: sorting.sortBy,
      sortOrder: sorting.sortOrder,
    };
    
    // Add filters (skip 'all' values)
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params[key] = value as string | number;
      }
    });
    
    return params;
  }, [filters, pagination, sorting]);

  // Cleanup
  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    filters,
    setFilter,
    setSearch,
    searchInput,
    clearFilters,
    pagination,
    setPagination,
    queryParams,
    sorting,
    setSorting,
  };
}

/**
 * Helper hook for simple debounced value
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * Helper hook for debounced callback
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number = 300
): T {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  return React.useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
}
