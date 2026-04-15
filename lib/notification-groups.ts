/**
 * Notification Groups — Mapping notification types to 4 display groups
 *
 * Groups: Đơn hàng | Vận chuyển | Kho hàng | Hệ thống
 */

export type NotificationGroup = 'orders' | 'shipping' | 'inventory' | 'system'

/**
 * Map each notification type → group
 */
const TYPE_TO_GROUP: Record<string, NotificationGroup> = {
  // Đơn hàng
  order: 'orders',
  warranty: 'orders',
  complaint: 'orders',
  sales_return: 'orders',
  customer: 'orders',

  // Vận chuyển
  shipment: 'shipping',
  reconciliation: 'shipping',

  // Kho hàng
  stock_transfer: 'inventory',
  inventory: 'inventory',
  inventory_check: 'inventory',
  inventory_receipt: 'inventory',
  cost_adjustment: 'inventory',
  price_adjustment: 'inventory',
  purchase_order: 'inventory',
  purchase_return: 'inventory',

  // Hệ thống
  system: 'system',
  task: 'system',
  comment: 'system',
  attendance: 'system',
  leave: 'system',
  payroll: 'system',
  penalty: 'system',
  employee: 'system',
  payment: 'system',
  receipt: 'system',
}

/**
 * Get group for a notification type. Defaults to 'system' for unknown types.
 */
export function getNotificationGroup(type: string): NotificationGroup {
  return TYPE_TO_GROUP[type] ?? 'system'
}

/**
 * Get all notification types belonging to a group
 */
export function getTypesForGroup(group: NotificationGroup): string[] {
  return Object.entries(TYPE_TO_GROUP)
    .filter(([, g]) => g === group)
    .map(([type]) => type)
}

/**
 * Group metadata for UI display
 */
export const NOTIFICATION_GROUP_META: Record<
  NotificationGroup,
  { label: string; icon: string }
> = {
  orders: { label: 'Đơn hàng', icon: 'shopping-cart' },
  shipping: { label: 'Vận chuyển', icon: 'truck' },
  inventory: { label: 'Kho hàng', icon: 'warehouse' },
  system: { label: 'Hệ thống', icon: 'settings' },
}
