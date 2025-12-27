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
  createShipment,
  syncShipmentStatus,
  cancelShipment,
} from '../api/order-actions-api';
import { orderKeys } from './use-orders';

interface UseOrderActionsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useOrderActions(options: UseOrderActionsOptions = {}) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: orderKeys.all });

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

  return {
    cancel,
    addPayment,
    updateStatus,
    requestPackaging,
    confirmPacking,
    requestShipment,
    syncShipment,
    cancelOrderShipment,
    isLoading: cancel.isPending || addPayment.isPending || updateStatus.isPending || 
               requestPackaging.isPending || confirmPacking.isPending || 
               requestShipment.isPending || syncShipment.isPending || cancelOrderShipment.isPending,
  };
}
