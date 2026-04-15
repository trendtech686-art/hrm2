/**
 * Shipments React Query Hooks
 * Provides data fetching and mutations for shipment management
 * 
 * Updated to use Server Actions for mutations (Phase 2 migration)
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useAllShipments } from './use-all-shipments';
import {
  fetchShipments,
  fetchShipmentById,
  type ShipmentFilters,
} from '../api/shipments-api';

// Query keys factory
export const shipmentKeys = {
  all: ['shipments'] as const,
  lists: () => [...shipmentKeys.all, 'list'] as const,
  list: (filters: ShipmentFilters) => [...shipmentKeys.lists(), filters] as const,
  details: () => [...shipmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...shipmentKeys.details(), id] as const,
  byOrder: (orderId: string) => [...shipmentKeys.all, 'order', orderId] as const,
  stats: () => [...shipmentKeys.all, 'stats'] as const,
};

// Types for initial data from Server Components
export interface ShipmentStats {
  pending: number;
  inTransit: number; // Maps to 'shipped' in some places
  delivered: number;
  returned: number;
}

/**
 * Hook for shipment statistics with optional initial data from Server Component
 */
export function useShipmentStats(initialData?: ShipmentStats) {
  return useQuery({
    queryKey: shipmentKeys.stats(),
    queryFn: async () => {
      const res = await fetch('/api/shipments/stats');
      if (!res.ok) throw new Error('Không thể tải thống kê vận đơn');
      return res.json() as Promise<ShipmentStats>;
    },
    initialData,
    staleTime: initialData ? 60_000 : 0,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch shipments with filters
 */
export function useShipments(filters: ShipmentFilters = {}) {
  return useQuery({
    queryKey: shipmentKeys.list(filters),
    queryFn: () => fetchShipments(filters),
    staleTime: 1000 * 60, // 1 minute - shipments change frequently
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to fetch single shipment
 */
export function useShipmentById(systemId: string | undefined) {
  return useQuery({
    queryKey: shipmentKeys.detail(systemId!),
    queryFn: () => fetchShipmentById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Finder hook for looking up shipments by various IDs.
 * Cache-only: subscribes to the query cache but NEVER triggers a fetch.
 */
export function useShipmentFinder() {
  const { data } = useAllShipments({ enabled: false });

  const findById = (systemId: string | undefined) => {
    if (!systemId) return undefined;
    return data.find((s) => s.systemId === systemId);
  };

  const findByPackagingSystemId = (packagingSystemId: string | undefined) => {
    if (!packagingSystemId) return undefined;
    return data.find((s) => s.packagingSystemId === packagingSystemId);
  };

  const findByTrackingCode = (trackingCode: string | undefined) => {
    if (!trackingCode) return undefined;
    return data.find((s) => s.trackingCode === trackingCode);
  };

  return {
    findById,
    findByPackagingSystemId,
    findByTrackingCode,
  };
}

