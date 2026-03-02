/**
 * Complaints Settings Hooks
 * React Query hooks for managing complaints module settings
 * 
 * @module features/settings/complaints/hooks/use-complaints-settings
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getModuleSettingSection, updateModuleSettingSection } from '@/app/actions/settings/module-settings';
import type { ComplaintsSettingsState, CardColorSettings, ComplaintType as _ComplaintType } from '../types';
import { createDefaultComplaintsSettings, clone } from '../types';

export const complaintsSettingsKeys = {
  all: ['settings', 'complaints'] as const,
  section: (type: ComplaintsSettingType) => [...complaintsSettingsKeys.all, type] as const,
};

type ComplaintsSettingType = 'sla' | 'notifications' | 'tracking' | 'reminders' | 'templates' | 'cardColors' | 'complaintTypes';

// Default values
const defaultSettings = createDefaultComplaintsSettings();

const DEFAULTS: Record<ComplaintsSettingType, unknown> = {
  'sla': defaultSettings.sla,
  'notifications': defaultSettings.notifications,
  'tracking': defaultSettings.publicTracking,
  'reminders': defaultSettings.reminders,
  'templates': defaultSettings.templates,
  'cardColors': defaultSettings.cardColors,
  'complaintTypes': defaultSettings.complaintTypes,
};

// API functions
async function fetchComplaintsSettingSection<T = unknown>(
  type: ComplaintsSettingType
): Promise<T> {
  const result = await getModuleSettingSection<T>('complaints', type);
  if (!result.success) {
    throw new Error(result.error);
  }
  // Merge DB data with defaults so new fields added later get default values
  // instead of being undefined (which causes them to be lost on JSON serialization)
  // Only merge plain objects (e.g. publicTracking), NOT arrays (e.g. complaintTypes)
  const defaults = clone(DEFAULTS[type] as T);
  if (result.data && typeof result.data === 'object' && !Array.isArray(result.data) && typeof defaults === 'object' && !Array.isArray(defaults)) {
    return { ...defaults, ...result.data } as T;
  }
  return result.data ?? defaults;
}

async function updateComplaintsSettingSection(
  type: ComplaintsSettingType,
  data: unknown
): Promise<unknown> {
  const result = await updateModuleSettingSection('complaints', type, data);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}

/**
 * Hook to fetch a specific complaints settings section
 */
export function useComplaintsSettingSection<T = unknown>(type: ComplaintsSettingType) {
  return useQuery({
    queryKey: complaintsSettingsKeys.section(type),
    queryFn: () => fetchComplaintsSettingSection<T>(type),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to fetch all complaints settings sections
 */
export function useComplaintsSettings() {
  const sla = useComplaintsSettingSection('sla');
  const templates = useComplaintsSettingSection('templates');
  const notifications = useComplaintsSettingSection('notifications');
  const publicTracking = useComplaintsSettingSection('tracking');
  const reminders = useComplaintsSettingSection('reminders');
  const cardColors = useComplaintsSettingSection<CardColorSettings>('cardColors');
  const complaintTypes = useComplaintsSettingSection('complaintTypes');

  const isLoading = sla.isLoading || templates.isLoading || notifications.isLoading || 
    publicTracking.isLoading || reminders.isLoading || cardColors.isLoading || complaintTypes.isLoading;
  const error = sla.error || templates.error || notifications.error || 
    publicTracking.error || reminders.error || cardColors.error || complaintTypes.error;

  return {
    data: {
      sla: sla.data ?? clone(defaultSettings.sla),
      templates: templates.data ?? clone(defaultSettings.templates),
      notifications: notifications.data ?? clone(defaultSettings.notifications),
      publicTracking: publicTracking.data ?? clone(defaultSettings.publicTracking),
      reminders: reminders.data ?? clone(defaultSettings.reminders),
      cardColors: cardColors.data ?? clone(defaultSettings.cardColors),
      complaintTypes: complaintTypes.data ?? clone(defaultSettings.complaintTypes),
    } as ComplaintsSettingsState,
    isLoading,
    error,
  };
}

/**
 * Hook for complaints settings mutations
 */
export function useComplaintsSettingsMutations() {
  const queryClient = useQueryClient();

  const updateSection = useMutation({
    mutationFn: ({ type, data }: { type: ComplaintsSettingType; data: unknown }) =>
      updateComplaintsSettingSection(type, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: complaintsSettingsKeys.section(variables.type) });
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  return { updateSection };
}