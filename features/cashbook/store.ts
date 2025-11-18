import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { data as initialData } from './data.ts';
import type { CashAccount } from './types.ts';
import { findNextAvailableBusinessId } from '../../lib/id-utils';

interface CashbookState {
  accounts: CashAccount[];
  getAccountById: (id: string) => CashAccount | undefined;
  add: (item: Omit<CashAccount, 'systemId'>) => void;
  update: (systemId: string, item: CashAccount) => void;
  remove: (systemId: string) => void;
  setDefault: (systemId: string) => void;
}

let idCounter = initialData.length;

export const useCashbookStore = create<CashbookState>()(
  persist(
    (set, get) => ({
      accounts: initialData,
      getAccountById: (id) => get().accounts.find(a => a.id === id),
      add: (item) => set(state => {
        // Generate systemId using ACCOUNT prefix (6 digits)
        idCounter++;
        const newSystemId = `ACCOUNT${String(idCounter).padStart(6, '0')}`;
        
        // Auto-generate business ID if empty
        let businessId = item.id;
        if (!businessId || !businessId.trim()) {
          const existingIds = state.accounts.map(acc => acc.id);
          const result = findNextAvailableBusinessId('TK', existingIds, idCounter, 6);
          businessId = result.nextId;
          idCounter = result.updatedCounter;
        }
        
        const newItem = { ...item, systemId: newSystemId, id: businessId } as CashAccount;
        return { accounts: [...state.accounts, newItem] };
      }),
      update: (systemId, updatedItem) => set(state => ({
        accounts: state.accounts.map(acc => acc.systemId === systemId ? updatedItem : acc)
      })),
      remove: (systemId) => set(state => ({
        accounts: state.accounts.filter(acc => acc.systemId !== systemId)
      })),
      setDefault: (systemId) => set(state => {
        const targetAccount = state.accounts.find(acc => acc.systemId === systemId);
        if (!targetAccount) return state;
        
        // Chỉ set default cho accounts cùng type (cash hoặc bank)
        return {
          accounts: state.accounts.map(acc => ({
            ...acc,
            isDefault: acc.type === targetAccount.type ? acc.systemId === systemId : acc.isDefault
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
