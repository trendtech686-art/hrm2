/**
 * useAllPriceAdjustments - Convenience hook for flat array of price adjustments
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 */

import { useQuery } from '@tanstack/react-query';
import { fetchPriceAdjustments } from '../api/price-adjustments-api';
import { priceAdjustmentKeys } from './use-price-adjustments';

export function useAllPriceAdjustments(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: [...priceAdjustmentKeys.all, 'all'],
    queryFn: async () => {
      const res = await fetchPriceAdjustments();
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
