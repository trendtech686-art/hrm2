import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { data as initialData } from './data';
import type { PaymentMethod } from '@/lib/types/prisma-extended';
import { asSystemId, type SystemId } from '@/lib/id-types';

interface PaymentMethodState {
  data: PaymentMethod[];
  add: (item: Omit<PaymentMethod, 'systemId' | 'isDefault'>) => void;
  update: (systemId: SystemId, updatedPolicy: Omit<PaymentMethod, 'isDefault' | 'systemId'>) => void;
  remove: (systemId: SystemId) => void;
  setDefault: (systemId: SystemId) => void;
}

export const usePaymentMethodStore = create<PaymentMethodState>()(
  persist(
    (set) => ({
      data: initialData,
      add: (item) => set((state) => {
        const newItem: PaymentMethod = { 
            ...item, 
            systemId: asSystemId(`PM_${Date.now()}`),
            isDefault: state.data.length === 0, // Make first item default
        };
        return { data: [...state.data, newItem] };
      }),
      update: (systemId, updatedFields) => set((state) => ({
        data: state.data.map(p => p.systemId === systemId ? { ...p, ...updatedFields } : p),
      })),
      remove: (systemId) => set((state) => ({
        data: state.data.filter((p) => p.systemId !== systemId),
      })),
      setDefault: (systemId) => set((state) => ({
        data: state.data.map(p => ({ ...p, isDefault: p.systemId === systemId })),
      })),
    }),
    {
      name: 'hrm-payment-method-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
