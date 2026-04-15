'use client'

/**
 * Hook để quản lý column visibility
 * Sử dụng React Query (via useUserPreference) để tránh duplicate fetches
 */

import { useMemo } from 'react'
import { useUserPreference } from './use-user-preference'

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
  const storageKey = `${tableName}-column-visibility`
  return useUserPreference<Record<string, boolean>>(storageKey, defaultVisibility, 'ui')
}

/**
 * Hook để quản lý column order
 */
export function useColumnOrder(
  tableName: string,
  defaultOrder: string[] = []
): [string[], (order: string[]) => void, boolean] {
  const storageKey = `${tableName}-column-order`
  return useUserPreference<string[]>(storageKey, defaultOrder, 'ui')
}

/**
 * Hook để quản lý pinned columns
 */
export function usePinnedColumns(
  tableName: string,
  defaultPinned: string[] = []
): [string[], (pinned: string[]) => void, boolean] {
  const storageKey = `${tableName}-column-pinned`
  return useUserPreference<string[]>(storageKey, defaultPinned, 'ui')
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
