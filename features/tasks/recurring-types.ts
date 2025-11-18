import type { SystemId } from '../../lib/id-types';
import type { TaskPriority, TaskAssignee } from './types';

export type RecurrenceFrequency = 
  | 'daily'     // Hàng ngày
  | 'weekly'    // Hàng tuần
  | 'monthly'   // Hàng tháng
  | 'yearly';   // Hàng năm

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type MonthlyRecurrenceType = 
  | 'day-of-month'  // Ngày cụ thể trong tháng (ví dụ: ngày 15)
  | 'day-of-week';  // Thứ trong tháng (ví dụ: Thứ 2 tuần 3)

export interface RecurrencePattern {
  frequency: RecurrenceFrequency;
  interval: number; // Every X days/weeks/months/years
  
  // For weekly: which days of week
  daysOfWeek?: DayOfWeek[];
  
  // For monthly
  monthlyType?: MonthlyRecurrenceType;
  dayOfMonth?: number; // 1-31
  weekOfMonth?: number; // 1-4 or -1 for last week
  dayOfWeekInMonth?: DayOfWeek;
  
  // For yearly
  monthOfYear?: number; // 1-12
  
  // End condition
  endDate?: string; // ISO date string
  occurrences?: number; // Stop after X occurrences
}

export interface RecurringTask {
  systemId: SystemId;
  id: string; // RECUR-XXX
  
  // Task template info
  title: string;
  description: string;
  priority: TaskPriority;
  estimatedHours?: number;
  
  // Assignees
  assignees: TaskAssignee[];
  assignerId: string;
  assignerName: string;
  
  // Subtasks template
  subtasks?: Array<{ title: string; completed: boolean }>;
  
  // Recurrence settings
  recurrencePattern: RecurrencePattern;
  startDate: string; // First occurrence date
  
  // Task creation settings
  createDaysBefore: number; // Create task X days before due date (default: 0)
  durationDays: number; // Task duration from start to due (default: 1)
  
  // Status
  isActive: boolean;
  isPaused: boolean;
  
  // Tracking
  createdTaskIds: string[]; // SystemIds of tasks created from this recurring task
  lastCreatedDate?: string; // Last time a task was created
  nextOccurrenceDate?: string; // Next scheduled task date
  occurrenceCount: number; // How many tasks created so far
  
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  
  // Template reference (optional)
  templateId?: string;
}

export interface RecurrenceSchedule {
  recurringTaskId: string;
  scheduledDates: string[]; // Array of ISO date strings for upcoming tasks
}

// Helper to calculate next occurrence date
export function calculateNextOccurrence(
  pattern: RecurrencePattern,
  fromDate: Date
): Date | null {
  const next = new Date(fromDate);
  
  switch (pattern.frequency) {
    case 'daily':
      next.setDate(next.getDate() + pattern.interval);
      break;
      
    case 'weekly':
      next.setDate(next.getDate() + (pattern.interval * 7));
      break;
      
    case 'monthly':
      if (pattern.monthlyType === 'day-of-month' && pattern.dayOfMonth) {
        next.setMonth(next.getMonth() + pattern.interval);
        next.setDate(pattern.dayOfMonth);
      } else if (pattern.monthlyType === 'day-of-week') {
        // Complex: find Nth weekday of month
        next.setMonth(next.getMonth() + pattern.interval);
        // Implementation would go here
      }
      break;
      
    case 'yearly':
      next.setFullYear(next.getFullYear() + pattern.interval);
      if (pattern.monthOfYear) {
        next.setMonth(pattern.monthOfYear - 1);
      }
      break;
  }
  
  // Check end conditions
  if (pattern.endDate && next > new Date(pattern.endDate)) {
    return null;
  }
  
  return next;
}

// Helper to check if recurrence should continue
export function shouldContinueRecurrence(
  pattern: RecurrencePattern,
  currentCount: number,
  nextDate: Date | null
): boolean {
  if (!nextDate) return false;
  
  if (pattern.occurrences && currentCount >= pattern.occurrences) {
    return false;
  }
  
  if (pattern.endDate && nextDate > new Date(pattern.endDate)) {
    return false;
  }
  
  return true;
}
