/**
 * Hook cho receive goods workflow của PurchaseOrder
 * Migrated to React Query - uses server-side APIs
 */
import React from 'react';
import { toast } from 'sonner';
import { formatDateCustom } from '@/lib/date-utils';
import { asSystemId, type SystemId } from '@/lib/id-types';
import type { PurchaseOrder } from '@/lib/types/prisma-extended';
import { usePurchaseOrderMutations } from './use-purchase-orders';
import { useAllInventoryReceipts } from '@/features/inventory-receipts/hooks/use-inventory-receipts';
import { useInventoryReceiptMutations } from '@/features/inventory-receipts/hooks/use-inventory-receipts';
import { useAllBranches } from '@/features/settings/branches/hooks/use-all-branches';
import { useAuth } from '@/contexts/auth-context';

export type ReceiveLineItemForm = {
  productSystemId: SystemId;
  productId: string;
  productName: string;
  orderedQuantity: number;
  remainingQuantity: number;
  receiveQuantity: number;
  unitPrice: number;
};

export type ReceiveDialogState = {
  isOpen: boolean;
  purchaseOrder: PurchaseOrder | null;
  receivedDate: string;
  targetBranchSystemId: SystemId | null;
  targetBranchName: string;
  warehouseName: string;
  documentCode: string;
  notes: string;
  items: ReceiveLineItemForm[];
};

const initialReceiveState: ReceiveDialogState = {
  isOpen: false,
  purchaseOrder: null,
  receivedDate: '',
  targetBranchSystemId: null,
  targetBranchName: '',
  warehouseName: '',
  documentCode: '',
  notes: '',
  items: [],
};

export interface PurchaseOrderReceiveWorkflowOptions {
  enabled?: boolean;
}

export function usePurchaseOrderReceiveWorkflow(options?: PurchaseOrderReceiveWorkflowOptions) {
  const enabled = options?.enabled ?? true;
  const { processReceipt: processReceiptMutation } = usePurchaseOrderMutations({});
  // ⚡ OPTIMIZED: Only load receipts when enabled (receive dialog is open)
  const { data: allReceipts } = useAllInventoryReceipts({ enabled });
  const { create: createInventoryReceipt } = useInventoryReceiptMutations({
    onCreateSuccess: () => {},
    onError: (err) => toast.error(err.message)
  });
  const { data: branches } = useAllBranches({ enabled });
  const { employee: loggedInUser } = useAuth();
  
  const currentUserSystemId = loggedInUser?.systemId ?? 'SYSTEM';
  const _currentUserName = loggedInUser?.fullName ?? 'Hệ thống';

  const [receiveDialogState, setReceiveDialogState] = React.useState<ReceiveDialogState>(initialReceiveState);
  const [pendingReceiveQueue, setPendingReceiveQueue] = React.useState<PurchaseOrder[]>([]);
  const [isSubmittingReceive, setIsSubmittingReceive] = React.useState(false);

  const requireLoggedInEmployee = React.useCallback(() => {
    if (!loggedInUser) {
      toast.error('Chưa xác định người nhận', {
        description: 'Vui lòng đăng nhập để ghi nhận người nhập hàng.',
      });
      return false;
    }
    return true;
  }, [loggedInUser]);

  const computeReceivableItems = React.useCallback((po: PurchaseOrder): ReceiveLineItemForm[] => {
    const relatedReceipts = allReceipts.filter(r => r.purchaseOrderSystemId === asSystemId(po.systemId));
    return po.lineItems
      .map(item => {
        const receivedQty = relatedReceipts.reduce((sum, receipt) => {
          const receiptItem = receipt.items.find(i => i.productSystemId === item.productSystemId);
          return sum + (receiptItem ? Number(receiptItem.receivedQuantity) : 0);
        }, 0);
        const remaining = Math.max(item.quantity - receivedQty, 0);
        return {
          productSystemId: asSystemId(item.productSystemId),
          productId: item.productId,
          productName: item.productName,
          orderedQuantity: item.quantity,
          remainingQuantity: remaining,
          receiveQuantity: remaining,
          unitPrice: item.unitPrice,
        };
      })
      .filter(item => item.remainingQuantity > 0);
  }, [allReceipts]);

  const openReceiveDialogForOrder = React.useCallback((po: PurchaseOrder, presetItems?: ReceiveLineItemForm[]) => {
    const computedItems = presetItems ?? computeReceivableItems(po);
    if (computedItems.length === 0) {
      toast.error('Đơn đã nhận đủ', {
        description: `Đơn ${po.id} không còn số lượng cần nhập`,
      });
      return false;
    }
    const branchMatch = branches.find(b => b.systemId === po.branchSystemId);
    const fallbackBranch = branchMatch ?? branches[0];
    const targetBranchId: SystemId | null =
      fallbackBranch?.systemId ?? (po.branchSystemId ? asSystemId(po.branchSystemId) : null);
    const targetBranchName = fallbackBranch?.name || po.branchName || 'Chưa xác định';

    setReceiveDialogState({
      isOpen: true,
      purchaseOrder: po,
      receivedDate: formatDateCustom(new Date(), "yyyy-MM-dd'T'HH:mm"),
      targetBranchSystemId: targetBranchId,
      targetBranchName,
      warehouseName: po.branchName ? `Kho ${po.branchName}` : '',
      documentCode: '',
      notes: '',
      items: computedItems,
    });
    return true;
  }, [branches, computeReceivableItems]);

  const closeReceiveDialog = React.useCallback(() => {
    setReceiveDialogState(initialReceiveState);
    setPendingReceiveQueue([]);
  }, []);

  const beginReceiveFlow = React.useCallback((orders: PurchaseOrder[]) => {
    if (!requireLoggedInEmployee()) return;
    const receivableEntries = orders
      .map(po => ({ po, items: computeReceivableItems(po) }))
      .filter(entry => entry.items.length > 0);

    if (receivableEntries.length === 0) {
      toast('Không có đơn hợp lệ', {
        description: 'Các đơn đã chọn đều đã nhập đủ hàng.',
      });
      return;
    }

    const [firstEntry, ...restEntries] = receivableEntries;
    setPendingReceiveQueue(restEntries.map(entry => entry.po));
    openReceiveDialogForOrder(firstEntry.po, firstEntry.items);
  }, [computeReceivableItems, openReceiveDialogForOrder, requireLoggedInEmployee]);

  const handleReceiveQuantityChange = React.useCallback((productSystemId: string, value: number) => {
    setReceiveDialogState(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.productSystemId === productSystemId
          ? { ...item, receiveQuantity: Math.min(Math.max(value, 0), item.remainingQuantity) }
          : item
      )
    }));
  }, []);

  const handleReceiveFieldChange = React.useCallback((field: 'documentCode' | 'receivedDate' | 'warehouseName' | 'notes', value: string) => {
    setReceiveDialogState(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleReceiveBranchChange = React.useCallback((branchSystemId: string) => {
    const branch = branches.find(b => b.systemId === branchSystemId);
    const nextSystemId = branch?.systemId ?? (branchSystemId ? asSystemId(branchSystemId) : null);
    setReceiveDialogState(prev => ({
      ...prev,
      targetBranchSystemId: nextSystemId,
      targetBranchName: branch?.name || prev.targetBranchName,
    }));
  }, [branches]);

  const handleSubmitReceiveDialog = React.useCallback(async () => {
    if (!receiveDialogState.purchaseOrder || !requireLoggedInEmployee()) {
      return;
    }

    if (!receiveDialogState.targetBranchSystemId) {
      toast.error('Chưa chọn chi nhánh', {
        description: 'Vui lòng chọn chi nhánh nhận hàng trước khi lưu phiếu.',
      });
      return;
    }

    const itemsToReceive = receiveDialogState.items
      .filter(item => item.receiveQuantity > 0)
      .map(item => ({
        productSystemId: item.productSystemId,
        productId: item.productId,
        productName: item.productName,
        orderedQuantity: item.orderedQuantity,
        receivedQuantity: item.receiveQuantity,
        unitPrice: item.unitPrice,
      }));

    if (itemsToReceive.length === 0) {
      toast.error('Chưa chọn số lượng', {
        description: 'Vui lòng nhập số lượng thực nhận cho ít nhất một sản phẩm.',
      });
      return;
    }

    setIsSubmittingReceive(true);
    try {
      const normalizedDate = receiveDialogState.receivedDate
        ? receiveDialogState.receivedDate.replace('T', ' ')
        : formatDateCustom(new Date(), 'yyyy-MM-dd HH:mm');

      // Calculate allocated fees per unit for cost price
      const totalQuantity = itemsToReceive.reduce((sum, item) => sum + item.receivedQuantity, 0);
      const shippingFee = Number(receiveDialogState.purchaseOrder.shippingFee || 0);
      const otherFees = Number(receiveDialogState.purchaseOrder.tax || 0); // tax field stores other fees
      const allocatedFeePerUnit = totalQuantity > 0 ? (shippingFee + otherFees) / totalQuantity : 0;

      const branchSystemId = receiveDialogState.targetBranchSystemId;
      const receiptPayload: Parameters<typeof createInventoryReceipt.mutateAsync>[0] = {
        type: 'PURCHASE',
        branchId: branchSystemId,
        branchSystemId: branchSystemId,
        branchName: receiveDialogState.targetBranchName,
        purchaseOrderSystemId: receiveDialogState.purchaseOrder.systemId,
        purchaseOrderId: receiveDialogState.purchaseOrder.id || receiveDialogState.purchaseOrder.systemId,
        supplierSystemId: receiveDialogState.purchaseOrder.supplierSystemId,
        supplierName: receiveDialogState.purchaseOrder.supplierName,
        receiptDate: normalizedDate,
        createdBy: currentUserSystemId,
        items: itemsToReceive.map(item => {
          // Cost price = unit price + allocated fees per unit
          const costPrice = item.unitPrice + allocatedFeePerUnit;
          return {
            productId: item.productId || item.productSystemId,
            productSystemId: item.productSystemId,
            productName: item.productName,
            quantity: item.receivedQuantity,
            unitCost: costPrice, // Include allocated fees in cost price
          };
        }),
      };

      // Create the inventory receipt - API also creates stock history AND updates ProductInventory
      // ✅ FIX: Removed duplicate updateInventoryMutation call - createInventoryReceipt already handles:
      //   1. Creating inventory receipt record
      //   2. Updating ProductInventory.onHand
      //   3. Creating StockHistory entries
      // Previously we were calling updateInventoryMutation AGAIN which caused:
      //   - Double inventory update (onHand was incremented twice)
      //   - Duplicate StockHistory entries
      //   - Mismatch between ProductInventory.onHand and StockHistory.newStockLevel
      await createInventoryReceipt.mutateAsync(receiptPayload);

      // Update PO status via API
      await processReceiptMutation.mutateAsync(receiveDialogState.purchaseOrder.systemId);
      
      toast.success('Đã lưu phiếu nhập', {
        description: `Hoàn tất nhập hàng cho đơn ${receiveDialogState.purchaseOrder.id}.`,
      });

      if (pendingReceiveQueue.length > 0) {
        const [next, ...rest] = pendingReceiveQueue;
        setPendingReceiveQueue(rest);
        openReceiveDialogForOrder(next);
      } else {
        closeReceiveDialog();
      }
    } catch (error) {
      toast.error('Lỗi lưu phiếu nhập', {
        description: error instanceof Error ? error.message : 'Đã xảy ra lỗi',
      });
    } finally {
      setIsSubmittingReceive(false);
    }
  }, [
    receiveDialogState, 
    requireLoggedInEmployee, 
    currentUserSystemId, 
    createInventoryReceipt, 
    processReceiptMutation, 
    pendingReceiveQueue, 
    openReceiveDialogForOrder, 
    closeReceiveDialog
  ]);

  return {
    receiveDialogState,
    isSubmittingReceive,
    pendingReceiveQueue,
    beginReceiveFlow,
    openReceiveDialogForOrder,
    closeReceiveDialog,
    handleReceiveQuantityChange,
    handleReceiveFieldChange,
    handleReceiveBranchChange,
    handleSubmitReceiveDialog,
    computeReceivableItems,
  };
}
