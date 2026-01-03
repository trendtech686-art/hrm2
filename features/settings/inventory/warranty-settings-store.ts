import { create } from 'zustand';

export interface WarrantySettings {
  /** Thời hạn bảo hành mặc định (tháng) - áp dụng cho tất cả SP nếu không cấu hình riêng */
  defaultWarrantyMonths: number;
}

interface WarrantySettingsState {
  settings: WarrantySettings;
  update: (updates: Partial<WarrantySettings>) => void;
  reset: () => void;
}

const defaultSettings: WarrantySettings = {
  defaultWarrantyMonths: 12,
};

export const useWarrantySettingsStore = create<WarrantySettingsState>()(
    (set) => ({
      settings: defaultSettings,
      
      update: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
      
      reset: () => set({ settings: defaultSettings }),
    })
);

/** Hook để lấy thời hạn bảo hành mặc định */
export function useDefaultWarrantyMonths() {
  return useWarrantySettingsStore((state) => state.settings.defaultWarrantyMonths);
}
