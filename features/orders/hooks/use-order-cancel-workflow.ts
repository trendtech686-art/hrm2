/**
 * Hook cho cancel workflow của Order
 * Tách từ page.tsx để giảm kích thước file
 */
import React from 'react';
import { toast } from 'sonner';
import type { Order } from '@/lib/types/prisma-extended';
import { useOrderActions } from './use-order-actions';

export interface CancelOrderState {
  isDialogOpen: boolean;
  orderToCancel: Order | null;
  cancelReason: string;
  shouldRestoreStock: boolean;
}

const initialCancelState: CancelOrderState = {
  isDialogOpen: false,
  orderToCancel: null,
  cancelReason: '',
  shouldRestoreStock: true,
};

export function useOrderCancelWorkflow() {
  const { cancel: cancelOrderMutation } = useOrderActions();
  const [cancelState, setCancelState] = React.useState<CancelOrderState>(initialCancelState);

  const handleCancelRequest = React.useCallback((order: Order) => {
    setCancelState({
      isDialogOpen: true,
      orderToCancel: order,
      cancelReason: '',
      shouldRestoreStock: true,
    });
  }, []);

  const handleCancelDialogClose = React.useCallback(() => {
    setCancelState(initialCancelState);
  }, []);

  const handleReasonChange = React.useCallback((reason: string) => {
    setCancelState(prev => ({ ...prev, cancelReason: reason }));
  }, []);

  const handleRestoreStockChange = React.useCallback((shouldRestore: boolean) => {
    setCancelState(prev => ({ ...prev, shouldRestoreStock: shouldRestore }));
  }, []);

  const confirmCancel = React.useCallback(async () => {
    const { orderToCancel, cancelReason, shouldRestoreStock } = cancelState;
    
    if (!orderToCancel) {
      toast.error('Không tìm thấy đơn hàng cần hủy');
      return;
    }

    if (!cancelReason.trim()) {
      toast.error('Vui lòng nhập lý do hủy đơn');
      return;
    }

    try {
      await cancelOrderMutation.mutateAsync({
        systemId: orderToCancel.systemId,
        reason: cancelReason.trim(),
        restockItems: shouldRestoreStock,
      });
      
      toast.success(`Đã hủy đơn hàng ${orderToCancel.id}`);
      handleCancelDialogClose();
    } catch (error) {
      // Error is handled by mutation's onError
      console.error('Failed to cancel order:', error);
    }
  }, [cancelState, cancelOrderMutation, handleCancelDialogClose]);

  return {
    cancelState,
    handleCancelRequest,
    handleCancelDialogClose,
    handleReasonChange,
    handleRestoreStockChange,
    confirmCancel,
    isCancelling: cancelOrderMutation.isPending,
  };
}
