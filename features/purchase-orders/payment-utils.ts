import type { Payment } from '../payments/types.ts';
import type { Receipt } from '../receipts/types.ts';
import type { PurchaseOrder } from './types.ts';

const SUPPLIER_TARGET_IDS = ['NHACUNGCAP', 'supplier'];
const SUPPLIER_TARGET_LABELS = ['Nhà cung cấp'];

export const isPaymentLinkedToPurchaseOrder = (payment: Payment, purchaseOrder: PurchaseOrder): boolean => {
  if (!payment || !purchaseOrder) {
    return false;
  }

  if (payment.purchaseOrderSystemId) {
    return payment.purchaseOrderSystemId === purchaseOrder.systemId;
  }

  if (payment.originalDocumentId) {
    return (
      payment.originalDocumentId === purchaseOrder.systemId ||
      payment.originalDocumentId === purchaseOrder.id
    );
  }

  const isSupplierTarget =
    (payment.recipientTypeSystemId && SUPPLIER_TARGET_IDS.includes(payment.recipientTypeSystemId)) ||
    (payment.recipientTypeName && SUPPLIER_TARGET_LABELS.includes(payment.recipientTypeName));

  if (isSupplierTarget && payment.recipientSystemId && payment.recipientSystemId === purchaseOrder.supplierSystemId) {
    return true;
  }

  return false;
};

export const getPaymentsForPurchaseOrder = (payments: Payment[], purchaseOrder: PurchaseOrder): Payment[] => {
  if (!Array.isArray(payments) || !purchaseOrder) {
    return [];
  }
  return payments.filter(payment => isPaymentLinkedToPurchaseOrder(payment, purchaseOrder));
};

export const sumPaymentsForPurchaseOrder = (payments: Payment[], purchaseOrder: PurchaseOrder): number => {
  return getPaymentsForPurchaseOrder(payments, purchaseOrder).reduce((sum, payment) => sum + (payment.amount || 0), 0);
};

export const isReceiptLinkedToPurchaseOrder = (receipt: Receipt, purchaseOrder: PurchaseOrder): boolean => {
  if (!receipt || !purchaseOrder) {
    return false;
  }

  if (receipt.purchaseOrderSystemId) {
    return receipt.purchaseOrderSystemId === purchaseOrder.systemId;
  }

  if (receipt.originalDocumentId) {
    return (
      receipt.originalDocumentId === purchaseOrder.systemId ||
      receipt.originalDocumentId === purchaseOrder.id
    );
  }

  const isSupplierTarget =
    (receipt.payerTypeSystemId && SUPPLIER_TARGET_IDS.includes(receipt.payerTypeSystemId)) ||
    (receipt.payerTypeName && SUPPLIER_TARGET_LABELS.includes(receipt.payerTypeName));

  if (isSupplierTarget && receipt.payerSystemId && receipt.payerSystemId === purchaseOrder.supplierSystemId) {
    return true;
  }

  return false;
};

export const getReceiptsForPurchaseOrder = (receipts: Receipt[], purchaseOrder: PurchaseOrder): Receipt[] => {
  if (!Array.isArray(receipts) || !purchaseOrder) {
    return [];
  }
  return receipts.filter(receipt => isReceiptLinkedToPurchaseOrder(receipt, purchaseOrder));
};
