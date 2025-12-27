/**
 * Warranty Settings Sync Utilities
 * Provides sync functions for warranty SLA, notifications, tracking settings
 * Uses in-memory cache with database as source of truth
 * 
 * NOTE: localStorage has been removed - all data comes from API/database
 */

// Default values - mutable for use as initial state
const DEFAULTS = {
  sla: {
    response: 2 * 60,      // 2 hours
    processing: 24 * 60,   // 24 hours
    return: 48 * 60,       // 48 hours
  },
  notifications: {
    emailOnCreate: true,
    emailOnAssign: true,
    emailOnProcessing: false,
    emailOnProcessed: true,
    emailOnReturned: true,
    emailOnOverdue: true,
    smsOnOverdue: false,
    inAppNotifications: true,
    reminderNotifications: true,
  },
  tracking: {
    enabled: false,
    allowCustomerComments: false,
    showEmployeeName: true,
    showTimeline: true,
  },
  templates: [] as ReminderTemplate[],
}

// In-memory cache for sync functions
let slaCache: WarrantySLATargets | null = null
let notificationsCache: WarrantyNotificationSettings | null = null
let trackingCache: WarrantyTrackingSettings | null = null
let templatesCache: ReminderTemplate[] | null = null

type SettingType = 'sla-targets' | 'notifications' | 'tracking' | 'reminder-templates'

// Generic fetch function
async function fetchWarrantySetting<T>(type: SettingType): Promise<T> {
  try {
    const response = await fetch(`/api/warranty-settings?type=${type}`)
    if (!response.ok) throw new Error('Failed to fetch')
    return await response.json()
  } catch (error) {
    console.error(`[WarrantySettings] Failed to fetch ${type}:`, error)
    throw error
  }
}

// Generic save function
async function saveWarrantySetting<T>(type: SettingType, data: T): Promise<void> {
  try {
    const response = await fetch('/api/warranty-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    })
    if (!response.ok) throw new Error('Failed to save')
  } catch (error) {
    console.error(`[WarrantySettings] Failed to save ${type}:`, error)
    throw error
  }
}

// ============= SLA TARGETS =============

export interface WarrantySLATargets {
  response: number
  processing: number
  return: number
}

/**
 * Load SLA targets from database
 */
export async function loadWarrantySLATargetsAsync(): Promise<WarrantySLATargets> {
  try {
    const data = await fetchWarrantySetting<WarrantySLATargets>('sla-targets')
    slaCache = data
    return data
  } catch {
    // Return cache or defaults if API fails
    return slaCache ?? DEFAULTS.sla
  }
}

/**
 * Get SLA targets synchronously (from cache only)
 */
export function getWarrantySLATargetsSync(): WarrantySLATargets {
  return slaCache ?? DEFAULTS.sla
}

/**
 * Save SLA targets to database
 */
export async function saveWarrantySLATargetsAsync(targets: WarrantySLATargets): Promise<void> {
  await saveWarrantySetting('sla-targets', targets)
  slaCache = targets
}

// ============= NOTIFICATION SETTINGS =============

export interface WarrantyNotificationSettings {
  emailOnCreate: boolean
  emailOnAssign: boolean
  emailOnProcessing: boolean
  emailOnProcessed: boolean
  emailOnReturned: boolean
  emailOnOverdue: boolean
  smsOnOverdue: boolean
  inAppNotifications: boolean
  reminderNotifications: boolean
}

/**
 * Load notification settings from database
 */
export async function loadWarrantyNotificationsAsync(): Promise<WarrantyNotificationSettings> {
  try {
    const data = await fetchWarrantySetting<WarrantyNotificationSettings>('notifications')
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
export function getWarrantyNotificationsSync(): WarrantyNotificationSettings {
  return notificationsCache ?? DEFAULTS.notifications as WarrantyNotificationSettings
}

/**
 * Save notification settings
 */
export async function saveWarrantyNotificationsAsync(settings: WarrantyNotificationSettings): Promise<void> {
  await saveWarrantySetting('notifications', settings)
  notificationsCache = settings
}

// ============= TRACKING SETTINGS =============

export interface WarrantyTrackingSettings {
  enabled: boolean
  allowCustomerComments: boolean
  showEmployeeName: boolean
  showTimeline: boolean
}

/**
 * Load tracking settings from database
 */
export async function loadWarrantyTrackingAsync(): Promise<WarrantyTrackingSettings> {
  try {
    const data = await fetchWarrantySetting<WarrantyTrackingSettings>('tracking')
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
export function getWarrantyTrackingSync(): WarrantyTrackingSettings {
  return trackingCache ?? DEFAULTS.tracking as WarrantyTrackingSettings
}

/**
 * Save tracking settings
 */
export async function saveWarrantyTrackingAsync(settings: WarrantyTrackingSettings): Promise<void> {
  await saveWarrantySetting('tracking', settings)
  trackingCache = settings
}

// ============= REMINDER TEMPLATES =============

export interface ReminderTemplate {
  id: string
  name: string
  message: string
  isDefault?: boolean
}

/**
 * Load reminder templates from database
 */
export async function loadWarrantyTemplatesAsync(): Promise<ReminderTemplate[]> {
  try {
    const data = await fetchWarrantySetting<ReminderTemplate[]>('reminder-templates')
    templatesCache = data
    return data
  } catch {
    // Return cache or defaults if API fails
    return templatesCache ?? DEFAULTS.templates
  }
}

/**
 * Get reminder templates synchronously (from cache only)
 */
export function getWarrantyTemplatesSync(): ReminderTemplate[] {
  return templatesCache ?? []
}

/**
 * Save reminder templates
 */
export async function saveWarrantyTemplatesAsync(templates: ReminderTemplate[]): Promise<void> {
  await saveWarrantySetting('reminder-templates', templates)
  templatesCache = templates
}

// ============= INITIALIZATION =============

/**
 * Initialize all warranty settings from database
 * Call this on app startup or user login
 */
export async function initWarrantySettings(): Promise<void> {
  await Promise.all([
    loadWarrantySLATargetsAsync(),
    loadWarrantyNotificationsAsync(),
    loadWarrantyTrackingAsync(),
    loadWarrantyTemplatesAsync(),
  ])
}
