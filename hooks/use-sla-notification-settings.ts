/**
 * Hooks để quản lý SLA settings và Notification settings
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

export const slaNotificationKeys = {
  all: ['sla-notification-settings'] as const,
  setting: (key: string, userId: string) => [...slaNotificationKeys.all, key, userId] as const,
}

// ============================================================================
// Generic Settings Hook Factory (React Query)
// ============================================================================

function createUserPreferenceHook<T extends object>(
  preferenceKey: string,
  defaultValue: T
) {
  return function usePreference(): [T, (value: T) => void, boolean] {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const queryKey = slaNotificationKeys.setting(preferenceKey, user?.systemId ?? '')

    // Query for loading
    const { data = defaultValue, isLoading } = useQuery({
      queryKey,
      queryFn: async (): Promise<T> => {
        if (!user?.systemId) return defaultValue
        const res = await fetch(
          `${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(preferenceKey)}`
        )
        if (!res.ok) throw new Error('Failed to load settings')
        const data = await res.json()
        return data?.value ? { ...defaultValue, ...data.value } : defaultValue
      },
      enabled: !!user?.systemId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    })

    // Mutation for saving with optimistic updates
    const mutation = useMutation({
      mutationFn: async (newValue: T) => {
        if (!user?.systemId) throw new Error('User not authenticated')
        const res = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.systemId,
            key: preferenceKey,
            value: newValue,
            category: 'settings',
          }),
        })
        if (!res.ok) throw new Error('Failed to save settings')
        return newValue
      },
      onMutate: async (newValue) => {
        await queryClient.cancelQueries({ queryKey })
        const previous = queryClient.getQueryData<T>(queryKey)
        queryClient.setQueryData<T>(queryKey, newValue)
        return { previous }
      },
      onError: (_err, _newValue, context) => {
        if (context?.previous) {
          queryClient.setQueryData<T>(queryKey, context.previous)
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey })
      },
    })

    // Setter
    const setValue = useCallback(
      (newValue: T) => {
        mutation.mutate(newValue)
      },
      [mutation]
    )

    return [data, setValue, isLoading]
  }
}

// ==================== Warranty SLA Settings ====================

export interface WarrantySLATargets {
  response: number;    // minutes
  processing: number;  // minutes
  return: number;      // minutes
}

export const DEFAULT_WARRANTY_SLA_TARGETS: WarrantySLATargets = {
  response: 2 * 60,      // 2 hours
  processing: 24 * 60,   // 24 hours
  return: 48 * 60,       // 48 hours
}

export const useWarrantySLASettings = createUserPreferenceHook<WarrantySLATargets>(
  'warranty-sla-targets',
  DEFAULT_WARRANTY_SLA_TARGETS
)

// ==================== Complaints SLA Settings ====================

export interface ComplaintsSLASettings {
  low: { responseTime: number; resolveTime: number };
  medium: { responseTime: number; resolveTime: number };
  high: { responseTime: number; resolveTime: number };
  urgent: { responseTime: number; resolveTime: number };
}

export const DEFAULT_COMPLAINTS_SLA_SETTINGS: ComplaintsSLASettings = {
  low: { responseTime: 240, resolveTime: 48 },
  medium: { responseTime: 120, resolveTime: 24 },
  high: { responseTime: 60, resolveTime: 12 },
  urgent: { responseTime: 30, resolveTime: 4 },
}

export const useComplaintsSLASettings = createUserPreferenceHook<ComplaintsSLASettings>(
  'complaints-sla-settings',
  DEFAULT_COMPLAINTS_SLA_SETTINGS
)

// ==================== Warranty Notification Settings ====================

export interface WarrantyNotificationSettings {
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

export const DEFAULT_WARRANTY_NOTIFICATION_SETTINGS: WarrantyNotificationSettings = {
  emailOnCreate: true,
  emailOnAssign: true,
  emailOnProcessing: false,
  emailOnProcessed: true,
  emailOnReturned: true,
  emailOnOverdue: true,
  smsOnOverdue: false,
  inAppNotifications: true,
  reminderNotifications: true,
}

export const useWarrantyNotificationSettings = createUserPreferenceHook<WarrantyNotificationSettings>(
  'warranty-notification-settings',
  DEFAULT_WARRANTY_NOTIFICATION_SETTINGS
)

// ==================== Complaints Notification Settings ====================

export interface ComplaintsNotificationSettings {
  emailOnCreate: boolean;
  emailOnAssign: boolean;
  emailOnVerified: boolean;
  emailOnResolved: boolean;
  emailOnOverdue: boolean;
  smsOnOverdue: boolean;
  inAppNotifications: boolean;
}

export const DEFAULT_COMPLAINTS_NOTIFICATION_SETTINGS: ComplaintsNotificationSettings = {
  emailOnCreate: true,
  emailOnAssign: true,
  emailOnVerified: false,
  emailOnResolved: true,
  emailOnOverdue: true,
  smsOnOverdue: false,
  inAppNotifications: true,
}

export const useComplaintsNotificationSettings = createUserPreferenceHook<ComplaintsNotificationSettings>(
  'complaints-notification-settings',
  DEFAULT_COMPLAINTS_NOTIFICATION_SETTINGS
)
