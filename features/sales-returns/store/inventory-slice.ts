/**
 * Sales Returns Store - Inventory Slice
 * Handles inventory updates when processing returns
 * 
 * @module features/sales-returns/store/inventory-slice
 */

import { getCurrentDate } from '@/lib/date-utils';
import type { SalesReturn } from '@/lib/types/prisma-extended';
import type { SystemId } from '../../../lib/id-types';

import { useProductStore } from '../../products/store';
import { useStockHistoryStore } from '../../stock-history/store';
import { baseStore } from './base-store';
import { getReturnStockItems } from './helpers';

// ============================================
// UPDATE INVENTORY FOR RETURN
// ============================================

/**
 * Update inventory when items are received from customer
 * Handles combo products by adding stock to child products
 */
export const updateInventoryForReturn = (salesReturn: SalesReturn): void => {
    if (!salesReturn.isReceived) {
        return;
    }

    const { updateInventory } = useProductStore.getState();
    const { addEntry: addStockHistory } = useStockHistoryStore.getState();

    // Expand combo items to child products
    const stockItems = getReturnStockItems(salesReturn.items);

    stockItems.forEach(item => {
        if (item.quantity > 0) {
            const product = useProductStore.getState().findById(item.productSystemId);
            const oldStock = product?.inventoryByBranch[salesReturn.branchSystemId] || 0;

            updateInventory(item.productSystemId, salesReturn.branchSystemId, item.quantity);

            addStockHistory({
                productId: item.productSystemId,
                date: getCurrentDate().toISOString(),
                employeeName: salesReturn.creatorName,
                action: 'Nhập hàng từ khách trả',
                quantityChange: item.quantity,
                newStockLevel: oldStock + item.quantity,
                documentId: salesReturn.id,
                branchSystemId: salesReturn.branchSystemId,
                branch: salesReturn.branchName,
            });
        }
    });
};

// ============================================
// CONFIRM RECEIPT SLICE
// ============================================

export const inventorySlice = {
    /**
     * Confirm receipt of returned items and update inventory
     * Use this when isReceived was false initially and items are now received
     * For combo products, add stock to child products instead
     */
    confirmReceipt: (returnSystemId: SystemId): { success: boolean; message: string } => {
        const salesReturn = baseStore.getState().findById(returnSystemId);
        
        if (!salesReturn) {
            console.error('❌ [Sales Return] Return not found:', returnSystemId);
            return { success: false, message: 'Không tìm thấy phiếu trả hàng' };
        }

        if (salesReturn.isReceived) {
            return { success: false, message: 'Hàng đã được nhận trước đó' };
        }

        const { updateInventory } = useProductStore.getState();
        const { addEntry: addStockHistory } = useStockHistoryStore.getState();

        // Expand combo items to child products
        const stockItems = getReturnStockItems(salesReturn.items);

        // Update inventory for all returned items (including expanded combo children)
        stockItems.forEach(item => {
            if (item.quantity > 0) {
                const product = useProductStore.getState().findById(item.productSystemId);
                const oldStock = product?.inventoryByBranch[salesReturn.branchSystemId] || 0;

                updateInventory(item.productSystemId, salesReturn.branchSystemId, item.quantity);

                addStockHistory({
                    productId: item.productSystemId,
                    date: getCurrentDate().toISOString(),
                    employeeName: salesReturn.creatorName,
                    action: 'Nhập hàng từ khách trả (xác nhận)',
                    quantityChange: item.quantity,
                    newStockLevel: oldStock + item.quantity,
                    documentId: salesReturn.id,
                    branchSystemId: salesReturn.branchSystemId,
                    branch: salesReturn.branchName,
                });
            }
        });

        // Update the return record
        baseStore.getState().update(returnSystemId, {
            ...salesReturn,
            isReceived: true,
        });

        return { success: true, message: 'Đã xác nhận nhận hàng và cập nhật tồn kho' };
    },
};
