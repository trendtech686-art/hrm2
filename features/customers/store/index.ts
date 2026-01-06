/**
 * Customers Store - Main Entry Point
 * Combines all slices into a single store export
 * 
 * @module features/customers/store/index
 */

import type { Customer } from '@/lib/types/prisma-extended';
import type { CrudState } from '../../../lib/store-factory';
import { baseStore } from './base-store';
import type { CustomerStoreState, CustomerStoreSelector } from './types';

// Import all slice methods
import { searchCustomers } from './search-slice';
import {
    updateDebt,
    addDebtTransaction,
    updateDebtTransactionPayment,
    removeDebtTransaction,
    addDebtReminder,
    updateDebtReminder,
    removeDebtReminder,
    getHighRiskDebtCustomers,
    getOverdueDebtCustomers,
    getDueSoonCustomers,
} from './debt-slice';
import {
    incrementOrderStats,
    decrementOrderStats,
    incrementReturnStats,
    incrementFailedDeliveryStats,
} from './stats-slice';
import {
    updateCustomerIntelligence,
    getCustomersBySegment,
} from './intelligence-slice';
import { add, update } from './crud-slice';
import { removeMany, updateManyStatus, restoreMany } from './bulk-slice';

// ============================================
// COMBINED AUGMENTED METHODS
// ============================================

const augmentedMethods = {
    // Search
    searchCustomers,
    
    // Debt management
    updateDebt,
    addDebtTransaction,
    updateDebtTransactionPayment,
    removeDebtTransaction,
    addDebtReminder,
    updateDebtReminder,
    removeDebtReminder,
    getHighRiskDebtCustomers,
    getOverdueDebtCustomers,
    getDueSoonCustomers,
    
    // Stats
    incrementOrderStats,
    decrementOrderStats,
    incrementReturnStats,
    incrementFailedDeliveryStats,
    
    // Intelligence
    updateCustomerIntelligence,
    getCustomersBySegment,
    
    // CRUD overrides
    add,
    update,
    
    // Bulk operations
    removeMany,
    updateManyStatus,
    restoreMany,
};

// ============================================
// STORE HOOK WITH SELECTOR SUPPORT
// ============================================

let cachedBaseState: CrudState<Customer> | null = null;
let cachedCombinedState: CustomerStoreState | null = null;

const getCombinedState = (state: CrudState<Customer>): CustomerStoreState => {
    if (cachedBaseState !== state || !cachedCombinedState) {
        cachedBaseState = state;
        cachedCombinedState = { ...state, ...augmentedMethods } as CustomerStoreState;
    }
    return cachedCombinedState!;
};

const boundStore = baseStore as unknown as {
    <R>(selector: (state: CrudState<Customer>) => R, equalityFn?: (a: R, b: R) => boolean): R;
    (): CustomerStoreState;
};

export const useCustomerStore = <T = CustomerStoreState>(
    selector?: CustomerStoreSelector<T>,
    equalityFn?: (a: T, b: T) => boolean
): T => {
    if (selector) {
        if (equalityFn) {
            return boundStore((state) => selector(getCombinedState(state)), equalityFn);
        }
        return boundStore((state) => selector(getCombinedState(state)));
    }
    return boundStore((state) => getCombinedState(state) as unknown as T);
};

useCustomerStore.getState = (): CustomerStoreState => {
    return getCombinedState(baseStore.getState());
};

// Re-export types
export type { CustomerStoreState, CustomerStoreSelector } from './types';
