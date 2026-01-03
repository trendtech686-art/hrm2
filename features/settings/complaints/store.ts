import { createSettingsConfigStore } from '../settings-config-store';
import { createDefaultComplaintsSettings, clone, type ComplaintsSettingsState, type CardColorSettings } from './types';

// ============================================
// SETTINGS STORE
// ============================================

export const useComplaintsSettingsStore = createSettingsConfigStore<ComplaintsSettingsState>({
  storageKey: 'settings-complaints',
  getDefaultState: createDefaultComplaintsSettings,
});

// Export function to load card colors from other components
export function loadCardColorSettings(): CardColorSettings {
  return clone(useComplaintsSettingsStore.getState().data.cardColors);
}
