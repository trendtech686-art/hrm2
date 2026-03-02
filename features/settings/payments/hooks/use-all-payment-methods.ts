/**
 * useAllPaymentMethods - Convenience hook for components needing all methods as flat array
 * Uses fetchAllPages auto-pagination to load ALL records
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchPaymentMethods } from '../methods/api/payment-methods-api';
import { paymentMethodKeys } from '../methods/hooks/use-payment-methods';

export function useAllPaymentMethods() {
  const query = useQuery({
    queryKey: [...paymentMethodKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchPaymentMethods(p)),
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

export function useDefaultPaymentMethod() {
  const { data, isLoading } = useAllPaymentMethods();
  const defaultMethod = data.find(pm => (pm as { isDefault?: boolean }).isDefault);
  
  return { defaultMethod, isLoading };
}
