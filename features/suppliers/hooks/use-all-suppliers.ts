/**
 * useAllSuppliers - Convenience hook for components needing all suppliers as flat array
 * 
 * Replaces legacy useSupplierStore().data pattern
 */

import * as React from 'react';
import { useSuppliers } from './use-suppliers';
import type { Supplier } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

/**
 * Returns all suppliers as a flat array
 * Compatible with legacy store pattern: { data: suppliers }
 */
export function useAllSuppliers() {
  const query = useSuppliers({ limit: 500 });
  
  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Returns only active suppliers
 */
export function useActiveSuppliers() {
  const { data, isLoading, isError, error } = useAllSuppliers();
  
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
