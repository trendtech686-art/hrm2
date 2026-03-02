/**
 * Warranty Settings Hooks
 * React Query hooks for managing warranty module settings
 * 
 * @module features/settings/warranty/hooks/use-warranty-settings
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getModuleSettingSection, updateModuleSettingSection } from '@/app/actions/settings/module-settings';

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
  smsOnOverdue: boolean;
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
    smsOnOverdue: false,
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
    statusColors: {},
    enableStatusColors: true,
  },
};

// API functions
async function fetchWarrantySettingSection<T = WarrantySettingValue>(
  type: WarrantySettingType
): Promise<T> {
  const result = await getModuleSettingSection<T>('warranty', type);
  if (!result.success) {
    throw new Error(result.error);
  }
  const defaults = DEFAULTS[type] as T;
  // For plain objects: merge DB data with defaults to ensure new fields have values
  // For arrays: return DB data as-is (array spread produces objects, not arrays)
  if (
    result.data &&
    typeof result.data === 'object' &&
    !Array.isArray(result.data) &&
    typeof defaults === 'object' &&
    !Array.isArray(defaults)
  ) {
    return { ...defaults, ...result.data } as T;
  }
  return result.data ?? defaults;
}

async function updateWarrantySettingSection(
  type: WarrantySettingType,
  data: WarrantySettingValue
): Promise<WarrantySettingValue> {
  const result = await updateModuleSettingSection('warranty', type, data);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data as WarrantySettingValue;
}

/**
 * Hook to fetch a specific warranty settings section
 */
export function useWarrantySettingSection<T = WarrantySettingValue>(type: WarrantySettingType) {
  return useQuery({
    queryKey: warrantySettingsKeys.section(type),
    queryFn: () => fetchWarrantySettingSection<T>(type),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to fetch all warranty settings sections
 */
export function useWarrantySettings() {
  const sla = useWarrantySettingSection<SlaTargets>('sla-targets');
  const templates = useWarrantySettingSection<unknown[]>('reminder-templates');
  const notifications = useWarrantySettingSection<NotificationSettings>('notifications');
  const publicTracking = useWarrantySettingSection<TrackingSettings>('tracking');
  const cardColors = useWarrantySettingSection<CardColorSettings>('cardColors');

  const isLoading = sla.isLoading || templates.isLoading || notifications.isLoading || publicTracking.isLoading || cardColors.isLoading;
  const error = sla.error || templates.error || notifications.error || publicTracking.error || cardColors.error;

  return {
    data: {
      sla: sla.data ?? (DEFAULTS['sla-targets'] as SlaTargets),
      templates: templates.data ?? (DEFAULTS['reminder-templates'] as unknown[]),
      notifications: notifications.data ?? (DEFAULTS['notifications'] as NotificationSettings),
      publicTracking: publicTracking.data ?? (DEFAULTS['tracking'] as TrackingSettings),
      cardColors: cardColors.data ?? (DEFAULTS['cardColors'] as CardColorSettings),
    },
    isLoading,
    error,
  };
}

/**
 * Hook for warranty settings mutations
 */
export function useWarrantySettingsMutations() {
  const queryClient = useQueryClient();

  const updateSection = useMutation({
    mutationFn: ({ type, data }: { type: WarrantySettingType; data: WarrantySettingValue }) =>
      updateWarrantySettingSection(type, data),
    onMutate: async (variables) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: warrantySettingsKeys.section(variables.type) });
      // Snapshot previous value
      const previous = queryClient.getQueryData(warrantySettingsKeys.section(variables.type));
      // Optimistically update cache
      queryClient.setQueryData(warrantySettingsKeys.section(variables.type), variables.data);
      return { previous };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: warrantySettingsKeys.section(variables.type) });
    },
    onError: (error: Error, variables, context) => {
      // Rollback on error
      if (context?.previous !== undefined) {
        queryClient.setQueryData(warrantySettingsKeys.section(variables.type), context.previous);
      }
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  return { updateSection };
}
