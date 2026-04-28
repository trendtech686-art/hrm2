/**
 * useAllShipments - Convenience hook for components needing all shipments as flat array
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 * 
 * ⚠️ WARNING: Sử dụng filter để giới hạn data!
 * - Dùng fromDate/toDate để filter theo ngày
 * - Dùng branchId/carrier/status để filter cụ thể
 * 
 * @param options.enabled - Set to false to disable fetching (lazy load)
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchShipments, type ShipmentFilters } from '../api/shipments-api';
import { shipmentKeys } from './use-shipments';

export interface UseAllShipmentsOptions extends Pick<ShipmentFilters, 'fromDate' | 'toDate' | 'branchId' | 'carrier' | 'status' | 'deliveryStatus' | 'search'> {
  /** Set to false to disable fetching until needed */
  enabled?: boolean;
}

export function useAllShipments(options: UseAllShipmentsOptions = {}) {
  const { enabled = true, fromDate, toDate, branchId, carrier, status, deliveryStatus, search } = options;
  const query = useQuery({
    queryKey: [...shipmentKeys.all, 'all', { fromDate, toDate, branchId, carrier, status, deliveryStatus, search }],
    queryFn: () => fetchAllPages((p) => fetchShipments({ ...p, fromDate, toDate, branchId, carrier, status, deliveryStatus, search })),
    enabled,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * useShipmentCarriers - Lightweight hook for unique carrier names (filter dropdown)
 */
export function useShipmentCarriers() {
  return useQuery({
    queryKey: [...shipmentKeys.all, 'carriers'],
    queryFn: async () => {
      const res = await fetch('/api/shipments/carriers');
      if (!res.ok) throw new Error('Failed to fetch carriers');
      const json = await res.json();
      return (json.data || json) as string[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
