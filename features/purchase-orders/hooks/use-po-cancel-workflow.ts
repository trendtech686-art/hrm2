/**
 * Hook cho cancel workflow của PurchaseOrder
 * Migrated to React Query - uses server-side API
 * 
 * ⚡ PERFORMANCE NOTE: This hook is used from list pages where multiple POs
 * could be cancelled. We fetch payments for the specific PO when the dialog opens,
 * rather than loading all payments upfront.
 */
import React from 'react';
import { toast } from 'sonner';
import type { PurchaseOrder } from '@/lib/types/prisma-extended';
import { usePurchaseOrderMutations } from './use-purchase-orders';
import { sumPaymentsForPurchaseOrder } from '../payment-utils';
import { usePurchaseOrderPayments } from './use-po-related-data';
import { useAuth } from '@/contexts/auth-context';

export interface CancelPODialogState {
  isOpen: boolean;
  po: PurchaseOrder | null;
  willCreateReturn?: boolean;
  totalPaid?: number;
}

const initialCancelState: CancelPODialogState = {
  isOpen: false,
  po: null,
};

export function usePurchaseOrderCancelWorkflow() {
  const { employee: loggedInUser } = useAuth();
  
  const currentUserSystemId = loggedInUser?.systemId ?? 'SYSTEM';
  const currentUserName = loggedInUser?.fullName ?? 'Hệ thống';

  const [cancelDialogState, setCancelDialogState] = React.useState<CancelPODialogState>(initialCancelState);
  const [isCancelling, setIsCancelling] = React.useState(false);

  // ⚡ PERFORMANCE: Only fetch payments for the selected PO (when dialog is open)
  const selectedPoSystemId = cancelDialogState.po?.systemId || null;
  const { data: poPayments } = usePurchaseOrderPayments(selectedPoSystemId);

  const { cancel: cancelMutation } = usePurchaseOrderMutations({
    onCancelSuccess: (result) => {
      const poId = result.id;
      setCancelDialogState(initialCancelState);
      setIsCancelling(false);
      
      toast.success('Đã hủy đơn nhập hàng', { 
        description: `Đơn ${poId} đã được hủy` 
      });
    },
    onError: (error) => {
      setIsCancelling(false);
      toast.error('Lỗi hủy đơn hàng', { description: error.message });
    },
  });

  const handleCancelRequest = React.useCallback((po: PurchaseOrder) => {
    const hasBeenDelivered = po.deliveryStatus !== 'Chưa nhập';

    // Set PO first - payments will be fetched via usePurchaseOrderPayments hook
    setCancelDialogState({ 
      isOpen: true, 
      po: po, 
      totalPaid: 0, // Will be calculated after payments are loaded
      willCreateReturn: hasBeenDelivered 
    });
  }, []);

  // ⚡ Update totalPaid when payments are loaded for the selected PO
  React.useEffect(() => {
    if (cancelDialogState.po && poPayments) {
      const totalPaid = sumPaymentsForPurchaseOrder(poPayments, cancelDialogState.po);
      if (totalPaid !== cancelDialogState.totalPaid) {
        setCancelDialogState(prev => ({ ...prev, totalPaid }));
      }
    }
  }, [cancelDialogState.po, cancelDialogState.totalPaid, poPayments]);

  const closeCancelDialog = React.useCallback(() => {
    setCancelDialogState(initialCancelState);
  }, []);

  const confirmCancel = React.useCallback(() => {
    if (!cancelDialogState.po || isCancelling) return;
    const po = cancelDialogState.po;

    setIsCancelling(true);
    
    // Call API - server handles purchase return and receipt creation
    cancelMutation.mutate({
      systemId: po.systemId,
      userId: currentUserSystemId,
      userName: currentUserName,
      reason: cancelDialogState.willCreateReturn 
        ? `Tự động tạo khi hủy đơn nhập hàng ${po.id}` 
        : undefined,
    });
  }, [cancelDialogState, isCancelling, cancelMutation, currentUserSystemId, currentUserName]);

  const handleBulkCancel = React.useCallback((selectedIds: string[]) => {
    if (selectedIds.length === 0) {
      toast.error('Chưa chọn đơn hàng', {
        description: 'Vui lòng chọn ít nhất một đơn hàng',
      });
      return;
    }
    
    // Cancel each order sequentially via API
    let cancelled = 0;
    let failed = 0;
    
    const cancelNext = async (index: number) => {
      if (index >= selectedIds.length) {
        if (cancelled > 0) {
          toast.success('Đã hủy', {
            description: `Đã hủy ${cancelled}/${selectedIds.length} đơn nhập hàng${failed > 0 ? `, ${failed} thất bại` : ''}`,
          });
        }
        return;
      }
      
      try {
        await cancelMutation.mutateAsync({
          systemId: selectedIds[index],
          userId: currentUserSystemId,
          userName: currentUserName,
        });
        cancelled++;
      } catch {
        failed++;
      }
      
      await cancelNext(index + 1);
    };
    
    cancelNext(0);
  }, [cancelMutation, currentUserSystemId, currentUserName]);

  return {
    cancelDialogState,
    handleCancelRequest,
    closeCancelDialog,
    confirmCancel,
    handleBulkCancel,
    isCancelling,
  };
}
