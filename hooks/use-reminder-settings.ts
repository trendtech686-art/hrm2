/**
 * Hooks để quản lý reminder settings và templates
 * Sử dụng React Query với database làm source of truth
 * 
 * @see docs/LOCALSTORAGE-TO-DATABASE-MIGRATION.md
 */

import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/auth-context'

const API_BASE = '/api/user-preferences'

// ============================================================================
// Query Keys Factory
// ============================================================================

export const reminderSettingsKeys = {
  all: ['reminder-settings'] as const,
  warrantyTemplates: (userId: string) => [...reminderSettingsKeys.all, 'warranty-templates', userId] as const,
  complaintSettings: (userId: string) => [...reminderSettingsKeys.all, 'complaint-settings', userId] as const,
}

// ==================== Warranty Reminder Templates ====================

export interface ReminderTemplate {
  id: string;
  name: string;
  message: string;
  isDefault?: boolean;
}

export const DEFAULT_WARRANTY_REMINDER_TEMPLATES: ReminderTemplate[] = [
  {
    id: 'overdue',
    name: 'Nhắc nhở quá hạn',
    message: 'Phiếu bảo hành #{ticketId} đã quá hạn xử lý. Vui lòng kiểm tra và cập nhật trạng thái.',
    isDefault: true,
  },
  {
    id: 'follow-up',
    name: 'Theo dõi tiến độ',
    message: 'Phiếu bảo hành #{ticketId} đang được xử lý. Vui lòng cập nhật tiến độ cho khách hàng {customerName}.',
    isDefault: true,
  },
  {
    id: 'return-ready',
    name: 'Sẵn sàng trả hàng',
    message: 'Sản phẩm bảo hành #{ticketId} đã xử lý xong. Vui lòng chuẩn bị trả hàng cho khách {customerName}.',
    isDefault: true,
  },
  {
    id: 'custom',
    name: 'Nhắc nhở tùy chỉnh',
    message: '',
    isDefault: false,
  },
];

const WARRANTY_REMINDER_TEMPLATES_KEY = 'warranty-reminder-templates'

/**
 * Hook để quản lý warranty reminder templates với React Query
 */
export function useWarrantyReminderTemplates(): [
  ReminderTemplate[],
  (templates: ReminderTemplate[]) => void,
  boolean
] {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const queryKey = reminderSettingsKeys.warrantyTemplates(user?.systemId ?? '')

  // Query for loading custom templates
  const { data: customTemplates = [], isLoading } = useQuery({
    queryKey,
    queryFn: async (): Promise<ReminderTemplate[]> => {
      if (!user?.systemId) return []
      const res = await fetch(
        `${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(WARRANTY_REMINDER_TEMPLATES_KEY)}`
      )
      if (!res.ok) throw new Error('Failed to load templates')
      const data = await res.json()
      return data?.value && Array.isArray(data.value) ? data.value : []
    },
    enabled: !!user?.systemId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })

  // Mutation for saving templates
  const mutation = useMutation({
    mutationFn: async (newTemplates: ReminderTemplate[]) => {
      if (!user?.systemId) throw new Error('User not authenticated')
      const customOnly = newTemplates.filter(t => !t.isDefault)
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.systemId,
          key: WARRANTY_REMINDER_TEMPLATES_KEY,
          value: customOnly,
          category: 'templates',
        }),
      })
      if (!res.ok) throw new Error('Failed to save templates')
      return customOnly
    },
    onMutate: async (newTemplates) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<ReminderTemplate[]>(queryKey)
      const customOnly = newTemplates.filter(t => !t.isDefault)
      queryClient.setQueryData<ReminderTemplate[]>(queryKey, customOnly)
      return { previous }
    },
    onError: (_err, _newTemplates, context) => {
      if (context?.previous) {
        queryClient.setQueryData<ReminderTemplate[]>(queryKey, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  // Combined templates (default + custom)
  const allTemplates = [...DEFAULT_WARRANTY_REMINDER_TEMPLATES, ...customTemplates]

  // Save templates
  const setTemplates = useCallback(
    (newTemplates: ReminderTemplate[]) => {
      mutation.mutate(newTemplates)
    },
    [mutation]
  )

  return [allTemplates, setTemplates, isLoading]
}

// ==================== Complaint Reminder Settings ====================

export interface ComplaintReminderSettings {
  enabled: boolean;
  intervals: {
    firstReminder: number; // hours
    secondReminder: number; // hours
    escalation: number; // hours
  };
  notifyAssignee: boolean;
  notifyCreator: boolean;
  notifyManager: boolean;
}

const COMPLAINT_REMINDER_SETTINGS_KEY = 'complaints-reminder-settings'

const DEFAULT_COMPLAINT_REMINDER_SETTINGS: ComplaintReminderSettings = {
  enabled: true,
  intervals: {
    firstReminder: 4,
    secondReminder: 8,
    escalation: 24,
  },
  notifyAssignee: true,
  notifyCreator: true,
  notifyManager: true,
}

/**
 * Hook để quản lý complaint reminder settings với React Query
 */
export function useComplaintReminderSettings(): [
  ComplaintReminderSettings,
  (settings: ComplaintReminderSettings) => void,
  boolean
] {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const queryKey = reminderSettingsKeys.complaintSettings(user?.systemId ?? '')

  // Query for loading settings
  const { data: settings = DEFAULT_COMPLAINT_REMINDER_SETTINGS, isLoading } = useQuery({
    queryKey,
    queryFn: async (): Promise<ComplaintReminderSettings> => {
      if (!user?.systemId) return DEFAULT_COMPLAINT_REMINDER_SETTINGS
      const res = await fetch(
        `${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(COMPLAINT_REMINDER_SETTINGS_KEY)}`
      )
      if (!res.ok) throw new Error('Failed to load settings')
      const data = await res.json()
      return data?.value ? { ...DEFAULT_COMPLAINT_REMINDER_SETTINGS, ...data.value } : DEFAULT_COMPLAINT_REMINDER_SETTINGS
    },
    enabled: !!user?.systemId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })

  // Mutation for saving settings
  const mutation = useMutation({
    mutationFn: async (newSettings: ComplaintReminderSettings) => {
      if (!user?.systemId) throw new Error('User not authenticated')
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.systemId,
          key: COMPLAINT_REMINDER_SETTINGS_KEY,
          value: newSettings,
          category: 'settings',
        }),
      })
      if (!res.ok) throw new Error('Failed to save settings')
      return newSettings
    },
    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<ComplaintReminderSettings>(queryKey)
      queryClient.setQueryData<ComplaintReminderSettings>(queryKey, newSettings)
      return { previous }
    },
    onError: (_err, _newSettings, context) => {
      if (context?.previous) {
        queryClient.setQueryData<ComplaintReminderSettings>(queryKey, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  // Update settings
  const setSettings = useCallback(
    (newSettings: ComplaintReminderSettings) => {
      mutation.mutate(newSettings)
    },
    [mutation]
  )

  return [settings, setSettings, isLoading]
}
