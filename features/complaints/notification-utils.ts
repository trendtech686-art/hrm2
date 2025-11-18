import { toast } from "sonner";

// Storage key
const STORAGE_KEY = 'complaints-notification-settings';

// Default notification settings
const defaultNotifications = {
  emailOnCreate: true,
  emailOnAssign: true,
  emailOnVerified: false,
  emailOnResolved: true,
  emailOnOverdue: true,
  smsOnOverdue: false,
  inAppNotifications: true,
};

interface NotificationSettings {
  emailOnCreate: boolean;
  emailOnAssign: boolean;
  emailOnVerified: boolean;
  emailOnResolved: boolean;
  emailOnOverdue: boolean;
  smsOnOverdue: boolean;
  inAppNotifications: boolean;
}

/**
 * Load notification settings from localStorage
 */
function loadNotificationSettings(): NotificationSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultNotifications;
  } catch {
    return defaultNotifications;
  }
}

/**
 * Show toast notification based on settings
 */
export function showNotification(
  type: 'success' | 'error' | 'info',
  message: string,
  options?: { id?: string | number; description?: string }
) {
  const settings = loadNotificationSettings();
  
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
    }
  }
}

/**
 * Show loading toast (always shown regardless of settings)
 */
export function showLoading(message: string) {
  return toast.loading(message);
}

/**
 * Check if a specific notification event is enabled
 */
export function isNotificationEnabled(event: keyof NotificationSettings): boolean {
  const settings = loadNotificationSettings();
  return settings[event] || false;
}

/**
 * Wrapper functions for specific complaint events
 */
export const complaintNotifications = {
  onCreate: (message: string = "Đã tạo khiếu nại mới") => {
    if (isNotificationEnabled('emailOnCreate')) {
      showNotification('success', message);
      // TODO: Send email notification here
    }
  },
  
  onAssign: (message: string = "Đã giao việc cho nhân viên") => {
    if (isNotificationEnabled('emailOnAssign')) {
      showNotification('success', message);
      // TODO: Send email notification here
    }
  },
  
  onVerified: (message: string = "Đã xác minh khiếu nại") => {
    if (isNotificationEnabled('emailOnVerified')) {
      showNotification('success', message);
      // TODO: Send email notification here
    }
  },
  
  onResolved: (message: string = "Đã giải quyết khiếu nại") => {
    if (isNotificationEnabled('emailOnResolved')) {
      showNotification('success', message);
      // TODO: Send email notification here
    }
  },
  
  onOverdue: (message: string) => {
    if (isNotificationEnabled('emailOnOverdue')) {
      showNotification('error', message, { description: 'Vui lòng xử lý nhanh' });
      // TODO: Send email notification here
    }
    
    if (isNotificationEnabled('smsOnOverdue')) {
      // TODO: Send SMS notification here
      console.log('SMS notification would be sent:', message);
    }
  },
};
