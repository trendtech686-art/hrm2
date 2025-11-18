import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TaxInclusionType = 'inclusive' | 'exclusive';

interface TaxSettingsState {
  // Global tax inclusion setting
  priceIncludesTax: boolean; // true = inclusive (đã bao gồm), false = exclusive (chưa bao gồm)
  
  // Default tax IDs
  defaultSaleTaxId: string | null;
  defaultPurchaseTaxId: string | null;
  
  // Actions
  setPriceIncludesTax: (includes: boolean) => void;
  setDefaultSaleTaxId: (taxId: string | null) => void;
  setDefaultPurchaseTaxId: (taxId: string | null) => void;
  getTaxInclusionType: () => TaxInclusionType;
}

export const useTaxSettingsStore = create<TaxSettingsState>()(
  persist(
    (set, get) => ({
      priceIncludesTax: false, // Default: Giá chưa bao gồm thuế
      defaultSaleTaxId: null,
      defaultPurchaseTaxId: null,

      setPriceIncludesTax: (includes) => {
        set({ priceIncludesTax: includes });
      },

      setDefaultSaleTaxId: (taxId) => {
        set({ defaultSaleTaxId: taxId });
      },

      setDefaultPurchaseTaxId: (taxId) => {
        set({ defaultPurchaseTaxId: taxId });
      },

      getTaxInclusionType: () => {
        return get().priceIncludesTax ? 'inclusive' : 'exclusive';
      },
    }),
    {
      name: 'tax-settings',
    }
  )
);
