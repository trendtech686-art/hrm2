/**
 * Receipts Store - Helpers
 * Helper functions and utilities
 * 
 * @module features/receipts/store/helpers
 */

import type { Receipt } from '@/lib/types/prisma-extended';
import type { HistoryEntry } from '../../../components/ActivityHistory';
import { 
  findNextAvailableBusinessId, 
  generateSystemId, 
  getMaxBusinessIdCounter, 
  getMaxSystemIdCounter,
  extractCounterFromBusinessId,
  type EntityType 
} from '@/lib/id-utils';
import { asSystemId, asBusinessId, type BusinessId, type SystemId } from '@/lib/id-types';
import { pickAccount, pickPaymentMethod, pickReceiptType, pickTargetGroup } from '@/features/finance/document-lookups';
import { useEmployeeStore } from '../../employees/store';
import { getCurrentUserSystemId } from '../../../contexts/auth-context';

// ============================================================================
// Constants
// ============================================================================

export const RECEIPT_ENTITY: EntityType = 'receipts';
export const SYSTEM_ID_PREFIX = 'RECEIPT';
export const BUSINESS_ID_PREFIX = 'PT';
export const BUSINESS_ID_DIGITS = 6;

const SYSTEM_AUTHOR = asSystemId('SYSTEM');

// ============================================================================
// User Info Helpers
// ============================================================================

export const getCurrentUserInfo = () => {
  const currentUserSystemId = getCurrentUserSystemId?.() || 'SYSTEM';
  const employee = useEmployeeStore.getState().data.find(e => e.systemId === currentUserSystemId);
  return {
    systemId: currentUserSystemId,
    name: employee?.fullName || 'Hệ thống',
    avatar: employee?.avatarUrl,
  };
};

export const getCurrentReceiptAuthor = (): SystemId => {
  const userId = getCurrentUserSystemId?.();
  return userId ? asSystemId(userId) : SYSTEM_AUTHOR;
};

// ============================================================================
// History Entry Helper
// ============================================================================

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

// ============================================================================
// Status Normalization
// ============================================================================

export const normalizeReceiptStatus = (status?: Receipt['status']): Receipt['status'] =>
  status === 'cancelled' ? 'cancelled' : 'completed';

// ============================================================================
// Metadata Helpers
// ============================================================================

export const ensureReceiptMetadata = (receipt: Receipt): Receipt => {
  let mutated = false;
  const updates: Partial<Receipt> = {};

  const targetGroup = pickTargetGroup({
    systemId: receipt.payerTypeSystemId,
    name: receipt.payerTypeName,
  });
  if (targetGroup) {
    if (receipt.payerTypeSystemId !== targetGroup.systemId) {
      updates.payerTypeSystemId = targetGroup.systemId;
      mutated = true;
    }
    if (receipt.payerTypeName !== targetGroup.name) {
      updates.payerTypeName = targetGroup.name;
      mutated = true;
    }
  }

  const paymentMethod = pickPaymentMethod({
    systemId: receipt.paymentMethodSystemId,
    name: receipt.paymentMethodName,
  });
  if (paymentMethod) {
    if (receipt.paymentMethodSystemId !== paymentMethod.systemId) {
      updates.paymentMethodSystemId = paymentMethod.systemId;
      mutated = true;
    }
    if (receipt.paymentMethodName !== paymentMethod.name) {
      updates.paymentMethodName = paymentMethod.name;
      mutated = true;
    }
  }

  const account = pickAccount({
    accountSystemId: receipt.accountSystemId,
    branchSystemId: receipt.branchSystemId,
    paymentMethodName: paymentMethod?.name ?? receipt.paymentMethodName,
  });
  if (account && receipt.accountSystemId !== account.systemId) {
    updates.accountSystemId = account.systemId;
    mutated = true;
  }

  const receiptType = pickReceiptType({
    systemId: receipt.paymentReceiptTypeSystemId,
    name: receipt.paymentReceiptTypeName,
  });
  if (receiptType) {
    if (receipt.paymentReceiptTypeSystemId !== receiptType.systemId) {
      updates.paymentReceiptTypeSystemId = receiptType.systemId;
      mutated = true;
    }
    if (receipt.paymentReceiptTypeName !== receiptType.name) {
      updates.paymentReceiptTypeName = receiptType.name;
      mutated = true;
    }
  }

  if (!receipt.customerName && receipt.payerName) {
    updates.customerName = receipt.payerName;
    mutated = true;
  }

  if (!receipt.customerSystemId && receipt.payerSystemId) {
    updates.customerSystemId = receipt.payerSystemId;
    mutated = true;
  }

  return mutated ? { ...receipt, ...updates } : receipt;
};

export const backfillReceiptMetadata = (receipts: Receipt[]): Receipt[] => {
  let mutated = false;
  const updated = receipts.map(receipt => {
    const normalized = ensureReceiptMetadata(receipt);
    if (normalized !== receipt) {
      mutated = true;
    }
    return normalized;
  });
  return mutated ? updated : receipts;
};

// ============================================================================
// ID Generation - State managed by index.ts
// ============================================================================

let systemIdCounter = 0;
let businessIdCounter = 0;

export const initializeCounters = (receipts: Receipt[]) => {
  systemIdCounter = getMaxSystemIdCounter(receipts, SYSTEM_ID_PREFIX);
  businessIdCounter = getMaxBusinessIdCounter(receipts, BUSINESS_ID_PREFIX);
  return { systemIdCounter, businessIdCounter };
};

export const getNextSystemId = (): SystemId => {
  systemIdCounter += 1;
  return asSystemId(generateSystemId(RECEIPT_ENTITY, systemIdCounter));
};

export const ensureReceiptBusinessId = (receipts: Receipt[], provided?: BusinessId | string): BusinessId => {
  if (provided && `${provided}`.trim().length > 0) {
    const normalized = `${provided}`.trim().toUpperCase();
    const parsedCounter = extractCounterFromBusinessId(normalized, BUSINESS_ID_PREFIX);
    if (parsedCounter > businessIdCounter) {
      businessIdCounter = parsedCounter;
    }
    return asBusinessId(normalized);
  }

  const existingIds = receipts.map(receipt => receipt.id as string).filter(Boolean);
  const { nextId, updatedCounter } = findNextAvailableBusinessId(
    BUSINESS_ID_PREFIX,
    existingIds,
    businessIdCounter,
    BUSINESS_ID_DIGITS
  );
  businessIdCounter = updatedCounter;
  return asBusinessId(nextId);
};

export const getCounters = () => ({ systemIdCounter, businessIdCounter });
