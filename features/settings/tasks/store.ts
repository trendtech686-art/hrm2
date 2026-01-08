/**
 * Tasks Settings Store
 * UI configuration - colors, SLA thresholds, templates
 * 
 * ✅ KEEP IN ZUSTAND - This is UI state with database sync
 * Server data should use React Query hooks from:
 * `@/features/tasks/hooks/use-tasks`
 */
import { createSettingsConfigStore } from '../settings-config-store';
import {
  type TasksSettingsState,
  type CardColorSettings,
  type SLASettings,
  type EvidenceSettings,
  type TaskType,
  type TaskTemplate,
  defaultSLA,
  defaultTemplates,
  defaultNotifications,
  defaultReminders,
  defaultCardColors,
  defaultTaskTypes,
  defaultEvidence,
  clone,
} from './types';

// ============================================
// SETTINGS STORE
// ============================================

const createDefaultTasksSettings = (): TasksSettingsState => ({
  sla: clone(defaultSLA),
  templates: clone(defaultTemplates),
  notifications: clone(defaultNotifications),
  reminders: clone(defaultReminders),
  cardColors: clone(defaultCardColors),
  taskTypes: clone(defaultTaskTypes),
  evidence: clone(defaultEvidence),
});

export const useTasksSettingsStore = createSettingsConfigStore<TasksSettingsState>({
  getDefaultState: createDefaultTasksSettings,
});

// ============================================
// DATABASE SYNC
// ============================================

const TASKS_SETTINGS_API = '/api/tasks-settings';
let saveTimeout: NodeJS.Timeout | null = null;
let isInitialized = false;

type SettingType = 'sla' | 'notifications' | 'reminders' | 'cardColors' | 'taskTypes' | 'templates' | 'evidence';

/**
 * Load tasks settings from database
 */
export async function loadTasksSettingsFromDatabase(): Promise<void> {
  if (isInitialized) return;
  
  try {
    const types: SettingType[] = ['sla', 'notifications', 'reminders', 'cardColors', 'taskTypes', 'templates', 'evidence'];
    
    const results = await Promise.all(
      types.map(async (type) => {
        const res = await fetch(`${TASKS_SETTINGS_API}?type=${type}`);
        if (!res.ok) return { type, data: null };
        const json = await res.json();
        return { type, data: json.data };
      })
    );
    
    const store = useTasksSettingsStore.getState();
    
    results.forEach(({ type, data }) => {
      if (data) {
        store.setSection(type as keyof TasksSettingsState, data);
      }
    });
    
    isInitialized = true;
  } catch (error) {
    console.error('[TasksSettings] Failed to load from database:', error);
  }
}

/**
 * Sync tasks settings to database (debounced)
 */
export function syncTasksSettingsToDatabase(type: SettingType): void {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  
  saveTimeout = setTimeout(async () => {
    try {
      const state = useTasksSettingsStore.getState().data;
      const data = state[type as keyof TasksSettingsState];
      
      await fetch(TASKS_SETTINGS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data }),
      });
    } catch (error) {
      console.error('[TasksSettings] Failed to sync to database:', error);
    }
  }, 500);
}

// ============================================
// LOAD FUNCTIONS (for external consumers)
// ============================================

export function loadCardColorSettings(): CardColorSettings {
  return clone(useTasksSettingsStore.getState().data.cardColors);
}

export function loadSLASettings(): SLASettings {
  return clone(useTasksSettingsStore.getState().data.sla);
}

export function loadEvidenceSettings(): EvidenceSettings {
  return clone(useTasksSettingsStore.getState().data.evidence);
}

export function loadTaskTypes(): TaskType[] {
  return clone(useTasksSettingsStore.getState().data.taskTypes).filter(t => t.isActive);
}

export function loadTaskTemplates(): TaskTemplate[] {
  return clone(useTasksSettingsStore.getState().data.templates);
}
