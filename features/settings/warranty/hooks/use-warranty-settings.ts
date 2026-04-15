/**
 * Warranty Settings Hooks
 * React Query hooks for managing warranty module settings
 * 
 * ⚡ PERFORMANCE: Uses single GET /api/settings?group=warranty instead of
 *    5 separate Server Actions (which each POST to the current page URL).
 * 
 * @module features/settings/warranty/hooks/use-warranty-settings
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateModuleSettingSection } from '@/app/actions/settings/module-settings';

export const warrantySettingsKeys = {
  all: ['settings', 'warranty'] as const,
  section: (type: WarrantySettingType) => [...warrantySettingsKeys.all, type] as const,
};

type WarrantySettingType = 'sla-targets' | 'notifications' | 'tracking' | 'reminder-templates' | 'cardColors';

// Type definitions
interface SlaPriorityTarget {
  responseTime: number;
  resolveTime: number;
}

interface SlaTargets {
  low: SlaPriorityTarget;
  medium: SlaPriorityTarget;
  high: SlaPriorityTarget;
  urgent: SlaPriorityTarget;
}

interface NotificationSettings {
  emailOnCreate: boolean;
  emailOnAssign: boolean;
  emailOnProcessing: boolean;
  emailOnProcessed: boolean;
  emailOnReturned: boolean;
  emailOnOverdue: boolean;
  inAppNotifications: boolean;
  reminderNotifications: boolean;
}

interface TrackingSettings {
  enabled: boolean;
  allowCustomerComments: boolean;
  showEmployeeName: boolean;
  showTimeline: boolean;
  showProductList: boolean;
  showSummary: boolean;
  showPayment: boolean;
  showReceivedImages: boolean;
  showProcessedImages: boolean;
  showHistory: boolean;
}

export interface CardColorSettings {
  statusColors: Record<string, string>;
  priorityColors?: Record<string, string>;
  overdueColor?: string;
  enableStatusColors: boolean;
  enablePriorityColors?: boolean;
  enableOverdueColor?: boolean;
}

type WarrantySettingValue = SlaTargets | NotificationSettings | TrackingSettings | CardColorSettings | unknown[];

export interface WarrantySettings {
  sla: SlaTargets;
  templates: unknown[];
  notifications: NotificationSettings;
  publicTracking: TrackingSettings;
  cardColors: CardColorSettings;
}

// Default values
const DEFAULTS: Record<WarrantySettingType, WarrantySettingValue> = {
  'sla-targets': {
    low: { responseTime: 480, resolveTime: 72 },    // 8h response, 72h resolve
    medium: { responseTime: 240, resolveTime: 48 }, // 4h response, 48h resolve
    high: { responseTime: 120, resolveTime: 24 },   // 2h response, 24h resolve
    urgent: { responseTime: 60, resolveTime: 12 },  // 1h response, 12h resolve
  },
  'notifications': {
    emailOnCreate: true,
    emailOnAssign: true,
    emailOnProcessing: false,
    emailOnProcessed: true,
    emailOnReturned: true,
    emailOnOverdue: true,
    inAppNotifications: true,
    reminderNotifications: true,
  },
  'tracking': {
    enabled: false,
    allowCustomerComments: false,
    showEmployeeName: true,
    showTimeline: true,
    showProductList: true,
    showSummary: true,
    showPayment: true,
    showReceivedImages: true,
    showProcessedImages: true,
    showHistory: true,
  },
  'reminder-templates': [],
  'cardColors': {
    statusColors: {
      new: 'bg-blue-50 border-blue-200',
      pending: 'bg-yellow-50 border-yellow-200',
      processed: 'bg-green-50 border-green-200',
      returned: 'bg-gray-50 border-gray-200',
    },
    overdueColor: 'bg-red-50 border-red-400',
    enableStatusColors: true,
    enableOverdueColor: true,
  },
};

// DB key → settings field mapping
const KEY_TO_FIELD: Record<string, WarrantySettingType> = {
  'warranty_sla_targets': 'sla-targets',
  'warranty_notification_settings': 'notifications',
  'warranty_tracking_settings': 'tracking',
  'warranty_templates': 'reminder-templates',
  'warranty_card_color_settings': 'cardColors',
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

// ⚡ PERFORMANCE: Single GET fetch for all warranty settings
async function fetchAllWarrantySettings(): Promise<Record<string, unknown>> {
  const res = await fetch('/api/settings?group=warranty', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch warranty settings');
  const json = await res.json();
  const grouped = json.grouped?.warranty as Record<string, unknown> | undefined;
  const result: Record<string, unknown> = {};

  for (const [dbKey, fieldName] of Object.entries(KEY_TO_FIELD)) {
    const dbValue = grouped?.[dbKey] ?? null;
    const defaults = DEFAULTS[fieldName as WarrantySettingType];
    if (dbValue && typeof dbValue === 'object' && !Array.isArray(dbValue) && defaults && typeof defaults === 'object' && !Array.isArray(defaults)) {
      result[fieldName] = deepMerge(defaults as unknown as Record<string, unknown>, dbValue as Record<string, unknown>);
    } else {
      result[fieldName] = dbValue ?? defaults ?? null;
    }
  }
  return result;
}

/**
 * Hook to fetch a specific warranty settings section (uses batch-fetched cache)
 */
export function useWarrantySettingSection<T = WarrantySettingValue>(type: WarrantySettingType) {
  return useQuery({
    queryKey: warrantySettingsKeys.all,
    queryFn: fetchAllWarrantySettings,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    select: (data) => (data[type] as T) ?? (DEFAULTS[type] as T),
  });
}

/**
 * Hook to fetch all warranty settings sections (single API call)
 */
export function useWarrantySettings() {
  const query = useQuery({
    queryKey: warrantySettingsKeys.all,
    queryFn: fetchAllWarrantySettings,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const d = query.data;
  return {
    data: {
      sla: (d?.['sla-targets'] ?? DEFAULTS['sla-targets']) as SlaTargets,
      templates: (d?.['reminder-templates'] ?? DEFAULTS['reminder-templates']) as unknown[],
      notifications: (d?.notifications ?? DEFAULTS['notifications']) as NotificationSettings,
      publicTracking: (d?.tracking ?? DEFAULTS['tracking']) as TrackingSettings,
      cardColors: (d?.cardColors ?? DEFAULTS['cardColors']) as CardColorSettings,
    },
    isLoading: query.isLoading,
    error: query.error,
  };
}

/**
 * Hook for warranty settings mutations
 */
export function useWarrantySettingsMutations() {
  const queryClient = useQueryClient();

  const updateSection = useMutation({
    mutationFn: async ({ type, data }: { type: WarrantySettingType; data: WarrantySettingValue }) => {
      const result = await updateModuleSettingSection('warranty', type, data);
      if (!result.success) throw new Error(result.error);
      return result.data as WarrantySettingValue;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: warrantySettingsKeys.all });
      const previous = queryClient.getQueryData(warrantySettingsKeys.all);
      // Optimistically update the batch cache
      queryClient.setQueryData(warrantySettingsKeys.all, (old: Record<string, unknown> | undefined) => {
        if (!old) return old;
        return { ...old, [variables.type]: variables.data };
      });
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warrantySettingsKeys.all });
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(warrantySettingsKeys.all, context.previous);
      }
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  return { updateSection };
}
