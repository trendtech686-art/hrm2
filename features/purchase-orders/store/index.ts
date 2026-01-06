/**
 * Purchase Orders Store - Main Entry Point
 * Combines all slices into a single store export
 * 
 * @module features/purchase-orders/store/index
 */

import { baseStore } from './base-store';
import type { PurchaseOrderStoreState } from './types';

// Import all slice methods
import { addPayment, updatePaymentStatusForPoIds } from './payment-slice';
import { processInventoryReceipt } from './inventory-slice';
import { processReturn } from './return-slice';
import { 
    syncAllPurchaseOrderStatuses, 
    finishOrder, 
    cancelOrder, 
    bulkCancel, 
    printPurchaseOrders 
} from './status-slice';
import { initializeSync } from './sync-slice';

// Initialize sync on module load
initializeSync();

// ============================================
// COMBINED AUGMENTED METHODS
// ============================================

const augmentedMethods = {
    // Payment
    addPayment,
    updatePaymentStatusForPoIds,
    
    // Inventory
    processInventoryReceipt,
    
    // Return
    processReturn,
    
    // Status
    syncAllPurchaseOrderStatuses,
    finishOrder,
    cancelOrder,
    bulkCancel,
    printPurchaseOrders,
};

// ============================================
// STORE HOOK
// ============================================

export const usePurchaseOrderStore = (): PurchaseOrderStoreState => {
    const state = baseStore();
    return {
        ...state,
        ...augmentedMethods,
    } as PurchaseOrderStoreState;
};

usePurchaseOrderStore.getState = () => {
    const state = baseStore.getState();
    return {
        ...state,
        ...augmentedMethods,
    };
};

// Re-export types
export type { PurchaseOrderStoreState } from './types';
