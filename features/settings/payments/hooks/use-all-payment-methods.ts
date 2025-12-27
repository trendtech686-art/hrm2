/**
 * useAllPaymentMethods - Convenience hook for components needing all methods as flat array
 */

import { usePaymentMethods } from './use-payment-methods';

export function useAllPaymentMethods() {
  const query = usePaymentMethods({});
  
  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useDefaultPaymentMethod() {
  const { data, isLoading } = useAllPaymentMethods();
  const defaultMethod = data.find(pm => (pm as any).isDefault);
  
  return { defaultMethod, isLoading };
}
