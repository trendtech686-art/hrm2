import { useState, useCallback, useRef, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/auth-context'
import { logError } from '@/lib/logger'

const API_BASE = '/api/user-preferences'
const SAVE_DEBOUNCE_DELAY = 500

// Query key factory for user preferences
export const userPreferenceKeys = {
  all: ['user-preferences'] as const,
  byKey: (userId: string, key: string) => ['user-preferences', userId, key] as const,
}

async function fetchPreference(userId: string, key: string): Promise<unknown> {
  const res = await fetch(
    `${API_BASE}?userId=${encodeURIComponent(userId)}&key=${encodeURIComponent(key)}`
  )
  if (!res.ok) return null
  const json = await res.json()
  return json?.value ?? null
}

/**
 * Hook để lưu trữ và đọc user preferences từ database
 * Sử dụng React Query để tránh duplicate fetches (StrictMode)
 * 
 * @param key - Unique key cho preference (e.g., "tasks-column-visibility")
 * @param defaultValue - Giá trị mặc định nếu chưa có trong DB
 * @param category - Category để phân loại (ui, notification, workflow)
 * @param options - Additional options like enabled
 */
export function useUserPreference<T>(
  key: string,
  defaultValue: T,
  category?: string,
  options?: { enabled?: boolean }
): [T, (value: T) => void, boolean] {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const userId = user?.systemId || ''
  const enabled = options?.enabled !== false

  const { data: dbValue, isLoading: queryLoading } = useQuery({
    queryKey: userPreferenceKeys.byKey(userId, key),
    queryFn: () => fetchPreference(userId, key),
    enabled: !!userId && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  // Local state for optimistic updates
  const [localValue, setLocalValue] = useState<T | undefined>(undefined)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<string>('')
  const dbLoadAppliedRef = useRef(false)

  // Sync DB value after initial load completes — overrides any premature defaults
  // Fixes race condition: page useEffect sets defaults before DB loads → debounced save overwrites DB
  useEffect(() => {
    if (!queryLoading && !dbLoadAppliedRef.current) {
      dbLoadAppliedRef.current = true
      if (dbValue != null) {
        // Cancel any pending save (from premature default writes) before applying DB value
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current)
          saveTimeoutRef.current = null
        }
        setLocalValue(dbValue as T)
        lastSavedRef.current = JSON.stringify(dbValue)
      }
    }
  }, [queryLoading, dbValue])

  // Helper: merge DB/saved value with defaults (adds new default keys while preserving saved values)
  const mergeWithDefaults = (val: unknown): T =>
    typeof defaultValue === 'object' && defaultValue !== null && !Array.isArray(defaultValue)
      && typeof val === 'object' && val !== null && !Array.isArray(val)
      ? { ...defaultValue, ...(val as T) }
      : val as T

  // Resolve value with flash prevention for column initialization race condition:
  // 1. During loading → localValue if explicitly set, else defaultValue
  //    (prevents render loops when useEffect sets value during loading phase)
  // 2. Right after load completes (before sync effect runs) → DB value directly (no 1-frame flash)
  // 3. After sync → normal: localValue > db (merged) > default
  const value = (() => {
    if (queryLoading) {
      // If localValue was explicitly set during loading, prefer it to prevent render loops
      // (e.g., page useEffect sets columnVisibility → but returning defaultValue {} causes loop)
      if (localValue !== undefined) return localValue
      return defaultValue
    }
    if (!dbLoadAppliedRef.current && dbValue != null) return mergeWithDefaults(dbValue)
    if (localValue !== undefined) return localValue
    if (dbValue != null) return mergeWithDefaults(dbValue)
    return defaultValue
  })()

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [])

  const setPreference = useCallback(
    (newValue: T) => {
      setLocalValue(newValue)

      // Block saves until initial DB load completes — prevents premature defaults from overwriting
      if (!userId || !dbLoadAppliedRef.current) return

      const newValueStr = JSON.stringify(newValue)
      if (newValueStr === lastSavedRef.current) return

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, key, value: newValue, category }),
          })
          if (res.ok) {
            lastSavedRef.current = newValueStr
            // Update cache so other components see the new value
            queryClient.setQueryData(userPreferenceKeys.byKey(userId, key), newValue)
          }
        } catch (error) {
          logError(`Error saving preference ${key}`, error)
        }
      }, SAVE_DEBOUNCE_DELAY)
    },
    [userId, key, category, queryClient]
  )

  return [value, setPreference, queryLoading]
}

/**
 * Hook để load tất cả preferences của user một lần
 * Useful cho initial load hoặc settings page
 */
export function useAllUserPreferences() {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<Record<string, unknown>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user?.systemId) {
      setIsLoading(false)
      return
    }

    const loadPreferences = async () => {
      try {
        const res = await fetch(`/api/user-preferences?userId=${user.systemId}`)
        if (res.ok) {
          const data = await res.json()
          setPreferences(data.map || {})
        }
      } catch (error) {
        logError('Error loading all preferences', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPreferences()
  }, [user?.systemId])

  const savePreference = useCallback(
    async (key: string, value: unknown, category?: string) => {
      if (!user?.systemId) return

      setPreferences((prev) => ({ ...prev, [key]: value }))

      try {
        await fetch('/api/user-preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.systemId,
            key,
            value,
            category,
          }),
        })
      } catch (error) {
        logError(`Error saving preference ${key}`, error)
      }
    },
    [user?.systemId]
  )

  return { preferences, savePreference, isLoading }
}
