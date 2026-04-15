/**
 * useOrderActions - Mutations for order actions (cancel, payment, packaging, shipment)
 * 
 * Updated to use Server Actions for critical mutations (Phase 2 migration)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import {
  createShipment,
  syncShipmentStatus,
  cancelShipment,
  confirmCodReconciliation,
  createGHTKShipment,
  cancelGHTKShipment,
  syncGHTKShipment,
} from '../api/order-actions-api';
import {
  cancelOrderAction,
  bulkCancelOrderAction,
  bulkApproveOrderAction,
  bulkPaymentOrderAction,
  updateOrderStatusAction,
  addOrderPaymentAction,
  createPackagingAction,
  confirmPackagingAction,
  cancelPackagingAction,
  processInStorePickupAction,
  confirmInStorePickupAction,
  dispatchOrderAction,
  startShippingAction,
  completeDeliveryAction,
  failDeliveryAction,
  cancelDeliveryAction,
  type CancelOrderInput,
  type BulkCancelOrderInput,
  type BulkApproveOrderInput,
  type BulkPaymentOrderInput,
  type UpdateOrderStatusInput,
  type AddOrderPaymentInput,
  type CreatePackagingInput,
  type ConfirmPackagingInput,
  type CancelPackagingInput,
  type ProcessInStorePickupInput,
  type DispatchInput,
  type StartShippingInput,
  type CompleteDeliveryInput,
  type FailDeliveryInput,
  type CancelDeliveryInput,
} from '@/app/actions/orders';
import { orderKeys } from './use-orders';

interface UseOrderActionsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useOrderActions(options: UseOrderActionsOptions = {}) {
  const queryClient = useQueryClient();
  const invalidate = () => {
    invalidateRelated(queryClient, 'orders');
  };
  // Force refetch the single order detail to get fresh data immediately
  const refetchOrder = (systemId: string) => {
    queryClient.invalidateQueries({ queryKey: orderKeys.detail(systemId) });
    queryClient.refetchQueries({ queryKey: orderKeys.detail(systemId) });
  };

  // ============================================
  // ORDER LIFECYCLE (Server Actions)
  // ============================================

  const cancel = useMutation({
    mutationFn: async (input: CancelOrderInput) => {
      const result = await cancelOrderAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to cancel order');
      }
      return result.data;
    },
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const bulkCancel = useMutation({
    mutationFn: async (input: BulkCancelOrderInput) => {
      const result = await bulkCancelOrderAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to bulk cancel orders');
      }
      return result.data;
    },
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const bulkApprove = useMutation({
    mutationFn: async (input: BulkApproveOrderInput) => {
      const result = await bulkApproveOrderAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to bulk approve orders');
      }
      return result.data;
    },
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const bulkPayment = useMutation({
    mutationFn: async (input: BulkPaymentOrderInput) => {
      const result = await bulkPaymentOrderAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to bulk pay orders');
      }
      return result.data;
    },
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const addPayment = useMutation({
    mutationFn: async (input: AddOrderPaymentInput) => {
      const result = await addOrderPaymentAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to add payment');
      }
      return { data: result.data, systemId: input.systemId };
    },
    onSuccess: (result) => { 
      invalidate(); 
      refetchOrder(result.systemId); 
      options.onSuccess?.(); 
    },
    onError: options.onError,
  });

  const updateStatus = useMutation({
    mutationFn: async (input: UpdateOrderStatusInput) => {
      const result = await updateOrderStatusAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update status');
      }
      return result.data;
    },
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  // ============================================
  // PACKAGING (Server Actions)
  // ============================================

  const requestPackaging = useMutation({
    mutationFn: async (input: CreatePackagingInput) => {
      const result = await createPackagingAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create packaging');
      }
      return result.data;
    },
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const confirmPacking = useMutation({
    mutationFn: async (input: ConfirmPackagingInput) => {
      const result = await confirmPackagingAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to confirm packaging');
      }
      return result.data;
    },
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const cancelPacking = useMutation({
    mutationFn: async (input: CancelPackagingInput) => {
      const result = await cancelPackagingAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to cancel packaging');
      }
      return result.data;
    },
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  // ============================================
  // DELIVERY - IN-STORE PICKUP (Server Actions)
  // ============================================

  const selectInStorePickup = useMutation({
    mutationFn: async (input: ProcessInStorePickupInput) => {
      const result = await processInStorePickupAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to process in-store pickup');
      }
      return result.data;
    },
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const confirmPickup = useMutation({
    mutationFn: async (input: ProcessInStorePickupInput) => {
      const result = await confirmInStorePickupAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to confirm in-store pickup');
      }
      return { data: result.data, systemId: input.systemId };
    },
    onSuccess: (result) => { 
      invalidate(); 
      refetchOrder(result.systemId); 
      options.onSuccess?.(); 
    },
    onError: options.onError,
  });

  // ============================================
  // DELIVERY - WAREHOUSE DISPATCH (Server Actions)
  // ============================================

  const dispatch = useMutation({
    mutationFn: async (input: DispatchInput) => {
      const result = await dispatchOrderAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to dispatch from warehouse');
      }
      return { data: result.data, systemId: input.systemId };
    },
    onSuccess: (result) => { invalidate(); refetchOrder(result.systemId); options.onSuccess?.(); },
    onError: options.onError,
  });

  const startShipping = useMutation({
    mutationFn: async (input: StartShippingInput) => {
      const result = await startShippingAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to start shipping');
      }
      return { data: result.data, systemId: input.systemId };
    },
    onSuccess: (result) => { invalidate(); refetchOrder(result.systemId); options.onSuccess?.(); },
    onError: options.onError,
  });

  const complete = useMutation({
    mutationFn: async (input: CompleteDeliveryInput) => {
      const result = await completeDeliveryAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to complete delivery');
      }
      return { data: result.data, systemId: input.systemId };
    },
    onSuccess: (result) => { 
      invalidate(); 
      refetchOrder(result.systemId); 
      options.onSuccess?.(); 
    },
    onError: options.onError,
  });

  const fail = useMutation({
    mutationFn: async (input: FailDeliveryInput) => {
      const result = await failDeliveryAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to mark delivery as failed');
      }
      return result.data;
    },
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const cancelDeliveryMutation = useMutation({
    mutationFn: async (input: CancelDeliveryInput) => {
      const result = await cancelDeliveryAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to cancel delivery');
      }
      return result.data;
    },
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  // ============================================
  // SHIPMENT (Generic)
  // ============================================

  const requestShipment = useMutation({
    mutationFn: ({ systemId, provider, serviceType, packagingId }: { systemId: string; provider: string; serviceType?: string; packagingId?: string }) =>
      createShipment(systemId, { provider, serviceType, packagingId }),
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
    bulkCancel,
    bulkApprove,
    bulkPayment,
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
    startShipping,
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
    isLoading: cancel.isPending || bulkCancel.isPending || bulkApprove.isPending || bulkPayment.isPending || addPayment.isPending || updateStatus.isPending || 
               requestPackaging.isPending || confirmPacking.isPending || cancelPacking.isPending ||
               selectInStorePickup.isPending || confirmPickup.isPending ||
               dispatch.isPending || complete.isPending || fail.isPending || cancelDeliveryMutation.isPending ||
               requestShipment.isPending || syncShipment.isPending || cancelOrderShipment.isPending ||
               reconcileCod.isPending || createGhtk.isPending || cancelGhtk.isPending || syncGhtk.isPending,
  };
}
