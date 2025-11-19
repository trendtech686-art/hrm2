/**
 * ============================================
 * COMPLAINT TIME TRACKING HOOK
 * ============================================
 * Theo dõi thời gian xử lý khiếu nại và SLA
 */

import { useMemo } from 'react';
import type { Complaint } from '../types';

export interface TimeTrackingMetrics {
  // Thời gian phản hồi (từ tạo → assign)
  responseTime: number | null; // milliseconds
  responseTimeFormatted: string;
  responseStatus: 'on-time' | 'warning' | 'overdue' | 'pending';

  // Thời gian giải quyết (từ tạo → resolved)
  resolutionTime: number | null; // milliseconds
  resolutionTimeFormatted: string;
  resolutionStatus: 'on-time' | 'warning' | 'overdue' | 'pending';

  // Thời gian điều tra (từ assign → submit evidence)
  investigationTime: number | null; // milliseconds
  investigationTimeFormatted: string;

  // Thời gian chờ xác minh (từ submit evidence → verify)
  verificationTime: number | null; // milliseconds
  verificationTimeFormatted: string;

  // Tổng thời gian đang xử lý (realtime)
  currentProcessingTime: number; // milliseconds
  currentProcessingTimeFormatted: string;

  // SLA targets (có thể config sau)
  responseTimeSLA: number; // 4 hours
  resolutionTimeSLA: number; // 48 hours
}

// ============================================
// SLA CONFIGURATION
// ============================================

const SLA_CONFIG = {
  // Thời gian phản hồi tối đa: 4 giờ (business hours)
  responseTime: 4 * 60 * 60 * 1000, // 4 hours

  // Thời gian giải quyết tối đa: 48 giờ (business hours)  
  resolutionTime: 48 * 60 * 60 * 1000, // 48 hours

  // Warning threshold: 80% of SLA
  warningThreshold: 0.8,
};

/**
 * Hook tính toán metrics thời gian cho khiếu nại
 */
export function useComplaintTimeTracking(complaint: Complaint | null | undefined): TimeTrackingMetrics | null {
  return useMemo(() => {
    if (!complaint) return null;

    const now = new Date().getTime();
    const createdAt = new Date(complaint.createdAt).getTime();
    const assignedAt = complaint.assignedAt ? new Date(complaint.assignedAt).getTime() : null;
    const resolvedAt = complaint.resolvedAt ? new Date(complaint.resolvedAt).getTime() : null;

    // ============================================
    // RESPONSE TIME (Tạo → Assign)
    // ============================================
    
    let responseTime: number | null = null;
    let responseStatus: 'on-time' | 'warning' | 'overdue' | 'pending' = 'pending';

    if (assignedAt) {
      responseTime = assignedAt - createdAt;
      
      if (responseTime <= SLA_CONFIG.responseTime * SLA_CONFIG.warningThreshold) {
        responseStatus = 'on-time';
      } else if (responseTime <= SLA_CONFIG.responseTime) {
        responseStatus = 'warning';
      } else {
        responseStatus = 'overdue';
      }
    } else if (complaint.status !== 'pending') {
      // Đã xử lý nhưng không có assignedAt
      responseTime = 0;
      responseStatus = 'on-time';
    } else {
      // Chưa assign
      const elapsed = now - createdAt;
      if (elapsed > SLA_CONFIG.responseTime) {
        responseStatus = 'overdue';
      } else if (elapsed > SLA_CONFIG.responseTime * SLA_CONFIG.warningThreshold) {
        responseStatus = 'warning';
      }
    }

    // ============================================
    // RESOLUTION TIME (Tạo → Resolved)
    // ============================================

    let resolutionTime: number | null = null;
    let resolutionStatus: 'on-time' | 'warning' | 'overdue' | 'pending' = 'pending';

    if (resolvedAt) {
      resolutionTime = resolvedAt - createdAt;

      if (resolutionTime <= SLA_CONFIG.resolutionTime * SLA_CONFIG.warningThreshold) {
        resolutionStatus = 'on-time';
      } else if (resolutionTime <= SLA_CONFIG.resolutionTime) {
        resolutionStatus = 'warning';
      } else {
        resolutionStatus = 'overdue';
      }
    } else if (complaint.status === 'resolved' || complaint.status === 'ended') {
      // Đã đóng nhưng không có resolvedAt
      resolutionTime = now - createdAt;
      resolutionStatus = resolutionTime > SLA_CONFIG.resolutionTime ? 'overdue' : 'on-time';
    } else {
      // Đang xử lý
      const elapsed = now - createdAt;
      if (elapsed > SLA_CONFIG.resolutionTime) {
        resolutionStatus = 'overdue';
      } else if (elapsed > SLA_CONFIG.resolutionTime * SLA_CONFIG.warningThreshold) {
        resolutionStatus = 'warning';
      }
    }

    // ============================================
    // INVESTIGATION TIME (Assign → Evidence)
    // ============================================

    let investigationTime: number | null = null;
    
    if (assignedAt && complaint.investigationNote) {
      // Tìm action "investigated" đầu tiên
      const investigatedAction = complaint.timeline.find(
        action => action.actionType === 'investigated' && action.note === complaint.investigationNote
      );
      
      if (investigatedAction) {
        const investigatedAt = new Date(investigatedAction.performedAt).getTime();
        investigationTime = investigatedAt - assignedAt;
      }
    }

    // ============================================
    // VERIFICATION TIME (Evidence → Verify)
    // ============================================

    let verificationTime: number | null = null;

    if (complaint.verification !== 'pending-verification') {
      const verifiedAction = complaint.timeline.find(
        action => action.actionType === 'verified' || 
                  action.actionType === 'verified-correct' || 
                  action.actionType === 'verified-incorrect'
      );

      const investigatedAction = complaint.timeline.find(
        action => action.actionType === 'investigated' && action.note === complaint.investigationNote
      );

      if (verifiedAction && investigatedAction) {
        const verifiedAt = new Date(verifiedAction.performedAt).getTime();
        const investigatedAt = new Date(investigatedAction.performedAt).getTime();
        verificationTime = verifiedAt - investigatedAt;
      }
    }

    // ============================================
    // CURRENT PROCESSING TIME (Realtime)
    // ============================================

    const currentProcessingTime = resolvedAt ? (resolvedAt - createdAt) : (now - createdAt);

    // ============================================
    // FORMATTING
    // ============================================

    return {
      responseTime,
      responseTimeFormatted: formatDuration(responseTime),
      responseStatus,

      resolutionTime,
      resolutionTimeFormatted: formatDuration(resolutionTime),
      resolutionStatus,

      investigationTime,
      investigationTimeFormatted: formatDuration(investigationTime),

      verificationTime,
      verificationTimeFormatted: formatDuration(verificationTime),

      currentProcessingTime,
      currentProcessingTimeFormatted: formatDuration(currentProcessingTime),

      responseTimeSLA: SLA_CONFIG.responseTime,
      resolutionTimeSLA: SLA_CONFIG.resolutionTime,
    };
  }, [complaint]);
}

/**
 * Format duration từ milliseconds sang string dễ đọc
 */
function formatDuration(ms: number | null): string {
  if (ms === null || ms === undefined) return '-';
  if (ms === 0) return 'Ngay lập tức';

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    const remainingHours = hours % 24;
    return remainingHours > 0 
      ? `${days} ngày ${remainingHours} giờ`
      : `${days} ngày`;
  }

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours} giờ ${remainingMinutes} phút`
      : `${hours} giờ`;
  }

  if (minutes > 0) {
    return `${minutes} phút`;
  }

  return `${seconds} giây`;
}

/**
 * Helper: Format SLA target
 */
export function formatSLATarget(ms: number): string {
  const hours = ms / (60 * 60 * 1000);
  return hours >= 24 ? `${hours / 24} ngày` : `${hours} giờ`;
}

/**
 * Helper: Tính % progress so với SLA
 */
export function calculateSLAProgress(elapsedMs: number, slaMs: number): number {
  return Math.min((elapsedMs / slaMs) * 100, 100);
}

/**
 * Helper: Get color class based on status
 */
export function getSLAStatusColor(status: 'on-time' | 'warning' | 'overdue' | 'pending'): string {
  switch (status) {
    case 'on-time':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'warning':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'overdue':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'pending':
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Helper: Get status label
 */
export function getSLAStatusLabel(status: 'on-time' | 'warning' | 'overdue' | 'pending'): string {
  switch (status) {
    case 'on-time':
      return 'Đúng hạn';
    case 'warning':
      return 'Sắp trễ';
    case 'overdue':
      return 'Quá hạn';
    case 'pending':
      return 'Chờ xử lý';
  }
}
