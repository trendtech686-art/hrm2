/**
 * Hook to compute customer debt dynamically from orders and receipts/payments
 * ═══════════════════════════════════════════════════════════════
 * This replaces the static currentDebt field with real-time calculated debt
 * based on:
 * - Delivered orders (increases debt)
 * - Receipts with affectsDebt=true (decreases debt)
 * - Payments with affectsDebt=true (increases/decreases debt) - excluding sales return refunds
 * 
 * NOTE: Sales returns and refund payments from sales returns do NOT affect debt.
 * They are cash transactions, not debt transactions.
 * 
 * IMPORTANT: This uses the same logic as detail-page.tsx customerDebtTransactions
 * to ensure consistency across the app.
 * ═══════════════════════════════════════════════════════════════
 */

import { useMemo } from 'react';
import { useOrderStore } from '../../orders/store';
import { useReceiptStore } from '../../receipts/store';
import { usePaymentStore } from '../../payments/store';
import type { Customer, DebtTransaction } from '../types';
import type { Order } from '../../orders/types';
import type { Receipt } from '../../receipts/types';
import type { Payment } from '../../payments/types';
import type { SystemId, BusinessId } from '@/lib/id-types';
import { asSystemId } from '@/lib/id-types';

export type ComputedDebtInfo = {
  currentDebt: number;
  debtTransactions: DebtTransaction[];
};

/**
 * Compute debt transactions and current debt for a customer
 * Uses the same logic as detail-page.tsx for consistency
 */
function computeCustomerDebtTransactions(
  customer: Customer,
  allOrders: Order[],
  allReceipts: Receipt[],
  allPayments: Payment[]
): ComputedDebtInfo {
  // Get orders that create debt for this customer
  // Debt starts when: status='Hoàn thành' OR deliveryStatus='Đã giao hàng' OR stockOutStatus='Xuất kho toàn bộ'
  const debtCreatingOrders = allOrders.filter(
    o => o.customerSystemId === customer.systemId && 
         o.status !== 'Đã hủy' &&
         (o.status === 'Hoàn thành' || 
          o.deliveryStatus === 'Đã giao hàng' || 
          o.stockOutStatus === 'Xuất kho toàn bộ')
  );

  // Build order transactions - use grandTotal (không trừ paidAmount)
  // vì phiếu thu đã được tính riêng ở receiptTransactions
  const orderTransactions = debtCreatingOrders
    .map(order => {
      // Calculate due date based on payment terms (default NET30)
      const orderDate = new Date(order.orderDate);
      const paymentTermDays = customer.paymentTerms === 'NET60' ? 60 : 
                               customer.paymentTerms === 'NET15' ? 15 : 
                               customer.paymentTerms === 'COD' ? 0 : 30;
      const dueDate = new Date(orderDate);
      dueDate.setDate(dueDate.getDate() + paymentTermDays);
      
      return {
        systemId: asSystemId(`debt-order-${order.systemId}`),
        orderId: order.id,
        orderDate: order.orderDate,
        amount: order.grandTotal || 0,
        dueDate: dueDate.toISOString().split('T')[0],
        isPaid: false,
        remainingAmount: order.grandTotal || 0,
        notes: `Đơn hàng #${order.id}`,
        _createdAt: order.createdAt || order.orderDate,
        _type: 'order' as const,
        _change: order.grandTotal || 0,
      };
    });

  // Get receipts affecting this customer's debt
  const customerReceipts = allReceipts.filter(
    r => r.status !== 'cancelled' && 
         r.affectsDebt === true && 
         (r.customerSystemId === customer.systemId || 
          r.payerSystemId === customer.systemId ||
          (r.payerTypeName === 'Khách hàng' && r.payerName === customer.name))
  );

  const receiptTransactions = customerReceipts.map(receipt => ({
    systemId: asSystemId(`debt-receipt-${receipt.systemId}`),
    orderId: receipt.id,
    orderDate: receipt.date,
    amount: receipt.amount,
    dueDate: receipt.date,
    isPaid: true,
    remainingAmount: 0,
    notes: receipt.description || `Phiếu thu #${receipt.id}`,
    _createdAt: receipt.createdAt || receipt.date,
    _type: 'receipt' as const,
    _change: -receipt.amount, // Receipts reduce debt
  }));

  // ✅ Phiếu chi - CHỈ TÍNH các phiếu chi KHÔNG phải hoàn tiền từ trả hàng
  // Phiếu chi hoàn tiền từ trả hàng là giao dịch tiền mặt, không ảnh hưởng công nợ
  // Phiếu trả hàng cũng KHÔNG ảnh hưởng công nợ
  const customerPayments = allPayments.filter(
    p => p.status !== 'cancelled' && 
         p.affectsDebt === true && 
         !p.linkedSalesReturnSystemId && // Loại bỏ phiếu chi từ trả hàng
         (p.customerSystemId === customer.systemId || 
          p.recipientSystemId === customer.systemId ||
          (p.recipientTypeName === 'Khách hàng' && p.recipientName === customer.name))
  );

  const paymentTransactions = customerPayments.map(payment => {
    // Phiếu chi cho khách (không phải trả hàng) → giảm công nợ
    const isRefundToCustomer = payment.paymentReceiptTypeName === 'Hoàn tiền khách hàng' || 
                               payment.category === 'complaint_refund';
    const changeAmount = isRefundToCustomer ? -payment.amount : payment.amount;
    
    return {
      systemId: asSystemId(`debt-payment-${payment.systemId}`),
      orderId: payment.id,
      orderDate: payment.date,
      amount: payment.amount,
      dueDate: payment.date,
      isPaid: false,
      remainingAmount: payment.amount,
      notes: payment.description || `Phiếu chi #${payment.id}`,
      _createdAt: payment.createdAt || payment.date,
      _type: 'payment' as const,
      _change: changeAmount,
    };
  });

  // ✅ Công nợ = Đơn hàng - Phiếu thu - Phiếu chi (không phải trả hàng)
  // Phiếu trả hàng và phiếu chi hoàn tiền từ trả hàng KHÔNG ảnh hưởng công nợ
  const allTransactions = [...orderTransactions, ...receiptTransactions, ...paymentTransactions];
  allTransactions.sort((a, b) => new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime());

  // Calculate running balance
  let runningDebt = 0;
  const transactionsWithBalance = allTransactions.map(t => {
    runningDebt += t._change;
    return t;
  });

  // Get current debt (final balance)
  const currentDebt = Math.max(0, runningDebt);

  // Convert to DebtTransaction format (only unpaid order transactions)
  const debtTransactions: DebtTransaction[] = orderTransactions.map(t => ({
    systemId: t.systemId,
    orderId: t.orderId,
    orderDate: t.orderDate,
    amount: t.amount,
    dueDate: t.dueDate,
    isPaid: currentDebt === 0, // Mark as paid if no outstanding debt
    remainingAmount: currentDebt === 0 ? 0 : t.remainingAmount,
    notes: t.notes,
  }));

  return {
    currentDebt,
    debtTransactions,
  };
}

/**
 * Hook to get computed debt for a single customer
 */
export function useComputedCustomerDebt(customer: Customer | null | undefined): ComputedDebtInfo | null {
  const { data: allOrders } = useOrderStore();
  const { data: allReceipts } = useReceiptStore();
  const { data: allPayments } = usePaymentStore();

  return useMemo(() => {
    if (!customer) return null;
    return computeCustomerDebtTransactions(customer, allOrders, allReceipts, allPayments);
  }, [customer, allOrders, allReceipts, allPayments]);
}

/**
 * Hook to get computed debt for all customers as a map
 * Returns a Map of customerSystemId -> ComputedDebtInfo
 */
export function useAllCustomersComputedDebt(customers: Customer[]): Map<SystemId, ComputedDebtInfo> {
  const { data: allOrders } = useOrderStore();
  const { data: allReceipts } = useReceiptStore();
  const { data: allPayments } = usePaymentStore();

  return useMemo(() => {
    const debtMap = new Map<SystemId, ComputedDebtInfo>();
    
    for (const customer of customers) {
      const debtInfo = computeCustomerDebtTransactions(customer, allOrders, allReceipts, allPayments);
      debtMap.set(customer.systemId, debtInfo);
    }
    
    return debtMap;
  }, [customers, allOrders, allReceipts, allPayments]);
}

/**
 * Hook to get customers with computed debt appended
 * Returns customers array with currentDebt AND debtTransactions replaced by computed values
 */
export function useCustomersWithComputedDebt(customers: Customer[]): Customer[] {
  const { data: allOrders } = useOrderStore();
  const { data: allReceipts } = useReceiptStore();
  const { data: allPayments } = usePaymentStore();

  return useMemo(() => {
    return customers.map(customer => {
      const debtInfo = computeCustomerDebtTransactions(customer, allOrders, allReceipts, allPayments);
      return {
        ...customer,
        currentDebt: debtInfo.currentDebt, // Override static currentDebt
        debtTransactions: debtInfo.debtTransactions, // Override static debtTransactions
      };
    });
  }, [customers, allOrders, allReceipts, allPayments]);
}
