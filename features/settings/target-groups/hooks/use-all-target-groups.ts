/**
 * useAllTargetGroups - Convenience hook for flat array of target groups
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchTargetGroups } from '../api/target-groups-api';
import { targetGroupKeys } from './use-target-groups';

export function useAllTargetGroups(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: [...targetGroupKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchTargetGroups(p)),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useTargetGroupFinder() {
  const { data: targetGroups = [] } = useAllTargetGroups();
  
  const findById = (systemId: string) => {
    return targetGroups.find(tg => tg.systemId === systemId) ?? null;
  };
  
  return { findById };
}
