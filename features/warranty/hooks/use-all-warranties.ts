/**
 * useAllWarranties - Convenience hook for components needing all warranties as flat array
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchWarranties } from '../api/warranties-api';
import { warrantyKeys } from './use-warranties';

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
