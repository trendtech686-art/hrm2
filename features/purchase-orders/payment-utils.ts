import type { Payment } from '../payments/types';
import type { Receipt } from '../receipts/types';
import type { PurchaseOrder, PurchaseOrderPayment } from '@/lib/types/prisma-extended';

// Type for payments that can be linked to PO - either embedded or full Payment  
// Use generics to allow any object with at least an amount field
type PaymentLike = { amount: number | string } & Record<string, unknown>;

const _SUPPLIER_TARGET_IDS = ['NHACUNGCAP', 'supplier'];
const _SUPPLIER_TARGET_LABELS = ['Nhà cung cấp'];

export const isPaymentLinkedToPurchaseOrder = <T extends PaymentLike>(payment: T, purchaseOrder: PurchaseOrder): boolean => {
  if (!payment || !purchaseOrder) {
    return false;
  }

  // Priority 1: Direct link via purchaseOrderSystemId
  if ('purchaseOrderSystemId' in payment && payment.purchaseOrderSystemId) {
    const match = payment.purchaseOrderSystemId === purchaseOrder.systemId;
    return match;
  }

  // Priority 2: Link via purchaseOrderId (which stores systemId in DB)
  if ('purchaseOrderId' in payment && payment.purchaseOrderId) {
    const match = (
      payment.purchaseOrderId === purchaseOrder.systemId ||
      payment.purchaseOrderId === purchaseOrder.id
    );
    return match;
  }

  // Priority 3: Link via originalDocumentId
  if ('originalDocumentId' in payment && payment.originalDocumentId) {
    const match = (
      payment.originalDocumentId === purchaseOrder.systemId ||
      payment.originalDocumentId === purchaseOrder.id
    );
    return match;
  }

  // Note: Removed supplier fallback matching as it causes false positives
  // when multiple orders exist for the same supplier

  return false;
};

/**
 * Get ALL payments linked to a purchase order (including expenses like shipping fees)
 * Use this for displaying payment history
 */
export const getPaymentsForPurchaseOrder = <T extends PaymentLike>(payments: T[], purchaseOrder: PurchaseOrder): T[] => {
  if (!Array.isArray(payments) || !purchaseOrder) {
    return [];
  }
  return payments.filter(payment => isPaymentLinkedToPurchaseOrder(payment, purchaseOrder));
};

/**
 * Get only SUPPLIER payments linked to a purchase order
 * Excludes expense payments (shipping fees, other fees paid to 3rd parties)
 * Use this for calculating "Đã trả NCC" (amount paid to supplier)
 */
export const getSupplierPaymentsForPurchaseOrder = <T extends PaymentLike>(payments: T[], purchaseOrder: PurchaseOrder): T[] => {
  if (!Array.isArray(payments) || !purchaseOrder) {
    return [];
  }
  return payments.filter(payment => {
    if (!isPaymentLinkedToPurchaseOrder(payment, purchaseOrder)) return false;
    // Only include supplier_payment category, exclude expense category
    // If category is not available (embedded payment), assume it's a supplier payment
    const category = 'category' in payment ? payment.category : 'supplier_payment';
    return category === 'supplier_payment' || !category;
  });
};

/**
 * Sum only SUPPLIER payments for calculating debt
 * Excludes expense payments (shipping fees, other fees)
 */
export const sumPaymentsForPurchaseOrder = <T extends PaymentLike>(payments: T[], purchaseOrder: PurchaseOrder): number => {
  return getSupplierPaymentsForPurchaseOrder(payments, purchaseOrder).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
};

export const isReceiptLinkedToPurchaseOrder = (receipt: Receipt, purchaseOrder: PurchaseOrder): boolean => {
  if (!receipt || !purchaseOrder) {
    return false;
  }

  // Priority 1: Direct link via purchaseOrderSystemId
  if (receipt.purchaseOrderSystemId) {
    return receipt.purchaseOrderSystemId === purchaseOrder.systemId;
  }

  // Priority 2: Link via originalDocumentId  
  if (receipt.originalDocumentId) {
    return (
      receipt.originalDocumentId === purchaseOrder.systemId ||
      receipt.originalDocumentId === purchaseOrder.id
    );
  }

  // Note: Removed supplier fallback matching as it causes false positives
  // when multiple orders exist for the same supplier

  return false;
};

export const getReceiptsForPurchaseOrder = (receipts: Receipt[], purchaseOrder: PurchaseOrder): Receipt[] => {
  if (!Array.isArray(receipts) || !purchaseOrder) {
    return [];
  }
  return receipts.filter(receipt => isReceiptLinkedToPurchaseOrder(receipt, purchaseOrder));
};
