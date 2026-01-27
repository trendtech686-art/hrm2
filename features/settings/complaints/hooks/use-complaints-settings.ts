/**
 * Complaints Settings Hooks
 * React Query hooks for managing complaints module settings
 * 
 * @module features/settings/complaints/hooks/use-complaints-settings
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ComplaintsSettingsState, CardColorSettings } from '../types';
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
  const response = await fetch(`/api/complaints-settings?type=${type}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type} settings`);
  }
  const result = await response.json();
  return result.data ?? clone(DEFAULTS[type] as T);
}

async function updateComplaintsSettingSection(
  type: ComplaintsSettingType,
  data: unknown
): Promise<unknown> {
  const response = await fetch('/api/complaints-settings', {
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
      toast.success('Đã lưu cài đặt');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  return { updateSection };
}

/**
 * Legacy compatibility function - load card colors
 */
export function loadCardColorSettings(): CardColorSettings {
  // For legacy sync code - fetch from cache or return defaults
  const cachedData = typeof window !== 'undefined' 
    ? (window as unknown as { __complaintsCardColors?: CardColorSettings }).__complaintsCardColors
    : undefined;
  return cachedData ?? clone(defaultSettings.cardColors);
}
