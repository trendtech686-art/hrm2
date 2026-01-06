/**
 * Customers Store - Debt Slice
 * Debt management operations including transactions and reminders
 * 
 * @module features/customers/store/debt-slice
 */

import type { Customer } from '@/lib/types/prisma-extended';
import type { SystemId, BusinessId } from '../../../lib/id-types';
import type { DebtTransaction, DebtReminder } from '../types';
import { getHighRiskDebtCustomers as getHighRiskDebtCustomersUtil } from '../credit-utils';
import { getOverdueDebtCustomers as getOverdueDebtCustomersUtil, getDueSoonCustomers as getDueSoonCustomersUtil } from '../debt-tracking-utils';
import { baseStore } from './base-store';

// ============================================
// DEBT MANAGEMENT
// ============================================

export const updateDebt = (systemId: SystemId, amountChange: number) => {
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
};

export const addDebtTransaction = (systemId: SystemId, transaction: DebtTransaction) => {
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
};

export const updateDebtTransactionPayment = (systemId: SystemId, orderId: BusinessId, amountPaid: number) => {
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
};

export const removeDebtTransaction = (systemId: SystemId, orderId: BusinessId) => {
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
};

// ============================================
// DEBT REMINDERS
// ============================================

export const addDebtReminder = (systemId: SystemId, reminder: DebtReminder) => {
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
};

export const updateDebtReminder = (systemId: SystemId, reminderId: SystemId, updates: Partial<DebtReminder>) => {
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
};

export const removeDebtReminder = (systemId: SystemId, reminderId: SystemId) => {
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
};

// ============================================
// DEBT QUERIES
// ============================================

export const getHighRiskDebtCustomers = (): Customer[] => {
    const activeCustomers = baseStore.getState().getActive();
    return getHighRiskDebtCustomersUtil(activeCustomers);
};

export const getOverdueDebtCustomers = (): Customer[] => {
    const activeCustomers = baseStore.getState().getActive();
    return getOverdueDebtCustomersUtil(activeCustomers);
};

export const getDueSoonCustomers = (): Customer[] => {
    const activeCustomers = baseStore.getState().getActive();
    return getDueSoonCustomersUtil(activeCustomers);
};
