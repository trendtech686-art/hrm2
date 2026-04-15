/**
 * useAllCostAdjustments - Convenience hook for flat array of cost adjustments
 * Returns all cost adjustments (equivalent to old store's data array)
 */

import { useQuery } from '@tanstack/react-query';
import { fetchCostAdjustments } from '../api/cost-adjustments-api';
import { costAdjustmentKeys } from './use-cost-adjustments';

export function useAllCostAdjustments(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: [...costAdjustmentKeys.all, 'all'],
    queryFn: async () => {
      const res = await fetchCostAdjustments();
      return res.data;
    },
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


