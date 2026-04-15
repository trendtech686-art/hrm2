/**
 * Notification Settings Hooks
 * Reuse existing module settings infrastructure for notification configs
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { updateModuleSettingSection } from '@/app/actions/settings/module-settings';
import type {
  TaskNotificationSettings,
  TaskReminderSettings,
  ComplaintNotificationSettings,
  ComplaintReminderSettings,
  WarrantyNotificationSettings,
  SystemNotificationSettings,
  GeneralNotificationSettings,
  SalesNotificationSettings,
  WarehouseNotificationSettings,
  HrNotificationSettings,
} from '../types';
import {
  defaultTaskNotifications,
  defaultTaskReminders,
  defaultComplaintNotifications,
  defaultComplaintReminders,
  defaultWarrantyNotifications,
  defaultSystemNotifications,
  defaultGeneralNotifications,
  defaultSalesNotifications,
  defaultWarehouseNotifications,
  defaultHrNotifications,
} from '../types';

export const notificationSettingsKeys = {
  all: ['settings', 'notifications'] as const,
  general: ['settings', 'general-notifications'] as const,
  tasks: ['settings', 'tasks'] as const,
  complaints: ['settings', 'complaints'] as const,
  warranty: ['settings', 'warranty'] as const,
  system: ['settings', 'system-notifications'] as const,
  sales: ['settings', 'sales-notifications'] as const,
  warehouse: ['settings', 'warehouse-notifications'] as const,
  hr: ['settings', 'hr-notifications'] as const,
};

// DB key → field mapping per module
const TASKS_KEY_MAP: Record<string, string> = {
  'tasks_notification_settings': 'notifications',
  'tasks_reminder_settings': 'reminders',
};

const COMPLAINTS_KEY_MAP: Record<string, string> = {
  'complaints_notification_settings': 'notifications',
  'complaints_reminder_settings': 'reminders',
};

const WARRANTY_KEY_MAP: Record<string, string> = {
  'warranty_notification_settings': 'notifications',
};

const SALES_KEY_MAP: Record<string, string> = {
  'sales_notification_settings': 'notifications',
};

const WAREHOUSE_KEY_MAP: Record<string, string> = {
  'warehouse_notification_settings': 'notifications',
};

const HR_KEY_MAP: Record<string, string> = {
  'hr_notification_settings': 'notifications',
};

const GENERAL_KEY_MAP: Record<string, string> = {
  'general_notification_settings': 'general',
};

async function fetchGroupSettings(group: string, keyMap: Record<string, string>): Promise<Record<string, unknown>> {
  const res = await fetch(`/api/settings?group=${group}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to fetch ${group} settings`);
  const json = await res.json();
  const grouped = json.grouped?.[group] as Record<string, unknown> | undefined;
  const result: Record<string, unknown> = {};
  for (const [dbKey, fieldName] of Object.entries(keyMap)) {
    result[fieldName] = grouped?.[dbKey] ?? null;
  }
  return result;
}

// ============================================
// GENERAL NOTIFICATIONS (server-persisted)
// ============================================

export function useGeneralNotificationSettings() {
  const query = useQuery({
    queryKey: notificationSettingsKeys.general,
    queryFn: () => fetchGroupSettings('system-notifications', GENERAL_KEY_MAP),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const d = query.data;
  const settings = useMemo(
    () => ({ ...defaultGeneralNotifications, ...(d?.general as Partial<GeneralNotificationSettings> | null) }),
    [d?.general],
  );
  return { settings, isLoading: query.isLoading };
}

// ============================================
// TASK NOTIFICATIONS
// ============================================

export function useTaskNotificationSettings() {
  const query = useQuery({
    queryKey: notificationSettingsKeys.tasks,
    queryFn: () => fetchGroupSettings('tasks', TASKS_KEY_MAP),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const d = query.data;
  const notifications = useMemo(
    () => ({ ...defaultTaskNotifications, ...(d?.notifications as Partial<TaskNotificationSettings> | null) }),
    [d?.notifications],
  );
  const reminders = useMemo(
    () => ({ ...defaultTaskReminders, ...(d?.reminders as Partial<TaskReminderSettings> | null) }),
    [d?.reminders],
  );
  return { notifications, reminders, isLoading: query.isLoading };
}

// ============================================
// COMPLAINT NOTIFICATIONS
// ============================================

export function useComplaintNotificationSettings() {
  const query = useQuery({
    queryKey: notificationSettingsKeys.complaints,
    queryFn: () => fetchGroupSettings('complaints', COMPLAINTS_KEY_MAP),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const d = query.data;
  const notifications = useMemo(
    () => ({ ...defaultComplaintNotifications, ...(d?.notifications as Partial<ComplaintNotificationSettings> | null) }),
    [d?.notifications],
  );
  const reminders = useMemo(
    () => ({ ...defaultComplaintReminders, ...(d?.reminders as Partial<ComplaintReminderSettings> | null) }),
    [d?.reminders],
  );
  return { notifications, reminders, isLoading: query.isLoading };
}

// ============================================
// WARRANTY NOTIFICATIONS
// ============================================

export function useWarrantyNotificationSettings() {
  const query = useQuery({
    queryKey: notificationSettingsKeys.warranty,
    queryFn: () => fetchGroupSettings('warranty', WARRANTY_KEY_MAP),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const d = query.data;
  const notifications = useMemo(
    () => ({ ...defaultWarrantyNotifications, ...(d?.notifications as Partial<WarrantyNotificationSettings> | null) }),
    [d?.notifications],
  );
  return { notifications, isLoading: query.isLoading };
}

// ============================================
// SALES NOTIFICATIONS
// ============================================

export function useSalesNotificationSettings() {
  const query = useQuery({
    queryKey: notificationSettingsKeys.sales,
    queryFn: () => fetchGroupSettings('sales', SALES_KEY_MAP),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const d = query.data;
  const settings = useMemo(
    () => ({ ...defaultSalesNotifications, ...(d?.notifications as Partial<SalesNotificationSettings> | null) }),
    [d?.notifications],
  );
  return { settings, isLoading: query.isLoading };
}

// ============================================
// WAREHOUSE & PURCHASING NOTIFICATIONS
// ============================================

export function useWarehouseNotificationSettings() {
  const query = useQuery({
    queryKey: notificationSettingsKeys.warehouse,
    queryFn: () => fetchGroupSettings('warehouse', WAREHOUSE_KEY_MAP),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const d = query.data;
  const settings = useMemo(
    () => ({ ...defaultWarehouseNotifications, ...(d?.notifications as Partial<WarehouseNotificationSettings> | null) }),
    [d?.notifications],
  );
  return { settings, isLoading: query.isLoading };
}

// ============================================
// HR NOTIFICATIONS
// ============================================

export function useHrNotificationSettings() {
  const query = useQuery({
    queryKey: notificationSettingsKeys.hr,
    queryFn: () => fetchGroupSettings('hr', HR_KEY_MAP),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const d = query.data;
  const settings = useMemo(
    () => ({ ...defaultHrNotifications, ...(d?.notifications as Partial<HrNotificationSettings> | null) }),
    [d?.notifications],
  );
  return { settings, isLoading: query.isLoading };
}

// ============================================
// SYSTEM NOTIFICATIONS
// ============================================

export function useSystemNotificationSettings() {
  const query = useQuery({
    queryKey: notificationSettingsKeys.system,
    queryFn: async () => {
      const res = await fetch('/api/settings?group=system-notifications', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch system notification settings');
      const json = await res.json();
      const grouped = json.grouped?.['system-notifications'] as Record<string, unknown> | undefined;
      return (grouped?.['system_notification_settings'] ?? null) as SystemNotificationSettings | null;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const settings = useMemo(
    () => ({ ...defaultSystemNotifications, ...(query.data as Partial<SystemNotificationSettings> | null) }),
    [query.data],
  );
  return { settings, isLoading: query.isLoading };
}

// ============================================
// MUTATIONS
// ============================================

export function useNotificationSettingsMutations() {
  const queryClient = useQueryClient();

  const updateGeneralNotifications = useMutation({
    mutationFn: async (data: GeneralNotificationSettings) => {
      const result = await updateModuleSettingSection('system-notifications', 'general', data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationSettingsKeys.general });
    },
    onError: (error: Error) => toast.error(`Lỗi: ${error.message}`),
  });

  const updateTaskNotifications = useMutation({
    mutationFn: async (data: TaskNotificationSettings) => {
      const result = await updateModuleSettingSection('tasks', 'notifications', data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationSettingsKeys.tasks });
    },
    onError: (error: Error) => toast.error(`Lỗi: ${error.message}`),
  });

  const updateTaskReminders = useMutation({
    mutationFn: async (data: TaskReminderSettings) => {
      const result = await updateModuleSettingSection('tasks', 'reminders', data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationSettingsKeys.tasks });
    },
    onError: (error: Error) => toast.error(`Lỗi: ${error.message}`),
  });

  const updateComplaintNotifications = useMutation({
    mutationFn: async (data: ComplaintNotificationSettings) => {
      const result = await updateModuleSettingSection('complaints', 'notifications', data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationSettingsKeys.complaints });
    },
    onError: (error: Error) => toast.error(`Lỗi: ${error.message}`),
  });

  const updateComplaintReminders = useMutation({
    mutationFn: async (data: ComplaintReminderSettings) => {
      const result = await updateModuleSettingSection('complaints', 'reminders', data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationSettingsKeys.complaints });
    },
    onError: (error: Error) => toast.error(`Lỗi: ${error.message}`),
  });

  const updateWarrantyNotifications = useMutation({
    mutationFn: async (data: WarrantyNotificationSettings) => {
      const result = await updateModuleSettingSection('warranty', 'notifications', data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationSettingsKeys.warranty });
    },
    onError: (error: Error) => toast.error(`Lỗi: ${error.message}`),
  });

  const updateSystemNotifications = useMutation({
    mutationFn: async (data: SystemNotificationSettings) => {
      const result = await updateModuleSettingSection('system-notifications', 'notifications', data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationSettingsKeys.system });
    },
    onError: (error: Error) => toast.error(`Lỗi: ${error.message}`),
  });

  const updateSalesNotifications = useMutation({
    mutationFn: async (data: SalesNotificationSettings) => {
      const result = await updateModuleSettingSection('sales', 'notifications', data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationSettingsKeys.sales });
    },
    onError: (error: Error) => toast.error(`Lỗi: ${error.message}`),
  });

  const updateWarehouseNotifications = useMutation({
    mutationFn: async (data: WarehouseNotificationSettings) => {
      const result = await updateModuleSettingSection('warehouse', 'notifications', data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationSettingsKeys.warehouse });
    },
    onError: (error: Error) => toast.error(`Lỗi: ${error.message}`),
  });

  const updateHrNotifications = useMutation({
    mutationFn: async (data: HrNotificationSettings) => {
      const result = await updateModuleSettingSection('hr', 'notifications', data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationSettingsKeys.hr });
    },
    onError: (error: Error) => toast.error(`Lỗi: ${error.message}`),
  });

  return {
    updateGeneralNotifications,
    updateTaskNotifications,
    updateTaskReminders,
    updateComplaintNotifications,
    updateComplaintReminders,
    updateWarrantyNotifications,
    updateSystemNotifications,
    updateSalesNotifications,
    updateWarehouseNotifications,
    updateHrNotifications,
  };
}
