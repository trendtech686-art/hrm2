import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { data as initialData } from './data';
import type { CashAccount } from '@/lib/types/prisma-extended';
import { findNextAvailableBusinessId, generateSystemId, getMaxBusinessIdCounter, getMaxSystemIdCounter, type EntityType } from '../../lib/id-utils';
import { asBusinessId, asSystemId, type BusinessId, type SystemId } from '../../lib/id-types';

const CASH_ACCOUNT_ENTITY: EntityType = 'cash-accounts';
const SYSTEM_ID_PREFIX = 'ACCOUNT';
const BUSINESS_ID_PREFIX = 'TK';
const BUSINESS_ID_DIGITS = 6;

interface CashbookState {
  accounts: CashAccount[];
  getAccountById: (id: BusinessId) => CashAccount | undefined;
  add: (item: Omit<CashAccount, 'systemId'>) => void;
  update: (systemId: SystemId, item: CashAccount) => void;
  remove: (systemId: SystemId) => void;
  setDefault: (systemId: SystemId) => void;
}

const getNextSystemId = (accounts: CashAccount[]): SystemId => {
  const currentCounter = getMaxSystemIdCounter(accounts, SYSTEM_ID_PREFIX);
  return asSystemId(generateSystemId(CASH_ACCOUNT_ENTITY, currentCounter + 1));
};

const ensureBusinessId = (accounts: CashAccount[], provided?: BusinessId): BusinessId => {
  if (provided && provided.trim()) {
    return provided;
  }

  const existingIds = accounts.map(acc => acc.id as string);
  const startCounter = getMaxBusinessIdCounter(accounts, BUSINESS_ID_PREFIX);
  const { nextId } = findNextAvailableBusinessId(BUSINESS_ID_PREFIX, existingIds, startCounter, BUSINESS_ID_DIGITS);
  return asBusinessId(nextId);
};

export const useCashbookStore = create<CashbookState>()(
  persist(
    (set, get) => ({
      accounts: initialData,
      getAccountById: (id) => get().accounts.find(a => a.id === id),
      add: (item) => set((state) => {
        const newAccount: CashAccount = {
          ...item,
          systemId: getNextSystemId(state.accounts),
          id: ensureBusinessId(state.accounts, item.id),
        };

        return { accounts: [...state.accounts, newAccount] };
      }),
      update: (systemId, updatedItem) => set((state) => ({
        accounts: state.accounts.map((acc) => (acc.systemId === systemId ? updatedItem : acc))
      })),
      remove: (systemId) => set((state) => ({
        accounts: state.accounts.filter(acc => acc.systemId !== systemId)
      })),
      setDefault: (systemId) => set((state) => {
        const targetAccount = state.accounts.find(acc => acc.systemId === systemId);
        if (!targetAccount) return state;

        return {
          accounts: state.accounts.map(acc => ({
            ...acc,
            isDefault: (acc.type === targetAccount.type ? acc.systemId === systemId : acc.isDefault) ?? false
          }))
        };
      })
    }),
    {
      name: 'hrm-cashbook-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
