/**
 * Sales Returns Store - Main Export
 * Combines all slices into a unified store interface
 * 
 * @module features/sales-returns/store
 */

// Re-export base store
export { baseStore } from './base-store';

// Re-export helpers for external use
export {
    getReturnStockItems,
    formatSalesReturnData,
} from './helpers';

// Import slices
import { baseStore } from './base-store';
import { addSlice } from './add-slice';
import { inventorySlice } from './inventory-slice';

// ============================================
// COMBINED AUGMENTED METHODS
// ============================================

const augmentedMethods = {
    // Add with side effects
    ...addSlice,
    
    // Inventory operations (confirmReceipt)
    ...inventorySlice,
};

// ============================================
// TYPE DEFINITIONS
// ============================================

type BaseStoreState = ReturnType<typeof baseStore.getState>;
type AugmentedMethods = typeof augmentedMethods;
export type SalesReturnStoreState = BaseStoreState & AugmentedMethods;

// ============================================
// STORE EXPORT
// ============================================

// Export typed hook with all augmented methods
export const useSalesReturnStore = (): SalesReturnStoreState => {
    const state = baseStore();
    return {
        ...state,
        ...augmentedMethods,
    } as SalesReturnStoreState;
};

// Export getState for non-hook usage
useSalesReturnStore.getState = (): SalesReturnStoreState => {
    const state = baseStore.getState();
    return {
        ...state,
        ...augmentedMethods,
    } as SalesReturnStoreState;
};

// Export setState for direct state manipulation
useSalesReturnStore.setState = baseStore.setState;

// Export subscribe for external subscriptions
useSalesReturnStore.subscribe = baseStore.subscribe;
