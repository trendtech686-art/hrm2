/**
 * Hook để quản lý column visibility
 * Sử dụng database (user preferences) làm source of truth
 * localStorage đã bị remove khỏi codebase
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/auth-context'

const API_BASE = '/api/user-preferences'

// Debounce delay for saving preferences (ms)
const SAVE_DEBOUNCE_DELAY = 1000

/**
 * Hook để quản lý column visibility cho data tables
 * 
 * @param tableName - Tên bảng (e.g., 'suppliers', 'tasks', 'products')
 * @param defaultVisibility - Default visibility state
 */
export function useColumnVisibility(
  tableName: string,
  defaultVisibility: Record<string, boolean> = {}
): [Record<string, boolean>, (visibility: Record<string, boolean>) => void, boolean] {
  const { user } = useAuth()
  const [visibility, setVisibility] = useState<Record<string, boolean>>(defaultVisibility)
  const [isLoading, setIsLoading] = useState(true)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<string>('')

  const storageKey = `${tableName}-column-visibility`

  // Load from database
  useEffect(() => {
    const loadVisibility = async () => {
      try {
        if (user?.systemId) {
          const res = await fetch(
            `${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(storageKey)}`
          )
          
          if (res.ok) {
            const data = await res.json()
            if (data && data.value) {
              setVisibility(data.value)
              lastSavedRef.current = JSON.stringify(data.value)
            }
          }
        }
      } catch (error) {
        console.error(`Error loading column visibility for ${tableName}:`, error)
      } finally {
        setIsLoading(false)
      }
    }

    loadVisibility()
  }, [user?.systemId, storageKey, tableName])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // Update visibility - save to database with debounce
  const updateVisibility = useCallback(
    (newVisibility: Record<string, boolean>) => {
      setVisibility(newVisibility)

      // Save to database if user logged in (with debounce)
      if (user?.systemId) {
        const newValueStr = JSON.stringify(newVisibility)
        
        // Skip if value hasn't changed
        if (newValueStr === lastSavedRef.current) {
          return
        }

        // Clear existing timeout
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current)
        }

        // Debounce save
        saveTimeoutRef.current = setTimeout(() => {
          lastSavedRef.current = newValueStr
          fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.systemId,
              key: storageKey,
              value: newVisibility,
              category: 'ui',
            }),
          }).catch(error => {
            console.error(`Error saving column visibility for ${tableName}:`, error)
          })
        }, SAVE_DEBOUNCE_DELAY)
      }
    },
    [user?.systemId, storageKey, tableName]
  )

  return [visibility, updateVisibility, isLoading]
}

/**
 * Hook để quản lý column order
 */
export function useColumnOrder(
  tableName: string,
  defaultOrder: string[] = []
): [string[], (order: string[]) => void, boolean] {
  const { user } = useAuth()
  const [order, setOrder] = useState<string[]>(defaultOrder)
  const [isLoading, setIsLoading] = useState(true)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<string>('')

  const storageKey = `${tableName}-column-order`

  useEffect(() => {
    const loadOrder = async () => {
      try {
        if (user?.systemId) {
          const res = await fetch(
            `${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(storageKey)}`
          )
          
          if (res.ok) {
            const data = await res.json()
            if (data && data.value) {
              setOrder(data.value)
              lastSavedRef.current = JSON.stringify(data.value)
            }
          }
        }
      } catch (error) {
        console.error(`Error loading column order for ${tableName}:`, error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrder()
  }, [user?.systemId, storageKey, tableName])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const updateOrder = useCallback(
    (newOrder: string[]) => {
      setOrder(newOrder)

      if (user?.systemId) {
        const newValueStr = JSON.stringify(newOrder)
        
        // Skip if value hasn't changed
        if (newValueStr === lastSavedRef.current) {
          return
        }

        // Clear existing timeout
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current)
        }

        // Debounce save
        saveTimeoutRef.current = setTimeout(() => {
          lastSavedRef.current = newValueStr
          fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.systemId,
              key: storageKey,
              value: newOrder,
              category: 'ui',
            }),
          }).catch(error => {
            console.error(`Error saving column order for ${tableName}:`, error)
          })
        }, SAVE_DEBOUNCE_DELAY)
      }
    },
    [user?.systemId, storageKey, tableName]
  )

  return [order, updateOrder, isLoading]
}

/**
 * Hook để quản lý pinned columns
 */
export function usePinnedColumns(
  tableName: string,
  defaultPinned: string[] = []
): [string[], (pinned: string[]) => void, boolean] {
  const { user } = useAuth()
  const [pinned, setPinned] = useState<string[]>(defaultPinned)
  const [isLoading, setIsLoading] = useState(true)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<string>('')

  const storageKey = `${tableName}-column-pinned`

  useEffect(() => {
    const loadPinned = async () => {
      try {
        if (user?.systemId) {
          const res = await fetch(
            `${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(storageKey)}`
          )
          
          if (res.ok) {
            const data = await res.json()
            if (data && data.value) {
              setPinned(data.value)
              lastSavedRef.current = JSON.stringify(data.value)
            }
          }
        }
      } catch (error) {
        console.error(`Error loading pinned columns for ${tableName}:`, error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPinned()
  }, [user?.systemId, storageKey, tableName])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const updatePinned = useCallback(
    (newPinned: string[]) => {
      setPinned(newPinned)

      if (user?.systemId) {
        const newValueStr = JSON.stringify(newPinned)
        
        // Skip if value hasn't changed
        if (newValueStr === lastSavedRef.current) {
          return
        }

        // Clear existing timeout
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current)
        }

        // Debounce save
        saveTimeoutRef.current = setTimeout(() => {
          lastSavedRef.current = newValueStr
          fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.systemId,
              key: storageKey,
              value: newPinned,
              category: 'ui',
            }),
          }).catch(error => {
            console.error(`Error saving pinned columns for ${tableName}:`, error)
          })
        }, SAVE_DEBOUNCE_DELAY)
      }
    },
    [user?.systemId, storageKey, tableName]
  )

  return [pinned, updatePinned, isLoading]
}

export default useColumnVisibility
