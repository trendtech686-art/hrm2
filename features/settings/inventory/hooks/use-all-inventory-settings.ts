/**
 * Convenience hooks for inventory settings - flat array access
 */

import { useCallback } from 'react';
import { 
  useProductCategories, 
  useInventoryBrands,
  useImporters 
} from './use-inventory-settings';
import type { ProductCategory, Brand } from '@/lib/types/prisma-extended';

/**
 * Returns all product categories as a flat array
 */
export function useAllProductCategories() {
  const query = useProductCategories();
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Returns active (non-deleted) product categories as a flat array
 */
export function useActiveProductCategories() {
  const { data, isLoading, isError, error } = useAllProductCategories();
  
  const activeCategories = data.filter(c => !c.isDeleted);
  
  return {
    data: activeCategories,
    isLoading,
    isError,
    error,
  };
}

/**
 * Returns product categories formatted as options
 */
export function useProductCategoryOptions() {
  const { data, isLoading } = useAllProductCategories();
  
  const options = data.map(c => ({
    value: c.systemId,
    label: c.name,
  }));
  
  return { options, isLoading };
}

/**
 * Hook for finding category by systemId
 */
export function useProductCategoryFinder() {
  const { data } = useAllProductCategories();
  
  const findById = useCallback((systemId: string): ProductCategory | undefined => {
    return data.find(c => c.systemId === systemId);
  }, [data]);
  
  return { findById };
}

/**
 * Returns all brands as a flat array
 */
export function useAllBrands() {
  const query = useInventoryBrands();
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Returns active (non-deleted) brands as a flat array
 */
export function useActiveBrands() {
  const { data, isLoading, isError, error } = useAllBrands();
  
  const activeBrands = data.filter(b => !b.isDeleted);
  
  return {
    data: activeBrands,
    isLoading,
    isError,
    error,
  };
}

/**
 * Returns brands formatted as options
 */
export function useBrandOptions() {
  const { data, isLoading } = useAllBrands();
  
  const options = data.map(b => ({
    value: b.systemId,
    label: b.name,
  }));
  
  return { options, isLoading };
}

/**
 * Hook for finding brand by systemId
 */
export function useBrandFinder() {
  const { data } = useAllBrands();
  
  const findById = useCallback((systemId: string): Brand | undefined => {
    return data.find(b => b.systemId === systemId);
  }, [data]);
  
  return { findById };
}

/**
 * Returns all importers as a flat array
 */
export function useAllImporters() {
  const query = useImporters();
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
