/**
 * Products Store - Main Entry Point
 * Combines all slices into a single store export
 * 
 * @module features/products/store/index
 */

import { baseStore } from './base-store';
import type { ProductStoreState } from './types';

// Import all slice methods
import {
    updateInventory,
    commitStock,
    uncommitStock,
    dispatchStock,
    completeDelivery,
    returnStockFromTransit,
    updateLastPurchasePrice,
} from './inventory-slice';
import { searchProducts } from './search-slice';
import { addProduct, updateProduct } from './crud-slice';

// ============================================
// COMBINED STORE
// ============================================

/**
 * Product store hook with all methods
 */
export const useProductStore = (): ProductStoreState => {
    const state = baseStore();
    return {
        ...state,
        add: addProduct,
        update: updateProduct,
        updateInventory,
        commitStock,
        uncommitStock,
        dispatchStock,
        completeDelivery,
        returnStockFromTransit,
        updateLastPurchasePrice,
        searchProducts,
    };
};

/**
 * Get state without hook (for use outside React components)
 */
useProductStore.getState = (): ProductStoreState => {
    const state = baseStore.getState();
    return {
        ...state,
        add: addProduct,
        update: updateProduct,
        updateInventory,
        commitStock,
        uncommitStock,
        dispatchStock,
        completeDelivery,
        returnStockFromTransit,
        updateLastPurchasePrice,
        searchProducts,
    };
};

// Expose subscribe for external usage
(useProductStore as typeof useProductStore & { subscribe?: typeof baseStore.subscribe }).subscribe = baseStore.subscribe;

// Re-export types
export type { ProductStoreState } from './types';
