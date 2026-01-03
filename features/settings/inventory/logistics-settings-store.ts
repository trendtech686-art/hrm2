import { create } from 'zustand';
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

export const useProductLogisticsSettingsStore = create<LogisticsSettingsState>()(
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
    })
);
