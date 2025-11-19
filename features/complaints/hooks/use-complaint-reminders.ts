/**
 * ============================================
 * COMPLAINT AUTO-REMINDER HOOK
 * ============================================
 * Tự động nhắc nhở khi khiếu nại không có hành động sau X giờ
 * - Track last action time
 * - Send notifications khi quá thời gian
 * - Support multiple reminder levels
 */

import * as React from 'react';
import { toast } from 'sonner';
import type { Complaint } from '../types';
import { useNotificationStore } from '../../../components/ui/notification-center.tsx';

export interface ReminderSettings {
  enabled: boolean;
  intervals: {
    firstReminder: number; // hours - Nhắc nhở lần 1
    secondReminder: number; // hours - Nhắc nhở lần 2
    escalation: number; // hours - Escalate lên manager
  };
  notifyAssignee: boolean; // Gửi thông báo cho người được giao
  notifyCreator: boolean; // Gửi thông báo cho người tạo
  notifyManager: boolean; // Gửi thông báo cho manager khi escalate
}

export interface ReminderStatus {
  needsAction: boolean;
  hoursIdle: number; // Số giờ không có hành động
  lastActionAt: Date | null;
  reminderLevel: 'none' | 'first' | 'second' | 'escalated';
  message: string;
}

// Load reminder settings from localStorage
function loadReminderSettings(): ReminderSettings {
  try {
    const stored = localStorage.getItem('complaints-reminder-settings');
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load reminder settings:', e);
  }
  
  // Default settings
  return {
    enabled: true,
    intervals: {
      firstReminder: 4, // 4 hours
      secondReminder: 8, // 8 hours
      escalation: 24, // 24 hours
    },
    notifyAssignee: true,
    notifyCreator: true,
    notifyManager: true,
  };
}

// Save reminder settings
export function saveReminderSettings(settings: ReminderSettings): void {
  try {
    localStorage.setItem('complaints-reminder-settings', JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save reminder settings:', e);
  }
}

/**
 * Calculate hours since last action
 */
function getHoursSinceLastAction(complaint: Complaint): number {
  if (!complaint.timeline || complaint.timeline.length === 0) {
    // No actions yet, use createdAt
    const createdAt = new Date(complaint.createdAt);
    const now = new Date();
    return (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
  }
  
  // Get last action (timeline is sorted newest first in some cases, oldest first in others)
  // We need to find the most recent action
  const sortedTimeline = [...complaint.timeline].sort((a, b) => {
    const dateA = new Date(a.performedAt).getTime();
    const dateB = new Date(b.performedAt).getTime();
    return dateB - dateA; // Newest first
  });
  
  const lastAction = sortedTimeline[0];
  const lastActionTime = new Date(lastAction.performedAt);
  const now = new Date();
  
  return (now.getTime() - lastActionTime.getTime()) / (1000 * 60 * 60);
}

/**
 * Get last action date
 */
function getLastActionDate(complaint: Complaint): Date | null {
  if (!complaint.timeline || complaint.timeline.length === 0) {
    return new Date(complaint.createdAt);
  }
  
  const sortedTimeline = [...complaint.timeline].sort((a, b) => {
    const dateA = new Date(a.performedAt).getTime();
    const dateB = new Date(b.performedAt).getTime();
    return dateB - dateA;
  });
  
  return new Date(sortedTimeline[0].performedAt);
}

/**
 * Check if complaint needs action
 */
export function checkComplaintReminder(
  complaint: Complaint | null,
  settings: ReminderSettings = loadReminderSettings()
): ReminderStatus {
  if (!complaint || !settings.enabled) {
    return {
      needsAction: false,
      hoursIdle: 0,
      lastActionAt: null,
      reminderLevel: 'none',
      message: '',
    };
  }
  
  // Only track active complaints (not resolved/rejected)
  if (complaint.status === 'resolved' || complaint.status === 'ended' || complaint.status === 'cancelled') {
    return {
      needsAction: false,
      hoursIdle: 0,
      lastActionAt: getLastActionDate(complaint),
      reminderLevel: 'none',
      message: 'Khiếu nại đã đóng',
    };
  }
  
  const hoursIdle = getHoursSinceLastAction(complaint);
  const lastActionAt = getLastActionDate(complaint);
  
  // Determine reminder level
  let reminderLevel: 'none' | 'first' | 'second' | 'escalated' = 'none';
  let needsAction = false;
  let message = '';
  
  if (hoursIdle >= settings.intervals.escalation) {
    reminderLevel = 'escalated';
    needsAction = true;
    message = `⚠️ KHẨN CẤP: Không có hành động trong ${Math.floor(hoursIdle)} giờ! Cần escalate ngay.`;
  } else if (hoursIdle >= settings.intervals.secondReminder) {
    reminderLevel = 'second';
    needsAction = true;
    message = `⚡ Nhắc nhở lần 2: Không có hành động trong ${Math.floor(hoursIdle)} giờ.`;
  } else if (hoursIdle >= settings.intervals.firstReminder) {
    reminderLevel = 'first';
    needsAction = true;
    message = `💡 Nhắc nhở: Không có hành động trong ${Math.floor(hoursIdle)} giờ.`;
  }
  
  return {
    needsAction,
    hoursIdle,
    lastActionAt,
    reminderLevel,
    message,
  };
}

/**
 * Hook to monitor complaint and send reminders
 */
export function useComplaintReminders(complaint: Complaint | null) {
  const { addNotification } = useNotificationStore();
  const [settings] = React.useState<ReminderSettings>(() => loadReminderSettings());
  const [reminderStatus, setReminderStatus] = React.useState<ReminderStatus>(() => 
    checkComplaintReminder(complaint, settings)
  );
  
  // Track last reminder sent to avoid spam
  const lastReminderSent = React.useRef<{
    level: string;
    timestamp: number;
  } | null>(null);
  
  // Check and update reminder status every minute
  React.useEffect(() => {
    if (!complaint || !settings.enabled) return;
    
    const checkInterval = setInterval(() => {
      const status = checkComplaintReminder(complaint, settings);
      setReminderStatus(status);
      
      // Send notification if needed
      if (status.needsAction && status.reminderLevel !== 'none') {
        const now = Date.now();
        const lastSent = lastReminderSent.current;
        
        // Only send if:
        // 1. No reminder sent before, OR
        // 2. Reminder level changed, OR
        // 3. More than 1 hour since last reminder
        const shouldSend = 
          !lastSent || 
          lastSent.level !== status.reminderLevel ||
          (now - lastSent.timestamp) > 60 * 60 * 1000;
        
        if (shouldSend) {
          sendReminder(complaint, status, settings, addNotification);
          lastReminderSent.current = {
            level: status.reminderLevel,
            timestamp: now,
          };
        }
      }
    }, 60 * 1000); // Check every minute
    
    return () => clearInterval(checkInterval);
  }, [complaint?.systemId, settings.enabled, addNotification]);
  
  return reminderStatus;
}

/**
 * Send reminder notification
 */
function sendReminder(
  complaint: Complaint,
  status: ReminderStatus,
  settings: ReminderSettings,
  addNotification: (notification: any) => void
) {
  const recipients: string[] = [];
  
  // Add assignee
  if (settings.notifyAssignee && complaint.assignedTo) {
    recipients.push(complaint.assignedTo);
  }
  
  // Add creator
  if (settings.notifyCreator && complaint.createdBy) {
    recipients.push(complaint.createdBy);
  }
  
  // Add manager for escalation (simplified: send to creator who is usually manager)
  if (status.reminderLevel === 'escalated' && settings.notifyManager && complaint.createdBy) {
    recipients.push(complaint.createdBy);
  }
  
  // Send to each recipient
  recipients.forEach(recipientId => {
    addNotification({
      type: status.reminderLevel === 'escalated' ? 'alert' : 'warning',
      title: `Nhắc nhở: ${complaint.id}`,
      message: status.message,
      link: `/complaints/${complaint.systemId}`,
      createdBy: 'SYSTEM',
      metadata: {
        recipientId,
        complaintId: complaint.systemId,
        reminderLevel: status.reminderLevel,
        hoursIdle: status.hoursIdle,
      },
    });
  });
  
  // Also show toast for current user
  if (status.reminderLevel === 'escalated') {
    toast.error(status.message, {
      description: `Khiếu nại ${complaint.id} cần xử lý ngay!`,
      duration: 10000,
    });
  } else if (status.reminderLevel === 'second') {
    toast.warning(status.message, {
      description: `Khiếu nại ${complaint.id}`,
      duration: 5000,
    });
  }
}

/**
 * Format idle time for display
 */
export function formatIdleTime(hours: number): string {
  if (hours < 1) {
    return `${Math.floor(hours * 60)} phút`;
  } else if (hours < 24) {
    return `${Math.floor(hours)} giờ`;
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    return `${days} ngày ${remainingHours} giờ`;
  }
}

/**
 * Get reminder color based on level
 */
export function getReminderColor(level: ReminderStatus['reminderLevel']): string {
  switch (level) {
    case 'escalated':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'second':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'first':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    default:
      return '';
  }
}
