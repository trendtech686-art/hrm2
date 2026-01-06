/**
 * Customers Store - CRUD Slice
 * Overridden add/update with lifecycle tracking and activity history
 * 
 * @module features/customers/store/crud-slice
 */

import type { Customer } from '@/lib/types/prisma-extended';
import type { SystemId } from '../../../lib/id-types';
import { calculateLifecycleStage } from '../lifecycle-utils';
import {
    getCurrentUserInfo,
    createCreatedEntry,
    createUpdatedEntry,
    createStatusChangedEntry,
    appendHistoryEntry,
    type HistoryEntry
} from '../../../lib/activity-history-helper';
import { baseStore } from './base-store';

// ============================================
// CRUD OVERRIDES WITH ACTIVITY TRACKING
// ============================================

/**
 * Add customer with auto-calculated lifecycle stage and activity history
 */
export const add = (customer: Omit<Customer, 'systemId'>) => {
    const userInfo = getCurrentUserInfo();
    const customerWithLifecycle = {
        ...customer,
        lifecycleStage: calculateLifecycleStage(customer as Customer)
    };
    const newCustomer = baseStore.getState().add(customerWithLifecycle);
    
    // Add activity history entry
    const historyEntry = createCreatedEntry(
        userInfo,
        `${userInfo.name} đã tạo khách hàng ${newCustomer.name} (${newCustomer.id})`
    );
    baseStore.getState().update(newCustomer.systemId, {
        ...newCustomer,
        activityHistory: [historyEntry]
    });
    
    return newCustomer;
};

/**
 * Update customer with auto-calculated lifecycle stage and activity history
 */
export const update = (systemId: SystemId, updatedCustomer: Customer) => {
    const userInfo = getCurrentUserInfo();
    const existingCustomer = baseStore.getState().data.find(c => c.systemId === systemId);
    const historyEntries: HistoryEntry[] = [];
    
    if (existingCustomer) {
        // Track status changes
        if (existingCustomer.status !== updatedCustomer.status) {
            historyEntries.push(createStatusChangedEntry(
                userInfo,
                existingCustomer.status,
                updatedCustomer.status,
                `${userInfo.name} đã đổi trạng thái từ "${existingCustomer.status}" sang "${updatedCustomer.status}"`
            ));
        }
        
        // Track field changes
        const fieldsToTrack: Array<{ key: keyof Customer; label: string }> = [
            { key: 'name', label: 'Tên khách hàng' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Số điện thoại' },
            { key: 'company', label: 'Công ty' },
            { key: 'taxCode', label: 'Mã số thuế' },
            { key: 'representative', label: 'Người đại diện' },
            { key: 'type', label: 'Loại khách hàng' },
            { key: 'customerGroup', label: 'Nhóm khách hàng' },
            { key: 'lifecycleStage', label: 'Giai đoạn vòng đời' },
            { key: 'maxDebt', label: 'Hạn mức công nợ' },
            { key: 'paymentTerms', label: 'Điều khoản thanh toán' },
            { key: 'creditRating', label: 'Xếp hạng tín dụng' },
            { key: 'pricingLevel', label: 'Mức giá' },
            { key: 'defaultDiscount', label: 'Chiết khấu mặc định' },
            { key: 'accountManagerId', label: 'Nhân viên phụ trách' },
        ];
        
        const changes: string[] = [];
        for (const field of fieldsToTrack) {
            const oldVal = existingCustomer[field.key];
            const newVal = updatedCustomer[field.key];
            if (oldVal !== newVal && !(oldVal === undefined && newVal === undefined)) {
                // Skip if it's the status field (already tracked above)
                if (field.key === 'status') continue;
                const oldDisplay = oldVal !== undefined && oldVal !== null && oldVal !== '' ? String(oldVal) : '(trống)';
                const newDisplay = newVal !== undefined && newVal !== null && newVal !== '' ? String(newVal) : '(trống)';
                changes.push(`${field.label}: ${oldDisplay} → ${newDisplay}`);
            }
        }
        
        if (changes.length > 0) {
            historyEntries.push(createUpdatedEntry(
                userInfo,
                `${userInfo.name} đã cập nhật: ${changes.join(', ')}`
            ));
        }
    }
    
    const customerWithLifecycle = {
        ...updatedCustomer,
        lifecycleStage: calculateLifecycleStage(updatedCustomer),
        activityHistory: appendHistoryEntry(existingCustomer?.activityHistory, ...historyEntries)
    };
    
    // Call the update function from baseStore directly
    baseStore.getState().update(systemId, customerWithLifecycle);
};
