/**
 * Complaints Settings Store
 * UI configuration - colors, SLA thresholds
 * 
 * ✅ KEEP IN ZUSTAND - This is UI state with database sync
 * Server data should use React Query hooks from:
 * `@/features/complaints/hooks/use-complaints`
 */
import { createSettingsConfigStore } from '../settings-config-store';
import { createDefaultComplaintsSettings, clone, type ComplaintsSettingsState, type CardColorSettings } from './types';

// ============================================
// SETTINGS STORE
// ============================================

export const useComplaintsSettingsStore = createSettingsConfigStore<ComplaintsSettingsState>({
  getDefaultState: createDefaultComplaintsSettings,
});

// ============================================
// DATABASE SYNC
// ============================================

const COMPLAINTS_SETTINGS_API = '/api/complaints-settings';
let saveTimeout: NodeJS.Timeout | null = null;
let isInitialized = false;

type SettingType = 'sla' | 'notifications' | 'tracking' | 'reminders' | 'templates' | 'cardColors';

/**
 * Load complaints settings from database
 */
export async function loadComplaintsSettingsFromDatabase(): Promise<void> {
  if (isInitialized) return;
  
  try {
    const types: SettingType[] = ['sla', 'notifications', 'tracking', 'reminders', 'cardColors'];
    
    const results = await Promise.all(
      types.map(async (type) => {
        const res = await fetch(`${COMPLAINTS_SETTINGS_API}?type=${type}`);
        if (!res.ok) return { type, data: null };
        const json = await res.json();
        return { type, data: json.data };
      })
    );
    
    const store = useComplaintsSettingsStore.getState();
    
    results.forEach(({ type, data }) => {
      if (data) {
        switch (type) {
          case 'sla':
            store.setSection('sla', data);
            break;
          case 'notifications':
            store.setSection('notifications', data);
            break;
          case 'tracking':
            store.setSection('publicTracking', data);
            break;
          case 'reminders':
            store.setSection('reminders', data);
            break;
          case 'cardColors':
            store.setSection('cardColors', data);
            break;
        }
      }
    });
    
    isInitialized = true;
  } catch (error) {
    console.error('[ComplaintsSettings] Failed to load from database:', error);
  }
}

/**
 * Sync complaints settings to database (debounced)
 */
export function syncComplaintsSettingsToDatabase(type: SettingType): void {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  
  saveTimeout = setTimeout(async () => {
    try {
      const state = useComplaintsSettingsStore.getState().data;
      let data: unknown;
      
      switch (type) {
        case 'sla':
          data = state.sla;
          break;
        case 'notifications':
          data = state.notifications;
          break;
        case 'tracking':
          data = state.publicTracking;
          break;
        case 'reminders':
          data = state.reminders;
          break;
        case 'cardColors':
          data = state.cardColors;
          break;
        case 'templates':
          data = state.templates;
          break;
        default:
          return;
      }
      
      await fetch(COMPLAINTS_SETTINGS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data }),
      });
    } catch (error) {
      console.error('[ComplaintsSettings] Failed to sync to database:', error);
    }
  }, 500);
}

// Export function to load card colors from other components
export function loadCardColorSettings(): CardColorSettings {
  return clone(useComplaintsSettingsStore.getState().data.cardColors);
}
