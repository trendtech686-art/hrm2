/**
 * Warranty Settings Hooks
 * React Query hooks for managing warranty module settings
 * 
 * @module features/settings/warranty/hooks/use-warranty-settings
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const warrantySettingsKeys = {
  all: ['settings', 'warranty'] as const,
  section: (type: WarrantySettingType) => [...warrantySettingsKeys.all, type] as const,
};

type WarrantySettingType = 'sla-targets' | 'notifications' | 'tracking' | 'reminder-templates' | 'cardColors';

// Type definitions
interface SlaTargets {
  response: number;
  processing: number;
  return: number;
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
}

interface CardColorSettings {
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
    response: 2 * 60,
    processing: 24 * 60,
    return: 48 * 60,
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
  const response = await fetch(`/api/warranty-settings?type=${type}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type} settings`);
  }
  const result = await response.json();
  return result.data ?? (DEFAULTS[type] as T);
}

async function updateWarrantySettingSection(
  type: WarrantySettingType,
  data: WarrantySettingValue
): Promise<WarrantySettingValue> {
  const response = await fetch('/api/warranty-settings', {
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: warrantySettingsKeys.section(variables.type) });
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
    ? (window as unknown as { __warrantyCardColors?: CardColorSettings }).__warrantyCardColors
    : undefined;
  return cachedData ?? (DEFAULTS['cardColors'] as CardColorSettings);
}
