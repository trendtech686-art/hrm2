/**
 * useAllShippingPartners - Convenience hook for components needing all partners as flat array
 */

import { useShippingPartners } from './use-shipping';

export function useAllShippingPartners() {
  const query = useShippingPartners({});
  
  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
