/**
 * useAllPaymentMethods - Convenience hook for components needing all methods as flat array
 * Uses fetchAllPages auto-pagination to load ALL records
 */

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchPaymentMethods } from '../methods/api/payment-methods-api';
import { paymentMethodKeys } from '../methods/hooks/use-payment-methods';

const EMPTY_METHODS: never[] = [];

export function useAllPaymentMethods(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: [...paymentMethodKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchPaymentMethods(p)),
    staleTime: 30 * 60 * 1000, // 30 minutes - settings rarely change
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    enabled: options?.enabled,
  });
  const data = useMemo(() => query.data ?? EMPTY_METHODS, [query.data]);
  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useDefaultPaymentMethod() {
  const { data, isLoading } = useAllPaymentMethods();
  const defaultMethod = data.find(pm => (pm as { isDefault?: boolean }).isDefault);
  
  return { defaultMethod, isLoading };
}
