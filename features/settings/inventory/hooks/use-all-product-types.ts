/**
 * useAllProductTypes - Convenience hook for components needing all product types as flat array
 * 
 * Replaces legacy useProductTypeStore().data pattern
 */

import * as React from 'react';
import { useProductTypes } from './use-product-types';
import type { ProductType } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

/**
 * Returns all product types as a flat array
 * Compatible with legacy store pattern: { data: productTypes }
 */
export function useAllProductTypes() {
  const query = useProductTypes({ limit: 50 });
  
  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Returns only active product types
 * Replaces legacy getActive() method
 */
export function useActiveProductTypes() {
  const { data, isLoading, isError, error } = useAllProductTypes();
  
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
 * Helper hook to find a product type by ID from cached data
 * Replaces legacy findById() method
 * 
 * Usage:
 *   const { findById } = useProductTypeFinder();
 *   const productType = findById(someSystemId);
 */
export function useProductTypeFinder() {
  const { data } = useAllProductTypes();
  
  const findById = React.useCallback(
    (systemId: SystemId | string | undefined): ProductType | undefined => {
      if (!systemId) return undefined;
      return data.find(pt => pt.systemId === systemId && !pt.isDeleted);
    },
    [data]
  );
  
  return { findById };
}
