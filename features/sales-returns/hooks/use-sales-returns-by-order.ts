/**
 * useSalesReturnsByOrder - Fetch sales returns filtered by orderSystemId from API
 * 
 * @example
 * const { data: returns } = useSalesReturnsByOrder(orderSystemId);
 */

import { useQuery } from '@tanstack/react-query';
import { fetchSalesReturns } from '../api/sales-returns-api';
import { salesReturnKeys } from './use-sales-returns';
import type { SalesReturn } from '@/lib/types/prisma-extended';

const EMPTY_RETURNS: SalesReturn[] = [];

export function useSalesReturnsByOrder(orderSystemId: string | null | undefined) {
  const query = useQuery({
    queryKey: salesReturnKeys.byOrder(orderSystemId || ''),
    queryFn: async () => {
      if (!orderSystemId) return EMPTY_RETURNS;
      // API uses orderId but accepts both orderSystemId and orderId
      const result = await fetchSalesReturns({ orderId: orderSystemId, limit: 100 });
      return result.data;
    },
    enabled: !!orderSystemId,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    data: query.data || EMPTY_RETURNS,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
