'use client'

/**
 * Hook để quản lý column visibility
 * Sử dụng database (user preferences) làm source of truth
 * localStorage đã bị remove khỏi codebase
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'

const API_BASE = '/api/user-preferences'

// Debounce delay for saving preferences (ms)
const SAVE_DEBOUNCE_DELAY = 500

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
  const hasLoadedFromDB = useRef(false)
  // Store defaultVisibility in ref to avoid triggering effect on every render
  const defaultVisibilityRef = useRef(defaultVisibility)
  defaultVisibilityRef.current = defaultVisibility

  const storageKey = `${tableName}-column-visibility`

  // Load from database
  useEffect(() => {
    const loadVisibility = async () => {
      if (!user?.systemId) {
        setIsLoading(false)
        return
      }
      
      try {
        const res = await fetch(
          `${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(storageKey)}`
        )
        
        if (res.ok) {
          const json = await res.json()
          
          // API trả về trực tiếp object: { userId, key, value, ... }
          // không có wrapper { success: true, data: ... }
          const value = json?.value
          if (value && typeof value === 'object' && Object.keys(value).length > 0) {
            // ✅ Merge với defaultVisibility để đảm bảo cột mới được hiển thị
            // Cột mới trong default nhưng chưa có trong DB sẽ được thêm vào với giá trị mặc định
            const mergedVisibility = { ...defaultVisibilityRef.current, ...value }
            setVisibility(mergedVisibility)
            lastSavedRef.current = JSON.stringify(mergedVisibility)
            hasLoadedFromDB.current = true
          } else {
            // Empty or invalid value - use defaults
          }
        } else {
          // No saved preference found - use defaults
        }
      } catch (error) {
        console.error(`[useColumnVisibility] Error loading ${tableName}:`, error)
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
        saveTimeoutRef.current = setTimeout(async () => {
          try {
            const res = await fetch(API_BASE, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user.systemId,
                key: storageKey,
                value: newVisibility,
                category: 'ui',
              }),
            })
            
            if (res.ok) {
              lastSavedRef.current = newValueStr
            } else {
              console.error(`[useColumnVisibility] ❌ Save failed: ${res.status}`)
            }
          } catch (error) {
            console.error(`[useColumnVisibility] ❌ Error saving ${tableName}:`, error)
          }
        }, SAVE_DEBOUNCE_DELAY)
      } else {
        // User not logged in - skip database save
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
            // API trả về trực tiếp object: { userId, key, value, ... }
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
            // API trả về trực tiếp object: { userId, key, value, ... }
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

/**
 * Combined hook để quản lý toàn bộ column layout (visibility, order, pinned)
 * Tiện lợi hơn khi cần quản lý tất cả cùng lúc
 */
export interface ColumnLayout {
  visibility: Record<string, boolean>
  order: string[]
  pinned: string[]
}

export interface ColumnLayoutSetters {
  setVisibility: (visibility: Record<string, boolean>) => void
  setOrder: (order: string[]) => void
  setPinned: (pinned: string[]) => void
}

// Stable empty defaults to prevent re-renders
const EMPTY_VISIBILITY: Record<string, boolean> = {}
const EMPTY_ORDER: string[] = []
const EMPTY_PINNED: string[] = []

export function useColumnLayout(
  tableName: string,
  defaults: Partial<ColumnLayout> = {}
): [ColumnLayout, ColumnLayoutSetters, boolean] {
  // Use stable empty defaults if not provided
  const defaultVisibility = defaults.visibility ?? EMPTY_VISIBILITY
  const defaultOrder = defaults.order ?? EMPTY_ORDER
  const defaultPinned = defaults.pinned ?? EMPTY_PINNED
  
  const [visibility, setVisibility, loadingVis] = useColumnVisibility(
    tableName, 
    defaultVisibility
  )
  const [order, setOrder, loadingOrder] = useColumnOrder(
    tableName, 
    defaultOrder
  )
  const [pinned, setPinned, loadingPinned] = usePinnedColumns(
    tableName, 
    defaultPinned
  )

  const isLoading = loadingVis || loadingOrder || loadingPinned

  // ✅ Memoize layout object to prevent re-renders
  const layout: ColumnLayout = useMemo(
    () => ({ visibility, order, pinned }),
    [visibility, order, pinned]
  )
  
  // ✅ Memoize setters object to prevent re-renders
  const setters: ColumnLayoutSetters = useMemo(
    () => ({ setVisibility, setOrder, setPinned }),
    [setVisibility, setOrder, setPinned]
  )

  return [layout, setters, isLoading]
}
