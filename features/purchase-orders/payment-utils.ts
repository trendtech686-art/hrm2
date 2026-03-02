import type { Payment } from '../payments/types';
import type { Receipt } from '../receipts/types';
import type { PurchaseOrder } from '@/lib/types/prisma-extended';

const _SUPPLIER_TARGET_IDS = ['NHACUNGCAP', 'supplier'];
const _SUPPLIER_TARGET_LABELS = ['Nhà cung cấp'];

export const isPaymentLinkedToPurchaseOrder = (payment: Payment, purchaseOrder: PurchaseOrder): boolean => {
  if (!payment || !purchaseOrder) {
    return false;
  }

  // Debug log để xem tại sao payments matching
  const debugInfo = {
    paymentId: payment.id,
    poId: purchaseOrder.id,
    poSystemId: purchaseOrder.systemId,
    payment_purchaseOrderSystemId: payment.purchaseOrderSystemId,
    payment_purchaseOrderId: payment.purchaseOrderId,
    payment_originalDocumentId: payment.originalDocumentId,
  };

  // Priority 1: Direct link via purchaseOrderSystemId
  if (payment.purchaseOrderSystemId) {
    const match = payment.purchaseOrderSystemId === purchaseOrder.systemId;
    if (match) console.log('[Payment Match] via purchaseOrderSystemId:', debugInfo);
    return match;
  }

  // Priority 2: Link via purchaseOrderId (which stores systemId in DB)
  if (payment.purchaseOrderId) {
    const match = (
      payment.purchaseOrderId === purchaseOrder.systemId ||
      payment.purchaseOrderId === purchaseOrder.id
    );
    if (match) console.log('[Payment Match] via purchaseOrderId:', debugInfo);
    return match;
  }

  // Priority 3: Link via originalDocumentId
  if (payment.originalDocumentId) {
    const match = (
      payment.originalDocumentId === purchaseOrder.systemId ||
      payment.originalDocumentId === purchaseOrder.id
    );
    if (match) console.log('[Payment Match] via originalDocumentId:', debugInfo);
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
export const getPaymentsForPurchaseOrder = (payments: Payment[], purchaseOrder: PurchaseOrder): Payment[] => {
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
export const getSupplierPaymentsForPurchaseOrder = (payments: Payment[], purchaseOrder: PurchaseOrder): Payment[] => {
  if (!Array.isArray(payments) || !purchaseOrder) {
    return [];
  }
  return payments.filter(payment => {
    if (!isPaymentLinkedToPurchaseOrder(payment, purchaseOrder)) return false;
    // Only include supplier_payment category, exclude expense category
    return payment.category === 'supplier_payment';
  });
};

/**
 * Sum only SUPPLIER payments for calculating debt
 * Excludes expense payments (shipping fees, other fees)
 */
export const sumPaymentsForPurchaseOrder = (payments: Payment[], purchaseOrder: PurchaseOrder): number => {
  return getSupplierPaymentsForPurchaseOrder(payments, purchaseOrder).reduce((sum, payment) => sum + (payment.amount || 0), 0);
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
