/**
 * useAllProductTypes - Convenience hook for components needing all product types as flat array
 * 
 * Replaces legacy useProductTypeStore().data pattern
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchProductTypes } from '../api/product-types-api';
import { productTypeKeys } from './use-product-types';
import type { ProductTypeSettings } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

const EMPTY_TYPES: ProductTypeSettings[] = [];

interface UseAllProductTypesOptions {
  enabled?: boolean;
}

/**
 * Returns all product types as a flat array
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 */
export function useAllProductTypes(options: UseAllProductTypesOptions = {}) {
  const { enabled = true } = options;
  const query = useQuery({
    queryKey: [...productTypeKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchProductTypes(p)),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled,
  });
  
  const data = React.useMemo(() => (query.data ?? EMPTY_TYPES) as ProductTypeSettings[], [query.data]);
  
  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Returns only active product types
 * Replaces legacy getActive() method
 */
export function useActiveProductTypes(options: UseAllProductTypesOptions = {}) {
  const { data, isLoading, isError, error } = useAllProductTypes(options);
  
  const activeTypes = React.useMemo(
    () => data.filter(pt => !pt.isDeleted && pt.isActive !== false),
    [data]
  );
  
  return { data: activeTypes, isLoading, isError, error };
}

/**
 * Returns product types formatted as options for Select/Combobox
 */
export function useProductTypeOptions() {
  const { data, isLoading } = useActiveProductTypes();
  
  const options = React.useMemo(
    () => data.map(pt => ({
      value: pt.systemId,
      label: pt.name,
    })),
    [data]
  );
  
  return { options, isLoading };
}

/**
 * Returns the default product type
 */
export function useDefaultProductType() {
  const { data, isLoading } = useActiveProductTypes();
  const defaultType = data.find(pt => pt.isDefault) || data[0];
  
  return { defaultType, isLoading };
}

/**
 * Helper hook to find a product type by ID from cached data.
 * Cache-only: subscribes to the query cache but NEVER triggers a fetch.
 */
export function useProductTypeFinder() {
  const { data } = useAllProductTypes({ enabled: false });
  
  const findById = React.useCallback(
    (systemId: SystemId | string | undefined): ProductTypeSettings | undefined => {
      if (!systemId) return undefined;
      return data.find(pt => pt.systemId === systemId && !pt.isDeleted);
    },
    [data]
  );
  
  return { findById };
}
