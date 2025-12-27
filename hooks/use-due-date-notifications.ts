/**
 * Due Date Notifications Hook
 * Manages automatic notifications for tasks with approaching due dates
 * 
 * Generic hook - can be used with any entity that has dueDate field
 */

import { useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { AlertTriangle, Clock, Calendar } from 'lucide-react';

type TaskWithDueDate = {
  id?: string;
  systemId: string;
  dueDate?: Date | string;
  status?: string;
  customerName?: string;
  employeeName?: string;
  [key: string]: any;
};

type DueDateWarning = {
  severity: 'none' | 'info' | 'warning' | 'critical' | 'overdue';
  status?: 'overdue' | 'due-today' | 'due-tomorrow' | 'due-soon' | 'normal';
  message: string;
  daysRemaining: number;
};

type NotificationSettings = {
  enabled: boolean;
  checkInterval: number; // minutes
  notifyOverdue: boolean;
  notifyDueToday: boolean;
  notifyDueTomorrow: boolean;
  notifyDueSoon: boolean; // within 3 days
  playSound: boolean;
  showDesktopNotification: boolean;
  completedStatuses?: string[]; // Statuses to consider as completed
  linkPrefix?: string; // URL prefix for "View" action (e.g., "/warranty/", "/orders/")
};

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  checkInterval: 30, // Check every 30 minutes
  notifyOverdue: true,
  notifyDueToday: true,
  notifyDueTomorrow: true,
  notifyDueSoon: true,
  playSound: false,
  showDesktopNotification: false,
  completedStatuses: ['returned', 'completed', 'cancelled'],
  linkPrefix: '/warranty/',
};

// Helper functions (moved from warranty utils)
function getDaysUntilDue(dueDate: Date | string): number {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getDueDateWarning(dueDate: Date | string): DueDateWarning {
  const daysRemaining = getDaysUntilDue(dueDate);
  
  if (daysRemaining < 0) {
    return {
      severity: 'overdue',
      status: 'overdue',
      message: `Quá hạn ${Math.abs(daysRemaining)} ngày`,
      daysRemaining,
    };
  }
  
  if (daysRemaining === 0) {
    return {
      severity: 'critical',
      status: 'due-today',
      message: 'Hôm nay',
      daysRemaining,
    };
  }
  
  if (daysRemaining === 1) {
    return {
      severity: 'critical',
      status: 'due-tomorrow',
      message: 'Ngày mai',
      daysRemaining,
    };
  }
  
  if (daysRemaining <= 3) {
    return {
      severity: 'critical',
      status: 'due-soon',
      message: `Còn ${daysRemaining} ngày`,
      daysRemaining,
    };
  }
  
  if (daysRemaining <= 7) {
    return {
      severity: 'warning',
      status: 'normal',
      message: `Còn ${daysRemaining} ngày`,
      daysRemaining,
    };
  }
  
  return {
    severity: 'info',
    status: 'normal',
    message: `Còn ${daysRemaining} ngày`,
    daysRemaining,
  };
}

function getTasksNeedingNotification(
  tasks: TaskWithDueDate[],
  completedStatuses: string[] = ['returned', 'completed', 'cancelled']
): TaskWithDueDate[] {
  return tasks.filter(task => {
    if (!task.dueDate) return false;
    if (task.status && completedStatuses.includes(task.status)) return false;
    
    const warning = getDueDateWarning(task.dueDate);
    return ['overdue', 'due-today', 'due-tomorrow', 'due-soon'].includes(warning.status || '');
  });
}

function getDueDateNotificationMessage(task: TaskWithDueDate): string {
  if (!task.dueDate) return '';
  
  const warning = getDueDateWarning(task.dueDate);
  const prefix = `[${task.systemId}]`;
  
  switch (warning.status) {
    case 'overdue':
      return `${prefix} Công việc quá hạn ${Math.abs(warning.daysRemaining)} ngày`;
    case 'due-today':
      return `${prefix} Công việc đến hạn hôm nay`;
    case 'due-tomorrow':
      return `${prefix} Công việc đến hạn ngày mai`;
    case 'due-soon':
      return `${prefix} Công việc còn ${warning.daysRemaining} ngày`;
    default:
      return `${prefix} ${warning.message}`;
  }
}

// Track notified tasks to avoid duplicate notifications
const notifiedTasks = new Set<string>();

export function useDueDateNotifications(
  tasks: TaskWithDueDate[],
  settings: Partial<NotificationSettings> = {}
) {
  const mergedSettings = { ...DEFAULT_SETTINGS, ...settings };
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkAndNotify = useCallback(() => {
    if (!mergedSettings.enabled) return;

    const tasksToNotify = getTasksNeedingNotification(
      tasks,
      mergedSettings.completedStatuses
    );

    tasksToNotify.forEach(task => {
      if (!task.dueDate) return;
      
      const warning = getDueDateWarning(task.dueDate);
      const taskKey = `${task.systemId}-${warning.status}`;

      // Skip if already notified for this status
      if (notifiedTasks.has(taskKey)) return;

      // Check if this warning type should be notified
      const shouldNotify = 
        (warning.status === 'overdue' && mergedSettings.notifyOverdue) ||
        (warning.status === 'due-today' && mergedSettings.notifyDueToday) ||
        (warning.status === 'due-tomorrow' && mergedSettings.notifyDueTomorrow) ||
        (warning.status === 'due-soon' && mergedSettings.notifyDueSoon);

      if (!shouldNotify) return;

      // Show toast notification
      const message = getDueDateNotificationMessage(task);
      
      const toastOptions: any = {
        description: `${task.customerName ? `KH: ${task.customerName}` : ''}${task.employeeName ? ` | NV: ${task.employeeName}` : ''}`,
        duration: warning.status === 'overdue' ? 10000 : 5000,
        action: {
          label: 'Xem',
          onClick: () => {
            const linkPrefix = mergedSettings.linkPrefix || '/warranty/';
            window.location.href = `${linkPrefix}${task.systemId}`;
          },
        },
      };

      switch (warning.status) {
        case 'overdue':
          toast.error(message, toastOptions);
          break;
        case 'due-today':
          toast.warning(message, toastOptions);
          break;
        case 'due-tomorrow':
        case 'due-soon':
          toast.info(message, toastOptions);
          break;
      }

      // Mark as notified
      notifiedTasks.add(taskKey);

      // Desktop notification (if enabled and permitted)
      if (mergedSettings.showDesktopNotification && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('Nhắc nhở công việc', {
            body: message,
            icon: '/logo.png',
            tag: taskKey,
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission();
        }
      }

      // Play sound (if enabled)
      if (mergedSettings.playSound) {
        const audio = new Audio('/notification-sound.mp3');
        audio.play().catch(console.error);
      }
    });
  }, [tasks, mergedSettings]);

  // Initial check and periodic checks
  useEffect(() => {
    if (!mergedSettings.enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Check immediately
    checkAndNotify();

    // Set up periodic checks
    const intervalMs = mergedSettings.checkInterval * 60 * 1000;
    intervalRef.current = setInterval(checkAndNotify, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [checkAndNotify, mergedSettings.enabled, mergedSettings.checkInterval]);

  // Clear notification history for completed tasks
  useEffect(() => {
    const completedStatuses = mergedSettings.completedStatuses || ['returned', 'completed', 'cancelled'];
    tasks.forEach(task => {
      if (task.status && completedStatuses.includes(task.status)) {
        // Remove all notifications for this task
        Array.from(notifiedTasks).forEach(key => {
          if (key.startsWith(task.systemId)) {
            notifiedTasks.delete(key);
          }
        });
      }
    });
  }, [tasks, mergedSettings.completedStatuses]);

  const clearNotificationHistory = useCallback(() => {
    notifiedTasks.clear();
  }, []);

  const requestDesktopPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  return {
    checkAndNotify,
    clearNotificationHistory,
    requestDesktopPermission,
    hasDesktopPermission: 'Notification' in window && Notification.permission === 'granted',
  };
}

/**
 * Hook for managing notification settings
 * NOTE: localStorage has been removed - settings now stored in memory only
 * For persistent settings, use /api/user-preferences
 */
export function useNotificationSettings(storageKey: string = 'hrm-due-date-notification-settings') {
  // In-memory cache for settings
  const settingsRef = useRef<NotificationSettings>(DEFAULT_SETTINGS);
  
  const getSettings = useCallback((): NotificationSettings => {
    return settingsRef.current;
  }, []);

  const saveSettings = useCallback((settings: Partial<NotificationSettings>) => {
    const updated = { ...settingsRef.current, ...settings };
    settingsRef.current = updated;
    return updated;
  }, []);

  const resetSettings = useCallback(() => {
    settingsRef.current = DEFAULT_SETTINGS;
    return DEFAULT_SETTINGS;
  }, []);

  return {
    getSettings,
    saveSettings,
    resetSettings,
    defaultSettings: DEFAULT_SETTINGS,
  };
}
