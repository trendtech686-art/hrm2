import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Receipt, ReceiptStatus } from './types';
import { findNextAvailableBusinessId } from '../../lib/id-utils';
import { asSystemId, asBusinessId } from '../../lib/id-types';
import { data as initialData } from './data';

interface ReceiptStore {
  data: Receipt[];
  add: (item: Omit<Receipt, 'systemId'>) => Receipt;
  addMultiple: (items: Omit<Receipt, 'systemId'>[]) => void;
  update: (systemId: string, item: Receipt) => void;
  remove: (systemId: string) => void;
  findById: (systemId: string) => Receipt | undefined;
  getActive: () => Receipt[];
  approve: (systemId: string, approverSystemId: string, approverName: string) => void;
  complete: (systemId: string, completerSystemId: string, completerName: string) => void;
  cancel: (systemId: string) => void;
}

let receiptCounter = initialData.length;

export const useReceiptStore = create<ReceiptStore>()(
  persist(
    (set, get) => ({
      data: initialData,
      
      add: (item: Omit<Receipt, 'systemId'>): Receipt => {
        receiptCounter++;
        const systemId = asSystemId(`RECEIPT${String(receiptCounter).padStart(6, '0')}`);
        
        // Auto-generate business ID if empty
        let businessId = item.id as string;
        if (!businessId || !businessId.trim()) {
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
          status: item.status || 'completed'
        };
        
        set(state => ({ data: [...state.data, newReceipt] }));
        return newReceipt;
      },
      
      addMultiple: (items: Omit<Receipt, 'systemId'>[]) => {
        const newReceipts = items.map(item => {
          receiptCounter++;
          const systemId = asSystemId(`RECEIPT${String(receiptCounter).padStart(6, '0')}`);
          
          let businessId = item.id as string;
          if (!businessId || !businessId.trim()) {
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
            status: item.status || 'completed'
          } as Receipt;
        });
        
        set(state => ({ data: [...state.data, ...newReceipts] }));
      },
      
      update: (systemId: string, item: Receipt) => {
        set(state => ({
          data: state.data.map(r => r.systemId === systemId ? { ...item, updatedAt: new Date().toISOString() } : r)
        }));
      },
      
      remove: (systemId: string) => {
        set(state => ({
          data: state.data.filter(r => r.systemId !== systemId)
        }));
      },
      
      findById: (systemId: string) => {
        return get().data.find(r => r.systemId === systemId);
      },
      
      getActive: () => {
        return get().data.filter(r => r.status !== 'cancelled');
      },
      
      approve: (systemId: string, approverSystemId: string, approverName: string) => {
        const receipt = get().findById(systemId);
        if (receipt) {
          get().update(systemId, {
            ...receipt,
            status: 'approved',
            approvedBy: approverSystemId,
            approvedByName: approverName,
            approvedAt: new Date().toISOString(),
          });
        }
      },
      
      complete: (systemId: string, completerSystemId: string, completerName: string) => {
        const receipt = get().findById(systemId);
        if (receipt) {
          get().update(systemId, {
            ...receipt,
            status: 'completed',
            completedBy: completerSystemId,
            completedByName: completerName,
            completedAt: new Date().toISOString(),
          });
        }
      },
      
      cancel: (systemId: string) => {
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
    }
  )
);
