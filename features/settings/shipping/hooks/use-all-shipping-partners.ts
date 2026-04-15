/**
 * useAllShippingPartners - Convenience hook for components needing all partners as flat array
 * Uses fetchAllPages auto-pagination to load ALL records
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchShippingPartners } from '../api/shipping-api';
import { shippingPartnerKeys } from './use-shipping';

export function useAllShippingPartners(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: [...shippingPartnerKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchShippingPartners(p)),
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
