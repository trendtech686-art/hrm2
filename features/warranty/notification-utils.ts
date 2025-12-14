/**
 * Warranty Notification Utilities
 * Handle notification settings and events for warranty tickets
 * Pattern copied from Complaints notification system
 */

import { toast } from "sonner";

// Storage key
const STORAGE_KEY = 'warranty-notification-settings';

// Default notification settings
const defaultNotifications = {
  emailOnCreate: true,
  emailOnAssign: true,
  emailOnProcessing: false,
  emailOnProcessed: true,
  emailOnReturned: true,
  emailOnOverdue: true,
  smsOnOverdue: false,
  inAppNotifications: true,
  reminderNotifications: true,
};

export interface WarrantyNotificationSettings {
  emailOnCreate: boolean;         // Tạo phiếu mới
  emailOnAssign: boolean;         // Gán nhân viên
  emailOnProcessing: boolean;     // Bắt đầu xử lý
  emailOnProcessed: boolean;      // Xử lý xong
  emailOnReturned: boolean;       // Đã trả hàng
  emailOnOverdue: boolean;        // Quá hạn
  smsOnOverdue: boolean;          // SMS cảnh báo quá hạn
  inAppNotifications: boolean;    // Thông báo trong app
  reminderNotifications: boolean; // Nhận nhắc nhở
}

/**
 * Load notification settings from localStorage
 */
export function loadWarrantyNotificationSettings(): WarrantyNotificationSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultNotifications;
  } catch {
    return defaultNotifications;
  }
}

/**
 * Save notification settings to localStorage
 */
export function saveWarrantyNotificationSettings(settings: WarrantyNotificationSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save warranty notification settings:', error);
  }
}

/**
 * Show toast notification based on settings
 */
export function showWarrantyNotification(
  type: 'success' | 'error' | 'info' | 'warning',
  message: string,
  options?: { id?: string | number; description?: string | undefined; duration?: number }
) {
  const settings = loadWarrantyNotificationSettings();
  
  // Always show if inAppNotifications is enabled
  if (settings.inAppNotifications) {
    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'info':
        toast.info(message, options);
        break;
      case 'warning':
        toast.warning(message, options);
        break;
    }
  }
}

/**
 * Show loading toast (always shown regardless of settings)
 */
export function showWarrantyLoading(message: string) {
  return toast.loading(message);
}

/**
 * Check if a specific notification event is enabled
 */
export function isWarrantyNotificationEnabled(event: keyof WarrantyNotificationSettings): boolean {
  const settings = loadWarrantyNotificationSettings();
  return settings[event] || false;
}

/**
 * Wrapper functions for specific warranty events
 */

export function notifyWarrantyCreated(ticketId: string) {
  if (isWarrantyNotificationEnabled('emailOnCreate')) {
    showWarrantyNotification('success', `Đã tạo phiếu bảo hành ${ticketId}`, {
      description: 'Phiếu mới đã được tạo thành công',
    });
  }
}

export function notifyWarrantyAssigned(ticketId: string, employeeName: string) {
  if (isWarrantyNotificationEnabled('emailOnAssign')) {
    showWarrantyNotification('info', `Phiếu ${ticketId} được gán cho ${employeeName}`, {
      description: 'Đã cập nhật người phụ trách',
    });
  }
}

export function notifyWarrantyProcessing(ticketId: string) {
  if (isWarrantyNotificationEnabled('emailOnProcessing')) {
    showWarrantyNotification('info', `Phiếu ${ticketId} đang được xử lý`, {
      description: 'Nhân viên đã bắt đầu xử lý phiếu',
    });
  }
}

export function notifyWarrantyProcessed(ticketId: string) {
  if (isWarrantyNotificationEnabled('emailOnProcessed')) {
    showWarrantyNotification('success', `Phiếu ${ticketId} đã xử lý xong`, {
      description: 'Sản phẩm sẵn sàng để trả khách',
    });
  }
}

export function notifyWarrantyReturned(ticketId: string, orderId?: string) {
  if (isWarrantyNotificationEnabled('emailOnReturned')) {
    showWarrantyNotification('success', `Phiếu ${ticketId} đã trả hàng`, {
      description: orderId ? `Liên kết với đơn hàng ${orderId}` : 'Đã hoàn tất quy trình',
    });
  }
}

export function notifyWarrantyOverdue(ticketId: string, type: 'response' | 'processing' | 'return') {
  if (isWarrantyNotificationEnabled('emailOnOverdue')) {
    const typeLabels = {
      response: 'phản hồi',
      processing: 'xử lý',
      return: 'trả hàng',
    };
    
    showWarrantyNotification('warning', `Phiếu ${ticketId} quá hạn ${typeLabels[type]}`, {
      description: 'Vui lòng kiểm tra và xử lý ngay',
      duration: 10000, // Show longer for overdue warnings
    });
  }
}

export function notifyWarrantyReminder(ticketId: string, message: string) {
  if (isWarrantyNotificationEnabled('reminderNotifications')) {
    showWarrantyNotification('info', `Nhắc nhở: ${ticketId}`, {
      description: message,
      duration: 8000,
    });
  }
}

export function notifyWarrantyStatusChange(ticketId: string, oldStatus: string, newStatus: string) {
  showWarrantyNotification('info', `Phiếu ${ticketId} đã chuyển trạng thái`, {
    description: `${oldStatus} → ${newStatus}`,
  });
}

/**
 * Batch notification for multiple tickets
 */
export function notifyWarrantyBulkAction(action: string, count: number) {
  showWarrantyNotification('success', `Đã ${action} ${count} phiếu bảo hành`, {
    description: 'Thao tác hàng loạt thành công',
  });
}

/**
 * Error notification
 */
export function notifyWarrantyError(message: string, details?: string) {
  showWarrantyNotification('error', message, {
    description: details,
    duration: 5000,
  });
}

/**
 * Get notification summary for dashboard
 */
export function getWarrantyNotificationSummary() {
  const settings = loadWarrantyNotificationSettings();
  const enabledCount = Object.values(settings).filter(Boolean).length;
  const totalCount = Object.keys(settings).length;
  
  return {
    enabled: enabledCount,
    total: totalCount,
    percentage: Math.round((enabledCount / totalCount) * 100),
  };
}
