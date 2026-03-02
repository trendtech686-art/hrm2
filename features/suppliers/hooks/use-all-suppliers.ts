/**
 * useAllSuppliers - Convenience hook for components needing all suppliers as flat array
 * 
 * Replaces legacy useSupplierStore().data pattern
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchSuppliers } from '../api/suppliers-api';
import { supplierKeys } from './use-suppliers';
import type { Supplier } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

// ✅ Stable empty array to prevent re-renders
const EMPTY_SUPPLIERS: Supplier[] = [];

/**
 * Options for useAllSuppliers hook
 * @property enabled - Whether to fetch data (default: true). Set to false for lazy loading
 */
export interface UseAllSuppliersOptions {
  enabled?: boolean;
}

/**
 * Returns all suppliers as a flat array
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 * 
 * @example
 * // Lazy loading - chỉ load khi cần
 * const { data } = useAllSuppliers({ enabled: isDropdownOpen });
 */
export function useAllSuppliers(options: UseAllSuppliersOptions = {}) {
  const { enabled = true } = options;
  const query = useQuery({
    queryKey: [...supplierKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchSuppliers(p)),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled,
  });
  
  // ✅ Memoize data to prevent unnecessary re-renders
  const data = React.useMemo(() => 
    (query.data || EMPTY_SUPPLIERS) as Supplier[],
    [query.data]
  );
  
  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Returns only active suppliers
 */
export function useActiveSuppliers(options: UseAllSuppliersOptions = {}) {
  const { data, isLoading, isError, error } = useAllSuppliers(options);
  
  const activeSuppliers = React.useMemo(
    () => data.filter(s => s.status === 'Đang Giao Dịch' && !s.isDeleted),
    [data]
  );
  
  return { data: activeSuppliers, isLoading, isError, error };
}

/**
 * Returns suppliers formatted as options for Select/Combobox
 */
export function useSupplierOptions() {
  const { data, isLoading } = useActiveSuppliers();
  
  const options = React.useMemo(
    () => data.map(s => ({
      value: s.systemId,
      label: s.name,
    })),
    [data]
  );
  
  return { options, isLoading };
}

/**
 * Helper hook to find a supplier by ID from cached data
 * Replaces legacy findById() method
 */
export function useSupplierFinder() {
  const { data } = useAllSuppliers();
  
  const findById = React.useCallback(
    (systemId: SystemId | string | undefined): Supplier | undefined => {
      if (!systemId) return undefined;
      return data.find(s => s.systemId === systemId);
    },
    [data]
  );
  
  return { findById };
}
