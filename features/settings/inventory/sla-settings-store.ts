import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';
import type { ProductSlaSettings } from './types';

interface SlaSettingsState {
  settings: ProductSlaSettings;
  update: (updates: Partial<ProductSlaSettings>) => void;
  reset: () => void;
}

const defaultSettings: ProductSlaSettings = {
  // Ngưỡng mặc định
  defaultReorderLevel: 10,
  defaultSafetyStock: 5,
  defaultMaxStock: 100,
  
  // Cảnh báo hàng tồn lâu
  deadStockDays: 90,
  slowMovingDays: 30,
  
  // Notifications
  enableEmailAlerts: false,
  alertEmailRecipients: [],
  alertFrequency: 'daily',
  
  // Dashboard
  showOnDashboard: true,
  dashboardAlertTypes: ['out_of_stock', 'low_stock', 'below_safety'],
};

const memoryStorage = (() => {
  const store = new Map<string, string | null>();
  return {
    getItem: (name: string) => store.get(name) ?? null,
    setItem: (name: string, value: string) => {
      store.set(name, value);
    },
    removeItem: (name: string) => {
      store.delete(name);
    },
  } satisfies StateStorage;
})();

const resolveStorage = (): StateStorage => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return memoryStorage;
};

export const useSlaSettingsStore = create<SlaSettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      
      update: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
      
      reset: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'product-sla-settings',
      storage: createJSONStorage(resolveStorage),
    }
  )
);
