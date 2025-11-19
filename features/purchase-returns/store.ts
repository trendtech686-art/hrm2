import { formatDateCustom, getCurrentDate } from '../../lib/date-utils.ts';
import { createCrudStore, type CrudState } from '../../lib/store-factory.ts';
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
import { asBusinessId, asSystemId, type SystemId } from '@/lib/id-types';

const baseStore = createCrudStore<PurchaseReturn>(
  initialData,
  'purchase-returns',
  {
    persistKey: 'hrm-purchase-returns',
  }
);

const originalAdd = baseStore.getState().add;

const newAdd = (item: Omit<PurchaseReturn, 'systemId'>): PurchaseReturn | undefined => {
    // 1. Get other stores' methods
    const { updateInventory } = useProductStore.getState();
    const { addEntry: addStockHistory } = useStockHistoryStore.getState();
    const { add: addReceipt } = useReceiptStore.getState();
    const { processReturn: updatePOonReturn, data: allPOs } = usePurchaseOrderStore.getState();
    const { accounts } = useCashbookStore.getState();
    const { data: receiptTypes } = useReceiptTypeStore.getState();
    const { data: allReceipts } = useInventoryReceiptStore.getState();
    
    // 2. Add the return record itself
    const newReturn = originalAdd(item);

    if (!newReturn) {
      return undefined;
    }

    // 3. Update inventory & create stock history
    newReturn.items.forEach(lineItem => {
        if (lineItem.returnQuantity > 0) {
            const productBeforeUpdate = useProductStore.getState().findById(lineItem.productSystemId);
            const oldStock = productBeforeUpdate?.inventoryByBranch[newReturn.branchSystemId] || 0;
            
            updateInventory(lineItem.productSystemId, newReturn.branchSystemId, -lineItem.returnQuantity);
            addStockHistory({
                productId: lineItem.productSystemId,
                date: new Date().toISOString(),
                employeeName: newReturn.creatorName,
                action: 'Hoàn trả NCC',
                quantityChange: -lineItem.returnQuantity,
                newStockLevel: oldStock - lineItem.returnQuantity,
                documentId: newReturn.id,
                branchSystemId: newReturn.branchSystemId,
                branch: newReturn.branchName,
            });
        }
    });

    // 4. Create receipt when supplier refunds money (supplier pays company)
    if (newReturn.refundAmount > 0) {
      const receiptCategory = receiptTypes.find(pt => pt.name === 'Nhà cung cấp hoàn tiền');
      if (newReturn.accountSystemId) {
        const account = accounts.find(acc => acc.systemId === newReturn.accountSystemId);
        const issuedAt = formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm');

        const refundReceipt: Omit<Receipt, 'systemId'> = {
          id: asBusinessId(''), // Let receipt store auto-generate PT-XXXXXX
          date: issuedAt,
          amount: newReturn.refundAmount,

          // Payer info (TargetGroup placeholder)
          payerTypeSystemId: asSystemId('NHACUNGCAP'),
          payerTypeName: 'Nhà cung cấp',
          payerName: newReturn.supplierName,
          payerSystemId: newReturn.supplierSystemId,

          description: `Nhận hoàn tiền cho đơn nhập ${newReturn.purchaseOrderId} (Phiếu trả hàng ${newReturn.id})`,

          // Payment method placeholders — should map to settings
          paymentMethodSystemId: asSystemId(account?.type === 'cash' ? 'PAYMENT_METHOD_CASH' : 'PAYMENT_METHOD_BANK'),
          paymentMethodName: newReturn.refundMethod,

          accountSystemId: newReturn.accountSystemId,
          paymentReceiptTypeSystemId: receiptCategory?.systemId ?? asSystemId('RT_SUPPLIER_REFUND'),
          paymentReceiptTypeName: receiptCategory?.name ?? 'Nhà cung cấp hoàn tiền',

          branchSystemId: newReturn.branchSystemId,
          branchName: newReturn.branchName,
          createdBy: asSystemId('SYSTEM'),
          createdAt: issuedAt,

          status: 'completed',
          category: 'other',
          affectsDebt: true,

          purchaseOrderSystemId: newReturn.purchaseOrderSystemId,
          purchaseOrderId: newReturn.purchaseOrderId,
          originalDocumentId: newReturn.id,
        };

        addReceipt(refundReceipt);
        }
    }

    // 5. Update the original Purchase Order's status
    const po = allPOs.find(p => asSystemId(p.systemId) === newReturn.purchaseOrderSystemId);
    if (po) {
        // A full check would require summing all returns for this PO.
        const allItems = po.lineItems;
        const poSystemId = asSystemId(po.systemId);
        const allReturnedItems = baseStore.getState().data
        .filter(pr => pr.purchaseOrderSystemId === poSystemId)
            .flatMap(pr => pr.items);
            
      const receiptsForPO = allReceipts.filter(r => r.purchaseOrderSystemId === poSystemId);

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
        
        const existingReturnsForPO = baseStore.getState().data.filter(pr => pr.purchaseOrderSystemId === poSystemId && pr.systemId !== newReturn.systemId);
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

    return newReturn;
};

const otherMethods = {
  findByPurchaseOrderSystemId: (purchaseOrderSystemId: SystemId) => {
    return baseStore.getState().data.filter(pr => pr.purchaseOrderSystemId === purchaseOrderSystemId);
  }
};

type BaseState = CrudState<PurchaseReturn>;

export type PurchaseReturnStoreState = Omit<BaseState, 'add'> & {
  add: typeof newAdd;
  findByPurchaseOrderSystemId: (purchaseOrderSystemId: SystemId) => PurchaseReturn[];
};

export const usePurchaseReturnStore = (): PurchaseReturnStoreState => {
  const { add: _unusedAdd, ...rest } = baseStore();
  return {
    ...rest,
    add: newAdd,
    ...otherMethods,
  } as PurchaseReturnStoreState;
};

usePurchaseReturnStore.getState = (): PurchaseReturnStoreState => {
  const { add: _unusedAdd, ...rest } = baseStore.getState();
  return {
    ...rest,
    add: newAdd,
    ...otherMethods,
  } as PurchaseReturnStoreState;
};
