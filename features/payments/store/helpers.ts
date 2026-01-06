/**
 * Payments Store - Helpers
 * ID generation and metadata utilities
 * 
 * @module features/payments/store/helpers
 */

import type { Payment } from '@/lib/types/prisma-extended';
import type { HistoryEntry } from '../../../components/ActivityHistory';
import {
  extractCounterFromBusinessId,
  findNextAvailableBusinessId,
  generateSystemId,
  getMaxBusinessIdCounter,
  getMaxSystemIdCounter,
  type EntityType,
} from '../../../lib/id-utils';
import { asBusinessId, asSystemId, type BusinessId, type SystemId } from '../../../lib/id-types';
import { pickAccount, pickPaymentMethod, pickPaymentType, pickTargetGroup } from '@/features/finance/document-lookups';
import { useEmployeeStore } from '../../employees/store';
import { getCurrentUserSystemId } from '../../../contexts/auth-context';

const PAYMENT_ENTITY: EntityType = 'payments';
const SYSTEM_ID_PREFIX = 'PAYMENT';
const BUSINESS_ID_PREFIX = 'PC';
const BUSINESS_ID_DIGITS = 6;
const PURCHASE_ORDER_SYSTEM_PREFIX = 'PURCHASE';
const PURCHASE_ORDER_BUSINESS_PREFIX = 'PO';

// Counter management
let systemIdCounter = 0;
let businessIdCounter = 0;

export const initCounters = (payments: Payment[]) => {
  systemIdCounter = getMaxSystemIdCounter(payments, SYSTEM_ID_PREFIX);
  businessIdCounter = getMaxBusinessIdCounter(payments, BUSINESS_ID_PREFIX);
};

export const getCounters = () => ({ systemIdCounter, businessIdCounter });

// ========================================
// User Info
// ========================================

export const getCurrentUserInfo = () => {
  const currentUserSystemId = getCurrentUserSystemId?.() || 'SYSTEM';
  const employee = useEmployeeStore.getState().data.find(e => e.systemId === currentUserSystemId);
  return {
    systemId: currentUserSystemId,
    name: employee?.fullName || 'Hệ thống',
    avatar: employee?.avatarUrl,
  };
};

// ========================================
// History Entry
// ========================================

export const createHistoryEntry = (
  action: HistoryEntry['action'],
  description: string,
  metadata?: HistoryEntry['metadata']
): HistoryEntry => ({
  id: crypto.randomUUID(),
  action,
  timestamp: new Date(),
  user: getCurrentUserInfo(),
  description,
  metadata,
});

// ========================================
// Payment Normalization
// ========================================

export const normalizePaymentStatus = (status?: Payment['status']): Payment['status'] =>
  status === 'cancelled' ? 'cancelled' : 'completed';

export const normalizePayment = (payment: Payment): Payment => ({
  ...payment,
  status: normalizePaymentStatus(payment.status),
});

export const ensurePaymentMetadata = (payment: Payment): Payment => {
  let mutated = false;
  const updates: Partial<Payment> = {};

  const targetGroup = pickTargetGroup({
    systemId: payment.recipientTypeSystemId,
    name: payment.recipientTypeName,
  });
  if (targetGroup) {
    if (payment.recipientTypeSystemId !== targetGroup.systemId) {
      updates.recipientTypeSystemId = targetGroup.systemId;
      mutated = true;
    }
    if (payment.recipientTypeName !== targetGroup.name) {
      updates.recipientTypeName = targetGroup.name;
      mutated = true;
    }
  }

  const paymentMethod = pickPaymentMethod({
    systemId: payment.paymentMethodSystemId,
    name: payment.paymentMethodName,
  });
  if (paymentMethod) {
    if (payment.paymentMethodSystemId !== paymentMethod.systemId) {
      updates.paymentMethodSystemId = paymentMethod.systemId;
      mutated = true;
    }
    if (payment.paymentMethodName !== paymentMethod.name) {
      updates.paymentMethodName = paymentMethod.name;
      mutated = true;
    }
  }

  const account = pickAccount({
    accountSystemId: payment.accountSystemId,
    branchSystemId: payment.branchSystemId,
    paymentMethodName: paymentMethod?.name ?? payment.paymentMethodName,
  });
  if (account && payment.accountSystemId !== account.systemId) {
    updates.accountSystemId = account.systemId;
    mutated = true;
  }

  const paymentType = pickPaymentType({
    systemId: payment.paymentReceiptTypeSystemId,
    name: payment.paymentReceiptTypeName,
  });
  if (paymentType) {
    if (payment.paymentReceiptTypeSystemId !== paymentType.systemId) {
      updates.paymentReceiptTypeSystemId = paymentType.systemId;
      mutated = true;
    }
    if (payment.paymentReceiptTypeName !== paymentType.name) {
      updates.paymentReceiptTypeName = paymentType.name;
      mutated = true;
    }
  }

  const normalizedGroupName = targetGroup?.name?.trim().toLowerCase();
  if (normalizedGroupName === 'khách hàng') {
    if (!payment.customerName && payment.recipientName) {
      updates.customerName = payment.recipientName;
      mutated = true;
    }
    if (!payment.customerSystemId && payment.recipientSystemId) {
      updates.customerSystemId = payment.recipientSystemId;
      mutated = true;
    }
  }

  return mutated ? { ...payment, ...updates } : payment;
};

export const backfillPaymentMetadata = (payments: Payment[]): Payment[] => {
  let mutated = false;
  const updated = payments.map(payment => {
    const normalized = ensurePaymentMetadata(payment);
    if (normalized !== payment) {
      mutated = true;
    }
    return normalized;
  });
  return mutated ? updated : payments;
};

// ========================================
// ID Generation
// ========================================

export const getNextSystemId = (): SystemId => {
  systemIdCounter += 1;
  return asSystemId(generateSystemId(PAYMENT_ENTITY, systemIdCounter));
};

export const ensurePaymentBusinessId = (payments: Payment[], provided?: BusinessId | string): BusinessId => {
  if (provided && `${provided}`.trim().length > 0) {
    const normalized = `${provided}`.trim().toUpperCase();
    const parsedCounter = extractCounterFromBusinessId(normalized, BUSINESS_ID_PREFIX);
    if (parsedCounter > businessIdCounter) {
      businessIdCounter = parsedCounter;
    }
    return asBusinessId(normalized);
  }

  const existingIds = payments.map(payment => payment.id as string).filter(Boolean);
  const { nextId, updatedCounter } = findNextAvailableBusinessId(
    BUSINESS_ID_PREFIX,
    existingIds,
    businessIdCounter,
    BUSINESS_ID_DIGITS
  );
  businessIdCounter = updatedCounter;
  return asBusinessId(nextId);
};

// ========================================
// Document Reconciliation
// ========================================

export const reconcileLinkedDocuments = (payment: Payment): Payment => {
  if (!payment.originalDocumentId) {
    return payment;
  }

  const normalizedDocId = payment.originalDocumentId.toUpperCase();
  const nextPayment = { ...payment };

  if (!nextPayment.purchaseOrderSystemId && normalizedDocId.startsWith(PURCHASE_ORDER_SYSTEM_PREFIX)) {
    nextPayment.purchaseOrderSystemId = asSystemId(payment.originalDocumentId);
  }

  if (!nextPayment.purchaseOrderId && normalizedDocId.startsWith(PURCHASE_ORDER_BUSINESS_PREFIX)) {
    nextPayment.purchaseOrderId = asBusinessId(payment.originalDocumentId);
  }

  return nextPayment;
};
