/**
 * ============================================
 * COMPLAINT STATISTICS TYPES
 * ============================================
 * Type definitions for complaint statistics
 */

import type { ComplaintType, ComplaintResolution } from '../types';

export interface ComplaintStatistics {
  // ============================================
  // OVERVIEW STATS
  // ============================================
  overview: {
    total: number;
    pending: number;
    investigating: number;
    resolved: number;
    rejected: number;
    
    pendingPercentage: number;
    investigatingPercentage: number;
    resolvedPercentage: number;
    rejectedPercentage: number;
  };

  // ============================================
  // VERIFICATION STATS
  // ============================================
  verification: {
    verifiedCorrect: number;
    verifiedIncorrect: number;
    pendingVerification: number;
    
    correctRate: number; // % khiếu nại đúng
    incorrectRate: number; // % khách hàng sai
  };

  // ============================================
  // BY TYPE
  // ============================================
  byType: Array<{
    type: ComplaintType;
    label: string;
    count: number;
    percentage: number;
    resolvedCount: number;
    resolutionRate: number;
  }>;

  // ============================================
  // BY RESOLUTION
  // ============================================
  byResolution: Array<{
    resolution: ComplaintResolution;
    label: string;
    count: number;
    percentage: number;
  }>;

  // ============================================
  // BY ASSIGNEE (Top performers)
  // ============================================
  byAssignee: Array<{
    assigneeId: string;
    assigneeName: string;
    totalAssigned: number;
    resolved: number;
    pending: number;
    investigating: number;
    resolutionRate: number;
    avgResponseTime: number; // ms
    avgResolutionTime: number; // ms
  }>;

  // ============================================
  // TIME-BASED STATS
  // ============================================
  timeBased: {
    avgResponseTime: number; // ms
    avgResponseTimeFormatted: string;
    avgResolutionTime: number; // ms
    avgResolutionTimeFormatted: string;
    
    onTimeSLA: number; // Số lượng đúng SLA
    overdueCount: number; // Số lượng quá hạn
    slaComplianceRate: number; // % tuân thủ SLA
  };

  // ============================================
  // TREND ANALYSIS (Last 7 days)
  // ============================================
  trend: {
    totalThisWeek: number;
    totalLastWeek: number;
    changePercentage: number;
    isIncreasing: boolean;
    
    resolvedThisWeek: number;
    resolvedLastWeek: number;
    resolutionRateChange: number;
  };

  // ============================================
  // PRIORITY DISTRIBUTION
  // ============================================
  byPriority: Array<{
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    label: string;
    count: number;
    percentage: number;
    avgResolutionTime: number;
  }>;
}
