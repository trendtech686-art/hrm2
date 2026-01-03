/**
 * Hooks để quản lý reminder settings và templates
 * Sử dụng database (user preferences) làm source of truth
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/auth-context'

const API_BASE = '/api/user-preferences'
const SAVE_DEBOUNCE_DELAY = 1000

// ==================== Warranty Reminder Templates ====================

export interface ReminderTemplate {
  id: string;
  name: string;
  message: string;
  isDefault?: boolean;
}

export const DEFAULT_WARRANTY_REMINDER_TEMPLATES: ReminderTemplate[] = [
  {
    id: 'overdue',
    name: 'Nhắc nhở quá hạn',
    message: 'Phiếu bảo hành #{ticketId} đã quá hạn xử lý. Vui lòng kiểm tra và cập nhật trạng thái.',
    isDefault: true,
  },
  {
    id: 'follow-up',
    name: 'Theo dõi tiến độ',
    message: 'Phiếu bảo hành #{ticketId} đang được xử lý. Vui lòng cập nhật tiến độ cho khách hàng {customerName}.',
    isDefault: true,
  },
  {
    id: 'return-ready',
    name: 'Sẵn sàng trả hàng',
    message: 'Sản phẩm bảo hành #{ticketId} đã xử lý xong. Vui lòng chuẩn bị trả hàng cho khách {customerName}.',
    isDefault: true,
  },
  {
    id: 'custom',
    name: 'Nhắc nhở tùy chỉnh',
    message: '',
    isDefault: false,
  },
];

const WARRANTY_REMINDER_TEMPLATES_KEY = 'warranty-reminder-templates'

/**
 * Hook để quản lý warranty reminder templates
 */
export function useWarrantyReminderTemplates(): [
  ReminderTemplate[],
  (templates: ReminderTemplate[]) => void,
  boolean
] {
  const { user } = useAuth()
  const [customTemplates, setCustomTemplatesState] = useState<ReminderTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<string>('')

  // Load from database
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        if (user?.systemId) {
          const res = await fetch(
            `${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(WARRANTY_REMINDER_TEMPLATES_KEY)}`
          )
          
          if (res.ok) {
            const data = await res.json()
            if (data && data.value && Array.isArray(data.value)) {
              setCustomTemplatesState(data.value)
              lastSavedRef.current = JSON.stringify(data.value)
            }
          }
        }
      } catch (error) {
        console.error('Error loading warranty reminder templates:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTemplates()
  }, [user?.systemId])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // Combined templates (default + custom)
  const allTemplates = [...DEFAULT_WARRANTY_REMINDER_TEMPLATES, ...customTemplates]

  // Save custom templates
  const setTemplates = useCallback(
    (newTemplates: ReminderTemplate[]) => {
      // Filter out default templates
      const customOnly = newTemplates.filter(t => !t.isDefault)
      setCustomTemplatesState(customOnly)

      if (user?.systemId) {
        const newValueStr = JSON.stringify(customOnly)
        
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
              key: WARRANTY_REMINDER_TEMPLATES_KEY,
              value: customOnly,
              category: 'templates',
            }),
          }).catch(error => {
            console.error('Error saving warranty reminder templates:', error)
          })
        }, SAVE_DEBOUNCE_DELAY)
      }
    },
    [user?.systemId]
  )

  return [allTemplates, setTemplates, isLoading]
}

// ==================== Complaint Reminder Settings ====================

export interface ComplaintReminderSettings {
  enabled: boolean;
  intervals: {
    firstReminder: number; // hours
    secondReminder: number; // hours
    escalation: number; // hours
  };
  notifyAssignee: boolean;
  notifyCreator: boolean;
  notifyManager: boolean;
}

const COMPLAINT_REMINDER_SETTINGS_KEY = 'complaints-reminder-settings'

const DEFAULT_COMPLAINT_REMINDER_SETTINGS: ComplaintReminderSettings = {
  enabled: true,
  intervals: {
    firstReminder: 4,
    secondReminder: 8,
    escalation: 24,
  },
  notifyAssignee: true,
  notifyCreator: true,
  notifyManager: true,
}

/**
 * Hook để quản lý complaint reminder settings
 */
export function useComplaintReminderSettings(): [
  ComplaintReminderSettings,
  (settings: ComplaintReminderSettings) => void,
  boolean
] {
  const { user } = useAuth()
  const [settings, setSettingsState] = useState<ComplaintReminderSettings>(DEFAULT_COMPLAINT_REMINDER_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<string>('')

  // Load from database
  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (user?.systemId) {
          const res = await fetch(
            `${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(COMPLAINT_REMINDER_SETTINGS_KEY)}`
          )
          
          if (res.ok) {
            const data = await res.json()
            if (data && data.value) {
              setSettingsState({ ...DEFAULT_COMPLAINT_REMINDER_SETTINGS, ...data.value })
              lastSavedRef.current = JSON.stringify(data.value)
            }
          }
        }
      } catch (error) {
        console.error('Error loading complaint reminder settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [user?.systemId])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // Update settings
  const setSettings = useCallback(
    (newSettings: ComplaintReminderSettings) => {
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
              key: COMPLAINT_REMINDER_SETTINGS_KEY,
              value: newSettings,
              category: 'settings',
            }),
          }).catch(error => {
            console.error('Error saving complaint reminder settings:', error)
          })
        }, SAVE_DEBOUNCE_DELAY)
      }
    },
    [user?.systemId]
  )

  return [settings, setSettings, isLoading]
}
