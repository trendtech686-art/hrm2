/**
 * Settings Storage Hook
 * Sử dụng database API làm source of truth
 * localStorage đã bị remove khỏi codebase
 */

import { useCallback, useEffect, useState } from 'react'

const API_BASE = '/api/settings'

/**
 * Hook thay thế localStorage cho settings
 * Chỉ dùng database API - không có localStorage fallback
 */
export function useSettingsStorage<T extends Record<string, any>>(
  storageKey: string,
  defaultValue: T,
  group?: string
): [T, (value: T | ((prev: T) => T)) => void, { isLoading: boolean; isSaving: boolean; save: () => Promise<void> }] {
  const [settings, setSettings] = useState<T>(defaultValue)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsGroup = group || storageKey.replace('-settings', '')
        const res = await fetch(`${API_BASE}?group=${encodeURIComponent(settingsGroup)}`)
        
        if (res.ok) {
          const data = await res.json()
          
          if (data.data && data.data.length > 0) {
            const settingsMap = data.data.reduce((acc: Record<string, any>, item: any) => {
              acc[item.key] = item.value
              return acc
            }, {})
            
            setSettings(prev => ({ ...prev, ...settingsMap }))
          }
        }
      } catch (error) {
        console.error(`Error loading settings for ${storageKey}:`, error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [storageKey, group])

  // Save settings to database
  const save = useCallback(async () => {
    setIsSaving(true)
    try {
      const settingsGroup = group || storageKey.replace('-settings', '')
      
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        group: settingsGroup,
        value,
      }))

      await fetch(API_BASE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsArray }),
      })
    } catch (error) {
      console.error(`Error saving settings for ${storageKey}:`, error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }, [settings, storageKey, group])

  return [settings, setSettings, { isLoading, isSaving, save }]
}

/**
 * Simple hook for single setting value
 */
export function useSettingValue<T>(
  key: string,
  defaultValue: T,
  group: string = 'general'
): [T, (value: T) => Promise<void>, boolean] {
  const [value, setValue] = useState<T>(defaultValue)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}?key=${encodeURIComponent(key)}`)
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
    load()
  }, [key])

  const updateValue = useCallback(async (newValue: T) => {
    setValue(newValue)
    try {
      await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, group, value: newValue }),
      })
    } catch (error) {
      console.error(`Error saving setting ${key}:`, error)
    }
  }, [key, group])

  return [value, updateValue, isLoading]
}
