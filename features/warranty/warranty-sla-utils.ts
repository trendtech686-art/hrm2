/**
 * Warranty SLA Utilities
 * 
 * Calculate and format SLA-related metrics for warranty tickets
 */

import { WarrantyTicket } from './types.ts';

const SLA_STORAGE_KEY = 'warranty-sla-targets';

/**
 * Default SLA Targets (in minutes)
 */
const DEFAULT_WARRANTY_SLA_TARGETS = {
  response: 2 * 60,      // 2 hours - Thời gian phản hồi
  processing: 24 * 60,   // 24 hours - Thời gian xử lý
  return: 48 * 60,       // 48 hours - Thời gian trả hàng
};

/**
 * Load SLA targets from localStorage
 */
export function loadWarrantySLATargets() {
  try {
    const stored = localStorage.getItem(SLA_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_WARRANTY_SLA_TARGETS;
  } catch {
    return DEFAULT_WARRANTY_SLA_TARGETS;
  }
}

/**
 * Save SLA targets to localStorage
 */
export function saveWarrantySLATargets(targets: typeof DEFAULT_WARRANTY_SLA_TARGETS) {
  try {
    localStorage.setItem(SLA_STORAGE_KEY, JSON.stringify(targets));
  } catch (error) {
    console.error('Failed to save SLA targets:', error);
  }
}

/**
 * Current SLA Targets (loaded from localStorage or defaults)
 */
export const WARRANTY_SLA_TARGETS = loadWarrantySLATargets();

export interface WarrantyOverdueStatus {
  isOverdueResponse: boolean;
  isOverdueProcessing: boolean;
  isOverdueReturn: boolean;
  responseTimeLeft: number; // minutes (negative if overdue)
  processingTimeLeft: number;
  returnTimeLeft: number;
  overdueDuration?: string; // formatted string
}

/**
 * Check if warranty ticket is overdue
 */
export function checkWarrantyOverdue(ticket: WarrantyTicket): WarrantyOverdueStatus {
  const now = new Date();
  const createdAt = new Date(ticket.createdAt);
  const elapsedMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));

  // Response time: from created to first action (status changed to pending)
  const hasResponse = ticket.status !== 'incomplete';
  const responseTimeLeft = WARRANTY_SLA_TARGETS.response - elapsedMinutes;
  const isOverdueResponse = !hasResponse && responseTimeLeft < 0;

  // Processing time: from created to processed
  const hasProcessed = ticket.status === 'processed' || ticket.status === 'returned';
  const processingTimeLeft = WARRANTY_SLA_TARGETS.processing - elapsedMinutes;
  const isOverdueProcessing = !hasProcessed && processingTimeLeft < 0;

  // Return time: from created to returned
  const hasReturned = ticket.status === 'returned';
  const returnTimeLeft = WARRANTY_SLA_TARGETS.return - elapsedMinutes;
  const isOverdueReturn = !hasReturned && returnTimeLeft < 0;

  // Format most critical overdue duration
  let overdueDuration: string | undefined;
  if (isOverdueResponse) {
    overdueDuration = formatTimeLeft(Math.abs(responseTimeLeft));
  } else if (isOverdueProcessing) {
    overdueDuration = formatTimeLeft(Math.abs(processingTimeLeft));
  } else if (isOverdueReturn) {
    overdueDuration = formatTimeLeft(Math.abs(returnTimeLeft));
  }

  return {
    isOverdueResponse,
    isOverdueProcessing,
    isOverdueReturn,
    responseTimeLeft,
    processingTimeLeft,
    returnTimeLeft,
    overdueDuration,
  };
}

/**
 * Format minutes to readable time string
 * Examples: "2 giờ 30 phút", "45 phút", "1 ngày 3 giờ 15 phút"
 */
export function formatTimeLeft(minutes: number): string {
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
  
  // Always show format: X ngày X giờ X phút
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
 * Get hours since a timestamp
 */
export function getHoursSince(timestamp: string): number {
  const now = new Date();
  const then = new Date(timestamp);
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60));
}

/**
 * Get urgency level based on time left
 */
export function getUrgencyLevel(minutesLeft: number): 'normal' | 'warning' | 'critical' | 'overdue' {
  if (minutesLeft < 0) return 'overdue';
  
  const hoursLeft = minutesLeft / 60;
  if (hoursLeft < 1) return 'critical';
  if (hoursLeft < 3) return 'warning';
  return 'normal';
}

/**
 * Get urgency color class
 */
export function getUrgencyColor(level: 'normal' | 'warning' | 'critical' | 'overdue'): string {
  const colors = {
    normal: 'text-muted-foreground',
    warning: 'text-orange-500 font-medium',
    critical: 'text-destructive animate-pulse',
    overdue: 'text-destructive font-semibold',
  };
  return colors[level];
}
