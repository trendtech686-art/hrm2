/**
 * Delivery Report Data Hooks
 * 
 * Fetches shipment data for delivery reports
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchShipments } from '@/features/shipments/api/shipments-api';
import type { ReportDateRange } from '../types';

/**
 * Fetch all shipments within a date range (server-side filtered)
 */
export function useShipmentsByDateRange(dateRange: ReportDateRange) {
  return useQuery({
    queryKey: ['shipments', 'byDateRange', dateRange.from, dateRange.to],
    queryFn: () => fetchAllPages((p) => fetchShipments({
      ...p,
      fromDate: dateRange.from,
      toDate: dateRange.to,
    })),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!dateRange.from && !!dateRange.to,
  });
}
