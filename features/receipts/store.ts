import { create } from 'zustand';
import { persist, createJSONStorage, subscribeWithSelector } from 'zustand/middleware';
import type { Receipt } from './types';
import type { HistoryEntry } from '../../components/ActivityHistory';
import { 
  findNextAvailableBusinessId, 
  generateSystemId, 
  getMaxBusinessIdCounter, 
  getMaxSystemIdCounter,
  extractCounterFromBusinessId,
  type EntityType 
} from '@/lib/id-utils';
import { asSystemId, asBusinessId, type BusinessId, type SystemId } from '@/lib/id-types';
import { data as initialData } from './data';
import { pickAccount, pickPaymentMethod, pickReceiptType, pickTargetGroup } from '@/features/finance/document-lookups';
import { useEmployeeStore } from '../employees/store';
import { getCurrentUserSystemId } from '../../contexts/auth-context';

// Helper to get current user info
const getCurrentUserInfo = () => {
  const currentUserSystemId = getCurrentUserSystemId?.() || 'SYSTEM';
  const employee = useEmployeeStore.getState().data.find(e => e.systemId === currentUserSystemId);
  return {
    systemId: currentUserSystemId,
    name: employee?.fullName || 'Hệ thống',
    avatar: employee?.avatarUrl,
  };
};

// Helper to create history entry
const createHistoryEntry = (
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

const SYSTEM_AUTHOR = asSystemId('SYSTEM');
const getCurrentReceiptAuthor = (): SystemId => {
  const userId = getCurrentUserSystemId?.();
  return userId ? asSystemId(userId) : SYSTEM_AUTHOR;
};

export type ReceiptInput = Omit<Receipt, 'systemId' | 'id'> & { id?: BusinessId };

interface ReceiptStore {
  data: Receipt[];
  businessIdCounter: number;
  systemIdCounter: number;
  add: (item: ReceiptInput) => Receipt;
  addMultiple: (items: ReceiptInput[]) => void;
  update: (systemId: SystemId, item: Receipt) => void;
  remove: (systemId: SystemId) => void;
  findById: (systemId: SystemId) => Receipt | undefined;
  getActive: () => Receipt[];
  cancel: (systemId: SystemId, reason?: string) => void;
}

const RECEIPT_ENTITY: EntityType = 'receipts';
const SYSTEM_ID_PREFIX = 'RECEIPT';
const BUSINESS_ID_PREFIX = 'PT';
const BUSINESS_ID_DIGITS = 6;

const normalizeReceiptStatus = (status?: Receipt['status']): Receipt['status'] =>
  status === 'cancelled' ? 'cancelled' : 'completed';

const ensureReceiptMetadata = (receipt: Receipt): Receipt => {
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

const backfillReceiptMetadata = (receipts: Receipt[]): Receipt[] => {
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

const initialReceipts = backfillReceiptMetadata(initialData.map(receipt => ({
  ...receipt,
  status: normalizeReceiptStatus(receipt.status),
})));

let systemIdCounter = getMaxSystemIdCounter(initialReceipts, SYSTEM_ID_PREFIX);
let businessIdCounter = getMaxBusinessIdCounter(initialReceipts, BUSINESS_ID_PREFIX);

const getNextSystemId = (): SystemId => {
  systemIdCounter += 1;
  return asSystemId(generateSystemId(RECEIPT_ENTITY, systemIdCounter));
};

const ensureReceiptBusinessId = (receipts: Receipt[], provided?: BusinessId | string): BusinessId => {
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

export const useReceiptStore = create<ReceiptStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
      data: initialReceipts,
      businessIdCounter,
      systemIdCounter,
      
      add: (item: ReceiptInput): Receipt => {
        let createdReceipt: Receipt | null = null;
        set(state => {
          const systemId = getNextSystemId();
          const id = ensureReceiptBusinessId(state.data, item.id);
          const createdBy = item.createdBy ?? getCurrentReceiptAuthor();
          
          const newReceipt: Receipt = { 
            ...item, 
            systemId, 
            id,
            createdBy,
            createdAt: item.createdAt || new Date().toISOString(),
            status: normalizeReceiptStatus(item.status),
            orderAllocations: item.orderAllocations ?? [],
          };

          const normalizedReceipt = ensureReceiptMetadata(newReceipt);
          createdReceipt = normalizedReceipt;

          return { 
            data: [...state.data, normalizedReceipt],
            businessIdCounter,
            systemIdCounter
          };
        });
        return createdReceipt!;
      },
      
      addMultiple: (items: ReceiptInput[]) => {
        set(state => {
          const created: Receipt[] = [];
          
          items.forEach(item => {
            const context = [...state.data, ...created];
            const systemId = getNextSystemId();
            const id = ensureReceiptBusinessId(context, item.id);
            const createdBy = item.createdBy ?? getCurrentReceiptAuthor();
            
            const newReceipt: Receipt = { 
              ...item, 
              systemId, 
              id,
              createdBy,
              createdAt: item.createdAt || new Date().toISOString(),
              status: normalizeReceiptStatus(item.status),
              orderAllocations: item.orderAllocations ?? [],
            };
            created.push(ensureReceiptMetadata(newReceipt));
          });
          
          return { 
            data: [...state.data, ...created],
            businessIdCounter,
            systemIdCounter
          };
        });
      },
      
      update: (systemId: SystemId, item: Receipt) => {
        set(state => ({
          data: state.data.map(r => r.systemId === systemId ? { ...item, status: normalizeReceiptStatus(item.status), updatedAt: new Date().toISOString() } : r),
          businessIdCounter,
          systemIdCounter
        }));
      },
      
      remove: (systemId: SystemId) => {
        set(state => ({
          data: state.data.filter(r => r.systemId !== systemId),
          businessIdCounter,
          systemIdCounter
        }));
      },
      
      findById: (systemId: SystemId) => {
        return get().data.find(r => r.systemId === systemId);
      },
      
      getActive: () => {
        return get().data.filter(r => r.status !== 'cancelled');
      },
      
      cancel: (systemId: SystemId, reason?: string) => {
        const receipt = get().findById(systemId);
        if (receipt && receipt.status !== 'cancelled') {
          const historyEntry = createHistoryEntry(
            'cancelled',
            `Đã hủy phiếu thu${reason ? `: ${reason}` : ''}`,
            { oldValue: 'Hoàn thành', newValue: 'Đã hủy', note: reason }
          );
          
          get().update(systemId, {
            ...receipt,
            status: 'cancelled',
            cancelledAt: new Date().toISOString(),
            activityHistory: [...(receipt.activityHistory || []), historyEntry],
          });
        }
      },
    }),
    {
      name: 'receipt-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.data) {
          const normalized = backfillReceiptMetadata(state.data.map(receipt => ({
            ...receipt,
            status: normalizeReceiptStatus(receipt.status),
          })));
          
          const nextSystemCounter = getMaxSystemIdCounter(normalized, SYSTEM_ID_PREFIX);
          const nextBusinessCounter = getMaxBusinessIdCounter(normalized, BUSINESS_ID_PREFIX);
          systemIdCounter = nextSystemCounter;
          businessIdCounter = nextBusinessCounter;

          state.data = normalized;
          state.systemIdCounter = systemIdCounter;
          state.businessIdCounter = businessIdCounter;
        }
      },
    }
  ))
);
