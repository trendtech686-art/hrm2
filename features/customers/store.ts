import { create } from 'zustand';
import { createCrudStore, CrudState } from '../../lib/store-factory.ts';
import { data as initialData } from './data.ts';
import type { Customer } from './types.ts';
import { SystemId, BusinessId } from '../../lib/id-types.ts';
import { calculateLifecycleStage } from './lifecycle-utils.ts';
import { getHighRiskDebtCustomers } from './credit-utils.ts';
import { 
  calculateRFMScores, 
  getCustomerSegment, 
  calculateHealthScore,
  calculateChurnRisk 
} from './intelligence-utils.ts';
import { getOverdueDebtCustomers, getDueSoonCustomers } from './debt-tracking-utils.ts';
import Fuse from 'fuse.js';
import { getCurrentUserSystemId } from '../../contexts/auth-context.tsx';
import {
  getCurrentUserInfo,
  createCreatedEntry,
  createUpdatedEntry,
  createStatusChangedEntry,
  appendHistoryEntry,
  type HistoryEntry
} from '../../lib/activity-history-helper.ts';

const baseStore = createCrudStore<Customer>(initialData, 'customers', {
  businessIdField: 'id',
  persistKey: 'hrm-customers', // Enable persistence
  getCurrentUser: getCurrentUserSystemId, // Track who creates/updates
});

// Define enhanced interface
interface CustomerStoreState extends CrudState<Customer> {
  searchCustomers: (query: string, page: number, limit?: number) => Promise<{ items: { value: string; label: string }[], hasNextPage: boolean }>;
  updateDebt: (systemId: SystemId, amountChange: number) => void;
  incrementOrderStats: (systemId: SystemId, orderValue: number) => void;
  decrementOrderStats: (systemId: SystemId, orderValue: number) => void;
  incrementReturnStats: (systemId: SystemId, quantity: number) => void;
  incrementFailedDeliveryStats: (systemId: SystemId) => void;
  addDebtTransaction: (systemId: SystemId, transaction: import('./types').DebtTransaction) => void;
  addDebtReminder: (systemId: SystemId, reminder: import('./types').DebtReminder) => void;
  updateDebtReminder: (systemId: SystemId, reminderId: SystemId, updates: Partial<import('./types').DebtReminder>) => void;
  removeDebtReminder: (systemId: SystemId, reminderId: SystemId) => void;
  updateDebtTransactionPayment: (systemId: SystemId, orderId: BusinessId, amountPaid: number) => void;
  removeDebtTransaction: (systemId: SystemId, orderId: BusinessId) => void;
  getHighRiskDebtCustomers: () => Customer[];
  updateCustomerIntelligence: () => void; // Batch update RFM, health score, churn risk
  getCustomersBySegment: (segment: string) => Customer[];
  getOverdueDebtCustomers: () => Customer[];
  getDueSoonCustomers: () => Customer[];
    removeMany: (systemIds: SystemId[]) => void;
    updateManyStatus: (systemIds: SystemId[], status: Customer['status']) => void;
    restoreMany: (systemIds: SystemId[]) => void;
}

// Augmented methods
const augmentedMethods = {
    searchCustomers: async (query: string, page: number, limit: number = 20) => {
        return new Promise<{ items: { value: string; label: string }[], hasNextPage: boolean }>(resolve => {
            setTimeout(() => {
                const allCustomers = baseStore.getState().data;
                
                // Create fresh Fuse instance with current data (avoid stale data)
                const fuse = new Fuse(allCustomers, {
                    keys: ['name', 'id', 'phone'],
                    threshold: 0.3,
                });
                
                const results = query ? fuse.search(query).map(r => r.item) : allCustomers;
                
                const start = (page - 1) * limit;
                const end = start + limit;
                const paginatedItems = results.slice(start, end);

                resolve({
                    items: paginatedItems.map(c => ({ value: c.systemId, label: c.name })),
                    hasNextPage: end < results.length,
                });
            }, 300);
        });
    },
    updateDebt: (systemId: SystemId, amountChange: number) => {
        baseStore.setState(state => ({
            data: state.data.map(customer => {
                if (customer.systemId === systemId) {
                    return {
                        ...customer,
                        currentDebt: (customer.currentDebt || 0) + amountChange,
                    };
                }
                return customer;
            })
        }));
    },
    incrementOrderStats: (systemId: SystemId, orderValue: number) => {
        const allCustomers = baseStore.getState().getActive();
        
        baseStore.setState(state => ({
            data: state.data.map(customer => {
                if (customer.systemId === systemId) {
                    const updatedCustomer = {
                        ...customer,
                        totalOrders: (customer.totalOrders || 0) + 1,
                        totalSpent: (customer.totalSpent || 0) + orderValue,
                        lastPurchaseDate: new Date().toISOString().split('T')[0],
                    };
                    
                    // Auto-update intelligence after order stats change
                    const rfmScores = calculateRFMScores(updatedCustomer, allCustomers);
                    const segment = getCustomerSegment(rfmScores);
                    const healthScore = calculateHealthScore(updatedCustomer);
                    const churnRisk = calculateChurnRisk(updatedCustomer).risk;
                    const lifecycleStage = calculateLifecycleStage(updatedCustomer);
                    
                    return {
                        ...updatedCustomer,
                        rfmScores,
                        segment,
                        healthScore,
                        churnRisk,
                        lifecycleStage,
                    };
                }
                return customer;
            })
        }));
    },
    decrementOrderStats: (systemId: SystemId, orderValue: number) => {
        const allCustomers = baseStore.getState().getActive();
        
        baseStore.setState(state => ({
            data: state.data.map(customer => {
                if (customer.systemId === systemId) {
                    const updatedCustomer = {
                        ...customer,
                        totalOrders: Math.max(0, (customer.totalOrders || 0) - 1),
                        totalSpent: Math.max(0, (customer.totalSpent || 0) - orderValue),
                    };
                    
                    // Auto-update intelligence after order stats change
                    const rfmScores = calculateRFMScores(updatedCustomer, allCustomers);
                    const segment = getCustomerSegment(rfmScores);
                    const healthScore = calculateHealthScore(updatedCustomer);
                    const churnRisk = calculateChurnRisk(updatedCustomer).risk;
                    const lifecycleStage = calculateLifecycleStage(updatedCustomer);
                    
                    return {
                        ...updatedCustomer,
                        rfmScores,
                        segment,
                        healthScore,
                        churnRisk,
                        lifecycleStage,
                    };
                }
                return customer;
            })
        }));
    },
    incrementReturnStats: (systemId: SystemId, quantity: number) => {
        baseStore.setState(state => ({
            data: state.data.map(customer => {
                if (customer.systemId === systemId) {
                    return {
                        ...customer,
                        totalQuantityReturned: (customer.totalQuantityReturned || 0) + quantity,
                    };
                }
                return customer;
            })
        }));
    },
    incrementFailedDeliveryStats: (systemId: SystemId) => {
        baseStore.setState(state => ({
            data: state.data.map(customer => {
                if (customer.systemId === systemId) {
                    return {
                        ...customer,
                        failedDeliveries: (customer.failedDeliveries || 0) + 1,
                    };
                }
                return customer;
            })
        }));
    },
    addDebtTransaction: (systemId: SystemId, transaction: import('./types').DebtTransaction) => {
        baseStore.setState(state => ({
            data: state.data.map(customer => {
                if (customer.systemId === systemId) {
                    const currentTransactions = customer.debtTransactions || [];
                    // Avoid duplicates
                    if (currentTransactions.some(t => t.orderId === transaction.orderId)) {
                        return customer;
                    }

                    const outstandingAmount = Math.max(transaction.remainingAmount ?? transaction.amount ?? 0, 0);
                    return {
                        ...customer,
                        currentDebt: Math.max(0, (customer.currentDebt || 0) + outstandingAmount),
                        debtTransactions: [...currentTransactions, transaction],
                    };
                }
                return customer;
            })
        }));
    },
    updateDebtTransactionPayment: (systemId: SystemId, orderId: BusinessId, amountPaid: number) => {
        baseStore.setState(state => ({
            data: state.data.map(customer => {
                if (customer.systemId === systemId && customer.debtTransactions) {
                    let debtDelta = 0;
                    const updatedTransactions = customer.debtTransactions.map(t => {
                        if (t.orderId !== orderId) {
                            return t;
                        }

                        const currentPaid = t.paidAmount || 0;
                        const currentRemaining = t.remainingAmount ?? Math.max(t.amount - currentPaid, 0);
                        let appliedAmount = amountPaid;

                        if (appliedAmount > 0) {
                            appliedAmount = Math.min(appliedAmount, currentRemaining);
                        } else if (appliedAmount < 0) {
                            appliedAmount = Math.max(appliedAmount, -currentPaid);
                        }

                        const newPaidAmount = currentPaid + appliedAmount;
                        const recalculatedRemaining = Math.max(t.amount - newPaidAmount, 0);
                        debtDelta -= appliedAmount;

                        return {
                            ...t,
                            paidAmount: newPaidAmount,
                            remainingAmount: recalculatedRemaining,
                            isPaid: recalculatedRemaining <= 0,
                            paidDate: recalculatedRemaining <= 0 ? new Date().toISOString().split('T')[0] : t.paidDate,
                        };
                    });

                    return {
                        ...customer,
                        currentDebt: Math.max(0, (customer.currentDebt || 0) + debtDelta),
                        debtTransactions: updatedTransactions,
                    };
                }
                return customer;
            })
        }));
    },
    removeDebtTransaction: (systemId: SystemId, orderId: BusinessId) => {
        baseStore.setState(state => ({
            data: state.data.map(customer => {
                if (customer.systemId === systemId && customer.debtTransactions) {
                    const transaction = customer.debtTransactions.find(t => t.orderId === orderId);
                    const outstanding = transaction
                        ? Math.max(transaction.remainingAmount ?? (transaction.amount - (transaction.paidAmount || 0)), 0)
                        : 0;
                    return {
                        ...customer,
                        currentDebt: Math.max(0, (customer.currentDebt || 0) - outstanding),
                        debtTransactions: customer.debtTransactions.filter(t => t.orderId !== orderId),
                    };
                }
                return customer;
            })
        }));
    },
    // Add debt reminder (3.3)
    addDebtReminder: (systemId: SystemId, reminder: import('./types').DebtReminder) => {
        baseStore.setState(state => ({
            data: state.data.map(customer => {
                if (customer.systemId === systemId) {
                    const currentReminders = customer.debtReminders || [];
                    return {
                        ...customer,
                        debtReminders: [...currentReminders, reminder],
                    };
                }
                return customer;
            })
        }));
    },
    // Update debt reminder (3.3)
    updateDebtReminder: (systemId: SystemId, reminderId: SystemId, updates: Partial<import('./types').DebtReminder>) => {
        baseStore.setState(state => ({
            data: state.data.map(customer => {
                if (customer.systemId === systemId && customer.debtReminders) {
                    return {
                        ...customer,
                        debtReminders: customer.debtReminders.map(r =>
                            r.systemId === reminderId ? { ...r, ...updates } : r
                        ),
                    };
                }
                return customer;
            })
        }));
    },
    // Remove debt reminder (3.3)
    removeDebtReminder: (systemId: SystemId, reminderId: SystemId) => {
        baseStore.setState(state => ({
            data: state.data.map(customer => {
                if (customer.systemId === systemId && customer.debtReminders) {
                    return {
                        ...customer,
                        debtReminders: customer.debtReminders.filter(r => r.systemId !== reminderId),
                    };
                }
                return customer;
            })
        }));
    },
    // Override add to auto-calculate lifecycle stage and log activity
    add: (customer: Omit<Customer, 'systemId'>) => {
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
    },
    // Override update to auto-calculate lifecycle stage and log activity
    update: (systemId: SystemId, updatedCustomer: Customer) => {
        console.log('[CustomerStore] update called:', { systemId, updatedCustomer });
        
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
        console.log('[CustomerStore] Calling baseStore.update with:', customerWithLifecycle);
        
        // Call the update function from baseStore directly
        baseStore.getState().update(systemId, customerWithLifecycle);
        
        console.log('[CustomerStore] State after update:', baseStore.getState().data.find(c => c.systemId === systemId));
    },
    // Get customers with high debt risk
    getHighRiskDebtCustomers: () => {
        const activeCustomers = baseStore.getState().getActive();
        return getHighRiskDebtCustomers(activeCustomers);
    },
    // Batch update customer intelligence (RFM, health score, churn risk)
    updateCustomerIntelligence: () => {
        const allCustomers = baseStore.getState().getActive();
        
        baseStore.setState(state => ({
            data: state.data.map(customer => {
                if (customer.isDeleted) return customer;
                
                // Calculate RFM
                const rfmScores = calculateRFMScores(customer, allCustomers);
                const segment = getCustomerSegment(rfmScores);
                
                // Calculate health score
                const healthScore = calculateHealthScore(customer);
                
                // Calculate churn risk
                const churnRisk = calculateChurnRisk(customer).risk;
                
                // Calculate lifecycle stage
                const lifecycleStage = calculateLifecycleStage(customer);
                
                return {
                    ...customer,
                    rfmScores,
                    segment,
                    healthScore,
                    churnRisk,
                    lifecycleStage
                };
            })
        }));
    },
    // Get customers by segment
    getCustomersBySegment: (segment: string) => {
        return baseStore.getState().getActive().filter(c => c.segment === segment);
    },
    // Get customers with overdue debt
    getOverdueDebtCustomers: () => {
        const activeCustomers = baseStore.getState().getActive();
        return getOverdueDebtCustomers(activeCustomers);
    },
    // Get customers with debt due soon
    getDueSoonCustomers: () => {
        const activeCustomers = baseStore.getState().getActive();
        return getDueSoonCustomers(activeCustomers);
    },
    removeMany: (systemIds: SystemId[]) => {
        if (!systemIds.length) return;
        const deletedAtTimestamp = new Date().toISOString();
        baseStore.setState(state => ({
            data: state.data.map(customer =>
                systemIds.includes(customer.systemId)
                    ? { ...customer, isDeleted: true, deletedAt: deletedAtTimestamp }
                    : customer
            )
        }));
    },
    updateManyStatus: (systemIds: SystemId[], status: Customer['status']) => {
        if (!systemIds.length) return;
        baseStore.setState(state => ({
            data: state.data.map(customer =>
                systemIds.includes(customer.systemId)
                    ? { ...customer, status }
                    : customer
            )
        }));
    },
    restoreMany: (systemIds: SystemId[]) => {
        if (!systemIds.length) return;
        baseStore.setState(state => ({
            data: state.data.map(customer =>
                systemIds.includes(customer.systemId)
                    ? { ...customer, isDeleted: false, deletedAt: null }
                    : customer
            )
        }));
    }
};

type CustomerStoreSelector<T> = (state: CustomerStoreState) => T;

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
