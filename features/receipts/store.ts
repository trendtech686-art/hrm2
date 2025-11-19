import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Receipt } from './types';
import { findNextAvailableBusinessId } from '@/lib/id-utils';
import { asSystemId, asBusinessId, type BusinessId, type SystemId } from '@/lib/id-types';
import { data as initialData } from './data';

export type ReceiptInput = Omit<Receipt, 'systemId'> & { id?: BusinessId | string };

interface ReceiptStore {
  data: Receipt[];
  add: (item: ReceiptInput) => Receipt;
  addMultiple: (items: ReceiptInput[]) => void;
  update: (systemId: SystemId, item: Receipt) => void;
  remove: (systemId: SystemId) => void;
  findById: (systemId: SystemId) => Receipt | undefined;
  getActive: () => Receipt[];
  cancel: (systemId: SystemId) => void;
}

let receiptCounter = initialData.length;

const normalizeReceiptStatus = (status?: Receipt['status']): Receipt['status'] =>
  status === 'cancelled' ? 'cancelled' : 'completed';

export const useReceiptStore = create<ReceiptStore>()(
  persist(
    (set, get) => ({
      data: initialData.map(receipt => ({
        ...receipt,
        status: normalizeReceiptStatus(receipt.status),
      })),
      
      add: (item: ReceiptInput): Receipt => {
        receiptCounter++;
        const systemId = asSystemId(`RECEIPT${String(receiptCounter).padStart(6, '0')}`);
        
        // Auto-generate business ID if empty
        let businessId = typeof item.id === 'string' ? item.id.trim() : '';
        if (!businessId) {
          const existingIds = get().data.map(r => r.id as string);
          const result = findNextAvailableBusinessId('PT', existingIds, receiptCounter, 6);
          businessId = result.nextId;
          receiptCounter = result.updatedCounter;
        }
        
        const newReceipt: Receipt = { 
          ...item, 
          systemId, 
          id: asBusinessId(businessId),
          createdAt: item.createdAt || new Date().toISOString(),
          status: normalizeReceiptStatus(item.status)
        };
        
        set(state => ({ data: [...state.data, newReceipt] }));
        return newReceipt;
      },
      
      addMultiple: (items: ReceiptInput[]) => {
        const newReceipts = items.map(item => {
          receiptCounter++;
          const systemId = asSystemId(`RECEIPT${String(receiptCounter).padStart(6, '0')}`);
          
          let businessId = typeof item.id === 'string' ? item.id.trim() : '';
          if (!businessId) {
            const existingIds = get().data.map(r => r.id as string);
            const result = findNextAvailableBusinessId('PT', existingIds, receiptCounter, 6);
            businessId = result.nextId;
            receiptCounter = result.updatedCounter;
          }
          
          return { 
            ...item, 
            systemId, 
            id: asBusinessId(businessId),
            createdAt: item.createdAt || new Date().toISOString(),
            status: normalizeReceiptStatus(item.status)
          } as Receipt;
        });
        
        set(state => ({ data: [...state.data, ...newReceipts] }));
      },
      
      update: (systemId: SystemId, item: Receipt) => {
        set(state => ({
          data: state.data.map(r => r.systemId === systemId ? { ...item, status: normalizeReceiptStatus(item.status), updatedAt: new Date().toISOString() } : r)
        }));
      },
      
      remove: (systemId: SystemId) => {
        set(state => ({
          data: state.data.filter(r => r.systemId !== systemId)
        }));
      },
      
      findById: (systemId: SystemId) => {
        return get().data.find(r => r.systemId === systemId);
      },
      
      getActive: () => {
        return get().data.filter(r => r.status !== 'cancelled');
      },
      
      cancel: (systemId: SystemId) => {
        const receipt = get().findById(systemId);
        if (receipt) {
          get().update(systemId, {
            ...receipt,
            status: 'cancelled',
            cancelledAt: new Date().toISOString(),
          });
        }
      },
    }),
    {
      name: 'receipt-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.data) {
          state.data = state.data.map(receipt => ({
            ...receipt,
            status: normalizeReceiptStatus(receipt.status),
          }));
        }
      },
    }
  )
);
