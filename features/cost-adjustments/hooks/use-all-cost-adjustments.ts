/**
 * useAllCostAdjustments - Convenience hook for flat array of cost adjustments
 * Returns all cost adjustments (equivalent to old store's data array)
 */

import { useCallback } from 'react';
import { useCostAdjustments } from './use-cost-adjustments';
import type { CostAdjustment } from '../types';

export function useAllCostAdjustments() {
  const { data, ...rest } = useCostAdjustments({});
  return {
    data: data?.data || [],
    ...rest,
  };
}

export function useCostAdjustmentFinder() {
  const { data: adjustments = [] } = useAllCostAdjustments();
  
  const findById = useCallback((systemId: string): CostAdjustment | null => {
    return adjustments.find(a => a.systemId === systemId) ?? null;
  }, [adjustments]);
  
  return { findById };
}
