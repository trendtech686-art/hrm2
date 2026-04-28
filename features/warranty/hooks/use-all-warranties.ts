/**
 * useAllWarranties - Convenience hook for components needing all warranties as flat array
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 * 
 * ⚠️ WARNING: Sử dụng filter để giới hạn data!
 * - Dùng startDate/endDate để filter theo ngày
 * - Dùng branchId/status để filter cụ thể
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchWarranties, type WarrantiesParams } from '../api/warranties-api';
import { warrantyKeys } from './use-warranties';

export interface UseAllWarrantiesOptions extends Pick<WarrantiesParams, 'startDate' | 'endDate' | 'branchId' | 'status' | 'search'> {
  enabled?: boolean;
}

export function useAllWarranties(options: UseAllWarrantiesOptions = {}) {
  const { enabled = true, startDate, endDate, branchId, status, search } = options;
  const query = useQuery({
    queryKey: [...warrantyKeys.all, 'all', { startDate, endDate, branchId, status, search }],
    queryFn: () => fetchAllPages((p) => fetchWarranties({ ...p, startDate, endDate, branchId, status, search })),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled,
  });
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
