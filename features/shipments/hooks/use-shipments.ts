/**
 * Shipments React Query Hooks
 * Provides data fetching and mutations for shipment management
 * 
 * Updated to use Server Actions for mutations (Phase 2 migration)
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useAllShipments } from './use-all-shipments';
import {
  fetchShipments,
  fetchShipmentById,
  updateDeliveryStatus,
  reconcileShipment,
  bulkReconcileShipments,
  syncTrackingInfo,
  printShippingLabel,
  type ShipmentFilters,
  type ShipmentCreateInput,
  type ShipmentUpdateInput,
} from '../api/shipments-api';
import {
  createShipmentAction,
  updateShipmentAction,
  deleteShipmentAction,
  type CreateShipmentInput,
  type UpdateShipmentInput,
} from '@/app/actions/shipments';
import type { Shipment } from '@/lib/types/prisma-extended';

// Re-export types for backwards compatibility
export type { CreateShipmentInput, UpdateShipmentInput };

// Legacy format support
type LegacyUpdateInput = { systemId: string; data: ShipmentUpdateInput };

function toUpdateShipmentInput(input: UpdateShipmentInput | LegacyUpdateInput): UpdateShipmentInput {
  const i = input as Record<string, unknown>;
  if (i.data && typeof i.data === 'object') {
    const legacy = input as LegacyUpdateInput;
    const d = legacy.data as Record<string, unknown>;
    return {
      systemId: legacy.systemId,
      trackingCode: d.trackingCode as string | undefined,
      carrier: d.carrier as string | undefined,
      service: d.service as string | undefined,
      deliveryStatus: d.deliveryStatus as string | undefined,
      printStatus: d.printStatus as string | undefined,
      shippingFeeToPartner: d.shippingFeeToPartner as number | undefined,
      codAmount: d.codAmount as number | undefined,
      payer: d.payer as string | undefined,
      reconciliationStatus: d.reconciliationStatus as string | undefined,
      partnerStatus: d.partnerStatus as string | undefined,
    };
  }
  return input as UpdateShipmentInput;
}

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
      if (!res.ok) throw new Error('Failed to fetch shipment stats');
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
 * Hook to fetch shipments for a specific order
 */
export function useShipmentsByOrder(orderId: string | undefined) {
  return useQuery({
    queryKey: shipmentKeys.byOrder(orderId!),
    queryFn: () => fetchShipments({ orderId: orderId! }),
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
    mutationFn: async (data: CreateShipmentInput | ShipmentCreateInput) => {
      const input = data as CreateShipmentInput;
      const result = await createShipmentAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create shipment');
      }
      return result.data as Shipment;
    },
    onSuccess: () => {
      invalidateShipments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: async (input: UpdateShipmentInput | LegacyUpdateInput) => {
      const converted = toUpdateShipmentInput(input);
      const result = await updateShipmentAction(converted);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update shipment');
      }
      return result.data as Shipment;
    },
    onSuccess: () => {
      invalidateShipments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deleteShipmentAction({ systemId });
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete shipment');
      }
      return result.data;
    },
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

/**
 * Finder hook for looking up shipments by various IDs
 * Replaces useShipmentStore().findById pattern
 */
export function useShipmentFinder() {
  const { data } = useAllShipments();

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

