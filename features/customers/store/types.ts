/**
 * Customers Store - Types
 * Type definitions for the customer store
 * 
 * @module features/customers/store/types
 */

import type { Customer } from '@/lib/types/prisma-extended';
import type { CrudState } from '../../../lib/store-factory';
import type { SystemId, BusinessId } from '../../../lib/id-types';
import type { DebtTransaction, DebtReminder } from '../types';

export interface CustomerStoreState extends CrudState<Customer> {
    // Search
    searchCustomers: (query: string, page: number, limit?: number) => Promise<{ items: { value: string; label: string }[], hasNextPage: boolean }>;
    
    // Debt management
    updateDebt: (systemId: SystemId, amountChange: number) => void;
    addDebtTransaction: (systemId: SystemId, transaction: DebtTransaction) => void;
    addDebtReminder: (systemId: SystemId, reminder: DebtReminder) => void;
    updateDebtReminder: (systemId: SystemId, reminderId: SystemId, updates: Partial<DebtReminder>) => void;
    removeDebtReminder: (systemId: SystemId, reminderId: SystemId) => void;
    updateDebtTransactionPayment: (systemId: SystemId, orderId: BusinessId, amountPaid: number) => void;
    removeDebtTransaction: (systemId: SystemId, orderId: BusinessId) => void;
    getHighRiskDebtCustomers: () => Customer[];
    getOverdueDebtCustomers: () => Customer[];
    getDueSoonCustomers: () => Customer[];
    
    // Stats
    incrementOrderStats: (systemId: SystemId, orderValue: number) => void;
    decrementOrderStats: (systemId: SystemId, orderValue: number) => void;
    incrementReturnStats: (systemId: SystemId, quantity: number) => void;
    incrementFailedDeliveryStats: (systemId: SystemId) => void;
    
    // Intelligence
    updateCustomerIntelligence: () => void;
    getCustomersBySegment: (segment: string) => Customer[];
    
    // Bulk operations
    removeMany: (systemIds: SystemId[]) => void;
    updateManyStatus: (systemIds: SystemId[], status: Customer['status']) => void;
    restoreMany: (systemIds: SystemId[]) => void;
}

export type CustomerStoreSelector<T> = (state: CustomerStoreState) => T;
