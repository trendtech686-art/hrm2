/**
 * useAllPackagingSlips - Convenience hook for components needing all packaging slips as flat array
 * 
 * Auto-pagination: fetches all pages from GET /api/packaging
 * Replaces the pattern of loading ALL orders just to extract packagings.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchPackagingSlips } from '../api/packaging-api';
import { packagingKeys } from './use-packaging';
import type { PackagingSlip } from '@/lib/types/prisma-extended';

interface UseAllPackagingSlipsOptions {
  /** Set to false to disable fetching until needed */
  enabled?: boolean;
}

export function useAllPackagingSlips(options: UseAllPackagingSlipsOptions = {}) {
  const { enabled = true } = options;
  
  const query = useQuery<PackagingSlip[]>({
    queryKey: [...packagingKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchPackagingSlips(p)),
    enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
