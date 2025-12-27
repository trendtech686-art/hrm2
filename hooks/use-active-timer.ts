import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'

interface ActiveTimer {
  systemId: string
  userId: string
  taskId: string
  startTime: string
  description?: string
}

/**
 * Hook để quản lý active timer cho time tracking
 * Thay thế localStorage 'active-timer'
 */
export function useActiveTimer() {
  const { user } = useAuth()
  const [timer, setTimer] = useState<ActiveTimer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load active timer from database
  useEffect(() => {
    if (!user?.systemId) {
      setTimer(null)
      setIsLoading(false)
      return
    }

    const loadTimer = async () => {
      try {
        const res = await fetch(`/api/active-timer?userId=${user.systemId}`)
        if (res.ok) {
          const data = await res.json()
          setTimer(data)
        }
      } catch (error) {
        console.error('Error loading active timer:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTimer()
  }, [user?.systemId])

  // Start new timer
  const startTimer = useCallback(
    async (taskId: string, description?: string) => {
      if (!user?.systemId) {
        console.warn('Cannot start timer: user not logged in')
        return null
      }

      try {
        const res = await fetch('/api/active-timer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.systemId,
            taskId,
            startTime: new Date().toISOString(),
            description,
          }),
        })

        if (res.ok) {
          const newTimer = await res.json()
          setTimer(newTimer)
          return newTimer
        }
      } catch (error) {
        console.error('Error starting timer:', error)
      }
      return null
    },
    [user?.systemId]
  )

  // Stop timer
  const stopTimer = useCallback(async () => {
    if (!user?.systemId) return false

    try {
      const res = await fetch(`/api/active-timer?userId=${user.systemId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setTimer(null)
        return true
      }
    } catch (error) {
      console.error('Error stopping timer:', error)
    }
    return false
  }, [user?.systemId])

  // Calculate elapsed time
  const getElapsedTime = useCallback(() => {
    if (!timer?.startTime) return 0
    return Date.now() - new Date(timer.startTime).getTime()
  }, [timer?.startTime])

  // Check if timer is running for a specific task
  const isRunningForTask = useCallback(
    (taskId: string) => {
      return timer?.taskId === taskId
    },
    [timer?.taskId]
  )

  return {
    timer,
    isLoading,
    isRunning: !!timer,
    startTimer,
    stopTimer,
    getElapsedTime,
    isRunningForTask,
    currentTaskId: timer?.taskId,
  }
}
