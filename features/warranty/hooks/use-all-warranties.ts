/**
 * useAllWarranties - Convenience hook for components needing all warranties as flat array
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 */

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchWarranties } from '../api/warranties-api';
import { warrantyKeys } from './use-warranties';
import type { WarrantyTicket } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

export function useAllWarranties(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: [...warrantyKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchWarranties(p)),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
  
  return {
    data: query.data || [],
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
