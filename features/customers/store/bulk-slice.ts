/**
 * Customers Store - Bulk Operations Slice
 * Batch operations for multiple customers
 * 
 * @module features/customers/store/bulk-slice
 */

import type { Customer } from '@/lib/types/prisma-extended';
import type { SystemId } from '../../../lib/id-types';
import { baseStore } from './base-store';

// ============================================
// BULK OPERATIONS
// ============================================

/**
 * Soft delete multiple customers
 */
export const removeMany = (systemIds: SystemId[]) => {
    if (!systemIds.length) return;
    const deletedAtTimestamp = new Date().toISOString();
    baseStore.setState(state => ({
        data: state.data.map(customer =>
            systemIds.includes(customer.systemId)
                ? { ...customer, isDeleted: true, deletedAt: deletedAtTimestamp }
                : customer
        )
    }));
};

/**
 * Update status for multiple customers
 */
export const updateManyStatus = (systemIds: SystemId[], status: Customer['status']) => {
    if (!systemIds.length) return;
    baseStore.setState(state => ({
        data: state.data.map(customer =>
            systemIds.includes(customer.systemId)
                ? { ...customer, status }
                : customer
        )
    }));
};

/**
 * Restore multiple soft-deleted customers
 */
export const restoreMany = (systemIds: SystemId[]) => {
    if (!systemIds.length) return;
    baseStore.setState(state => ({
        data: state.data.map(customer =>
            systemIds.includes(customer.systemId)
                ? { ...customer, isDeleted: false, deletedAt: null }
                : customer
        )
    }));
};
