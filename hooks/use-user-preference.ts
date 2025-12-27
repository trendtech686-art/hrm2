import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'

interface UserPreference {
  systemId: string
  userId: string
  key: string
  value: any
  category?: string
  createdAt: string
  updatedAt: string
}

/**
 * Hook để lưu trữ và đọc user preferences từ database
 * Thay thế hoàn toàn localStorage cho các preferences cá nhân của user
 * 
 * @param key - Unique key cho preference (e.g., "tasks-column-visibility")
 * @param defaultValue - Giá trị mặc định nếu chưa có trong DB
 * @param category - Category để phân loại (ui, notification, workflow)
 */
export function useUserPreference<T>(
  key: string,
  defaultValue: T,
  category?: string
): [T, (value: T) => Promise<void>, boolean] {
  const { user } = useAuth()
  const [value, setValue] = useState<T>(defaultValue)
  const [isLoading, setIsLoading] = useState(true)

  // Load preference from database
  useEffect(() => {
    if (!user?.systemId) {
      setIsLoading(false)
      return
    }

    const loadPreference = async () => {
      try {
        const res = await fetch(
          `/api/user-preferences?userId=${user.systemId}&key=${encodeURIComponent(key)}`
        )
        if (res.ok) {
          const data = await res.json()
          if (data && data.value !== undefined) {
            setValue(data.value as T)
          }
        }
      } catch (error) {
        console.error(`Error loading preference ${key}:`, error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPreference()
  }, [user?.systemId, key])

  // Save preference to database
  const setPreference = useCallback(
    async (newValue: T) => {
      setValue(newValue)

      if (!user?.systemId) {
        console.warn('Cannot save preference: user not logged in')
        return
      }

      try {
        await fetch('/api/user-preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.systemId,
            key,
            value: newValue,
            category,
          }),
        })
      } catch (error) {
        console.error(`Error saving preference ${key}:`, error)
      }
    },
    [user?.systemId, key, category]
  )

  return [value, setPreference, isLoading]
}

/**
 * Hook để load tất cả preferences của user một lần
 * Useful cho initial load hoặc settings page
 */
export function useAllUserPreferences() {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<Record<string, any>>({})
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
        console.error('Error loading all preferences:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPreferences()
  }, [user?.systemId])

  const savePreference = useCallback(
    async (key: string, value: any, category?: string) => {
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
        console.error(`Error saving preference ${key}:`, error)
      }
    },
    [user?.systemId]
  )

  return { preferences, savePreference, isLoading }
}
