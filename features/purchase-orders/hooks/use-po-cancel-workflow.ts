/**
 * Hook cho cancel workflow của PurchaseOrder
 * Tách từ page.tsx để giảm kích thước file
 */
import React from 'react';
import { toast } from 'sonner';
import { toISODate, getCurrentDate } from '@/lib/date-utils';
import { asBusinessId, asSystemId } from '@/lib/id-types';
import type { PurchaseOrder } from '@/lib/types/prisma-extended';
import { usePurchaseOrderStore } from '../store';
import { sumPaymentsForPurchaseOrder } from '../payment-utils';
import { useAllPayments } from '@/features/payments/hooks/use-all-payments';
import { useInventoryReceiptStore } from '@/features/inventory-receipts/store';
import { usePurchaseReturnStore } from '@/features/purchase-returns/store';
import type { PurchaseReturnLineItem } from '@/features/purchase-returns/types';
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
  const { cancelOrder, bulkCancel } = usePurchaseOrderStore();
  const { data: allPayments } = useAllPayments();
  const { data: allReceipts } = useInventoryReceiptStore();
  const { add: addPurchaseReturn, data: allPurchaseReturns } = usePurchaseReturnStore();
  const { employee: loggedInUser } = useAuth();
  
  const currentUserSystemId = loggedInUser?.systemId ?? 'SYSTEM';
  const currentUserName = loggedInUser?.fullName ?? 'Hệ thống';

  const [cancelDialogState, setCancelDialogState] = React.useState<CancelPODialogState>(initialCancelState);

  const handleCancelRequest = React.useCallback((po: PurchaseOrder) => {
    const totalPaid = sumPaymentsForPurchaseOrder(allPayments, po);
    const hasBeenDelivered = po.deliveryStatus !== 'Chưa nhập';

    setCancelDialogState({ 
      isOpen: true, 
      po: po, 
      totalPaid: totalPaid,
      willCreateReturn: hasBeenDelivered 
    });
  }, [allPayments]);

  const closeCancelDialog = React.useCallback(() => {
    setCancelDialogState(initialCancelState);
  }, []);

  const confirmCancel = React.useCallback(() => {
    if (!cancelDialogState.po) return;
    const po = cancelDialogState.po;

    if (cancelDialogState.willCreateReturn) {
      const poSystemId = asSystemId(po.systemId);
      const receiptsForPO = allReceipts.filter(r => r.purchaseOrderSystemId === poSystemId);
      const returnsForPO = allPurchaseReturns.filter(pr => pr.purchaseOrderSystemId === poSystemId);

      const returnItems = po.lineItems
        .map<PurchaseReturnLineItem | null>(item => {
          const totalReceived = receiptsForPO.reduce((sum, receipt) => {
            const receiptItem = receipt.items.find(i => i.productSystemId === item.productSystemId);
            return sum + (receiptItem ? Number(receiptItem.receivedQuantity) : 0);
          }, 0);
          const totalReturned = returnsForPO.reduce((sum, pr) => {
            const returnItem = pr.items.find(i => i.productSystemId === item.productSystemId);
            return sum + (returnItem ? returnItem.returnQuantity : 0);
          }, 0);
          const returnableQuantity = totalReceived - totalReturned;

          if (returnableQuantity <= 0) {
            return null;
          }

          return {
            productSystemId: asSystemId(item.productSystemId),
            productId: asBusinessId(item.productId),
            productName: item.productName,
            orderedQuantity: item.quantity,
            returnQuantity: returnableQuantity,
            unitPrice: item.unitPrice,
          } satisfies PurchaseReturnLineItem;
        })
        .filter((item): item is PurchaseReturnLineItem => Boolean(item));

      if (returnItems.length > 0) {
        const totalReturnValue = returnItems.reduce((sum, item) => sum + (item.returnQuantity * item.unitPrice), 0);

        addPurchaseReturn({
          id: asBusinessId(''),
          purchaseOrderSystemId: asSystemId(po.systemId),
          purchaseOrderId: asBusinessId(po.id),
          supplierSystemId: asSystemId(po.supplierSystemId),
          supplierName: po.supplierName,
          branchSystemId: asSystemId(po.branchSystemId),
          branchName: po.branchName,
          returnDate: toISODate(getCurrentDate()),
          reason: `Tự động tạo khi hủy đơn nhập hàng ${po.id}`,
          items: returnItems,
          totalReturnValue,
          refundAmount: 0,
          refundMethod: '',
          creatorName: currentUserName,
        });
      }
    }

    cancelOrder(po.systemId, currentUserSystemId, currentUserName);
    setCancelDialogState(initialCancelState);
    toast.success('Đã hủy đơn nhập hàng', {
      description: `Đơn ${po.id} đã được hủy`,
    });
  }, [cancelDialogState, allReceipts, allPurchaseReturns, addPurchaseReturn, cancelOrder, currentUserSystemId, currentUserName]);

  const handleBulkCancel = React.useCallback((selectedIds: string[]) => {
    if (selectedIds.length === 0) {
      toast.error('Chưa chọn đơn hàng', {
        description: 'Vui lòng chọn ít nhất một đơn hàng',
      });
      return;
    }
    bulkCancel(selectedIds, currentUserSystemId, currentUserName);
    toast.success('Đã hủy', {
      description: `Đã hủy ${selectedIds.length} đơn nhập hàng`,
    });
  }, [bulkCancel, currentUserSystemId, currentUserName]);

  return {
    cancelDialogState,
    handleCancelRequest,
    closeCancelDialog,
    confirmCancel,
    handleBulkCancel,
  };
}
