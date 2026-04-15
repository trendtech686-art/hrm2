/**
 * useAllProducts - Convenience hook for components needing all products as flat array
 * 
 * ⚠️ PERFORMANCE NOTE:
 * This hook fetches ALL products. Only use when you truly need all data:
 * - Dropdowns/selects that need full list
 * - Export functionality
 * - Reports
 * 
 * For paginated list views, use useProductsQuery instead!
 * For autocomplete/search, use useProductSearch instead!
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { STALE_TIME } from '@/lib/query-client';
import { fetchProducts } from '../api/products-api';
import { productKeys } from './use-products';
import type { Product } from '../types';
import type { SystemId } from '@/lib/id-types';

// Stable empty array to prevent re-renders
const EMPTY_PRODUCTS: Product[] = [];

/**
 * Options for useAllProducts hook
 * @property enabled - Whether to fetch data (default: true). Set to false for lazy loading
 */
export interface UseAllProductsOptions {
  enabled?: boolean;
}

/**
 * @deprecated For list views, use useProductsQuery with server-side pagination.
 * For search/autocomplete, use useProductSearch.
 * Only use this for cases that truly need all products (export, specific dropdowns).
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 * 
 * @example
 * // Lazy loading - chỉ load khi dropdown mở
 * const [opened, setOpened] = useState(false);
 * const { data } = useAllProducts({ enabled: opened });
 */
export function useAllProducts(options: UseAllProductsOptions = {}) {
  const { enabled = true } = options;
  const query = useQuery({
    queryKey: [...productKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchProducts(p)),
    staleTime: STALE_TIME.LIST,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
    enabled,
  });
  
  // Memoize data to prevent unnecessary re-renders
  const data = React.useMemo(() => 
    (query.data || EMPTY_PRODUCTS) as Product[],
    [query.data]
  );
  
  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useActiveProducts() {
  const { data, isLoading } = useAllProducts();
  const activeProducts = data.filter(p => !p.isDeleted && (p as { isActive?: boolean }).isActive !== false);
  
  return { data: activeProducts, isLoading };
}

/**
 * Helper hook to find a product by ID from cached data.
 * Cache-only: subscribes to the query cache but NEVER triggers a fetch.
 * Data is available if any other component has loaded all products.
 * If cache is cold, findById returns undefined.
 */
export function useProductFinder() {
  const { data } = useAllProducts({ enabled: false });
  
  const findById = React.useCallback(
    (systemId: SystemId | string | undefined): Product | undefined => {
      if (!systemId) return undefined;
      return data.find(p => p.systemId === systemId);
    },
    [data]
  );
  
  return { findById };
}
