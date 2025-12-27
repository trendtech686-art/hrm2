/**
 * Shipments React Query Hooks
 * Provides data fetching and mutations for shipment management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchShipments,
  fetchShipmentById,
  createShipment,
  updateShipment,
  deleteShipment,
  updateDeliveryStatus,
  reconcileShipment,
  bulkReconcileShipments,
  syncTrackingInfo,
  printShippingLabel,
  type ShipmentFilters,
  type ShipmentCreateInput,
  type ShipmentUpdateInput,
} from '../api/shipments-api';

// Query keys factory
export const shipmentKeys = {
  all: ['shipments'] as const,
  lists: () => [...shipmentKeys.all, 'list'] as const,
  list: (filters: ShipmentFilters) => [...shipmentKeys.lists(), filters] as const,
  details: () => [...shipmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...shipmentKeys.details(), id] as const,
  byOrder: (orderId: string) => [...shipmentKeys.all, 'order', orderId] as const,
};

/**
 * Hook to fetch shipments with filters
 */
export function useShipments(filters: ShipmentFilters = {}) {
  return useQuery({
    queryKey: shipmentKeys.list(filters),
    queryFn: () => fetchShipments(filters),
    staleTime: 1000 * 60, // 1 minute - shipments change frequently
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
 * Hook to fetch shipments for a specific order
 */
export function useShipmentsByOrder(orderId: string | undefined) {
  return useQuery({
    queryKey: shipmentKeys.byOrder(orderId!),
    queryFn: () => fetchShipments({ orderId: orderId!, limit: 50 }),
    enabled: !!orderId,
    staleTime: 1000 * 60,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing shipment mutations
 */
export function useShipmentMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateShipments = () => {
    queryClient.invalidateQueries({ queryKey: shipmentKeys.all });
  };

  const create = useMutation({
    mutationFn: (data: ShipmentCreateInput) => createShipment(data),
    onSuccess: () => {
      invalidateShipments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: ShipmentUpdateInput }) =>
      updateShipment(systemId, data),
    onSuccess: () => {
      invalidateShipments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deleteShipment(systemId),
    onSuccess: () => {
      invalidateShipments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const updateStatus = useMutation({
    mutationFn: ({ systemId, status, timestamp }: { 
      systemId: string; 
      status: string; 
      timestamp?: string;
    }) => updateDeliveryStatus(systemId, status, timestamp),
    onSuccess: () => {
      invalidateShipments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const reconcile = useMutation({
    mutationFn: (systemId: string) => reconcileShipment(systemId),
    onSuccess: () => {
      invalidateShipments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const bulkReconcile = useMutation({
    mutationFn: (systemIds: string[]) => bulkReconcileShipments(systemIds),
    onSuccess: () => {
      invalidateShipments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const syncTracking = useMutation({
    mutationFn: (systemId: string) => syncTrackingInfo(systemId),
    onSuccess: () => {
      invalidateShipments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const printLabels = useMutation({
    mutationFn: (systemIds: string[]) => printShippingLabel(systemIds),
    onError: options.onError,
  });

  return {
    create,
    update,
    remove,
    updateStatus,
    reconcile,
    bulkReconcile,
    syncTracking,
    printLabels,
    isLoading:
      create.isPending ||
      update.isPending ||
      remove.isPending ||
      updateStatus.isPending ||
      reconcile.isPending ||
      bulkReconcile.isPending ||
      syncTracking.isPending,
  };
}

/**
 * Hook to fetch pending shipments (not reconciled)
 */
export function usePendingShipments() {
  return useShipments({ reconciliationStatus: 'Chưa đối soát' });
}

/**
 * Hook to fetch shipments in transit
 */
export function useShipmentsInTransit() {
  return useShipments({ status: 'Đang giao hàng' });
}
