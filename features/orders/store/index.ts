/**
 * Order Store - Main Export
 * Combines all slices into a unified store interface
 * 
 * @module features/orders/store
 */

// Re-export base store
export { baseStore } from './base-store';

// Re-export helpers for external use
export {
    getBranchId,
    getComboStockItems,
    processLineItemStock,
    applyPaymentToOrder,
    getOrderOutstandingAmount,
    calculateActualDebt,
    calculateTotalPaid,
    ensureCancellationAllowed,
    ensureOrderPackagingIdentifiers,
    getNextPackagingSystemId,
    buildPackagingBusinessId,
    initPackagingCounter,
} from './helpers';

// Import slices
import { baseStore } from './base-store';
import { paymentSlice } from './payment-slice';
import { cancellationSlice } from './cancellation-slice';
import { packagingSlice } from './packaging-slice';
import { deliverySlice } from './delivery-slice';
import { ghtkSlice } from './ghtk-slice';

// ============================================
// COMBINED AUGMENTED METHODS
// ============================================

const augmentedMethods = {
    // Payment methods
    ...paymentSlice,
    
    // Cancellation methods
    ...cancellationSlice,
    
    // Packaging methods
    ...packagingSlice,
    
    // Delivery methods
    ...deliverySlice,
    
    // GHTK integration methods
    ...ghtkSlice,
};

// ============================================
// TYPE DEFINITIONS
// ============================================

type BaseStoreState = ReturnType<typeof baseStore.getState>;
type AugmentedMethods = typeof augmentedMethods;
export type OrderStoreState = BaseStoreState & AugmentedMethods;

// ============================================
// STORE EXPORT
// ============================================

// Export typed hook with all augmented methods
export const useOrderStore = (): OrderStoreState => {
    const state = baseStore();
    return {
        ...state,
        ...augmentedMethods,
    } as OrderStoreState;
};

// Export getState for non-hook usage
useOrderStore.getState = (): OrderStoreState => {
    const state = baseStore.getState();
    return {
        ...state,
        ...augmentedMethods,
    } as OrderStoreState;
};

// Export setState for direct state manipulation
useOrderStore.setState = baseStore.setState;

// Export subscribe for external subscriptions
useOrderStore.subscribe = baseStore.subscribe;
