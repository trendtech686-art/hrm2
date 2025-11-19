import type { BusinessId, SystemId } from '@/lib/id-types';
import { asBusinessId, asSystemId } from '@/lib/id-types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Tax, TaxType } from './types.ts';

interface TaxState {
  data: Tax[];
  add: (tax: Omit<Tax, 'systemId'>) => Tax;
  update: (systemId: SystemId, tax: Partial<Tax>) => void;
  remove: (systemId: SystemId) => void;
  findById: (systemId: SystemId) => Tax | undefined;
  findByType: (type: TaxType) => Tax[];
  getDefault: (type: TaxType) => Tax | undefined;
  setDefault: (systemId: SystemId) => void;
  getActive: () => Tax[];
}

// Sample data
const rawTaxes = [
  {
    systemId: 'TAX001',
    id: 'VAT10',
    name: 'VAT 10%',
    rate: 10,
    type: 'purchase',
    isDefault: true,
    description: 'Thuế GTGT 10%',
    createdAt: new Date().toISOString(),
  },
  {
    systemId: 'TAX002',
    id: 'VAT8',
    name: 'VAT 8%',
    rate: 8,
    type: 'sale',
    isDefault: true,
    description: 'Thuế GTGT 8%',
    createdAt: new Date().toISOString(),
  },
  {
    systemId: 'TAX003',
    id: 'VAT5',
    name: 'VAT 5%',
    rate: 5,
    type: 'purchase',
    isDefault: false,
    description: 'Thuế GTGT 5%',
    createdAt: new Date().toISOString(),
  },
  {
    systemId: 'TAX004',
    id: 'VAT0',
    name: 'VAT 0%',
    rate: 0,
    type: 'purchase',
    isDefault: false,
    description: 'Không áp dụng thuế',
    createdAt: new Date().toISOString(),
  },
] as const;

const sampleTaxes: Tax[] = rawTaxes.map((tax) => ({
  ...tax,
  systemId: asSystemId(tax.systemId),
  id: asBusinessId(tax.id),
}));

export const useTaxStore = create<TaxState>()(
  persist(
    (set, get) => ({
      data: sampleTaxes,

      add: (tax) => {
        const newTax: Tax = {
          ...tax,
          systemId: asSystemId(`TAX${Date.now()}`),
          createdAt: new Date().toISOString(),
        };

        // If setting as default, unset other defaults of same type
        if (newTax.isDefault) {
          set((state) => ({
            data: state.data.map((t) =>
              t.type === newTax.type ? { ...t, isDefault: false } : t
            ),
          }));
        }

        set((state) => ({
          data: [...state.data, newTax],
        }));

        return newTax;
      },

      update: (systemId, updates) => {
        // If setting as default, unset other defaults of same type
        if (updates.isDefault) {
          const tax = get().findById(systemId);
          if (tax) {
            set((state) => ({
              data: state.data.map((t) =>
                t.type === tax.type && t.systemId !== systemId
                  ? { ...t, isDefault: false }
                  : t
              ),
            }));
          }
        }

        set((state) => ({
          data: state.data.map((tax) =>
            tax.systemId === systemId
              ? { ...tax, ...updates, updatedAt: new Date().toISOString() }
              : tax
          ),
        }));
      },

      remove: (systemId) => {
        set((state) => ({
          data: state.data.filter((tax) => tax.systemId !== systemId),
        }));
      },

      findById: (systemId) => {
        return get().data.find((tax) => tax.systemId === systemId);
      },

      findByType: (type) => {
        return get().data.filter((tax) => tax.type === type);
      },

      getDefault: (type) => {
        return get().data.find((tax) => tax.type === type && tax.isDefault);
      },

      setDefault: (systemId) => {
        const tax = get().findById(systemId);
        if (tax) {
          get().update(systemId, { isDefault: true });
        }
      },

      getActive: () => {
        return get().data;
      },
    }),
    {
      name: 'taxes-data',
    }
  )
);
