import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';

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

export const useWarrantySettingsStore = create<WarrantySettingsState>()(
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
      name: 'product-warranty-settings',
      storage: createJSONStorage(resolveStorage),
    }
  )
);

/** Hook để lấy thời hạn bảo hành mặc định */
export function useDefaultWarrantyMonths() {
  return useWarrantySettingsStore((state) => state.settings.defaultWarrantyMonths);
}
