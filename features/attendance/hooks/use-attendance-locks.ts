/**
 * React Query hooks for Attendance Locks
 * Replaces localStorage-based useAttendanceLocalState
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// API functions
const API_BASE = '/api/attendance/locks'

export async function fetchLockedMonths(): Promise<{ lockedMonths: Record<string, boolean> }> {
  const res = await fetch(API_BASE, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch locked months')
  const json = await res.json()
  // API returns { locks, lockedMonths } directly (not wrapped in data)
  return { lockedMonths: json.lockedMonths || {} }
}

async function lockMonth(monthKey: string): Promise<void> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ monthKey }),
  })
  if (!res.ok) {
    const text = await res.text()
    console.error('Lock month failed:', res.status, text)
    throw new Error(`Failed to lock month: ${res.status}`)
  }
}

async function unlockMonth(monthKey: string): Promise<void> {
  const res = await fetch(`${API_BASE}?monthKey=${encodeURIComponent(monthKey)}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) {
    const text = await res.text()
    console.error('Unlock month failed:', res.status, text)
    throw new Error(`Failed to unlock month: ${res.status}`)
  }
}

// Query keys
export const attendanceLockKeys = {
  all: ['attendance-locks'] as const,
  lockedMonths: () => [...attendanceLockKeys.all, 'lockedMonths'] as const,
}

/**
 * Hook to get all locked months from database
 */
export function useLockedMonths() {
  return useQuery({
    queryKey: attendanceLockKeys.lockedMonths(),
    queryFn: fetchLockedMonths,
    staleTime: 0, // Always fetch fresh data when invalidated
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    select: (data) => data.lockedMonths,
  })
}

/**
 * Hook for lock/unlock mutations with optimistic updates
 */
export function useAttendanceLockMutations() {
  const queryClient = useQueryClient()

  const lock = useMutation({
    mutationFn: lockMonth,
    onMutate: async (monthKey) => {
      await queryClient.cancelQueries({ queryKey: attendanceLockKeys.lockedMonths() })
      const prev = queryClient.getQueryData<{ lockedMonths: Record<string, boolean> }>(attendanceLockKeys.lockedMonths())
      queryClient.setQueryData(attendanceLockKeys.lockedMonths(), {
        lockedMonths: { ...prev?.lockedMonths, [monthKey]: true },
      })
      return { prev }
    },
    onError: (_err, _monthKey, context) => {
      if (context?.prev) queryClient.setQueryData(attendanceLockKeys.lockedMonths(), context.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: attendanceLockKeys.lockedMonths() })
    },
  })

  const unlock = useMutation({
    mutationFn: unlockMonth,
    onMutate: async (monthKey) => {
      await queryClient.cancelQueries({ queryKey: attendanceLockKeys.lockedMonths() })
      const prev = queryClient.getQueryData<{ lockedMonths: Record<string, boolean> }>(attendanceLockKeys.lockedMonths())
      const updated = { ...prev?.lockedMonths }
      delete updated[monthKey]
      queryClient.setQueryData(attendanceLockKeys.lockedMonths(), { lockedMonths: updated })
      return { prev }
    },
    onError: (_err, _monthKey, context) => {
      if (context?.prev) queryClient.setQueryData(attendanceLockKeys.lockedMonths(), context.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: attendanceLockKeys.lockedMonths() })
    },
  })

  const toggle = useMutation({
    mutationFn: async ({ monthKey, isCurrentlyLocked }: { monthKey: string; isCurrentlyLocked: boolean }) => {
      if (isCurrentlyLocked) {
        await unlockMonth(monthKey)
      } else {
        await lockMonth(monthKey)
      }
    },
    onMutate: async ({ monthKey, isCurrentlyLocked }) => {
      await queryClient.cancelQueries({ queryKey: attendanceLockKeys.lockedMonths() })
      const prev = queryClient.getQueryData<{ lockedMonths: Record<string, boolean> }>(attendanceLockKeys.lockedMonths())
      const updated = { ...prev?.lockedMonths }
      if (isCurrentlyLocked) {
        delete updated[monthKey]
      } else {
        updated[monthKey] = true
      }
      queryClient.setQueryData(attendanceLockKeys.lockedMonths(), { lockedMonths: updated })
      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) queryClient.setQueryData(attendanceLockKeys.lockedMonths(), context.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: attendanceLockKeys.lockedMonths() })
    },
  })

  return { lock, unlock, toggle }
}

/**
 * Combined hook for attendance lock state (replacement for useAttendanceLocalState)
 */
export function useAttendanceLocks() {
  const { data: lockedMonths = {}, isLoading, error } = useLockedMonths()
  const { lock, unlock, toggle } = useAttendanceLockMutations()

  const toggleLock = async (monthKey: string) => {
    const isLocked = Boolean(lockedMonths[monthKey])
    await toggle.mutateAsync({ monthKey, isCurrentlyLocked: isLocked })
  }

  const isMonthLocked = (monthKey: string) => Boolean(lockedMonths[monthKey])

  const getLatestLockedMonth = () => {
    const lockedKeys = Object.keys(lockedMonths).filter(k => lockedMonths[k])
    return lockedKeys.sort().reverse()[0] || null
  }

  return {
    lockedMonths,
    isLoading,
    error,
    toggleLock,
    lockMonth: async (monthKey: string) => {
      await lock.mutateAsync(monthKey)
    },
    unlockMonth: async (monthKey: string) => {
      await unlock.mutateAsync(monthKey)
    },
    isMonthLocked,
    getLatestLockedMonth,
    isToggling: toggle.isPending,
    isLocking: lock.isPending,
    isUnlocking: unlock.isPending,
  }
}
