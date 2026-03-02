/**
 * useOrderDetailActions - Comprehensive hook for order detail page actions
 * Combines all order-related mutations with backward-compatible API
 */

import { useCallback } from 'react';
import { toast } from 'sonner';
import { useOrderActions } from './use-order-actions';

import type { SystemId } from '@/lib/id-types';

interface UseOrderDetailActionsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface CancelOptions {
  reason?: string;
  restock?: boolean;
}

interface PaymentData {
  amount: number;
  paymentMethodId: string;
  note?: string;
}

export function useOrderDetailActions(options: UseOrderDetailActionsOptions = {}) {
  const actions = useOrderActions(options);

  // ============================================
  // ORDER LIFECYCLE
  // ============================================

  const cancelOrder = useCallback(
    async (orderSystemId: string | SystemId, _employeeSystemId?: string | SystemId, opts?: CancelOptions) => {
      try {
        await actions.cancel.mutateAsync({
          systemId: String(orderSystemId),
          reason: opts?.reason || '',
          restockItems: opts?.restock ?? true,
        });

        toast.success('ÄÃ£ há»§y Ä‘Æ¡n hÃ ng');
      } catch (error) {
        toast.error('Lá»—i khi há»§y Ä‘Æ¡n hÃ ng');
        throw error;
      }
    },
    [actions.cancel]
  );

  const addPayment = useCallback(
    async (orderSystemId: string | SystemId, paymentData: PaymentData, _employeeSystemId?: string | SystemId) => {
      try {
        await actions.addPayment.mutateAsync({
          systemId: String(orderSystemId),
          amount: paymentData.amount,
          paymentMethodId: paymentData.paymentMethodId,
          note: paymentData.note,
        });

        toast.success('ÄÃ£ thÃªm thanh toÃ¡n');
      } catch (error) {
        toast.error('Lá»—i khi thÃªm thanh toÃ¡n');
        throw error;
      }
    },
    [actions.addPayment]
  );

  // ============================================
  // PACKAGING
  // ============================================

  const requestPackaging = useCallback(
    async (orderSystemId: string | SystemId, _employeeSystemId?: string | SystemId, assignedEmployeeId?: string | SystemId) => {
      try {
        await actions.requestPackaging.mutateAsync({
          systemId: String(orderSystemId),
          assignedEmployeeId: assignedEmployeeId ? String(assignedEmployeeId) : undefined,
        });

        toast.success('ÄÃ£ táº¡o yÃªu cáº§u Ä‘Ã³ng gÃ³i');
      } catch (error) {
        toast.error('Lá»—i khi táº¡o yÃªu cáº§u Ä‘Ã³ng gÃ³i');
        throw error;
      }
    },
    [actions.requestPackaging]
  );

  const confirmPackaging = useCallback(
    async (orderSystemId: string | SystemId, packagingSystemId: string | SystemId, _employeeSystemId?: string | SystemId) => {
      try {
        await actions.confirmPacking.mutateAsync({
          systemId: String(orderSystemId),
          packagingId: String(packagingSystemId),
        });

        toast.success('XÃ¡c nháº­n Ä‘Ã³ng gÃ³i thÃ nh cÃ´ng');
      } catch (error) {
        toast.error('Lá»—i khi xÃ¡c nháº­n Ä‘Ã³ng gÃ³i');
        throw error;
      }
    },
    [actions.confirmPacking]
  );

  const cancelPackagingRequest = useCallback(
    async (orderSystemId: string | SystemId, packagingSystemId: string | SystemId, _employeeSystemId?: string | SystemId, reason?: string) => {
      try {
        await actions.cancelPacking.mutateAsync({
          systemId: String(orderSystemId),
          packagingId: String(packagingSystemId),
          reason: reason || '',
        });

        toast.success('Há»§y yÃªu cáº§u Ä‘Ã³ng gÃ³i thÃ nh cÃ´ng');
      } catch (error) {
        toast.error('Lá»—i khi há»§y yÃªu cáº§u Ä‘Ã³ng gÃ³i');
        throw error;
      }
    },
    [actions.cancelPacking]
  );

  // ============================================
  // DELIVERY
  // ============================================

  const processInStorePickup = useCallback(
    async (orderSystemId: string | SystemId, packagingSystemId: string | SystemId, _employeeSystemId?: string | SystemId) => {
      try {
        await actions.selectInStorePickup.mutateAsync({
          systemId: String(orderSystemId),
          packagingId: String(packagingSystemId),
        });

        toast.success('ÄÃ£ chuyá»ƒn sang nháº­n táº¡i cá»­a hÃ ng');
      } catch (error) {
        toast.error('Lá»—i khi xá»­ lÃ½');
        throw error;
      }
    },
    [actions.selectInStorePickup]
  );

  const confirmInStorePickup = useCallback(
    async (orderSystemId: string | SystemId, packagingSystemId: string | SystemId, _employeeSystemId?: string | SystemId) => {
      try {
        await actions.confirmPickup.mutateAsync({
          systemId: String(orderSystemId),
          packagingId: String(packagingSystemId),
        });

        toast.success('XÃ¡c nháº­n khÃ¡ch Ä‘Ã£ nháº­n hÃ ng');
      } catch (error) {
        toast.error('Lá»—i khi xÃ¡c nháº­n');
        throw error;
      }
    },
    [actions.confirmPickup]
  );

  const dispatchFromWarehouse = useCallback(
    async (orderSystemId: string | SystemId, packagingSystemId: string | SystemId, _employeeSystemId?: string | SystemId) => {
      try {
        await actions.dispatch.mutateAsync({
          systemId: String(orderSystemId),
          packagingId: String(packagingSystemId),
        });

        toast.success('Xuáº¥t kho thÃ nh cÃ´ng');
      } catch (error) {
        toast.error('Lá»—i khi xuáº¥t kho');
        throw error;
      }
    },
    [actions.dispatch]
  );

  const completeDelivery = useCallback(
    async (orderSystemId: string | SystemId, packagingSystemId: string | SystemId, _employeeSystemId?: string | SystemId) => {
      try {
        await actions.complete.mutateAsync({
          systemId: String(orderSystemId),
          packagingId: String(packagingSystemId),
        });

        toast.success('Giao hÃ ng thÃ nh cÃ´ng');
      } catch (error) {
        toast.error('Lá»—i khi cáº­p nháº­t tráº¡ng thÃ¡i giao hÃ ng');
        throw error;
      }
    },
    [actions.complete]
  );

  const failDelivery = useCallback(
    async (orderSystemId: string | SystemId, packagingSystemId: string | SystemId, _employeeSystemId?: string | SystemId, reason?: string) => {
      try {
        await actions.fail.mutateAsync({
          systemId: String(orderSystemId),
          packagingId: String(packagingSystemId),
          reason: reason || '',
        });

        toast.success('ÄÃ£ Ä‘Ã¡nh dáº¥u giao hÃ ng tháº¥t báº¡i');
      } catch (error) {
        toast.error('Lá»—i khi cáº­p nháº­t tráº¡ng thÃ¡i');
        throw error;
      }
    },
    [actions.fail]
  );

  const cancelDelivery = useCallback(
    async (orderSystemId: string | SystemId, packagingSystemId: string | SystemId, _employeeSystemId?: string | SystemId, reason?: string, restockItems?: boolean) => {
      try {
        await actions.cancelDelivery.mutateAsync({
          systemId: String(orderSystemId),
          packagingId: String(packagingSystemId),
          reason: reason || '',
          restockItems,
        });

        toast.success('Há»§y giao hÃ ng thÃ nh cÃ´ng');
      } catch (error) {
        toast.error('Lá»—i khi há»§y giao hÃ ng');
        throw error;
      }
    },
    [actions.cancelDelivery]
  );

  // Alias for backward compatibility
  const cancelDeliveryOnly = cancelDelivery;

  // ============================================
  // SHIPMENT
  // ============================================

  const confirmPartnerShipment = useCallback(
    async (orderSystemId: string | SystemId, provider: string, serviceType?: string, packagingId?: string) => {
      try {
        await actions.requestShipment.mutateAsync({
          systemId: String(orderSystemId),
          provider,
          serviceType,
          packagingId,
        });

        toast.success('ÄÃ£ táº¡o váº­n Ä‘Æ¡n');
      } catch (error) {
        toast.error('Lá»—i khi táº¡o váº­n Ä‘Æ¡n');
        throw error;
      }
    },
    [actions.requestShipment]
  );

  // ============================================
  // GHTK
  // ============================================

  const cancelGHTKShipment = useCallback(
    async (orderSystemId: string | SystemId, packagingSystemId: string | SystemId, trackingCode: string) => {
      try {
        await actions.cancelGhtk.mutateAsync({
          systemId: String(orderSystemId),
          packagingId: String(packagingSystemId),
          trackingCode,
        });

        toast.success('ÄÃ£ há»§y váº­n Ä‘Æ¡n GHTK');
        return { success: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Lá»—i khi há»§y váº­n Ä‘Æ¡n GHTK: ${message}`);
        return { success: false, message };
      }
    },
    [actions.cancelGhtk]
  );

  const syncGHTKShipment = useCallback(
    async (orderSystemId: string | SystemId, packagingSystemId: string | SystemId) => {
      try {
        await actions.syncGhtk.mutateAsync({
          systemId: String(orderSystemId),
          packagingId: String(packagingSystemId),
        });

        toast.success('Äá»“ng bá»™ váº­n Ä‘Æ¡n GHTK thÃ nh cÃ´ng');
        return { success: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Lá»—i khi Ä‘á»“ng bá»™: ${message}`);
        return { success: false, message };
      }
    },
    [actions.syncGhtk]
  );

  return {
    // Order lifecycle
    cancelOrder,
    bulkCancelOrders: actions.bulkCancel.mutateAsync,
    addPayment,

    // Packaging
    requestPackaging,
    confirmPackaging,
    cancelPackagingRequest,

    // Delivery - In-store
    processInStorePickup,
    confirmInStorePickup,

    // Delivery - Warehouse/Courier
    dispatchFromWarehouse,
    completeDelivery,
    failDelivery,
    cancelDelivery,
    cancelDeliveryOnly,

    // Shipment
    confirmPartnerShipment,

    // GHTK
    cancelGHTKShipment,
    syncGHTKShipment,

    // Loading states
    isCancelling: actions.cancel.isPending,
    isAddingPayment: actions.addPayment.isPending,
    isRequestingPackaging: actions.requestPackaging.isPending,
    isConfirmingPackaging: actions.confirmPacking.isPending,
    isCancellingPackaging: actions.cancelPacking.isPending,
    isDispatching: actions.dispatch.isPending,
    isCompletingDelivery: actions.complete.isPending,
    isCancellingGhtk: actions.cancelGhtk.isPending,
    isSyncingGhtk: actions.syncGhtk.isPending,
    isLoading:
      actions.cancel.isPending ||
      actions.addPayment.isPending ||
      actions.requestPackaging.isPending ||
      actions.confirmPacking.isPending ||
      actions.cancelPacking.isPending ||
      actions.dispatch.isPending ||
      actions.complete.isPending ||
      actions.cancelGhtk.isPending,
  };
}
