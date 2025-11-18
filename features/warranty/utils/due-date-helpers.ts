/**
 * Due Date Helpers for Warranty
 * 
 * Placeholder file for due date calculations
 * (Can be implemented later if needed)
 */

import type { WarrantyTicket } from '../types';

export type DueDateWarning = {
  severity: 'none' | 'info' | 'warning' | 'critical' | 'overdue';
  status?: 'overdue' | 'due-today' | 'due-tomorrow' | 'due-soon' | 'normal';
  message: string;
  daysRemaining: number;
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
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isOverdue(dueDate: Date | string): boolean {
  return getDaysUntilDue(dueDate) < 0;
}

export function getDueDateWarning(dueDate: Date | string): DueDateWarning {
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
