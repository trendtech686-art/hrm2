/**
 * Complaints Settings Hooks
 * React Query hooks for managing complaints module settings
 * 
 * ⚡ PERFORMANCE: Uses single GET /api/settings?group=complaints instead of
 *    7 separate Server Actions (which each POST to the current page URL).
 * 
 * @module features/settings/complaints/hooks/use-complaints-settings
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateModuleSettingSection } from '@/app/actions/settings/module-settings';
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

// DB key → settings field mapping
const KEY_TO_FIELD: Record<string, ComplaintsSettingType> = {
  'complaints_sla_settings': 'sla',
  'complaints_notification_settings': 'notifications',
  'complaints_tracking_settings': 'tracking',
  'complaints_reminder_settings': 'reminders',
  'complaints_templates': 'templates',
  'complaints_card_color_settings': 'cardColors',
  'complaints_complaint_types': 'complaintTypes',
};

// Deep merge: recursively merge nested objects so inner fields aren't lost
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

// ⚡ PERFORMANCE: Single GET fetch for all complaints settings
async function fetchAllComplaintsSettings(): Promise<Record<ComplaintsSettingType, unknown>> {
  const res = await fetch('/api/settings?group=complaints', {
    credentials: 'include',
    // Never use fetch cache - always get fresh data from server
    // This fixes the issue where settings revert after F5
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch complaints settings');
  const json = await res.json();

  const grouped = json.grouped?.complaints as Record<string, unknown> | undefined;
  const result: Record<string, unknown> = {};

  // Map DB keys to field names, deep-merging with defaults
  for (const [dbKey, fieldName] of Object.entries(KEY_TO_FIELD)) {
    const dbValue = grouped?.[dbKey] ?? null;
    const defaults = clone(DEFAULTS[fieldName]);
    if (dbValue && typeof dbValue === 'object' && !Array.isArray(dbValue) && typeof defaults === 'object' && !Array.isArray(defaults)) {
      result[fieldName] = deepMerge(defaults as Record<string, unknown>, dbValue as Record<string, unknown>);
    } else {
      result[fieldName] = dbValue ?? defaults;
    }
  }

  return result as Record<ComplaintsSettingType, unknown>;
}

/**
 * Hook to fetch a specific complaints settings section (uses batch-fetched cache)
 */
export function useComplaintsSettingSection<T = unknown>(type: ComplaintsSettingType) {
  // Fetch all sections in one request, select the specific section
  const query = useQuery({
    queryKey: complaintsSettingsKeys.all,
    queryFn: fetchAllComplaintsSettings,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    select: (data) => data[type] as T,
  });

  return query;
}

/**
 * Hook to fetch all complaints settings sections (single API call)
 */
export function useComplaintsSettings() {
  const query = useQuery({
    queryKey: complaintsSettingsKeys.all,
    queryFn: fetchAllComplaintsSettings,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const allData = query.data;

  return {
    data: {
      sla: allData?.sla ?? clone(defaultSettings.sla),
      templates: allData?.templates ?? clone(defaultSettings.templates),
      notifications: allData?.notifications ?? clone(defaultSettings.notifications),
      publicTracking: allData?.tracking ?? clone(defaultSettings.publicTracking),
      reminders: allData?.reminders ?? clone(defaultSettings.reminders),
      cardColors: (allData?.cardColors ?? clone(defaultSettings.cardColors)) as CardColorSettings,
      complaintTypes: allData?.complaintTypes ?? clone(defaultSettings.complaintTypes),
    } as ComplaintsSettingsState,
    isLoading: query.isLoading,
    error: query.error,
  };
}

/**
 * Hook for complaints settings mutations
 */
export function useComplaintsSettingsMutations() {
  const queryClient = useQueryClient();

  const updateSection = useMutation({
    mutationFn: async ({ type, data }: { type: ComplaintsSettingType; data: unknown }) => {
      const result = await updateModuleSettingSection('complaints', type, data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      // Invalidate the single batch query (refetches all sections)
      queryClient.invalidateQueries({ queryKey: complaintsSettingsKeys.all });
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  return { updateSection };
}