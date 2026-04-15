/**
 * Notification Hooks — React Query powered
 *
 * Replaces the in-memory notification store with server-backed data.
 * Polls every 30s for new notifications.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidateRelated } from '@/lib/query-invalidation-map'
import type { NotificationGroup } from '@/lib/notification-groups'

// ============== Types ==============

export interface ServerNotification {
  id: string
  type: string
  title: string
  message: string
  link?: string | null
  recipientId: string
  senderId?: string | null
  senderName?: string | null
  isRead: boolean
  readAt?: string | null
  metadata?: Record<string, unknown> | null
  createdAt: string
}

interface NotificationListResponse {
  data: ServerNotification[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface UnreadGroupCounts {
  orders: number
  shipping: number
  inventory: number
  system: number
  total: number
}

// ============== Query Keys ==============

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (params?: Record<string, unknown>) => [...notificationKeys.all, 'list', params] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
  unreadGroupCounts: () => [...notificationKeys.all, 'unread-group-counts'] as const,
}

// ============== API Functions ==============

async function fetchNotifications(params?: {
  page?: number
  limit?: number
  unreadOnly?: boolean
  group?: NotificationGroup
}): Promise<NotificationListResponse> {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set('page', String(params.page))
  if (params?.limit) searchParams.set('limit', String(params.limit))
  if (params?.unreadOnly) searchParams.set('unreadOnly', 'true')
  if (params?.group) searchParams.set('group', params.group)

  const url = `/api/notifications${searchParams.toString() ? `?${searchParams}` : ''}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch notifications')
  return res.json()
}

async function markAsReadApi(id: string): Promise<void> {
  const res = await fetch(`/api/notifications/${id}`, { method: 'PATCH' })
  if (!res.ok) throw new Error('Failed to mark as read')
}

async function markAllAsReadApi(): Promise<void> {
  const res = await fetch('/api/notifications/mark-all-read', { method: 'POST' })
  if (!res.ok) throw new Error('Failed to mark all as read')
}

async function deleteNotificationApi(id: string): Promise<void> {
  const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete notification')
}

async function fetchUnreadGroupCounts(): Promise<UnreadGroupCounts> {
  const res = await fetch('/api/notifications/unread-counts')
  if (!res.ok) throw new Error('Failed to fetch unread counts')
  return res.json()
}

// ============== Hooks ==============

/**
 * Fetch paginated notifications for the current user.
 * Polls every 30 seconds for real-time updates.
 */
export function useNotifications(params?: { page?: number; limit?: number; unreadOnly?: boolean; group?: NotificationGroup }) {
  return useQuery({
    queryKey: notificationKeys.list(params as Record<string, unknown>),
    queryFn: () => fetchNotifications(params),
    staleTime: 15 * 1000, // 15s
    refetchInterval: 30 * 1000, // Poll every 30s
  })
}

/**
 * Get unread count (derived from the main query to avoid extra API call)
 */
export function useUnreadNotificationCount() {
  const { data } = useNotifications({ limit: 1, unreadOnly: true })
  return data?.pagination?.total ?? 0
}

/**
 * Mark a single notification as read
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markAsReadApi,
    onSuccess: () => {
      invalidateRelated(queryClient, 'notifications')
    },
  })
}

/**
 * Mark all notifications as read
 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markAllAsReadApi,
    onSuccess: () => {
      invalidateRelated(queryClient, 'notifications')
    },
  })
}

/**
 * Delete a notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteNotificationApi,
    onSuccess: () => {
      invalidateRelated(queryClient, 'notifications')
    },
  })
}

/**
 * Get unread count per group (orders, shipping, inventory, system + total)
 * Polls every 30s for real-time badge updates.
 */
export function useUnreadGroupCounts() {
  return useQuery({
    queryKey: notificationKeys.unreadGroupCounts(),
    queryFn: fetchUnreadGroupCounts,
    staleTime: 15 * 1000,
    refetchInterval: 30 * 1000,
  })
}
