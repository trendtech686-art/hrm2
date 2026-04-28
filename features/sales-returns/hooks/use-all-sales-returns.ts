/**
 * useAllSalesReturns - Convenience hook for components needing all sales returns as flat array
 * 
 * ⚠️ WARNING: Sử dụng filter để giới hạn data!
 * - Dùng startDate/endDate để filter theo ngày
 * - Dùng branchId để filter theo chi nhánh
 * - Dùng status/customerId/orderSystemId để filter cụ thể
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchSalesReturns, type SalesReturnsParams } from '../api/sales-returns-api';
import { salesReturnKeys } from './use-sales-returns';
import type { SalesReturn } from '@/lib/types/prisma-extended';

// Stable empty array to avoid new reference on every render while loading
const EMPTY_SALES_RETURNS: SalesReturn[] = [];

export interface UseAllSalesReturnsOptions extends Pick<SalesReturnsParams, 'startDate' | 'endDate' | 'branchId' | 'status' | 'customerId' | 'orderSystemId' | 'search'> {
  enabled?: boolean;
}

export function useAllSalesReturns(options: UseAllSalesReturnsOptions = {}) {
  const { enabled = true, startDate, endDate, branchId, status, customerId, orderSystemId, search } = options;
  const query = useQuery({
    queryKey: [...salesReturnKeys.all, 'all', { startDate, endDate, branchId, status, customerId, orderSystemId, search }],
    queryFn: () => fetchAllPages((p) => fetchSalesReturns({ ...p, startDate, endDate, branchId, status, customerId, orderSystemId, search })),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled,
  });
  
  return {
    data: query.data || EMPTY_SALES_RETURNS,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
