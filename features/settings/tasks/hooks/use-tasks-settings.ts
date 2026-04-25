/**
 * Tasks Settings Hooks
 * React Query hooks for managing tasks module settings
 * 
 * ⚡ PERFORMANCE: Uses single GET /api/settings?group=tasks instead of
 *    7 separate Server Actions (which each POST to the current page URL).
 * 
 * @module features/settings/tasks/hooks/use-tasks-settings
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateModuleSettingSection } from '@/app/actions/settings/module-settings';
import type { TasksSettingsState, CardColorSettings, SLASettings, EvidenceSettings, TaskType, TaskTemplate } from '../types';
import { defaultSLA, defaultTemplates, defaultNotifications, defaultReminders, defaultCardColors, defaultTaskTypes, defaultEvidence, clone } from '../types';

export const tasksSettingsKeys = {
  all: ['settings', 'tasks'] as const,
  section: (type: TasksSettingType) => [...tasksSettingsKeys.all, type] as const,
};

type TasksSettingType = 'sla' | 'notifications' | 'reminders' | 'cardColors' | 'taskTypes' | 'templates' | 'evidence';

// Default values map
const DEFAULTS: Record<TasksSettingType, unknown> = {
  'sla': defaultSLA,
  'notifications': defaultNotifications,
  'reminders': defaultReminders,
  'cardColors': defaultCardColors,
  'taskTypes': defaultTaskTypes,
  'templates': defaultTemplates,
  'evidence': defaultEvidence,
};

// DB key → settings field mapping
const KEY_TO_FIELD: Record<string, TasksSettingType> = {
  'tasks_sla_settings': 'sla',
  'tasks_notification_settings': 'notifications',
  'tasks_reminder_settings': 'reminders',
  'tasks_card_color_settings': 'cardColors',
  'tasks_task_types': 'taskTypes',
  'tasks_templates': 'templates',
  'tasks_evidence_settings': 'evidence',
};

// Deep merge nested objects (SLA priorities, cardColors sub-objects, etc.)
function deepMerge<T extends Record<string, unknown>>(defaults: T, overrides: Record<string, unknown>): T {
  const result = { ...defaults } as Record<string, unknown>;
  for (const key of Object.keys(overrides)) {
    const defVal = defaults[key];
    const ovrVal = overrides[key];
    if (
      defVal && typeof defVal === 'object' && !Array.isArray(defVal) &&
      ovrVal && typeof ovrVal === 'object' && !Array.isArray(ovrVal)
    ) {
      result[key] = deepMerge(defVal as Record<string, unknown>, ovrVal as Record<string, unknown>);
    } else {
      result[key] = ovrVal;
    }
  }
  return result as T;
}

// ⚡ PERFORMANCE: Single GET fetch for all tasks settings
async function fetchAllTasksSettings(): Promise<Record<TasksSettingType, unknown>> {
  const res = await fetch('/api/settings?group=tasks', {
    credentials: 'include',
    // Never use fetch cache - always get fresh data from server
    // This fixes the issue where settings revert after F5
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch tasks settings');
  const json = await res.json();
  const grouped = json.grouped?.tasks as Record<string, unknown> | undefined;
  const result: Record<string, unknown> = {};

  for (const [dbKey, fieldName] of Object.entries(KEY_TO_FIELD)) {
    const dbValue = grouped?.[dbKey] ?? null;
    const defaults = clone(DEFAULTS[fieldName]);
    if (dbValue && typeof dbValue === 'object' && !Array.isArray(dbValue) && typeof defaults === 'object' && !Array.isArray(defaults)) {
      result[fieldName] = deepMerge(defaults as Record<string, unknown>, dbValue as Record<string, unknown>);
    } else {
      result[fieldName] = dbValue ?? defaults;
    }
  }
  return result as Record<TasksSettingType, unknown>;
}

/**
 * Hook to fetch a specific tasks settings section (uses batch-fetched cache)
 */
export function useTasksSettingSection<T = unknown>(type: TasksSettingType) {
  return useQuery({
    queryKey: tasksSettingsKeys.all,
    queryFn: fetchAllTasksSettings,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    select: (data) => (data[type] as T) ?? clone(DEFAULTS[type] as T),
  });
}

/**
 * Hook to fetch all tasks settings sections (single API call)
 */
export function useTasksSettings() {
  const query = useQuery({
    queryKey: tasksSettingsKeys.all,
    queryFn: fetchAllTasksSettings,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const d = query.data;
  
  return {
    data: {
      sla: (d?.sla ?? clone(defaultSLA)) as SLASettings,
      templates: (d?.templates ?? clone(defaultTemplates)) as TaskTemplate[],
      notifications: d?.notifications ?? clone(defaultNotifications),
      reminders: d?.reminders ?? clone(defaultReminders),
      cardColors: (d?.cardColors ?? clone(defaultCardColors)) as CardColorSettings,
      taskTypes: (d?.taskTypes ?? clone(defaultTaskTypes)) as TaskType[],
      evidence: (d?.evidence ?? clone(defaultEvidence)) as EvidenceSettings,
    } as TasksSettingsState,
    isLoading: query.isLoading,
    error: query.error,
  };
}

/**
 * Hook for tasks settings mutations
 */
export function useTasksSettingsMutations() {
  const queryClient = useQueryClient();

  const updateSection = useMutation({
    mutationFn: async ({ type, data }: { type: TasksSettingType; data: unknown }) => {
      const result = await updateModuleSettingSection('tasks', type, data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksSettingsKeys.all });
      toast.success('Đã lưu cài đặt');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  return { updateSection };
}
