/**
 * useAllPriceAdjustments - Convenience hook for flat array of price adjustments
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 */

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchPriceAdjustments } from '../api/price-adjustments-api';
import { priceAdjustmentKeys } from './use-price-adjustments';
import type { PriceAdjustment } from '../types';

export function useAllPriceAdjustments(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: [...priceAdjustmentKeys.all, 'all'],
    queryFn: () => fetchAllPages<PriceAdjustment>((p) => fetchPriceAdjustments(p)),
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

export function usePriceAdjustmentFinder() {
  const { data: adjustments = [] } = useAllPriceAdjustments();

  const findById = useCallback((systemId: string): PriceAdjustment | null => {
    return adjustments.find(a => a.systemId === systemId) ?? null;
  }, [adjustments]);

  return { findById };
}
