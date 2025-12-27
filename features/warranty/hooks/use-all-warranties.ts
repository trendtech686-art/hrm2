/**
 * useAllWarranties - Convenience hook for components needing all warranties as flat array
 */

import { useCallback } from 'react';
import { useWarranties } from './use-warranties';
import type { WarrantyTicket } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

export function useAllWarranties() {
  const query = useWarranties({});
  
  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Hook providing a findById function for warranties
 */
export function useWarrantyFinder() {
  const { data, isLoading } = useAllWarranties();
  
  const findById = useCallback((systemId: SystemId | string): WarrantyTicket | undefined => {
    if (!systemId) return undefined;
    return data.find(w => w.systemId === systemId);
  }, [data]);
  
  return { findById, isLoading };
}
