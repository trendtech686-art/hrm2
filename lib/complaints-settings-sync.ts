/**
 * Complaints Settings Sync Utilities
 * Provides sync functions for complaints SLA, notifications, tracking, reminders settings
 * Uses in-memory cache with database as source of truth
 * 
 * NOTE: localStorage has been removed - all data comes from API/database
 */

// Default values - mutable for use as initial state
const DEFAULTS = {
  sla: {
    low: { responseTime: 240, resolveTime: 48 },
    medium: { responseTime: 120, resolveTime: 24 },
    high: { responseTime: 60, resolveTime: 12 },
    urgent: { responseTime: 30, resolveTime: 4 },
  },
  notifications: {
    emailOnCreate: true,
    emailOnAssign: true,
    emailOnVerified: false,
    emailOnResolved: true,
    emailOnOverdue: true,
    smsOnOverdue: false,
    inAppNotifications: true,
  },
  tracking: {
    enabled: false,
    allowCustomerComments: false,
    showEmployeeName: true,
    showTimeline: true,
  },
  reminders: {
    enabled: true,
    intervals: {
      firstReminder: 4,
      secondReminder: 8,
      escalation: 24,
    },
    notifyAssignee: true,
    notifyCreator: true,
    notifyManager: true,
  },
  templates: [] as ComplaintTemplate[],
}

// In-memory cache for sync functions
let slaCache: ComplaintsSLASettings | null = null
let notificationsCache: ComplaintsNotificationSettings | null = null
let trackingCache: ComplaintsTrackingSettings | null = null
let remindersCache: ComplaintsReminderSettings | null = null
let templatesCache: ComplaintTemplate[] | null = null

type SettingType = 'sla' | 'notifications' | 'tracking' | 'reminders' | 'templates'

// Generic fetch function
async function fetchComplaintsSetting<T>(type: SettingType): Promise<T> {
  try {
    const response = await fetch(`/api/complaints-settings?type=${type}`)
    if (!response.ok) throw new Error('Failed to fetch')
    return await response.json()
  } catch (error) {
    console.error(`[ComplaintsSettings] Failed to fetch ${type}:`, error)
    throw error
  }
}

// Generic save function
async function saveComplaintsSetting<T>(type: SettingType, data: T): Promise<void> {
  try {
    const response = await fetch('/api/complaints-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    })
    if (!response.ok) throw new Error('Failed to save')
  } catch (error) {
    console.error(`[ComplaintsSettings] Failed to save ${type}:`, error)
    throw error
  }
}

// ============= SLA SETTINGS =============

export interface ComplaintsSLASettings {
  low: { responseTime: number; resolveTime: number }
  medium: { responseTime: number; resolveTime: number }
  high: { responseTime: number; resolveTime: number }
  urgent: { responseTime: number; resolveTime: number }
}

/**
 * Load SLA settings from database
 */
export async function loadComplaintsSLAAsync(): Promise<ComplaintsSLASettings> {
  try {
    const data = await fetchComplaintsSetting<ComplaintsSLASettings>('sla')
    slaCache = data
    return data
  } catch {
    // Return cache or defaults if API fails
    return slaCache ?? DEFAULTS.sla
  }
}

/**
 * Get SLA settings synchronously (from cache only)
 */
export function getComplaintsSLASync(): ComplaintsSLASettings {
  return slaCache ?? DEFAULTS.sla as ComplaintsSLASettings
}

/**
 * Save SLA settings to database
 */
export async function saveComplaintsSLAAsync(settings: ComplaintsSLASettings): Promise<void> {
  await saveComplaintsSetting('sla', settings)
  slaCache = settings
}

// ============= NOTIFICATION SETTINGS =============

export interface ComplaintsNotificationSettings {
  emailOnCreate: boolean
  emailOnAssign: boolean
  emailOnVerified: boolean
  emailOnResolved: boolean
  emailOnOverdue: boolean
  smsOnOverdue: boolean
  inAppNotifications: boolean
}

/**
 * Load notification settings from database
 */
export async function loadComplaintsNotificationsAsync(): Promise<ComplaintsNotificationSettings> {
  try {
    const data = await fetchComplaintsSetting<ComplaintsNotificationSettings>('notifications')
    notificationsCache = data
    return data
  } catch {
    // Return cache or defaults if API fails
    return notificationsCache ?? DEFAULTS.notifications
  }
}

/**
 * Get notification settings synchronously (from cache only)
 */
export function getComplaintsNotificationsSync(): ComplaintsNotificationSettings {
  return notificationsCache ?? DEFAULTS.notifications as ComplaintsNotificationSettings
}

/**
 * Save notification settings
 */
export async function saveComplaintsNotificationsAsync(settings: ComplaintsNotificationSettings): Promise<void> {
  await saveComplaintsSetting('notifications', settings)
  notificationsCache = settings
}

// ============= TRACKING SETTINGS =============

export interface ComplaintsTrackingSettings {
  enabled: boolean
  allowCustomerComments: boolean
  showEmployeeName: boolean
  showTimeline: boolean
}

/**
 * Load tracking settings from database
 */
export async function loadComplaintsTrackingAsync(): Promise<ComplaintsTrackingSettings> {
  try {
    const data = await fetchComplaintsSetting<ComplaintsTrackingSettings>('tracking')
    trackingCache = data
    return data
  } catch {
    // Return cache or defaults if API fails
    return trackingCache ?? DEFAULTS.tracking
  }
}

/**
 * Get tracking settings synchronously (from cache only)
 */
export function getComplaintsTrackingSync(): ComplaintsTrackingSettings {
  return trackingCache ?? DEFAULTS.tracking as ComplaintsTrackingSettings
}

/**
 * Save tracking settings
 */
export async function saveComplaintsTrackingAsync(settings: ComplaintsTrackingSettings): Promise<void> {
  await saveComplaintsSetting('tracking', settings)
  trackingCache = settings
}

// ============= REMINDER SETTINGS =============

export interface ComplaintsReminderSettings {
  enabled: boolean
  intervals: {
    firstReminder: number
    secondReminder: number
    escalation: number
  }
  notifyAssignee: boolean
  notifyCreator: boolean
  notifyManager: boolean
}

/**
 * Load reminder settings from database
 */
export async function loadComplaintsRemindersAsync(): Promise<ComplaintsReminderSettings> {
  try {
    const data = await fetchComplaintsSetting<ComplaintsReminderSettings>('reminders')
    remindersCache = data
    return data
  } catch {
    // Return cache or defaults if API fails
    return remindersCache ?? DEFAULTS.reminders
  }
}

/**
 * Get reminder settings synchronously (from cache only)
 */
export function getComplaintsRemindersSync(): ComplaintsReminderSettings {
  return remindersCache ?? DEFAULTS.reminders as ComplaintsReminderSettings
}

/**
 * Save reminder settings
 */
export async function saveComplaintsRemindersAsync(settings: ComplaintsReminderSettings): Promise<void> {
  await saveComplaintsSetting('reminders', settings)
  remindersCache = settings
}

// ============= TEMPLATES =============

export interface ComplaintTemplate {
  id: string
  name: string
  content: string
  isDefault?: boolean
}

/**
 * Load templates from database
 */
export async function loadComplaintsTemplatesAsync(): Promise<ComplaintTemplate[]> {
  try {
    const data = await fetchComplaintsSetting<ComplaintTemplate[]>('templates')
    templatesCache = data
    return data
  } catch {
    // Return cache or defaults if API fails
    return templatesCache ?? DEFAULTS.templates
  }
}

/**
 * Get templates synchronously (from cache only)
 */
export function getComplaintsTemplatesSync(): ComplaintTemplate[] {
  return templatesCache ?? []
}

/**
 * Save templates
 */
export async function saveComplaintsTemplatesAsync(templates: ComplaintTemplate[]): Promise<void> {
  await saveComplaintsSetting('templates', templates)
  templatesCache = templates
}

// ============= INITIALIZATION =============

/**
 * Initialize all complaints settings from database
 * Call this on app startup or user login
 */
export async function initComplaintsSettings(): Promise<void> {
  await Promise.all([
    loadComplaintsSLAAsync(),
    loadComplaintsNotificationsAsync(),
    loadComplaintsTrackingAsync(),
    loadComplaintsRemindersAsync(),
    loadComplaintsTemplatesAsync(),
  ])
}
