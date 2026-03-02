/**
 * useAllCostAdjustments - Convenience hook for flat array of cost adjustments
 * Returns all cost adjustments (equivalent to old store's data array)
 * Uses fetchAllPages auto-pagination to load ALL records
 */

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchCostAdjustments } from '../api/cost-adjustments-api';
import { costAdjustmentKeys } from './use-cost-adjustments';
import type { CostAdjustment } from '../types';

export function useAllCostAdjustments(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: [...costAdjustmentKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchCostAdjustments(p)),
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

export function useCostAdjustmentFinder() {
  const { data: adjustments = [] } = useAllCostAdjustments();
  
  const findById = useCallback((systemId: string): CostAdjustment | null => {
    return adjustments.find(a => a.systemId === systemId) ?? null;
  }, [adjustments]);
  
  return { findById };
}
