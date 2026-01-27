/**
 * Tasks Settings Hooks
 * React Query hooks for managing tasks module settings
 * 
 * @module features/settings/tasks/hooks/use-tasks-settings
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
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

// API functions
async function fetchTasksSettingSection<T = unknown>(
  type: TasksSettingType
): Promise<T> {
  const response = await fetch(`/api/tasks-settings?type=${type}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type} settings`);
  }
  const result = await response.json();
  return result.data ?? clone(DEFAULTS[type] as T);
}

async function updateTasksSettingSection(
  type: TasksSettingType,
  data: unknown
): Promise<unknown> {
  const response = await fetch('/api/tasks-settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, data }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update ${type} settings`);
  }
  const result = await response.json();
  return result.data;
}

/**
 * Hook to fetch a specific tasks settings section
 */
export function useTasksSettingSection<T = unknown>(type: TasksSettingType) {
  return useQuery({
    queryKey: tasksSettingsKeys.section(type),
    queryFn: () => fetchTasksSettingSection<T>(type),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to fetch all tasks settings sections
 */
export function useTasksSettings() {
  const sla = useTasksSettingSection<SLASettings>('sla');
  const templates = useTasksSettingSection<TaskTemplate[]>('templates');
  const notifications = useTasksSettingSection('notifications');
  const reminders = useTasksSettingSection('reminders');
  const cardColors = useTasksSettingSection<CardColorSettings>('cardColors');
  const taskTypes = useTasksSettingSection<TaskType[]>('taskTypes');
  const evidence = useTasksSettingSection<EvidenceSettings>('evidence');

  const isLoading = sla.isLoading || templates.isLoading || notifications.isLoading || 
    reminders.isLoading || cardColors.isLoading || taskTypes.isLoading || evidence.isLoading;
  const error = sla.error || templates.error || notifications.error || 
    reminders.error || cardColors.error || taskTypes.error || evidence.error;

  return {
    data: {
      sla: sla.data ?? clone(defaultSLA),
      templates: templates.data ?? clone(defaultTemplates),
      notifications: notifications.data ?? clone(defaultNotifications),
      reminders: reminders.data ?? clone(defaultReminders),
      cardColors: cardColors.data ?? clone(defaultCardColors),
      taskTypes: taskTypes.data ?? clone(defaultTaskTypes),
      evidence: evidence.data ?? clone(defaultEvidence),
    } as TasksSettingsState,
    isLoading,
    error,
  };
}

/**
 * Hook for tasks settings mutations
 */
export function useTasksSettingsMutations() {
  const queryClient = useQueryClient();

  const updateSection = useMutation({
    mutationFn: ({ type, data }: { type: TasksSettingType; data: unknown }) =>
      updateTasksSettingSection(type, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tasksSettingsKeys.section(variables.type) });
      toast.success('Đã lưu cài đặt');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  return { updateSection };
}

/**
 * Legacy compatibility functions
 */
export function loadCardColorSettings(): CardColorSettings {
  // For legacy sync code - fetch from cache or return defaults
  const cachedData = typeof window !== 'undefined' 
    ? (window as unknown as { __tasksCardColors?: CardColorSettings }).__tasksCardColors
    : undefined;
  return cachedData ?? clone(defaultCardColors);
}

export function loadSLASettings(): SLASettings {
  const cachedData = typeof window !== 'undefined' 
    ? (window as unknown as { __tasksSLA?: SLASettings }).__tasksSLA
    : undefined;
  return cachedData ?? clone(defaultSLA);
}

export function loadEvidenceSettings(): EvidenceSettings {
  const cachedData = typeof window !== 'undefined' 
    ? (window as unknown as { __tasksEvidence?: EvidenceSettings }).__tasksEvidence
    : undefined;
  return cachedData ?? clone(defaultEvidence);
}

export function loadTaskTypes(): TaskType[] {
  const cachedData = typeof window !== 'undefined' 
    ? (window as unknown as { __tasksTaskTypes?: TaskType[] }).__tasksTaskTypes
    : undefined;
  return (cachedData ?? clone(defaultTaskTypes)).filter((t: TaskType) => t.isActive);
}

export function loadTaskTemplates(): TaskTemplate[] {
  const cachedData = typeof window !== 'undefined' 
    ? (window as unknown as { __tasksTemplates?: TaskTemplate[] }).__tasksTemplates
    : undefined;
  return cachedData ?? clone(defaultTemplates);
}
