/**
 * useOrderDetailActions - Comprehensive hook for order detail page actions
 * Combines all order-related mutations with backward-compatible API
 */

import { useCallback } from 'react';
import { toast } from 'sonner';
import { useOrderActions } from './use-order-actions';
import { useOrderStore } from '../store';
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

  // Helper to sync store
  const syncStore = useCallback(() => {
    const storeState = useOrderStore.getState();
    if (storeState.loadFromAPI) {
      storeState.loadFromAPI();
    }
  }, []);

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
        syncStore();
        toast.success('Đã hủy đơn hàng');
      } catch (error) {
        toast.error('Lỗi khi hủy đơn hàng');
        throw error;
      }
    },
    [actions.cancel, syncStore]
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
        syncStore();
        toast.success('Đã thêm thanh toán');
      } catch (error) {
        toast.error('Lỗi khi thêm thanh toán');
        throw error;
      }
    },
    [actions.addPayment, syncStore]
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
        syncStore();
        toast.success('Đã tạo yêu cầu đóng gói');
      } catch (error) {
        toast.error('Lỗi khi tạo yêu cầu đóng gói');
        throw error;
      }
    },
    [actions.requestPackaging, syncStore]
  );

  const confirmPackaging = useCallback(
    async (orderSystemId: string | SystemId, packagingSystemId: string | SystemId, _employeeSystemId?: string | SystemId) => {
      try {
        await actions.confirmPacking.mutateAsync({
          systemId: String(orderSystemId),
          packagingId: String(packagingSystemId),
        });
        syncStore();
        toast.success('Xác nhận đóng gói thành công');
      } catch (error) {
        toast.error('Lỗi khi xác nhận đóng gói');
        throw error;
      }
    },
    [actions.confirmPacking, syncStore]
  );

  const cancelPackagingRequest = useCallback(
    async (orderSystemId: string | SystemId, packagingSystemId: string | SystemId, _employeeSystemId?: string | SystemId, reason?: string) => {
      try {
        await actions.cancelPacking.mutateAsync({
          systemId: String(orderSystemId),
          packagingId: String(packagingSystemId),
          reason: reason || '',
        });
        syncStore();
        toast.success('Hủy yêu cầu đóng gói thành công');
      } catch (error) {
        toast.error('Lỗi khi hủy yêu cầu đóng gói');
        throw error;
      }
    },
    [actions.cancelPacking, syncStore]
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
        syncStore();
        toast.success('Đã chuyển sang nhận tại cửa hàng');
      } catch (error) {
        toast.error('Lỗi khi xử lý');
        throw error;
      }
    },
    [actions.selectInStorePickup, syncStore]
  );

  const confirmInStorePickup = useCallback(
    async (orderSystemId: string | SystemId, packagingSystemId: string | SystemId, _employeeSystemId?: string | SystemId) => {
      try {
        await actions.confirmPickup.mutateAsync({
          systemId: String(orderSystemId),
          packagingId: String(packagingSystemId),
        });
        syncStore();
        toast.success('Xác nhận khách đã nhận hàng');
      } catch (error) {
        toast.error('Lỗi khi xác nhận');
        throw error;
      }
    },
    [actions.confirmPickup, syncStore]
  );

  const dispatchFromWarehouse = useCallback(
    async (orderSystemId: string | SystemId, packagingSystemId: string | SystemId, _employeeSystemId?: string | SystemId) => {
      try {
        await actions.dispatch.mutateAsync({
          systemId: String(orderSystemId),
          packagingId: String(packagingSystemId),
        });
        syncStore();
        toast.success('Xuất kho thành công');
      } catch (error) {
        toast.error('Lỗi khi xuất kho');
        throw error;
      }
    },
    [actions.dispatch, syncStore]
  );

  const completeDelivery = useCallback(
    async (orderSystemId: string | SystemId, packagingSystemId: string | SystemId, _employeeSystemId?: string | SystemId) => {
      try {
        await actions.complete.mutateAsync({
          systemId: String(orderSystemId),
          packagingId: String(packagingSystemId),
        });
        syncStore();
        toast.success('Giao hàng thành công');
      } catch (error) {
        toast.error('Lỗi khi cập nhật trạng thái giao hàng');
        throw error;
      }
    },
    [actions.complete, syncStore]
  );

  const failDelivery = useCallback(
    async (orderSystemId: string | SystemId, packagingSystemId: string | SystemId, _employeeSystemId?: string | SystemId, reason?: string) => {
      try {
        await actions.fail.mutateAsync({
          systemId: String(orderSystemId),
          packagingId: String(packagingSystemId),
          reason: reason || '',
        });
        syncStore();
        toast.success('Đã đánh dấu giao hàng thất bại');
      } catch (error) {
        toast.error('Lỗi khi cập nhật trạng thái');
        throw error;
      }
    },
    [actions.fail, syncStore]
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
        syncStore();
        toast.success('Hủy giao hàng thành công');
      } catch (error) {
        toast.error('Lỗi khi hủy giao hàng');
        throw error;
      }
    },
    [actions.cancelDelivery, syncStore]
  );

  // Alias for backward compatibility
  const cancelDeliveryOnly = cancelDelivery;

  // ============================================
  // SHIPMENT
  // ============================================

  const confirmPartnerShipment = useCallback(
    async (orderSystemId: string | SystemId, provider: string, serviceType?: string) => {
      try {
        await actions.requestShipment.mutateAsync({
          systemId: String(orderSystemId),
          provider,
          serviceType,
        });
        syncStore();
        toast.success('Đã tạo vận đơn');
      } catch (error) {
        toast.error('Lỗi khi tạo vận đơn');
        throw error;
      }
    },
    [actions.requestShipment, syncStore]
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
        syncStore();
        toast.success('Đã hủy vận đơn GHTK');
        return { success: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Lỗi khi hủy vận đơn GHTK: ${message}`);
        return { success: false, message };
      }
    },
    [actions.cancelGhtk, syncStore]
  );

  const syncGHTKShipment = useCallback(
    async (orderSystemId: string | SystemId, packagingSystemId: string | SystemId) => {
      try {
        await actions.syncGhtk.mutateAsync({
          systemId: String(orderSystemId),
          packagingId: String(packagingSystemId),
        });
        syncStore();
        toast.success('Đồng bộ vận đơn GHTK thành công');
        return { success: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Lỗi khi đồng bộ: ${message}`);
        return { success: false, message };
      }
    },
    [actions.syncGhtk, syncStore]
  );

  return {
    // Order lifecycle
    cancelOrder,
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
