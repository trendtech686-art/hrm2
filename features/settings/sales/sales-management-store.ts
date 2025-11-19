import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PrintCopiesOption = '1' | '2' | '3';

export type SalesManagementSettingsValues = {
  allowCancelAfterExport: boolean;
  allowNegativeOrder: boolean;
  allowNegativeApproval: boolean;
  allowNegativePacking: boolean;
  allowNegativeStockOut: boolean;
  printCopies: PrintCopiesOption;
};

interface SalesManagementSettingsState extends SalesManagementSettingsValues {
  updateSetting: <K extends keyof SalesManagementSettingsValues>(key: K, value: SalesManagementSettingsValues[K]) => void;
  reset: () => void;
}

const defaultSettings: SalesManagementSettingsValues = {
  allowCancelAfterExport: true,
  allowNegativeOrder: true,
  allowNegativeApproval: true,
  allowNegativePacking: true,
  allowNegativeStockOut: true,
  printCopies: '1',
};

export const useSalesManagementSettingsStore = create<SalesManagementSettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      updateSetting: (key, value) => set((state) => ({ ...state, [key]: value })),
      reset: () => set(() => ({ ...defaultSettings })),
    }),
    {
      name: 'sales-management-settings',
    }
  )
);

export const salesManagementDefaultSettings = defaultSettings;
