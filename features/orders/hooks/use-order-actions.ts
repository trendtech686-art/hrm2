/**
 * useOrderActions - Mutations for order actions (cancel, payment, packaging, shipment)
 * 
 * Updated to use Server Actions for critical mutations (Phase 2 migration)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  updateOrderStatusAction,
  addOrderPaymentAction,
  createPackagingAction,
  confirmPackagingAction,
  cancelPackagingAction,
  processInStorePickupAction,
  confirmInStorePickupAction,
  dispatchOrderAction,
  completeDeliveryAction,
  failDeliveryAction,
  cancelDeliveryAction,
  type CancelOrderInput,
  type BulkCancelOrderInput,
  type UpdateOrderStatusInput,
  type AddOrderPaymentInput,
  type CreatePackagingInput,
  type ConfirmPackagingInput,
  type CancelPackagingInput,
  type ProcessInStorePickupInput,
  type DispatchInput,
  type CompleteDeliveryInput,
  type FailDeliveryInput,
  type CancelDeliveryInput,
} from '@/app/actions/orders';
import { orderKeys } from './use-orders';
import { shipmentKeys } from '@/features/shipments/hooks/use-shipments';
import { productKeys } from '@/features/products/hooks/use-products';

interface UseOrderActionsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useOrderActions(options: UseOrderActionsOptions = {}) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: orderKeys.all });
  const invalidateShipments = () => queryClient.invalidateQueries({ queryKey: shipmentKeys.all });
  // Invalidate products when stock changes (dispatch, complete delivery, etc.)
  const invalidateProducts = () => queryClient.invalidateQueries({ queryKey: productKeys.all });

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
    onSuccess: () => { invalidate(); invalidateProducts(); options.onSuccess?.(); },
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
    onSuccess: () => { invalidate(); invalidateProducts(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const addPayment = useMutation({
    mutationFn: async (input: AddOrderPaymentInput) => {
      const result = await addOrderPaymentAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to add payment');
      }
      return result.data;
    },
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
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
    onSuccess: () => { invalidate(); invalidateShipments(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const confirmPickup = useMutation({
    mutationFn: async (input: ProcessInStorePickupInput) => {
      const result = await confirmInStorePickupAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to confirm in-store pickup');
      }
      return result.data;
    },
    onSuccess: () => { invalidate(); invalidateShipments(); invalidateProducts(); options.onSuccess?.(); },
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
      return result.data;
    },
    onSuccess: () => { invalidate(); invalidateProducts(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const complete = useMutation({
    mutationFn: async (input: CompleteDeliveryInput) => {
      const result = await completeDeliveryAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to complete delivery');
      }
      return result.data;
    },
    onSuccess: () => { invalidate(); invalidateProducts(); options.onSuccess?.(); },
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
    onSuccess: () => { invalidate(); invalidateProducts(); options.onSuccess?.(); },
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
    onSuccess: () => { invalidate(); invalidateProducts(); options.onSuccess?.(); },
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
    isLoading: cancel.isPending || bulkCancel.isPending || addPayment.isPending || updateStatus.isPending || 
               requestPackaging.isPending || confirmPacking.isPending || cancelPacking.isPending ||
               selectInStorePickup.isPending || confirmPickup.isPending ||
               dispatch.isPending || complete.isPending || fail.isPending || cancelDeliveryMutation.isPending ||
               requestShipment.isPending || syncShipment.isPending || cancelOrderShipment.isPending ||
               reconcileCod.isPending || createGhtk.isPending || cancelGhtk.isPending || syncGhtk.isPending,
  };
}
