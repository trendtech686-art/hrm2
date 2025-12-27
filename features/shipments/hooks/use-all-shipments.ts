/**
 * useAllShipments - Convenience hook for components needing all shipments as flat array
 */

import { useShipments } from './use-shipments';

export function useAllShipments() {
  const query = useShipments({});
  
  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
