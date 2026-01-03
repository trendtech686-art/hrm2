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
  storageKey: 'settings-tasks',
  getDefaultState: createDefaultTasksSettings,
});

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
