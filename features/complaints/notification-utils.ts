import { toast } from "sonner";
import type { ComplaintNotificationSettings } from '@/features/settings/notifications/types';

// Default notification settings (hardcoded — server settings are in features/settings/notifications/types.ts)
const defaultNotifications: ComplaintNotificationSettings = {
  emailOnCreate: true,
  emailOnAssign: true,
  emailOnVerified: false,
  emailOnResolved: true,
  emailOnOverdue: true,
  inAppNotifications: true,
};

/**
 * Show toast notification based on settings
 */
export function showNotification(
  type: 'success' | 'error' | 'info',
  message: string,
  options?: { id?: string | number; description?: string }
) {
  // Always show — inAppNotifications defaults to true
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

/**
 * Check if a specific notification event is enabled
 */
function isNotificationEnabled(event: keyof ComplaintNotificationSettings): boolean {
  return defaultNotifications[event] || false;
}

/**
 * Send email notification for complaint events.
 * Placeholder implementation — integrate with email service (e.g., Resend, SendGrid, AWS SES).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function _sendEmailNotification(to: string, subject: string, body: string): Promise<void> {
  // TODO: Integrate with email service
  // Example: await fetch('/api/notifications/email', { method: 'POST', body: JSON.stringify({ to, subject, body }) });
  console.warn(`[EMAIL] To: ${to}, Subject: ${subject}`);
}

/**
 * Wrapper functions for specific complaint events
 */
export const complaintNotifications = {
  onCreate: (message: string = "Đã tạo khiếu nại mới") => {
    if (isNotificationEnabled('emailOnCreate')) {
      showNotification('success', message);
      // TODO: Send email notification here
      // sendEmailNotification('admin@example.com', 'Khiếu nại mới', message);
    }
  },
  
  onAssign: (message: string = "Đã giao việc cho nhân viên") => {
    if (isNotificationEnabled('emailOnAssign')) {
      showNotification('success', message);
      // TODO: Send email notification here
      // sendEmailNotification('staff@example.com', 'Công việc mới', message);
    }
  },
  
  onVerified: (message: string = "Đã xác minh khiếu nại") => {
    if (isNotificationEnabled('emailOnVerified')) {
      showNotification('success', message);
      // TODO: Send email notification here
      // sendEmailNotification('customer@example.com', 'Khiếu nại đã xác minh', message);
    }
  },
  
  onResolved: (message: string = "Đã giải quyết khiếu nại") => {
    if (isNotificationEnabled('emailOnResolved')) {
      showNotification('success', message);
      // TODO: Send email notification here
      // sendEmailNotification('customer@example.com', 'Khiếu nại đã giải quyết', message);
    }
  },
  
  onOverdue: (message: string) => {
    if (isNotificationEnabled('emailOnOverdue')) {
      showNotification('error', message, { description: 'Vui lòng xử lý nhanh' });
    }
  },
};
