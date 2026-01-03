/**
 * useOrderActions - Mutations for order actions (cancel, payment, packaging, shipment)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  cancelOrder,
  addOrderPayment,
  updateOrderStatus,
  createPackaging,
  confirmPackaging,
  cancelPackagingRequest,
  processInStorePickup,
  confirmInStorePickup,
  dispatchFromWarehouse,
  completeDelivery,
  failDelivery,
  cancelDelivery,
  createShipment,
  syncShipmentStatus,
  cancelShipment,
  confirmCodReconciliation,
  createGHTKShipment,
  cancelGHTKShipment,
  syncGHTKShipment,
} from '../api/order-actions-api';
import { orderKeys } from './use-orders';

interface UseOrderActionsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useOrderActions(options: UseOrderActionsOptions = {}) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: orderKeys.all });

  // ============================================
  // ORDER LIFECYCLE
  // ============================================

  const cancel = useMutation({
    mutationFn: ({ systemId, reason, restockItems }: { systemId: string; reason: string; restockItems: boolean }) =>
      cancelOrder(systemId, { reason, restockItems }),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const addPayment = useMutation({
    mutationFn: ({ systemId, ...data }: { systemId: string; amount: number; paymentMethodId: string; note?: string }) =>
      addOrderPayment(systemId, data),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const updateStatus = useMutation({
    mutationFn: ({ systemId, status }: { systemId: string; status: string }) =>
      updateOrderStatus(systemId, status),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  // ============================================
  // PACKAGING
  // ============================================

  const requestPackaging = useMutation({
    mutationFn: ({ systemId, assignedEmployeeId }: { systemId: string; assignedEmployeeId?: string }) =>
      createPackaging(systemId, { assignedEmployeeId }),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const confirmPacking = useMutation({
    mutationFn: ({ systemId, packagingId }: { systemId: string; packagingId: string }) =>
      confirmPackaging(systemId, packagingId),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const cancelPacking = useMutation({
    mutationFn: ({ systemId, packagingId, reason }: { systemId: string; packagingId: string; reason: string }) =>
      cancelPackagingRequest(systemId, packagingId, { reason }),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  // ============================================
  // DELIVERY - IN-STORE PICKUP
  // ============================================

  const selectInStorePickup = useMutation({
    mutationFn: ({ systemId, packagingId }: { systemId: string; packagingId: string }) =>
      processInStorePickup(systemId, packagingId),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const confirmPickup = useMutation({
    mutationFn: ({ systemId, packagingId }: { systemId: string; packagingId: string }) =>
      confirmInStorePickup(systemId, packagingId),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  // ============================================
  // DELIVERY - WAREHOUSE DISPATCH
  // ============================================

  const dispatch = useMutation({
    mutationFn: ({ systemId, packagingId }: { systemId: string; packagingId: string }) =>
      dispatchFromWarehouse(systemId, packagingId),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const complete = useMutation({
    mutationFn: ({ systemId, packagingId }: { systemId: string; packagingId: string }) =>
      completeDelivery(systemId, packagingId),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const fail = useMutation({
    mutationFn: ({ systemId, packagingId, reason }: { systemId: string; packagingId: string; reason: string }) =>
      failDelivery(systemId, packagingId, { reason }),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const cancelDeliveryMutation = useMutation({
    mutationFn: ({ systemId, packagingId, reason, restockItems }: { systemId: string; packagingId: string; reason: string; restockItems?: boolean }) =>
      cancelDelivery(systemId, packagingId, { reason, restockItems }),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  // ============================================
  // SHIPMENT (Generic)
  // ============================================

  const requestShipment = useMutation({
    mutationFn: ({ systemId, provider, serviceType }: { systemId: string; provider: string; serviceType?: string }) =>
      createShipment(systemId, { provider, serviceType }),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const syncShipment = useMutation({
    mutationFn: (systemId: string) => syncShipmentStatus(systemId),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const cancelOrderShipment = useMutation({
    mutationFn: (systemId: string) => cancelShipment(systemId),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  // ============================================
  // COD RECONCILIATION
  // ============================================

  const reconcileCod = useMutation({
    mutationFn: (data: { shipments: Array<{ systemId: string; orderSystemId: string; codAmount: number }> }) =>
      confirmCodReconciliation(data),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  // ============================================
  // GHTK INTEGRATION
  // ============================================

  const createGhtk = useMutation({
    mutationFn: ({ systemId, packagingId, data }: { systemId: string; packagingId: string; data: Record<string, unknown> }) =>
      createGHTKShipment(systemId, packagingId, data),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const cancelGhtk = useMutation({
    mutationFn: ({ systemId, packagingId, trackingCode }: { systemId: string; packagingId: string; trackingCode: string }) =>
      cancelGHTKShipment(systemId, packagingId, trackingCode),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const syncGhtk = useMutation({
    mutationFn: ({ systemId, packagingId }: { systemId: string; packagingId: string }) =>
      syncGHTKShipment(systemId, packagingId),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  return {
    // Order lifecycle
    cancel,
    addPayment,
    updateStatus,
    
    // Packaging
    requestPackaging,
    confirmPacking,
    cancelPacking,
    
    // Delivery - In-store
    selectInStorePickup,
    confirmPickup,
    
    // Delivery - Warehouse/Courier
    dispatch,
    complete,
    fail,
    cancelDelivery: cancelDeliveryMutation,
    
    // Shipment
    requestShipment,
    syncShipment,
    cancelOrderShipment,
    
    // COD
    reconcileCod,
    
    // GHTK
    createGhtk,
    cancelGhtk,
    syncGhtk,
    
    // Loading states
    isLoading: cancel.isPending || addPayment.isPending || updateStatus.isPending || 
               requestPackaging.isPending || confirmPacking.isPending || cancelPacking.isPending ||
               selectInStorePickup.isPending || confirmPickup.isPending ||
               dispatch.isPending || complete.isPending || fail.isPending || cancelDeliveryMutation.isPending ||
               requestShipment.isPending || syncShipment.isPending || cancelOrderShipment.isPending ||
               reconcileCod.isPending || createGhtk.isPending || cancelGhtk.isPending || syncGhtk.isPending,
  };
}
