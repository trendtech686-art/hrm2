import * as React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export interface SlaConfig {
  targetMinutes: number;
  thresholds?: {
    critical?: number; // minutes before target (default: 60)
    warning?: number;  // minutes before target (default: 180)
  };
}

export interface SlaTimerProps {
  startTime: Date | string;
  targetMinutes: number;
  isCompleted?: boolean;
  completedLabel?: string;
  overdueLabel?: string;
  remainingLabel?: string;
  className?: string;
  thresholds?: {
    critical?: number;
    warning?: number;
  };
  showIcon?: boolean;
  updateInterval?: number; // milliseconds (default: 60000 = 1 minute)
}

type UrgencyLevel = 'normal' | 'warning' | 'critical' | 'overdue';

/**
 * Generic SLA Timer Component
 * 
 * Dùng chung cho: Warranty, Orders, Complaints, Support Tickets...
 * 
 * Features:
 * - Live countdown with auto-refresh
 * - Color coding based on urgency
 * - Overdue indicator
 * - Customizable thresholds
 * - Smart time formatting
 * 
 * Usage:
 * ```tsx
 * <SlaTimer
 *   startTime={ticket.createdAt}
 *   targetMinutes={120} // 2 hours
 *   isCompleted={ticket.status === 'completed'}
 *   thresholds={{ critical: 30, warning: 60 }}
 * />
 * ```
 */
export function SlaTimer({
  startTime,
  targetMinutes,
  isCompleted = false,
  completedLabel = 'Đã hoàn thành',
  overdueLabel = 'Quá hạn',
  remainingLabel = 'Còn',
  className,
  thresholds = {
    critical: 60,  // 1 hour
    warning: 180,  // 3 hours
  },
  showIcon = true,
  updateInterval = 60000, // 1 minute
}: SlaTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState(() => calculateTimeLeft(startTime, targetMinutes));
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Update timer at specified interval
  React.useEffect(() => {
    if (isCompleted) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft(calculateTimeLeft(startTime, targetMinutes));
    }, updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [startTime, targetMinutes, isCompleted, updateInterval]);

  // If completed, show completion message
  if (isCompleted) {
    return (
      <div className={cn('flex items-center gap-1 text-xs text-muted-foreground', className)}>
        {showIcon && <Clock className="h-3 w-3" />}
        <span>{completedLabel}</span>
      </div>
    );
  }

  const urgencyLevel = getUrgencyLevel(timeLeft, thresholds);
  const urgencyColorClass = getUrgencyColorClass(urgencyLevel);
  const isOverdue = timeLeft < 0;
  const label = isOverdue ? overdueLabel : remainingLabel;

  return (
    <div className={cn('flex items-center gap-1 text-xs', urgencyColorClass, className)}>
      {showIcon && <Clock className="h-3 w-3" />}
      <span>
        {label}: {formatTimeLeft(Math.abs(timeLeft))}
      </span>
    </div>
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate time left in minutes
 */
function calculateTimeLeft(startTime: Date | string, targetMinutes: number): number {
  const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
  
  // Validate date
  if (!start || isNaN(start.getTime())) {
    return targetMinutes; // Assume full time left if invalid start time
  }
  
  const now = new Date();
  const elapsedMinutes = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));
  return targetMinutes - elapsedMinutes;
}

/**
 * Format minutes to readable time string
 * Examples: "2 giờ 30 phút", "45 phút", "1 ngày 3 giờ"
 */
function formatTimeLeft(minutes: number): string {
  const abs = Math.abs(minutes);
  const totalHours = Math.floor(abs / 60);
  const mins = Math.floor(abs % 60);

  if (abs < 60) {
    return `${mins} phút`;
  }

  if (totalHours < 24) {
    return mins > 0 ? `${totalHours} giờ ${mins} phút` : `${totalHours} giờ`;
  }

  const days = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;

  const parts: string[] = [];
  parts.push(`${days} ngày`);
  if (remainingHours > 0) {
    parts.push(`${remainingHours} giờ`);
  }
  if (mins > 0) {
    parts.push(`${mins} phút`);
  }

  return parts.join(' ');
}

/**
 * Get urgency level based on time left and thresholds
 */
function getUrgencyLevel(
  minutesLeft: number,
  thresholds: { critical?: number; warning?: number }
): UrgencyLevel {
  if (minutesLeft < 0) return 'overdue';
  if (minutesLeft < (thresholds.critical || 60)) return 'critical';
  if (minutesLeft < (thresholds.warning || 180)) return 'warning';
  return 'normal';
}

/**
 * Get urgency color class
 */
function getUrgencyColorClass(level: UrgencyLevel): string {
  const colors: Record<UrgencyLevel, string> = {
    normal: 'text-muted-foreground',
    warning: 'text-orange-500 font-medium',
    critical: 'text-destructive animate-pulse',
    overdue: 'text-destructive font-semibold',
  };
  return colors[level];
}

// ============================================
// UTILITY HOOKS
// ============================================

/**
 * Hook to get SLA status without rendering
 */
export function useSlaStatus(
  startTime: Date | string,
  targetMinutes: number,
  isCompleted: boolean = false
) {
  const [timeLeft, setTimeLeft] = React.useState(() => calculateTimeLeft(startTime, targetMinutes));
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (isCompleted) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft(calculateTimeLeft(startTime, targetMinutes));
    }, 60000); // Update every minute

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [startTime, targetMinutes, isCompleted]);

  return {
    timeLeft,
    isOverdue: timeLeft < 0,
    formatted: formatTimeLeft(Math.abs(timeLeft)),
    urgencyLevel: getUrgencyLevel(timeLeft, { critical: 60, warning: 180 }),
  };
}
