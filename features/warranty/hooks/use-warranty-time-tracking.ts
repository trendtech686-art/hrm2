/**
 * Warranty Time Tracking Hook
 * 
 * Track detailed SLA metrics for warranty tickets
 * Auto-updates every minute for live countdown
 */

import * as React from 'react';
import { WarrantyTicket } from '../types';
import { WARRANTY_SLA_TARGETS, formatTimeLeft, getUrgencyLevel } from '../warranty-sla-utils';

export interface WarrantyTimeTrackingMetrics {
  // Response time (new -> pending)
  responseTime: number | null; // minutes
  responseTimeFormatted: string;
  responseStatus: 'not-started' | 'on-time' | 'warning' | 'overdue';
  responseTimeLeft: number; // minutes (negative if overdue)
  
  // Processing time (created -> processed)
  processingTime: number | null;
  processingTimeFormatted: string;
  processingStatus: 'not-started' | 'on-time' | 'warning' | 'overdue';
  processingTimeLeft: number;
  
  // Return time (created -> returned)
  returnTime: number | null;
  returnTimeFormatted: string;
  returnStatus: 'not-started' | 'on-time' | 'warning' | 'overdue';
  returnTimeLeft: number;
  
  // Current processing duration (for ongoing tickets)
  currentDuration: number; // minutes since created
  currentDurationFormatted: string;
  
  // Total duration (for completed tickets)
  totalDuration: number | null;
  totalDurationFormatted: string;
}

/**
 * Hook to track warranty time metrics with live updates
 */
export function useWarrantyTimeTracking(ticket: WarrantyTicket | null): WarrantyTimeTrackingMetrics | null {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  
  // Force re-render every minute for live countdown
  React.useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate();
    }, 60000); // 60 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  if (!ticket) return null;
  
  const now = new Date();
  const createdAt = new Date(ticket.createdAt);
  const currentDuration = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
  
  // Calculate response time (created -> pending)
  let responseTime: number | null = null;
  let responseStatus: 'not-started' | 'on-time' | 'warning' | 'overdue' = 'not-started';
  
  if (ticket.status !== 'incomplete') {
    // Find when status changed to pending
    const pendingEntry = ticket.history?.find(h => 
      h.action === 'status-changed' && h.changes?.some(c => c.newValue === 'pending')
    );
    
    if (pendingEntry) {
      const pendingAt = new Date(pendingEntry.performedAt);
      responseTime = Math.floor((pendingAt.getTime() - createdAt.getTime()) / (1000 * 60));
    } else {
      // Fallback: use current time if already past new status
      responseTime = currentDuration;
    }
    
    responseStatus = getSLAStatus(responseTime, WARRANTY_SLA_TARGETS.response);
  }
  
  const responseTimeLeft = WARRANTY_SLA_TARGETS.response - (responseTime || currentDuration);
  
  // Calculate processing time (created -> processed)
  let processingTime: number | null = null;
  let processingStatus: 'not-started' | 'on-time' | 'warning' | 'overdue' = 'not-started';
  
  if (ticket.status === 'processed' || ticket.status === 'returned') {
    const processedEntry = ticket.history?.find(h => 
      h.action === 'status-changed' && h.changes?.some(c => c.newValue === 'processed')
    );
    
    if (processedEntry) {
      const processedAt = new Date(processedEntry.performedAt);
      processingTime = Math.floor((processedAt.getTime() - createdAt.getTime()) / (1000 * 60));
    } else {
      processingTime = currentDuration;
    }
    
    processingStatus = getSLAStatus(processingTime, WARRANTY_SLA_TARGETS.processing);
  }
  
  const processingTimeLeft = WARRANTY_SLA_TARGETS.processing - (processingTime || currentDuration);
  
  // Calculate return time (created -> returned)
  let returnTime: number | null = null;
  let returnStatus: 'not-started' | 'on-time' | 'warning' | 'overdue' = 'not-started';
  
  if (ticket.status === 'returned' && ticket.returnedAt) {
    const returnedAt = new Date(ticket.returnedAt);
    returnTime = Math.floor((returnedAt.getTime() - createdAt.getTime()) / (1000 * 60));
    returnStatus = getSLAStatus(returnTime, WARRANTY_SLA_TARGETS.return);
  }
  
  const returnTimeLeft = WARRANTY_SLA_TARGETS.return - (returnTime || currentDuration);
  
  // Total duration
  const totalDuration = ticket.status === 'returned' && returnTime ? returnTime : null;
  
  return {
    responseTime,
    responseTimeFormatted: formatTimeLeft(responseTime || 0),
    responseStatus,
    responseTimeLeft,
    
    processingTime,
    processingTimeFormatted: formatTimeLeft(processingTime || 0),
    processingStatus,
    processingTimeLeft,
    
    returnTime,
    returnTimeFormatted: formatTimeLeft(returnTime || 0),
    returnStatus,
    returnTimeLeft,
    
    currentDuration,
    currentDurationFormatted: formatTimeLeft(currentDuration),
    
    totalDuration,
    totalDurationFormatted: formatTimeLeft(totalDuration || 0),
  };
}

/**
 * Determine SLA status based on actual vs target time
 */
function getSLAStatus(
  actualMinutes: number,
  targetMinutes: number
): 'on-time' | 'warning' | 'overdue' {
  const warningThreshold = targetMinutes * 0.8; // 80% of target
  
  if (actualMinutes <= warningThreshold) return 'on-time';
  if (actualMinutes <= targetMinutes) return 'warning';
  return 'overdue';
}

/**
 * Get color class for SLA status
 */
export function getSLAStatusColor(status: 'not-started' | 'on-time' | 'warning' | 'overdue'): string {
  const colors = {
    'not-started': 'text-muted-foreground',
    'on-time': 'text-green-600',
    'warning': 'text-orange-500',
    'overdue': 'text-destructive',
  };
  return colors[status];
}

/**
 * Get label for SLA status
 */
export function getSLAStatusLabel(status: 'not-started' | 'on-time' | 'warning' | 'overdue'): string {
  const labels = {
    'not-started': 'Chưa bắt đầu',
    'on-time': 'Đúng hạn',
    'warning': 'Cảnh báo',
    'overdue': 'Quá hạn',
  };
  return labels[status];
}
