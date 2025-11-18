import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '../../lib/date-utils.ts';
import { createCrudStore } from '../../lib/store-factory.ts';
import { data as initialData } from './data.ts';
import type { PurchaseReturn } from './types.ts';
import { useProductStore } from '../products/store.ts';
import { useStockHistoryStore } from '../stock-history/store.ts';
import { useReceiptStore } from '../receipts/store.ts';
import { usePurchaseOrderStore } from '../purchase-orders/store.ts';
import { useCashbookStore } from '../cashbook/store.ts';
import { useReceiptTypeStore } from '../settings/receipt-types/store.ts';
import type { Receipt } from '../receipts/types.ts';
import type { PurchaseOrderRefundStatus } from '../purchase-orders/types.ts';
import { useInventoryReceiptStore } from '../inventory-receipts/store.ts';

const baseStore = createCrudStore<any>(
  initialData as any, 
  'purchase-returns',
  {
    persistKey: 'hrm-purchase-returns' // ✅ Enable localStorage persistence
  }
);

const originalAdd = baseStore.getState().add;

const newAdd = (item: Omit<PurchaseReturn, 'systemId'>) => {
    // 1. Get other stores' methods
    const { updateInventory } = useProductStore.getState();
    const { addEntry: addStockHistory } = useStockHistoryStore.getState();
    const { add: addReceipt } = useReceiptStore.getState();
    const { processReturn: updatePOonReturn, data: allPOs } = usePurchaseOrderStore.getState();
    const { accounts } = useCashbookStore.getState();
    const { data: receiptTypes } = useReceiptTypeStore.getState();
    const { data: allReceipts } = useInventoryReceiptStore.getState();
    
    // 2. Add the return record itself
    originalAdd(item);
    const newReturn = baseStore.getState().data.find(r => r.id === item.id);

    if (!newReturn) return;

    // 3. Update inventory & create stock history
    item.items.forEach(lineItem => {
        if (lineItem.returnQuantity > 0) {
            const productBeforeUpdate = useProductStore.getState().findById(lineItem.productSystemId as any);
            const oldStock = productBeforeUpdate?.inventoryByBranch[item.branchSystemId] || 0;
            
            updateInventory(lineItem.productSystemId as any, item.branchSystemId as any, -lineItem.returnQuantity);            addStockHistory({
                productId: lineItem.productId,
                date: new Date().toISOString(),
                employeeName: item.creatorName,
                action: 'Hoàn trả NCC',
                quantityChange: -lineItem.returnQuantity,
                newStockLevel: oldStock - lineItem.returnQuantity,
                documentId: newReturn.systemId, // ✅ Fixed: Use systemId for document reference
                branchSystemId: item.branchSystemId,
                branch: item.branchName,
            });
        }
    });

    // 4. Create receipt when supplier refunds money (supplier pays company)
    if (item.refundAmount > 0) {
        const receiptCategory = receiptTypes.find(pt => pt.name === 'Nhà cung cấp hoàn tiền');
        if (item.accountSystemId) {
            const newReceipt: Omit<Receipt, 'systemId'> = {
                id: '' as any, // Let receipt store auto-generate PT-XXXXXX
                date: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
                amount: item.refundAmount,
                payerType: 'Nhà cung cấp', // Supplier is paying (refunding)
                payerName: item.supplierName,
                description: `Nhận hoàn tiền cho đơn nhập ${item.purchaseOrderId} (Phiếu trả hàng ${item.id})`,
                paymentMethod: item.refundMethod,
                accountSystemId: item.accountSystemId,
                paymentReceiptTypeSystemId: receiptCategory?.systemId || '',
                paymentReceiptTypeName: receiptCategory?.name || 'Nhà cung cấp hoàn tiền',
                branchSystemId: item.branchSystemId,
                branchName: item.branchName,
                createdBy: item.creatorName,
                createdAt: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
                status: 'completed',
                category: 'other',
                affectsDebt: true,
            };
            addReceipt(newReceipt);
        }
    }

    // 5. Update the original Purchase Order's status
    const po = allPOs.find(p => p.systemId === item.purchaseOrderId); // ✅ Fixed: Match by systemId
    if (po) {
        // A full check would require summing all returns for this PO.
        const allItems = po.lineItems;
        const allReturnedItems = baseStore.getState().data
            .filter(pr => pr.purchaseOrderId === po.systemId) // ✅ Fixed: Use systemId
            .flatMap(pr => pr.items);
            
        const receiptsForPO = allReceipts.filter(r => r.purchaseOrderId === po.systemId); // ✅ Fixed: Use systemId

        const isFullReturn = allItems.every(poItem => {
            const totalReceived = receiptsForPO.reduce((sum, receipt) => {
                const receiptItem = receipt.items.find(i => i.productSystemId === poItem.productSystemId);
                return sum + (receiptItem ? Number(receiptItem.receivedQuantity) : 0);
            }, 0);

            const totalReturned = allReturnedItems
                .filter(returnedItem => returnedItem.productSystemId === poItem.productSystemId)
                .reduce((sum, returnedItem) => sum + returnedItem.returnQuantity, 0);
            
            return totalReturned >= totalReceived;
        });
        
        const existingReturnsForPO = baseStore.getState().data.filter(pr => pr.purchaseOrderId === po.systemId && pr.systemId !== newReturn.systemId); // ✅ Fixed: Match by systemId
        const allReturnsForPO = [...existingReturnsForPO, newReturn];
        const totalReturnedValue = allReturnsForPO.reduce((sum, r) => sum + r.totalReturnValue, 0);
        const totalRefunded = allReturnsForPO.reduce((sum, r) => sum + r.refundAmount, 0);

        let newRefundStatus: PurchaseOrderRefundStatus = po.refundStatus || 'Chưa hoàn tiền';
        if (totalReturnedValue > 0) {
            if (totalRefunded >= totalReturnedValue) {
                newRefundStatus = 'Hoàn tiền toàn bộ';
            } else if (totalRefunded > 0) {
                newRefundStatus = 'Hoàn tiền một phần';
            } else {
                newRefundStatus = 'Chưa hoàn tiền';
            }
        }

        updatePOonReturn(po.id, isFullReturn, newRefundStatus, newReturn.id, newReturn.creatorName);
    }
};

const otherMethods = {
  findByPurchaseOrderId: (purchaseOrderId: string) => {
    return baseStore.getState().data.filter(pr => pr.purchaseOrderId === purchaseOrderId);
  }
};

// Export typed hook
export const usePurchaseReturnStore = (): any => {
  const state = baseStore();
  return {
    ...state,
    add: newAdd,
    ...otherMethods,
  };
};

// Export getState for non-hook usage
usePurchaseReturnStore.getState = (): any => {
  const state = baseStore.getState();
  return {
    ...state,
    add: newAdd,
    ...otherMethods,
  };
};
