/**
 * useAllProducts - Convenience hook for components needing all products as flat array
 */

import * as React from 'react';
import { useProducts } from './use-products';
import type { Product } from '../types';
import type { SystemId } from '@/lib/id-types';

export function useAllProducts() {
  const query = useProducts({ limit: 50 });
  
  return {
    data: query.data?.data || [] as Product[],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useActiveProducts() {
  const { data, isLoading } = useAllProducts();
  const activeProducts = data.filter(p => !p.isDeleted && (p as any).isActive !== false);
  
  return { data: activeProducts, isLoading };
}

/**
 * Helper hook to find a product by ID from cached data
 * Replaces legacy findById() method
 */
export function useProductFinder() {
  const { data } = useAllProducts();
  
  const findById = React.useCallback(
    (systemId: SystemId | string | undefined): Product | undefined => {
      if (!systemId) return undefined;
      return data.find(p => p.systemId === systemId);
    },
    [data]
  );
  
  return { findById };
}
