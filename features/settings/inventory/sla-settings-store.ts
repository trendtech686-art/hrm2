import { create } from 'zustand';
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

export const useSlaSettingsStore = create<SlaSettingsState>()(
    (set) => ({
      settings: defaultSettings,
      
      update: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
      
      reset: () => set({ settings: defaultSettings }),
    })
);
