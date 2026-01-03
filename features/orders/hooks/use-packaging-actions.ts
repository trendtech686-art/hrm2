/**
 * usePackagingActions - Wrapper hook for packaging-specific actions
 * Provides backward-compatible API for migrating from useOrderStore
 */

import { useCallback } from 'react';
import { toast } from 'sonner';
import { useOrderActions } from './use-order-actions';
import { useOrderStore } from '../store';

interface UsePackagingActionsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for packaging actions with store sync
 * Uses React Query mutations but also syncs to Zustand store for backward compatibility
 */
export function usePackagingActions(options: UsePackagingActionsOptions = {}) {
  const actions = useOrderActions(options);
  
  // Helper to sync store
  const syncStore = useCallback(() => {
    const storeState = useOrderStore.getState();
    if (storeState.loadFromAPI) {
      storeState.loadFromAPI();
    }
  }, []);
  
  // Confirm packaging
  const confirmPackaging = useCallback(
    async (orderSystemId: string, packagingSystemId: string, _employeeSystemId?: string) => {
      try {
        await actions.confirmPacking.mutateAsync({
          systemId: orderSystemId,
          packagingId: packagingSystemId,
        });
        
        // Sync to zustand store for backward compatibility
        syncStore();
        
        toast.success('Xác nhận đóng gói thành công');
      } catch (error) {
        toast.error('Lỗi khi xác nhận đóng gói');
        throw error;
      }
    },
    [actions.confirmPacking, syncStore]
  );

  // Cancel packaging request
  const cancelPackagingRequest = useCallback(
    async (orderSystemId: string, packagingSystemId: string, _employeeSystemId?: string, reason?: string) => {
      try {
        await actions.cancelPacking.mutateAsync({
          systemId: orderSystemId,
          packagingId: packagingSystemId,
          reason: reason || '',
        });
        
        // Sync to zustand store
        syncStore();
        
        toast.success('Hủy yêu cầu đóng gói thành công');
      } catch (error) {
        toast.error('Lỗi khi hủy yêu cầu đóng gói');
        throw error;
      }
    },
    [actions.cancelPacking, syncStore]
  );

  // Dispatch from warehouse
  const dispatchFromWarehouse = useCallback(
    async (orderSystemId: string, packagingSystemId: string) => {
      try {
        await actions.dispatch.mutateAsync({
          systemId: orderSystemId,
          packagingId: packagingSystemId,
        });
        
        // Sync to zustand store
        syncStore();
        
        toast.success('Xuất kho thành công');
      } catch (error) {
        toast.error('Lỗi khi xuất kho');
        throw error;
      }
    },
    [actions.dispatch, syncStore]
  );

  // Complete delivery
  const completeDelivery = useCallback(
    async (orderSystemId: string, packagingSystemId: string) => {
      try {
        await actions.complete.mutateAsync({
          systemId: orderSystemId,
          packagingId: packagingSystemId,
        });
        
        // Sync to zustand store
        syncStore();
        
        toast.success('Giao hàng thành công');
      } catch (error) {
        toast.error('Lỗi khi cập nhật trạng thái giao hàng');
        throw error;
      }
    },
    [actions.complete, syncStore]
  );

  // Fail delivery
  const failDelivery = useCallback(
    async (orderSystemId: string, packagingSystemId: string, reason: string) => {
      try {
        await actions.fail.mutateAsync({
          systemId: orderSystemId,
          packagingId: packagingSystemId,
          reason,
        });
        
        // Sync to zustand store
        syncStore();
        
        toast.success('Đã đánh dấu giao hàng thất bại');
      } catch (error) {
        toast.error('Lỗi khi cập nhật trạng thái');
        throw error;
      }
    },
    [actions.fail, syncStore]
  );

  // Cancel delivery
  const cancelDelivery = useCallback(
    async (orderSystemId: string, packagingSystemId: string, reason: string, restockItems?: boolean) => {
      try {
        await actions.cancelDelivery.mutateAsync({
          systemId: orderSystemId,
          packagingId: packagingSystemId,
          reason,
          restockItems,
        });
        
        // Sync to zustand store
        syncStore();
        
        toast.success('Hủy giao hàng thành công');
      } catch (error) {
        toast.error('Lỗi khi hủy giao hàng');
        throw error;
      }
    },
    [actions.cancelDelivery, syncStore]
  );

  // In-store pickup
  const processInStorePickup = useCallback(
    async (orderSystemId: string, packagingSystemId: string) => {
      try {
        await actions.selectInStorePickup.mutateAsync({
          systemId: orderSystemId,
          packagingId: packagingSystemId,
        });
        
        // Sync to zustand store
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
    async (orderSystemId: string, packagingSystemId: string) => {
      try {
        await actions.confirmPickup.mutateAsync({
          systemId: orderSystemId,
          packagingId: packagingSystemId,
        });
        
        // Sync to zustand store
        syncStore();
        
        toast.success('Xác nhận khách đã nhận hàng');
      } catch (error) {
        toast.error('Lỗi khi xác nhận');
        throw error;
      }
    },
    [actions.confirmPickup, syncStore]
  );

  return {
    // Packaging
    confirmPackaging,
    cancelPackagingRequest,
    
    // Delivery
    dispatchFromWarehouse,
    completeDelivery,
    failDelivery,
    cancelDelivery,
    
    // In-store pickup
    processInStorePickup,
    confirmInStorePickup,
    
    // Loading states
    isConfirming: actions.confirmPacking.isPending,
    isCancelling: actions.cancelPacking.isPending,
    isDispatching: actions.dispatch.isPending,
    isLoading: actions.confirmPacking.isPending || actions.cancelPacking.isPending || actions.dispatch.isPending,
  };
}
