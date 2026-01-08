/**
 * Settings Hook - React Query version
 * 
 * Hook để lấy và cập nhật settings từ database
 * Thay thế localStorage cho general-settings, security-settings, etc.
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'

interface Setting {
  systemId: string
  key: string
  group: string
  value: unknown
  valueType: string
  description?: string
}

// Query keys
export const settingsKeys = {
  all: ['settings'] as const,
  group: (group: string) => [...settingsKeys.all, 'group', group] as const,
  key: (key: string) => [...settingsKeys.all, 'key', key] as const,
}

// API functions
async function fetchSettings(group?: string): Promise<{ data: Setting[] }> {
  const url = group
    ? `/api/settings?group=${encodeURIComponent(group)}`
    : '/api/settings'

  const res = await fetch(url)
  if (!res.ok) throw new Error('Không thể tải cài đặt')
  return res.json()
}

async function fetchSetting(key: string): Promise<Setting | null> {
  const res = await fetch(`/api/settings?key=${encodeURIComponent(key)}`)
  if (!res.ok) return null
  const data = await res.json()
  return data || null
}

async function updateSettingApi(data: { key: string; group: string; value: unknown }): Promise<Setting> {
  const res = await fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Không thể lưu cài đặt')
  return res.json()
}

async function bulkUpdateSettingsApi(settings: Array<{ key: string; group: string; value: unknown }>): Promise<void> {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ settings }),
  })
  if (!res.ok) throw new Error('Không thể lưu cài đặt')
}

/**
 * Hook để lấy và cập nhật settings từ database
 * 
 * @param group - Group settings (general, security, appearance, etc.)
 * 
 * @example
 * ```tsx
 * const { settings, isLoading, updateSetting } = useSettings('general')
 * 
 * // Get a setting value
 * const companyName = settings['company_name'] as string
 * 
 * // Update a setting
 * await updateSetting('company_name', 'New Company')
 * ```
 */
export function useSettings(group?: string) {
  const queryClient = useQueryClient()

  // Query for fetching settings
  const query = useQuery({
    queryKey: group ? settingsKeys.group(group) : settingsKeys.all,
    queryFn: () => fetchSettings(group),
    staleTime: 5 * 60 * 1000, // 5 minutes - settings don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
    placeholderData: keepPreviousData,
  })

  // Convert to key-value map
  const settings = (query.data?.data || []).reduce(
    (acc: Record<string, unknown>, s: Setting) => {
      acc[s.key] = s.value
      return acc
    },
    {} as Record<string, unknown>
  )

  // Mutation for updating single setting
  const updateMutation = useMutation({
    mutationFn: updateSettingApi,
    onMutate: async (newData) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: settingsKeys.all })
      
      const previousData = queryClient.getQueryData(
        group ? settingsKeys.group(group) : settingsKeys.all
      )
      
      queryClient.setQueryData(
        group ? settingsKeys.group(group) : settingsKeys.all,
        (old: { data: Setting[] } | undefined) => {
          if (!old) return old
          const existingIndex = old.data.findIndex(s => s.key === newData.key)
          if (existingIndex >= 0) {
            const updated = [...old.data]
            updated[existingIndex] = { ...updated[existingIndex], value: newData.value }
            return { data: updated }
          }
          return {
            data: [...old.data, { 
              systemId: 'temp', 
              key: newData.key, 
              group: newData.group, 
              value: newData.value,
              valueType: typeof newData.value 
            } as Setting]
          }
        }
      )
      
      return { previousData }
    },
    onError: (_err, _newData, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(
          group ? settingsKeys.group(group) : settingsKeys.all,
          context.previousData
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all })
    },
  })

  // Mutation for bulk update
  const bulkUpdateMutation = useMutation({
    mutationFn: bulkUpdateSettingsApi,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all })
    },
  })

  // Update single setting
  const updateSetting = async (key: string, value: unknown, settingGroup?: string) => {
    return updateMutation.mutateAsync({
      key,
      group: settingGroup || group || 'general',
      value,
    })
  }

  // Bulk update settings
  const updateSettings = async (newSettings: Record<string, unknown>, settingGroup?: string) => {
    const settingsArray = Object.entries(newSettings).map(([key, value]) => ({
      key,
      group: settingGroup || group || 'general',
      value,
    }))
    return bulkUpdateMutation.mutateAsync(settingsArray)
  }

  // Get single setting value with default
  const getSetting = <T>(key: string, defaultValue: T): T => {
    return settings[key] !== undefined ? (settings[key] as T) : defaultValue
  }

  return {
    settings,
    rawSettings: query.data?.data || [],
    isLoading: query.isLoading,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    updateSetting,
    updateSettings,
    getSetting,
    refresh: () => query.refetch(),
    isUpdating: updateMutation.isPending || bulkUpdateMutation.isPending,
  }
}

/**
 * Hook để lấy một setting cụ thể
 * 
 * @example
 * ```tsx
 * const [companyName, setCompanyName, isLoading] = useSetting('company_name', 'Default')
 * 
 * // Update the setting
 * await setCompanyName('New Company Name')
 * ```
 */
export function useSetting<T>(key: string, defaultValue: T) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: settingsKeys.key(key),
    queryFn: () => fetchSetting(key),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  const mutation = useMutation({
    mutationFn: (newValue: T) => updateSettingApi({
      key,
      group: 'general',
      value: newValue,
    }),
    onMutate: async (newValue) => {
      await queryClient.cancelQueries({ queryKey: settingsKeys.key(key) })
      const previousData = queryClient.getQueryData(settingsKeys.key(key))
      queryClient.setQueryData(settingsKeys.key(key), (old: Setting | null) => 
        old ? { ...old, value: newValue } : { systemId: 'temp', key, group: 'general', value: newValue, valueType: typeof newValue }
      )
      return { previousData }
    },
    onError: (_err, _newValue, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(settingsKeys.key(key), context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all })
    },
  })

  const value = query.data?.value !== undefined ? (query.data.value as T) : defaultValue

  const updateValue = async (newValue: T, _group: string = 'general') => {
    return mutation.mutateAsync(newValue)
  }

  return [value, updateValue, query.isLoading] as const
}
