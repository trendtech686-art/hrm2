// ============================================
// NOTIFICATION SETTINGS TYPES
// ============================================

export interface TaskNotificationSettings {
  emailOnCreate: boolean;
  emailOnAssign: boolean;
  emailOnComplete: boolean;
  emailOnOverdue: boolean;
  emailOnApprovalPending: boolean;
  inAppNotifications: boolean;
}

export interface TaskReminderSettings {
  enabled: boolean;
  firstReminderHours: number;
  secondReminderHours: number;
  escalationHours: number;
}

export interface ComplaintNotificationSettings {
  emailOnCreate: boolean;
  emailOnAssign: boolean;
  emailOnVerified: boolean;
  emailOnResolved: boolean;
  emailOnOverdue: boolean;
  inAppNotifications: boolean;
}

export interface ComplaintReminderSettings {
  enabled: boolean;
  firstReminderHours: number;
  secondReminderHours: number;
  escalationHours: number;
}

export interface WarrantyNotificationSettings {
  emailOnCreate: boolean;
  emailOnAssign: boolean;
  emailOnInspected: boolean;
  emailOnApproved: boolean;
  emailOnRejected: boolean;
  emailOnOverdue: boolean;
  inAppNotifications: boolean;
}

export interface GeneralNotificationSettings {
  enabled: boolean;
  notifyOverdue: boolean;
  notifyDueToday: boolean;
  notifyDueTomorrow: boolean;
  notifyDueSoon: boolean;
  showDesktopNotification: boolean;
  playSound: boolean;
}

export interface SalesNotificationSettings {
  orderCreated: boolean;
  orderStatusChanged: boolean;
  orderAssigned: boolean;
  orderCancelled: boolean;
  packagingUpdated: boolean;
  shipmentUpdated: boolean;
  deliveryUpdated: boolean;
  salesReturnUpdated: boolean;
  customerCreated: boolean;
  reconciliationUpdated: boolean;
  inAppNotifications: boolean;
}

export interface WarehouseNotificationSettings {
  stockTransferUpdated: boolean;
  inventoryCheckUpdated: boolean;
  costAdjustmentUpdated: boolean;
  priceAdjustmentUpdated: boolean;
  purchaseOrderUpdated: boolean;
  purchaseReturnUpdated: boolean;
  inventoryReceiptUpdated: boolean;
  lowStockAlert: boolean;
  lowStockThreshold: number;
  inAppNotifications: boolean;
}

export interface HrNotificationSettings {
  employeeCreated: boolean;
  attendanceUpdated: boolean;
  leaveUpdated: boolean;
  payrollUpdated: boolean;
  penaltyUpdated: boolean;
  inAppNotifications: boolean;
}

export interface SystemNotificationSettings {
  paymentReceived: boolean;
  paymentOverdue: boolean;
  receiptUpdated: boolean;
  commentCreated: boolean;
  dailySummaryEmail: boolean;
}

// ============================================
// DEFAULT VALUES
// ============================================

export const defaultTaskNotifications: TaskNotificationSettings = {
  emailOnCreate: true,
  emailOnAssign: true,
  emailOnComplete: true,
  emailOnOverdue: true,
  emailOnApprovalPending: true,
  inAppNotifications: true,
};

export const defaultTaskReminders: TaskReminderSettings = {
  enabled: true,
  firstReminderHours: 8,
  secondReminderHours: 24,
  escalationHours: 48,
};

export const defaultComplaintNotifications: ComplaintNotificationSettings = {
  emailOnCreate: true,
  emailOnAssign: true,
  emailOnVerified: true,
  emailOnResolved: true,
  emailOnOverdue: true,
  inAppNotifications: true,
};

export const defaultComplaintReminders: ComplaintReminderSettings = {
  enabled: true,
  firstReminderHours: 8,
  secondReminderHours: 24,
  escalationHours: 48,
};

export const defaultWarrantyNotifications: WarrantyNotificationSettings = {
  emailOnCreate: true,
  emailOnAssign: true,
  emailOnInspected: false,
  emailOnApproved: true,
  emailOnRejected: true,
  emailOnOverdue: true,
  inAppNotifications: true,
};

export const defaultGeneralNotifications: GeneralNotificationSettings = {
  enabled: true,
  notifyOverdue: true,
  notifyDueToday: true,
  notifyDueTomorrow: true,
  notifyDueSoon: true,
  showDesktopNotification: false,
  playSound: false,
};

export const defaultSalesNotifications: SalesNotificationSettings = {
  orderCreated: true,
  orderStatusChanged: true,
  orderAssigned: true,
  orderCancelled: true,
  packagingUpdated: true,
  shipmentUpdated: true,
  deliveryUpdated: true,
  salesReturnUpdated: true,
  customerCreated: true,
  reconciliationUpdated: true,
  inAppNotifications: true,
};

export const defaultWarehouseNotifications: WarehouseNotificationSettings = {
  stockTransferUpdated: true,
  inventoryCheckUpdated: true,
  costAdjustmentUpdated: true,
  priceAdjustmentUpdated: true,
  purchaseOrderUpdated: true,
  purchaseReturnUpdated: true,
  inventoryReceiptUpdated: true,
  lowStockAlert: true,
  lowStockThreshold: 10,
  inAppNotifications: true,
};

export const defaultHrNotifications: HrNotificationSettings = {
  employeeCreated: true,
  attendanceUpdated: true,
  leaveUpdated: true,
  payrollUpdated: true,
  penaltyUpdated: true,
  inAppNotifications: true,
};

export const defaultSystemNotifications: SystemNotificationSettings = {
  paymentReceived: true,
  paymentOverdue: true,
  receiptUpdated: true,
  commentCreated: true,
  dailySummaryEmail: false,
};
