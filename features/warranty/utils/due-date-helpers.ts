/**
 * Due Date Helpers for Warranty
 * 
 * Placeholder file for due date calculations
 * (Can be implemented later if needed)
 */

import type { WarrantyTicket } from '../types';

const HOUR_IN_MS = 1000 * 60 * 60;
const DAY_IN_MS = HOUR_IN_MS * 24;

export type DueDateStatus =
  | 'no-due-date'
  | 'future'
  | 'normal'
  | 'due-soon'
  | 'due-tomorrow'
  | 'due-today'
  | 'overdue';

export type DueDateWarning = {
  severity: 'none' | 'info' | 'warning' | 'critical' | 'overdue';
  status: DueDateStatus;
  message: string;
  daysRemaining: number;
  hoursRemaining: number;
  icon: 'AlertTriangle' | 'Clock' | 'AlertCircle' | 'Info' | 'Calendar';
  color: string;
  bgColor: string;
};

const STATUS_CONFIG: Record<DueDateStatus, Pick<DueDateWarning, 'severity' | 'icon' | 'color' | 'bgColor'>> = {
  'no-due-date': {
    severity: 'none',
    icon: 'Calendar',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/60',
  },
  future: {
    severity: 'info',
    icon: 'Calendar',
    color: 'text-blue-600 dark:text-blue-300',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
  normal: {
    severity: 'warning',
    icon: 'Clock',
    color: 'text-amber-600 dark:text-amber-300',
    bgColor: 'bg-amber-50 dark:bg-amber-950',
  },
  'due-soon': {
    severity: 'critical',
    icon: 'AlertCircle',
    color: 'text-orange-600 dark:text-orange-300',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
  },
  'due-tomorrow': {
    severity: 'critical',
    icon: 'AlertCircle',
    color: 'text-orange-600 dark:text-orange-300',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
  },
  'due-today': {
    severity: 'critical',
    icon: 'AlertTriangle',
    color: 'text-destructive dark:text-red-300',
    bgColor: 'bg-destructive/10 dark:bg-red-950',
  },
  overdue: {
    severity: 'overdue',
    icon: 'AlertTriangle',
    color: 'text-destructive dark:text-red-300',
    bgColor: 'bg-destructive/10 dark:bg-red-950',
  },
};

export function calculateDueDate(createdAt: Date | string, daysToAdd: number): Date {
  const date = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
  const dueDate = new Date(date);
  dueDate.setDate(dueDate.getDate() + daysToAdd);
  return dueDate;
}

export function getDaysUntilDue(dueDate: Date | string): number {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  return diffTime >= 0
    ? Math.ceil(diffTime / DAY_IN_MS)
    : Math.floor(diffTime / DAY_IN_MS);
}

export function isOverdue(dueDate: Date | string): boolean {
  return getDaysUntilDue(dueDate) < 0;
}

export function getDueDateWarning(dueDate?: Date | string | null): DueDateWarning {
  if (!dueDate) {
    return {
      ...STATUS_CONFIG['no-due-date'],
      status: 'no-due-date',
      message: 'Chưa có hạn chót',
      daysRemaining: 0,
      hoursRemaining: 0,
    };
  }

  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;

  if (Number.isNaN(due.getTime())) {
    return {
      ...STATUS_CONFIG['no-due-date'],
      status: 'no-due-date',
      message: 'Chưa có hạn chót',
      daysRemaining: 0,
      hoursRemaining: 0,
    };
  }

  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const hoursRemaining = diffMs >= 0
    ? Math.ceil(diffMs / HOUR_IN_MS)
    : Math.floor(diffMs / HOUR_IN_MS);
  const daysRemaining = diffMs >= 0
    ? Math.ceil(diffMs / DAY_IN_MS)
    : Math.floor(diffMs / DAY_IN_MS);

  let status: DueDateStatus;
  let message: string;

  if (diffMs < 0) {
    status = 'overdue';
    const overdueDays = Math.max(1, Math.abs(daysRemaining));
    message = `Quá hạn ${overdueDays} ngày`;
  } else if (daysRemaining === 0) {
    status = 'due-today';
    message = 'Đến hạn hôm nay';
  } else if (daysRemaining === 1) {
    status = 'due-tomorrow';
    message = 'Đến hạn ngày mai';
  } else if (daysRemaining <= 3) {
    status = 'due-soon';
    message = `Còn ${daysRemaining} ngày`;
  } else if (daysRemaining <= 7) {
    status = 'normal';
    message = `Còn ${daysRemaining} ngày`;
  } else {
    status = 'future';
    message = `Còn ${daysRemaining} ngày`;
  }

  const config = STATUS_CONFIG[status];

  return {
    ...config,
    status,
    message,
    daysRemaining,
    hoursRemaining,
  };
}

export function getTasksNeedingNotification(tasks: WarrantyTicket[]): WarrantyTicket[] {
  return tasks.filter(task => {
    // Warranty tickets don't have dueDate field, skip notification logic
    return false;
  });
}

export function getDueDateNotificationMessage(task: WarrantyTicket): string {
  // Warranty tickets don't have dueDate field, return empty
  return `[${task.systemId}] Thông báo phiếu bảo hành`;
}
