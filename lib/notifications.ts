/**
 * Server-side Notification Helper
 *
 * Create notifications from any API route or server action.
 * All functions are server-only — do NOT import from client components.
 *
 * @example
 * import { createNotification, createBulkNotifications } from '@/lib/notifications'
 *
 * // Single notification
 * await createNotification({
 *   type: 'task',
 *   title: 'Công việc mới',
 *   message: 'Bạn được giao công việc "Kiểm kho"',
 *   link: '/tasks/TASK001',
 *   recipientId: 'EMP000001',
 *   senderId: 'EMP000002',
 *   senderName: 'Nguyễn Văn A',
 * })
 *
 * // Bulk notifications
 * await createBulkNotifications({
 *   type: 'order',
 *   title: 'Đơn hàng mới',
 *   message: 'Đơn hàng DH000123 cần xử lý',
 *   link: '/orders/DH000123',
 *   recipientIds: ['EMP001', 'EMP002', 'EMP003'],
 *   senderId: 'EMP000004',
 *   senderName: 'Trần Thị B',
 * })
 */

import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { logError } from '@/lib/logger'
import type { GeneralNotificationSettings, SystemNotificationSettings, TaskNotificationSettings, ComplaintNotificationSettings, WarrantyNotificationSettings, SalesNotificationSettings, WarehouseNotificationSettings, HrNotificationSettings } from '@/features/settings/notifications/types'
import { defaultGeneralNotifications, defaultSystemNotifications, defaultTaskNotifications, defaultComplaintNotifications, defaultWarrantyNotifications, defaultSalesNotifications, defaultWarehouseNotifications, defaultHrNotifications } from '@/features/settings/notifications/types'

// ─── Cached settings reader (TTL: 60s) ────────────────────────
let _cachedGeneral: { data: GeneralNotificationSettings; ts: number } | null = null
let _cachedSystem: { data: SystemNotificationSettings; ts: number } | null = null
let _cachedTaskNotif: { data: TaskNotificationSettings; ts: number } | null = null
let _cachedComplaintNotif: { data: ComplaintNotificationSettings; ts: number } | null = null
let _cachedWarrantyNotif: { data: WarrantyNotificationSettings; ts: number } | null = null
let _cachedSales: { data: SalesNotificationSettings; ts: number } | null = null
let _cachedWarehouse: { data: WarehouseNotificationSettings; ts: number } | null = null
let _cachedHr: { data: HrNotificationSettings; ts: number } | null = null
const SETTINGS_TTL = 60_000 // 60 seconds

async function readSetting<T extends object>(key: string, group: string, fallback: T): Promise<T> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key_group: { key, group } },
    })
    if (!setting?.value) return fallback
    return { ...fallback, ...(setting.value as Partial<T>) }
  } catch {
    return fallback
  }
}

export async function getGeneralNotificationSettings(): Promise<GeneralNotificationSettings> {
  if (_cachedGeneral && Date.now() - _cachedGeneral.ts < SETTINGS_TTL) return _cachedGeneral.data
  const data = await readSetting<GeneralNotificationSettings>(
    'general_notification_settings', 'system-notifications', defaultGeneralNotifications,
  )
  _cachedGeneral = { data, ts: Date.now() }
  return data
}

export async function getSystemNotificationSettings(): Promise<SystemNotificationSettings> {
  if (_cachedSystem && Date.now() - _cachedSystem.ts < SETTINGS_TTL) return _cachedSystem.data
  const data = await readSetting<SystemNotificationSettings>(
    'system_notification_settings', 'system-notifications', defaultSystemNotifications,
  )
  _cachedSystem = { data, ts: Date.now() }
  return data
}

export async function getTaskNotificationSettings(): Promise<TaskNotificationSettings> {
  if (_cachedTaskNotif && Date.now() - _cachedTaskNotif.ts < SETTINGS_TTL) return _cachedTaskNotif.data
  const data = await readSetting<TaskNotificationSettings>(
    'tasks_notification_settings', 'tasks', defaultTaskNotifications,
  )
  _cachedTaskNotif = { data, ts: Date.now() }
  return data
}

export async function getComplaintNotificationSettings(): Promise<ComplaintNotificationSettings> {
  if (_cachedComplaintNotif && Date.now() - _cachedComplaintNotif.ts < SETTINGS_TTL) return _cachedComplaintNotif.data
  const data = await readSetting<ComplaintNotificationSettings>(
    'complaints_notification_settings', 'complaints', defaultComplaintNotifications,
  )
  _cachedComplaintNotif = { data, ts: Date.now() }
  return data
}

export async function getWarrantyNotificationSettings(): Promise<WarrantyNotificationSettings> {
  if (_cachedWarrantyNotif && Date.now() - _cachedWarrantyNotif.ts < SETTINGS_TTL) return _cachedWarrantyNotif.data
  const data = await readSetting<WarrantyNotificationSettings>(
    'warranty_notification_settings', 'warranty', defaultWarrantyNotifications,
  )
  _cachedWarrantyNotif = { data, ts: Date.now() }
  return data
}

export async function getSalesNotificationSettings(): Promise<SalesNotificationSettings> {
  if (_cachedSales && Date.now() - _cachedSales.ts < SETTINGS_TTL) return _cachedSales.data
  const data = await readSetting<SalesNotificationSettings>(
    'sales_notification_settings', 'sales', defaultSalesNotifications,
  )
  _cachedSales = { data, ts: Date.now() }
  return data
}

export async function getWarehouseNotificationSettings(): Promise<WarehouseNotificationSettings> {
  if (_cachedWarehouse && Date.now() - _cachedWarehouse.ts < SETTINGS_TTL) return _cachedWarehouse.data
  const data = await readSetting<WarehouseNotificationSettings>(
    'warehouse_notification_settings', 'warehouse', defaultWarehouseNotifications,
  )
  _cachedWarehouse = { data, ts: Date.now() }
  return data
}

export async function getHrNotificationSettings(): Promise<HrNotificationSettings> {
  if (_cachedHr && Date.now() - _cachedHr.ts < SETTINGS_TTL) return _cachedHr.data
  const data = await readSetting<HrNotificationSettings>(
    'hr_notification_settings', 'hr', defaultHrNotifications,
  )
  _cachedHr = { data, ts: Date.now() }
  return data
}

/** Unified settings key → reader + field mapping */
interface SettingsMapping {
  reader: () => Promise<Record<string, unknown>>
  field: string
}

// Helper to wrap typed reader into Record<string, unknown> reader
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asReader = (fn: () => Promise<any>): (() => Promise<Record<string, unknown>>) => fn

const salesReader = asReader(getSalesNotificationSettings)
const warehouseReader = asReader(getWarehouseNotificationSettings)
const hrReader = asReader(getHrNotificationSettings)
const systemReader = asReader(getSystemNotificationSettings)

const NOTIFICATION_SETTINGS_MAP: Record<string, SettingsMapping> = {
  // Sales tab
  'order:created': { reader: salesReader, field: 'orderCreated' },
  'order:status': { reader: salesReader, field: 'orderStatusChanged' },
  'order:assigned': { reader: salesReader, field: 'orderAssigned' },
  'order:cancelled': { reader: salesReader, field: 'orderCancelled' },
  'order:packaging': { reader: salesReader, field: 'packagingUpdated' },
  'order:shipment': { reader: salesReader, field: 'shipmentUpdated' },
  'order:delivery': { reader: salesReader, field: 'deliveryUpdated' },
  'sales-return:updated': { reader: salesReader, field: 'salesReturnUpdated' },
  'customer:new': { reader: salesReader, field: 'customerCreated' },
  'reconciliation:updated': { reader: salesReader, field: 'reconciliationUpdated' },
  // Warehouse & Purchasing tab
  'stock-transfer:updated': { reader: warehouseReader, field: 'stockTransferUpdated' },
  'inventory-check:updated': { reader: warehouseReader, field: 'inventoryCheckUpdated' },
  'cost-adjustment:updated': { reader: warehouseReader, field: 'costAdjustmentUpdated' },
  'price-adjustment:updated': { reader: warehouseReader, field: 'priceAdjustmentUpdated' },
  'purchase-order:updated': { reader: warehouseReader, field: 'purchaseOrderUpdated' },
  'purchase-return:updated': { reader: warehouseReader, field: 'purchaseReturnUpdated' },
  'inventory-receipt:updated': { reader: warehouseReader, field: 'inventoryReceiptUpdated' },
  'stock:low': { reader: warehouseReader, field: 'lowStockAlert' },
  // HR tab
  'employee:created': { reader: hrReader, field: 'employeeCreated' },
  'attendance:updated': { reader: hrReader, field: 'attendanceUpdated' },
  'leave:updated': { reader: hrReader, field: 'leaveUpdated' },
  'payroll:updated': { reader: hrReader, field: 'payrollUpdated' },
  'penalty:updated': { reader: hrReader, field: 'penaltyUpdated' },
  // System tab
  'payment:received': { reader: systemReader, field: 'paymentReceived' },
  'payment:overdue': { reader: systemReader, field: 'paymentOverdue' },
  'receipt:updated': { reader: systemReader, field: 'receiptUpdated' },
  'comment:created': { reader: systemReader, field: 'commentCreated' },
}

/** Module prefixes that have their own inAppNotifications toggle */
type ModulePrefix = 'task' | 'complaint' | 'warranty'

async function isModuleInAppEnabled(prefix: ModulePrefix): Promise<boolean> {
  switch (prefix) {
    case 'task': return (await getTaskNotificationSettings()).inAppNotifications
    case 'complaint': return (await getComplaintNotificationSettings()).inAppNotifications
    case 'warranty': return (await getWarrantyNotificationSettings()).inAppNotifications
  }
}

/**
 * Check if notification should be sent based on settings.
 * Returns false if master switch is off or specific event is disabled.
 *
 * Supports three key formats:
 * - Event keys: 'order:created', 'stock-transfer:updated' → checks event-level toggle + module inApp
 * - Module keys: 'task:assigned', 'complaint:created', 'warranty:created' → checks module inAppNotifications
 */
export async function shouldNotify(settingsKey?: string): Promise<boolean> {
  const general = await getGeneralNotificationSettings()
  if (!general.enabled) return false
  if (!settingsKey) return true

  // General due-date category gates — respect Cài đặt → Thông báo → Chung
  // Any settingsKey ending in these suffixes must also pass the corresponding
  // general toggle (notifyOverdue/notifyDueToday/…).
  const suffix = settingsKey.split(':').pop() ?? ''
  if (suffix === 'overdue' && !general.notifyOverdue) return false
  if (suffix === 'dueToday' && !general.notifyDueToday) return false
  if (suffix === 'dueTomorrow' && !general.notifyDueTomorrow) return false
  if (suffix === 'dueSoon' && !general.notifyDueSoon) return false

  // Check unified settings map (Sales, Warehouse, HR, System)
  const mapping = NOTIFICATION_SETTINGS_MAP[settingsKey]
  if (mapping) {
    const settings = await mapping.reader()
    // Check module-level inAppNotifications toggle if present
    if ('inAppNotifications' in settings && !settings.inAppNotifications) return false
    // Check event-level toggle
    return !!settings[mapping.field]
  }

  // Check module-level inAppNotifications (task:*, complaint:*, warranty:*)
  const prefix = settingsKey.split(':')[0] as ModulePrefix
  if (prefix === 'task' || prefix === 'complaint' || prefix === 'warranty') {
    return isModuleInAppEnabled(prefix)
  }

  return true
}

/**
 * Master gate for outbound email notifications.
 * Honors the General master toggle at `/settings/notifications` → Chung.
 *
 * Call this at the top of every module email sender (tasks, complaints, warranty, …)
 * before evaluating module-specific flags. Returns `false` when the master switch is off
 * so users can confidently mute the whole system from one place.
 */
export async function areEmailNotificationsEnabled(): Promise<boolean> {
  const general = await getGeneralNotificationSettings()
  return !!general.enabled
}

export interface CreateNotificationInput {
  type: string
  title: string
  message: string
  link?: string
  recipientId: string
  senderId?: string
  senderName?: string
  metadata?: Prisma.InputJsonValue
  /** Optional settings key to check before sending (e.g., 'order:created') */
  settingsKey?: string
}

export interface CreateBulkNotificationInput {
  type: string
  title: string
  message: string
  link?: string
  recipientIds: string[]
  senderId?: string
  senderName?: string
  metadata?: Prisma.InputJsonValue
  /** Optional settings key to check before sending (e.g., 'order:created') */
  settingsKey?: string
}

/**
 * Create a single notification (server-side only)
 */
export async function createNotification(input: CreateNotificationInput) {
  try {
    // Check settings before creating
    if (!(await shouldNotify(input.settingsKey))) return null

    return await prisma.notification.create({
      data: {
        type: input.type,
        title: input.title,
        message: input.message,
        link: input.link,
        recipientId: input.recipientId,
        senderId: input.senderId,
        senderName: input.senderName,
        metadata: input.metadata ?? undefined,
      },
    })
  } catch (error) {
    logError('[Notification] Failed to create notification', error)
    return null
  }
}

/**
 * Create notifications for multiple recipients (server-side only)
 */
export async function createBulkNotifications(input: CreateBulkNotificationInput) {
  try {
    if (input.recipientIds.length === 0) return { count: 0 }

    // Check settings before creating
    if (!(await shouldNotify(input.settingsKey))) return { count: 0 }

    // Filter out sender from recipients (don't notify yourself)
    const recipients = input.senderId
      ? input.recipientIds.filter(id => id !== input.senderId)
      : input.recipientIds

    if (recipients.length === 0) return { count: 0 }

    return await prisma.notification.createMany({
      data: recipients.map(recipientId => ({
        type: input.type,
        title: input.title,
        message: input.message,
        link: input.link,
        recipientId,
        senderId: input.senderId,
        senderName: input.senderName,
        metadata: input.metadata ?? undefined,
      })),
    })
  } catch (error) {
    logError('[Notification] Failed to create bulk notifications', error)
    return { count: 0 }
  }
}

/**
 * Get unread notification count for a user (server-side only)
 */
export async function getUnreadCount(recipientId: string): Promise<number> {
  try {
    return await prisma.notification.count({
      where: { recipientId, isRead: false },
    })
  } catch (error) {
    logError('[Notification] Failed to get unread count', error)
    return 0
  }
}
