import { useState, useEffect, useCallback } from 'react'

interface Setting {
  systemId: string
  key: string
  group: string
  value: any
  valueType: string
  description?: string
}

/**
 * Hook để lấy và cập nhật settings từ database
 * Thay thế localStorage cho general-settings, security-settings, etc.
 * 
 * @param group - Group settings (general, security, appearance, etc.)
 */
export function useSettings(group?: string) {
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [rawSettings, setRawSettings] = useState<Setting[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load settings from database
  const loadSettings = useCallback(async () => {
    try {
      const url = group
        ? `/api/settings?group=${encodeURIComponent(group)}`
        : '/api/settings'

      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setRawSettings(data.data || [])
        
        // Convert to key-value map
        const map = (data.data || []).reduce(
          (acc: Record<string, any>, s: Setting) => {
            acc[s.key] = s.value
            return acc
          },
          {}
        )
        setSettings(map)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setIsLoading(false)
    }
  }, [group])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  // Update single setting
  const updateSetting = useCallback(
    async (key: string, value: any, settingGroup?: string) => {
      setSettings((prev) => ({ ...prev, [key]: value }))

      try {
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key,
            group: settingGroup || group || 'general',
            value,
          }),
        })
      } catch (error) {
        console.error(`Error saving setting ${key}:`, error)
      }
    },
    [group]
  )

  // Bulk update settings
  const updateSettings = useCallback(
    async (newSettings: Record<string, any>, settingGroup?: string) => {
      setSettings((prev) => ({ ...prev, ...newSettings }))

      try {
        const settingsArray = Object.entries(newSettings).map(([key, value]) => ({
          key,
          group: settingGroup || group || 'general',
          value,
        }))

        await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ settings: settingsArray }),
        })
      } catch (error) {
        console.error('Error bulk saving settings:', error)
      }
    },
    [group]
  )

  // Get single setting value with default
  const getSetting = useCallback(
    <T>(key: string, defaultValue: T): T => {
      return settings[key] !== undefined ? settings[key] : defaultValue
    },
    [settings]
  )

  return {
    settings,
    rawSettings,
    isLoading,
    updateSetting,
    updateSettings,
    getSetting,
    refresh: loadSettings,
  }
}

/**
 * Hook để lấy một setting cụ thể
 */
export function useSetting<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSetting = async () => {
      try {
        const res = await fetch(`/api/settings?key=${encodeURIComponent(key)}`)
        if (res.ok) {
          const data = await res.json()
          if (data && data.value !== undefined) {
            setValue(data.value as T)
          }
        }
      } catch (error) {
        console.error(`Error loading setting ${key}:`, error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSetting()
  }, [key])

  const updateValue = useCallback(
    async (newValue: T, group: string = 'general') => {
      setValue(newValue)

      try {
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key,
            group,
            value: newValue,
          }),
        })
      } catch (error) {
        console.error(`Error saving setting ${key}:`, error)
      }
    },
    [key]
  )

  return [value, updateValue, isLoading] as const
}
