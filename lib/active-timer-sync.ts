/**
 * Active Timer Sync Utilities
 * 
 * Sync active timer with database as source of truth
 * Uses in-memory cache for fast synchronous access
 * 
 * NOTE: localStorage has been removed - all data comes from API/database
 */

interface ActiveTimerData {
  taskId: string
  startedAt: string
  description?: string
}

// In-memory cache for fast synchronous access
let timerCache: ActiveTimerData | null = null

/**
 * Save timer to database
 */
export async function saveActiveTimer(
  userId: string,
  taskId: string,
  startedAt: string,
  description?: string
): Promise<boolean> {
  // Update in-memory cache
  timerCache = { taskId, startedAt, description }

  // Save to database for persistence
  try {
    const res = await fetch('/api/active-timer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        taskId,
        startTime: startedAt,
        description,
      }),
    })
    return res.ok
  } catch (error) {
    console.error('Failed to save active timer to database:', error)
    return false
  }
}

/**
 * Remove timer from database
 */
export async function removeActiveTimer(userId: string): Promise<boolean> {
  // Clear in-memory cache
  timerCache = null

  // Remove from database
  try {
    const res = await fetch(`/api/active-timer?userId=${userId}`, {
      method: 'DELETE',
    })
    return res.ok
  } catch (error) {
    console.error('Failed to remove active timer from database:', error)
    return false
  }
}

/**
 * Load timer from database
 */
export async function loadActiveTimer(userId: string): Promise<ActiveTimerData | null> {
  // Return from cache if available
  if (timerCache) {
    return timerCache
  }

  // Fetch from database
  try {
    const res = await fetch(`/api/active-timer?userId=${userId}`)
    if (res.ok) {
      const data = await res.json()
      if (data?.taskId && data?.startTime) {
        const timerData: ActiveTimerData = {
          taskId: data.taskId,
          startedAt: data.startTime,
          description: data.description,
        }
        
        // Update cache
        timerCache = timerData
        
        return timerData
      }
    }
  } catch (error) {
    console.error('Failed to load active timer from database:', error)
  }

  return null
}

/**
 * Get timer from cache only (synchronous)
 */
export function getActiveTimerSync(): ActiveTimerData | null {
  return timerCache
}
