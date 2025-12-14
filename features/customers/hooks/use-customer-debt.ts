/**
 * Reactive hooks for Customer Debt Management
 * ═══════════════════════════════════════════════════════════════
 * - useCustomerDebt: Get debt info for a customer
 * - useCustomerDebtTransactions: Get debt transactions with status
 * - useDebtReminders: Get debt reminders for a customer
 * ═══════════════════════════════════════════════════════════════
 */

import { useMemo } from 'react';
import { useCustomerStore } from '../store';
import { 
  getDebtStatus, 
  getDebtStatusVariant,
  calculateDaysOverdue,
  calculateDaysUntilDue,
} from '../debt-tracking-utils';
import { 
  getCreditAlertLevel, 
  getCreditAlertBadgeVariant,
  canCreateOrder,
  type CreditAlertLevel
} from '../credit-utils';
import type { Customer, DebtTransaction, DebtReminder, DebtStatus } from '../types';

export type CustomerDebtInfo = {
  currentDebt: number;
  maxDebt: number;
  debtRatio: number;
  creditAlertLevel: CreditAlertLevel;
  creditAlertVariant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive';
  canCreateNewOrder: boolean;
  availableCredit: number;
  unpaidTransactions: DebtTransaction[];
  overdueTransactions: DebtTransaction[];
  totalOverdueAmount: number;
  oldestOverdueDays: number | null;
};

/**
 * Get comprehensive debt info for a customer
 */
export function useCustomerDebt(customer: Customer | null | undefined): CustomerDebtInfo | null {
  return useMemo(() => {
    if (!customer) return null;
    
    const currentDebt = customer.currentDebt || 0;
    const maxDebt = customer.maxDebt || 0;
    const debtRatio = maxDebt > 0 ? currentDebt / maxDebt : 0;
    
    const creditAlertLevel = getCreditAlertLevel(customer);
    const creditAlertVariant = getCreditAlertBadgeVariant(creditAlertLevel);
    
    const canCreateNewOrder = customer.allowCredit !== false && 
      (maxDebt === 0 || currentDebt < maxDebt);
    
    const availableCredit = Math.max(0, maxDebt - currentDebt);
    
    // Get unpaid transactions
    const unpaidTransactions = (customer.debtTransactions || [])
      .filter(t => !t.isPaid);
    
    // Get overdue transactions
    const overdueTransactions = unpaidTransactions.filter(t => {
      const daysOverdue = calculateDaysOverdue(t.dueDate);
      return daysOverdue > 0;
    });
    
    const totalOverdueAmount = overdueTransactions.reduce(
      (sum, t) => sum + (t.remainingAmount ?? t.amount), 
      0
    );
    
    // Get oldest overdue days
    const overdueDays = overdueTransactions
      .map(t => calculateDaysOverdue(t.dueDate))
      .filter(d => d > 0);
    const oldestOverdueDays = overdueDays.length > 0 
      ? Math.max(...overdueDays) 
      : null;
    
    return {
      currentDebt,
      maxDebt,
      debtRatio,
      creditAlertLevel,
      creditAlertVariant,
      canCreateNewOrder,
      availableCredit,
      unpaidTransactions,
      overdueTransactions,
      totalOverdueAmount,
      oldestOverdueDays,
    };
  }, [customer]);
}

export type EnrichedDebtTransaction = DebtTransaction & {
  debtStatus: DebtStatus | null;
  statusVariant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive';
  daysOverdue: number;
  daysUntilDue: number;
  remainingToPay: number;
};

/**
 * Get debt transactions with calculated status info
 */
export function useCustomerDebtTransactions(customer: Customer | null | undefined): EnrichedDebtTransaction[] {
  return useMemo(() => {
    if (!customer?.debtTransactions) return [];
    
    return customer.debtTransactions.map(t => {
      const hasDebt = !t.isPaid;
      const status = getDebtStatus(t.dueDate, hasDebt);
      return {
        ...t,
        debtStatus: status,
        statusVariant: getDebtStatusVariant(status),
        daysOverdue: calculateDaysOverdue(t.dueDate),
        daysUntilDue: calculateDaysUntilDue(t.dueDate),
        remainingToPay: t.remainingAmount ?? t.amount,
      };
    });
  }, [customer]);
}

/**
 * Get debt reminders for a customer, sorted by date descending
 */
export function useDebtReminders(customer: Customer | null | undefined): DebtReminder[] {
  return useMemo(() => {
    if (!customer?.debtReminders) return [];
    
    return [...customer.debtReminders].sort((a, b) => 
      new Date(b.reminderDate).getTime() - new Date(a.reminderDate).getTime()
    );
  }, [customer]);
}

/**
 * Check if customer can create new order with debt amount
 */
export function useCanCreateOrder(
  customer: Customer | null | undefined, 
  orderAmount: number
): { canCreate: boolean; reason: string | null } {
  return useMemo(() => {
    if (!customer) {
      return { canCreate: false, reason: 'Không tìm thấy khách hàng' };
    }
    
    const result = canCreateOrder(customer, orderAmount);
    return { canCreate: result.allowed, reason: result.reason || null };
  }, [customer, orderAmount]);
}
