/**
 * Hooks để quản lý SLA settings và Notification settings
 * Sử dụng database (user preferences) làm source of truth
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/auth-context'

const API_BASE = '/api/user-preferences'
const SAVE_DEBOUNCE_DELAY = 1000

// ==================== Warranty SLA Settings ====================

export interface WarrantySLATargets {
  response: number;    // minutes
  processing: number;  // minutes
  return: number;      // minutes
}

const WARRANTY_SLA_SETTINGS_KEY = 'warranty-sla-targets'

export const DEFAULT_WARRANTY_SLA_TARGETS: WarrantySLATargets = {
  response: 2 * 60,      // 2 hours
  processing: 24 * 60,   // 24 hours
  return: 48 * 60,       // 48 hours
}

/**
 * Hook để quản lý warranty SLA targets
 */
export function useWarrantySLASettings(): [
  WarrantySLATargets,
  (targets: WarrantySLATargets) => void,
  boolean
] {
  const { user } = useAuth()
  const [targets, setTargetsState] = useState<WarrantySLATargets>(DEFAULT_WARRANTY_SLA_TARGETS)
  const [isLoading, setIsLoading] = useState(true)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<string>('')

  useEffect(() => {
    const loadTargets = async () => {
      try {
        if (user?.systemId) {
          const res = await fetch(
            `${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(WARRANTY_SLA_SETTINGS_KEY)}`
          )
          
          if (res.ok) {
            const data = await res.json()
            if (data && data.value) {
              setTargetsState({ ...DEFAULT_WARRANTY_SLA_TARGETS, ...data.value })
              lastSavedRef.current = JSON.stringify(data.value)
            }
          }
        }
      } catch (error) {
        console.error('Error loading warranty SLA settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTargets()
  }, [user?.systemId])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const setTargets = useCallback(
    (newTargets: WarrantySLATargets) => {
      setTargetsState(newTargets)

      if (user?.systemId) {
        const newValueStr = JSON.stringify(newTargets)
        
        if (newValueStr === lastSavedRef.current) {
          return
        }

        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current)
        }

        saveTimeoutRef.current = setTimeout(() => {
          lastSavedRef.current = newValueStr
          fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.systemId,
              key: WARRANTY_SLA_SETTINGS_KEY,
              value: newTargets,
              category: 'settings',
            }),
          }).catch(error => {
            console.error('Error saving warranty SLA settings:', error)
          })
        }, SAVE_DEBOUNCE_DELAY)
      }
    },
    [user?.systemId]
  )

  return [targets, setTargets, isLoading]
}

// ==================== Complaints SLA Settings ====================

export interface ComplaintsSLASettings {
  low: { responseTime: number; resolveTime: number };
  medium: { responseTime: number; resolveTime: number };
  high: { responseTime: number; resolveTime: number };
  urgent: { responseTime: number; resolveTime: number };
}

const COMPLAINTS_SLA_SETTINGS_KEY = 'complaints-sla-settings'

export const DEFAULT_COMPLAINTS_SLA_SETTINGS: ComplaintsSLASettings = {
  low: { responseTime: 240, resolveTime: 48 },
  medium: { responseTime: 120, resolveTime: 24 },
  high: { responseTime: 60, resolveTime: 12 },
  urgent: { responseTime: 30, resolveTime: 4 },
}

/**
 * Hook để quản lý complaints SLA settings
 */
export function useComplaintsSLASettings(): [
  ComplaintsSLASettings,
  (settings: ComplaintsSLASettings) => void,
  boolean
] {
  const { user } = useAuth()
  const [settings, setSettingsState] = useState<ComplaintsSLASettings>(DEFAULT_COMPLAINTS_SLA_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<string>('')

  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (user?.systemId) {
          const res = await fetch(
            `${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(COMPLAINTS_SLA_SETTINGS_KEY)}`
          )
          
          if (res.ok) {
            const data = await res.json()
            if (data && data.value) {
              setSettingsState({ ...DEFAULT_COMPLAINTS_SLA_SETTINGS, ...data.value })
              lastSavedRef.current = JSON.stringify(data.value)
            }
          }
        }
      } catch (error) {
        console.error('Error loading complaints SLA settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [user?.systemId])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const setSettings = useCallback(
    (newSettings: ComplaintsSLASettings) => {
      setSettingsState(newSettings)

      if (user?.systemId) {
        const newValueStr = JSON.stringify(newSettings)
        
        if (newValueStr === lastSavedRef.current) {
          return
        }

        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current)
        }

        saveTimeoutRef.current = setTimeout(() => {
          lastSavedRef.current = newValueStr
          fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.systemId,
              key: COMPLAINTS_SLA_SETTINGS_KEY,
              value: newSettings,
              category: 'settings',
            }),
          }).catch(error => {
            console.error('Error saving complaints SLA settings:', error)
          })
        }, SAVE_DEBOUNCE_DELAY)
      }
    },
    [user?.systemId]
  )

  return [settings, setSettings, isLoading]
}

// ==================== Warranty Notification Settings ====================

export interface WarrantyNotificationSettings {
  emailOnCreate: boolean;
  emailOnAssign: boolean;
  emailOnProcessing: boolean;
  emailOnProcessed: boolean;
  emailOnReturned: boolean;
  emailOnOverdue: boolean;
  smsOnOverdue: boolean;
  inAppNotifications: boolean;
  reminderNotifications: boolean;
}

const WARRANTY_NOTIFICATION_SETTINGS_KEY = 'warranty-notification-settings'

export const DEFAULT_WARRANTY_NOTIFICATION_SETTINGS: WarrantyNotificationSettings = {
  emailOnCreate: true,
  emailOnAssign: true,
  emailOnProcessing: false,
  emailOnProcessed: true,
  emailOnReturned: true,
  emailOnOverdue: true,
  smsOnOverdue: false,
  inAppNotifications: true,
  reminderNotifications: true,
}

/**
 * Hook để quản lý warranty notification settings
 */
export function useWarrantyNotificationSettings(): [
  WarrantyNotificationSettings,
  (settings: WarrantyNotificationSettings) => void,
  boolean
] {
  const { user } = useAuth()
  const [settings, setSettingsState] = useState<WarrantyNotificationSettings>(DEFAULT_WARRANTY_NOTIFICATION_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<string>('')

  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (user?.systemId) {
          const res = await fetch(
            `${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(WARRANTY_NOTIFICATION_SETTINGS_KEY)}`
          )
          
          if (res.ok) {
            const data = await res.json()
            if (data && data.value) {
              setSettingsState({ ...DEFAULT_WARRANTY_NOTIFICATION_SETTINGS, ...data.value })
              lastSavedRef.current = JSON.stringify(data.value)
            }
          }
        }
      } catch (error) {
        console.error('Error loading warranty notification settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [user?.systemId])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const setSettings = useCallback(
    (newSettings: WarrantyNotificationSettings) => {
      setSettingsState(newSettings)

      if (user?.systemId) {
        const newValueStr = JSON.stringify(newSettings)
        
        if (newValueStr === lastSavedRef.current) {
          return
        }

        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current)
        }

        saveTimeoutRef.current = setTimeout(() => {
          lastSavedRef.current = newValueStr
          fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.systemId,
              key: WARRANTY_NOTIFICATION_SETTINGS_KEY,
              value: newSettings,
              category: 'settings',
            }),
          }).catch(error => {
            console.error('Error saving warranty notification settings:', error)
          })
        }, SAVE_DEBOUNCE_DELAY)
      }
    },
    [user?.systemId]
  )

  return [settings, setSettings, isLoading]
}

// ==================== Complaints Notification Settings ====================

export interface ComplaintsNotificationSettings {
  emailOnCreate: boolean;
  emailOnAssign: boolean;
  emailOnVerified: boolean;
  emailOnResolved: boolean;
  emailOnOverdue: boolean;
  smsOnOverdue: boolean;
  inAppNotifications: boolean;
}

const COMPLAINTS_NOTIFICATION_SETTINGS_KEY = 'complaints-notification-settings'

export const DEFAULT_COMPLAINTS_NOTIFICATION_SETTINGS: ComplaintsNotificationSettings = {
  emailOnCreate: true,
  emailOnAssign: true,
  emailOnVerified: false,
  emailOnResolved: true,
  emailOnOverdue: true,
  smsOnOverdue: false,
  inAppNotifications: true,
}

/**
 * Hook để quản lý complaints notification settings
 */
export function useComplaintsNotificationSettings(): [
  ComplaintsNotificationSettings,
  (settings: ComplaintsNotificationSettings) => void,
  boolean
] {
  const { user } = useAuth()
  const [settings, setSettingsState] = useState<ComplaintsNotificationSettings>(DEFAULT_COMPLAINTS_NOTIFICATION_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<string>('')

  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (user?.systemId) {
          const res = await fetch(
            `${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(COMPLAINTS_NOTIFICATION_SETTINGS_KEY)}`
          )
          
          if (res.ok) {
            const data = await res.json()
            if (data && data.value) {
              setSettingsState({ ...DEFAULT_COMPLAINTS_NOTIFICATION_SETTINGS, ...data.value })
              lastSavedRef.current = JSON.stringify(data.value)
            }
          }
        }
      } catch (error) {
        console.error('Error loading complaints notification settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [user?.systemId])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const setSettings = useCallback(
    (newSettings: ComplaintsNotificationSettings) => {
      setSettingsState(newSettings)

      if (user?.systemId) {
        const newValueStr = JSON.stringify(newSettings)
        
        if (newValueStr === lastSavedRef.current) {
          return
        }

        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current)
        }

        saveTimeoutRef.current = setTimeout(() => {
          lastSavedRef.current = newValueStr
          fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.systemId,
              key: COMPLAINTS_NOTIFICATION_SETTINGS_KEY,
              value: newSettings,
              category: 'settings',
            }),
          }).catch(error => {
            console.error('Error saving complaints notification settings:', error)
          })
        }, SAVE_DEBOUNCE_DELAY)
      }
    },
    [user?.systemId]
  )

  return [settings, setSettings, isLoading]
}
