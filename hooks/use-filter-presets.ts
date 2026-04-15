import { useCallback } from 'react'
import { useUserPreference } from './use-user-preference'

export interface SavedFilterPreset {
  id: string
  name: string
  filters: Record<string, unknown>
}

/**
 * Hook to manage saved filter presets per module, persisted to DB via UserPreference.
 *
 * @param moduleKey - Unique module identifier (e.g., 'orders', 'suppliers')
 * @returns { presets, savePreset, deletePreset, isLoading }
 */
export function useFilterPresets(moduleKey: string) {
  const [presets, setPresets, isLoading] = useUserPreference<SavedFilterPreset[]>(
    `filter-presets:${moduleKey}`,
    [],
    'filters'
  )

  const savePreset = useCallback(
    (name: string, filters: Record<string, unknown>) => {
      const id = crypto.randomUUID()
      setPresets([...presets, { id, name, filters }])
    },
    [presets, setPresets]
  )

  const deletePreset = useCallback(
    (id: string) => {
      setPresets(presets.filter(p => p.id !== id))
    },
    [presets, setPresets]
  )

  const updatePreset = useCallback(
    (id: string, filters: Record<string, unknown>) => {
      setPresets(presets.map(p => p.id === id ? { ...p, filters } : p))
    },
    [presets, setPresets]
  )

  return { presets, savePreset, deletePreset, updatePreset, isLoading }
}
