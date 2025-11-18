import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { data as initialData } from './data.ts';
import type { PricingPolicy } from './types.ts';

interface PricingPolicyState {
  data: PricingPolicy[];
  add: (item: Omit<PricingPolicy, 'systemId' | 'isDefault'>) => void;
  update: (systemId: string, updatedPolicy: Partial<Omit<PricingPolicy, 'systemId'>>) => void;
  remove: (systemId: string) => void;
  findById: (systemId: string) => PricingPolicy | undefined;
  setDefault: (systemId: string) => void;
  getActive: () => PricingPolicy[];
  getInactive: () => PricingPolicy[];
}

export const usePricingPolicyStore = create<PricingPolicyState>()(
  persist(
    (set, get) => ({
      data: initialData,
      findById: (systemId) => get().data.find((item) => item.systemId === systemId),
      getActive: () => get().data.filter((item) => item.isActive),
      getInactive: () => get().data.filter((item) => !item.isActive),
      add: (policy) => set((state) => {
        const newPolicy: PricingPolicy = { 
            ...policy, 
            systemId: `PP_${Date.now()}`,
            isDefault: false,
            isActive: true, // New policies are active by default
        };
        // If this is the very first policy of its type, make it default
        if (!state.data.some(p => p.type === newPolicy.type)) {
            newPolicy.isDefault = true;
        }
        return { data: [...state.data, newPolicy] };
      }),
      update: (systemId, updatedFields) => set((state) => ({
        data: state.data.map(p => p.systemId === systemId ? { ...p, ...updatedFields } : p),
      })),
      remove: (systemId) => set((state) => ({
        data: state.data.filter((p) => p.systemId !== systemId),
      })),
      setDefault: (systemId) => set((state) => {
        const policyToSet = state.data.find(p => p.systemId === systemId);
        if (!policyToSet) return state;

        const newData = state.data.map(p => {
          if (p.type === policyToSet.type) {
            return { ...p, isDefault: p.systemId === systemId };
          }
          return p;
        });
        return { data: newData };
      }),
    }),
    {
      name: 'hrm-pricing-policy-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
