import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';
import type { ProductLogisticsSettings, LogisticsPreset } from './types';

interface LogisticsSettingsState {
  settings: ProductLogisticsSettings;
  update: (updates: Partial<ProductLogisticsSettings>) => void;
  save: (settings: ProductLogisticsSettings) => void;
  reset: () => void;
}

const createPreset = (overrides: LogisticsPreset): LogisticsPreset => ({
  weight: overrides.weight ?? 0,
  weightUnit: overrides.weightUnit ?? 'g',
  length: overrides.length ?? 0,
  width: overrides.width ?? 0,
  height: overrides.height ?? 0,
});

const clonePreset = (preset: LogisticsPreset): LogisticsPreset => ({
  weight: preset.weight,
  weightUnit: preset.weightUnit ?? 'g',
  length: preset.length,
  width: preset.width,
  height: preset.height,
});

const cloneSettings = (settings: ProductLogisticsSettings): ProductLogisticsSettings => ({
  physicalDefaults: clonePreset(settings.physicalDefaults),
  comboDefaults: clonePreset(settings.comboDefaults),
});

const defaultSettings: ProductLogisticsSettings = {
  physicalDefaults: createPreset({ weight: 500, length: 30, width: 20, height: 10 }),
  comboDefaults: createPreset({ weight: 1000, length: 35, width: 25, height: 15 }),
};

const STORAGE_KEY = 'product-logistics-settings';

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

const getStorage = (): StateStorage => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return memoryStorage;
};

export const useProductLogisticsSettingsStore = create<LogisticsSettingsState>()(
  persist(
    (set) => ({
      settings: cloneSettings(defaultSettings),
      update: (updates) =>
        set((state) => ({
          settings: {
            physicalDefaults: {
              ...state.settings.physicalDefaults,
              ...(updates.physicalDefaults ?? {}),
            },
            comboDefaults: {
              ...state.settings.comboDefaults,
              ...(updates.comboDefaults ?? {}),
            },
          },
        })),
      save: (nextSettings) => set({ settings: cloneSettings(nextSettings) }),
      reset: () => set({ settings: cloneSettings(defaultSettings) }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(getStorage),
    }
  )
);
