/**
 * useAllSalesChannels - Convenience hook for flat array of sales channels
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchSalesChannels } from '../api/sales-channels-api';
import { salesChannelKeys } from './use-sales-channels';

export function useAllSalesChannels() {
  const query = useQuery({
    queryKey: [...salesChannelKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchSalesChannels(p)),
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
