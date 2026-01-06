/**
 * Purchase Orders Store - Sync Slice
 * Inventory receipt synchronization with purchase orders
 * 
 * @module features/purchase-orders/store/sync-slice
 */

import { syncInventoryReceiptsWithPurchaseOrders } from '../../inventory-receipts/store';
import { useProductStore } from '../../products/store';
import { baseStore } from './base-store';

// ============================================
// INVENTORY RECEIPT BACKFILL
// ============================================

export const runInventoryReceiptBackfill = () => {
    syncInventoryReceiptsWithPurchaseOrders({
        purchaseOrders: baseStore.getState().data,
        products: useProductStore.getState().data,
    });
};

/**
 * Initialize backfill and set up subscriptions
 */
export const initializeSync = () => {
    // Run initial backfill
    runInventoryReceiptBackfill();

    // Re-run backfill whenever purchase orders or products hydrate/update
    (baseStore as typeof baseStore & { subscribe?: (listener: () => void) => () => void }).subscribe?.(() => {
        runInventoryReceiptBackfill();
    });

    (useProductStore as typeof useProductStore & { subscribe?: (listener: () => void) => () => void }).subscribe?.(() => {
        runInventoryReceiptBackfill();
    });
};
