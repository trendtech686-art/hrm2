/**
 * ============================================
 * COMPLAINT STATISTICS HOOK
 * ============================================
 * Tính toán thống kê và phân tích khiếu nại
 */

import { useMemo } from 'react';
import type { Complaint, ComplaintType, ComplaintStatus, ComplaintResolution } from '../types';

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
    priority: 'low' | 'medium' | 'high' | 'urgent';
    label: string;
    count: number;
    percentage: number;
    avgResolutionTime: number;
  }>;
}

/**
 * Hook tính toán statistics cho complaints
 */
export function useComplaintStatistics(
  complaints: Complaint[],
  employees?: Array<{ systemId: string; fullName: string }>
): ComplaintStatistics {
  return useMemo(() => {
    const total = complaints.length;
    
    if (total === 0) {
      return getEmptyStatistics();
    }

    // ============================================
    // OVERVIEW STATS
    // ============================================
    
    const pending = complaints.filter(c => c.status === 'pending').length;
    const investigating = complaints.filter(c => c.status === 'investigating').length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;
    const rejected = complaints.filter(c => c.resolution === 'rejected').length;

    const overview = {
      total,
      pending,
      investigating,
      resolved,
      rejected,
      pendingPercentage: (pending / total) * 100,
      investigatingPercentage: (investigating / total) * 100,
      resolvedPercentage: (resolved / total) * 100,
      rejectedPercentage: (rejected / total) * 100,
    };

    // ============================================
    // VERIFICATION STATS
    // ============================================

    const verifiedCorrect = complaints.filter(c => c.verification === 'verified-correct').length;
    const verifiedIncorrect = complaints.filter(c => c.verification === 'verified-incorrect').length;
    const pendingVerification = complaints.filter(c => c.verification === 'pending-verification').length;
    const totalVerified = verifiedCorrect + verifiedIncorrect;

    const verification = {
      verifiedCorrect,
      verifiedIncorrect,
      pendingVerification,
      correctRate: totalVerified > 0 ? (verifiedCorrect / totalVerified) * 100 : 0,
      incorrectRate: totalVerified > 0 ? (verifiedIncorrect / totalVerified) * 100 : 0,
    };

    // ============================================
    // BY TYPE
    // ============================================

    const typeLabels: Record<ComplaintType, string> = {
      'wrong-product': 'Sai hàng',
      'missing-items': 'Thiếu hàng',
      'wrong-packaging': 'Đóng gói sai',
      'warehouse-defect': 'Lỗi kho',
      'product-condition': 'Tình trạng hàng',
    };

    const types: ComplaintType[] = ['wrong-product', 'missing-items', 'wrong-packaging', 'warehouse-defect', 'product-condition'];
    
    const byType = types.map(type => {
      const typeComplaints = complaints.filter(c => c.type === type);
      const count = typeComplaints.length;
      const resolvedCount = typeComplaints.filter(c => c.status === 'resolved').length;

      return {
        type,
        label: typeLabels[type],
        count,
        percentage: (count / total) * 100,
        resolvedCount,
        resolutionRate: count > 0 ? (resolvedCount / count) * 100 : 0,
      };
    }).filter(item => item.count > 0);

    // ============================================
    // BY RESOLUTION
    // ============================================

    const resolutionLabels: Record<ComplaintResolution, string> = {
      'refund': 'Hoàn tiền',
      'return-shipping': 'Trả hàng',
      'advice-only': 'Tư vấn',
      'rejected': 'Từ chối',
    };

    const resolutions: ComplaintResolution[] = ['refund', 'return-shipping', 'advice-only', 'rejected'];
    const resolvedComplaints = complaints.filter(c => c.resolution);

    const byResolution = resolutions.map(resolution => {
      const count = resolvedComplaints.filter(c => c.resolution === resolution).length;
      return {
        resolution,
        label: resolutionLabels[resolution],
        count,
        percentage: resolvedComplaints.length > 0 ? (count / resolvedComplaints.length) * 100 : 0,
      };
    }).filter(item => item.count > 0);

    // ============================================
    // BY ASSIGNEE
    // ============================================

    const assigneeMap = new Map<string, Complaint[]>();
    
    complaints.forEach(complaint => {
      if (complaint.assignedTo) {
        const existing = assigneeMap.get(complaint.assignedTo) || [];
        assigneeMap.set(complaint.assignedTo, [...existing, complaint]);
      }
    });

    const byAssignee = Array.from(assigneeMap.entries()).map(([assigneeId, assignedComplaints]) => {
      const totalAssigned = assignedComplaints.length;
      const resolvedCount = assignedComplaints.filter(c => c.status === 'resolved').length;
      const pendingCount = assignedComplaints.filter(c => c.status === 'pending').length;
      const investigatingCount = assignedComplaints.filter(c => c.status === 'investigating').length;

      // Calculate average times
      const responseTimes = assignedComplaints
        .filter(c => c.assignedAt)
        .map(c => new Date(c.assignedAt!).getTime() - new Date(c.createdAt).getTime());

      const resolutionTimes = assignedComplaints
        .filter(c => c.resolvedAt)
        .map(c => new Date(c.resolvedAt!).getTime() - new Date(c.createdAt).getTime());

      const avgResponseTime = responseTimes.length > 0
        ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
        : 0;

      const avgResolutionTime = resolutionTimes.length > 0
        ? resolutionTimes.reduce((sum, time) => sum + time, 0) / resolutionTimes.length
        : 0;

      const assigneeName = employees?.find(e => e.systemId === assigneeId)?.fullName || assigneeId;

      return {
        assigneeId,
        assigneeName,
        totalAssigned,
        resolved: resolvedCount,
        pending: pendingCount,
        investigating: investigatingCount,
        resolutionRate: (resolvedCount / totalAssigned) * 100,
        avgResponseTime,
        avgResolutionTime,
      };
    }).sort((a, b) => b.totalAssigned - a.totalAssigned);

    // ============================================
    // TIME-BASED STATS
    // ============================================

    const responseTimes = complaints
      .filter(c => c.assignedAt)
      .map(c => new Date(c.assignedAt!).getTime() - new Date(c.createdAt).getTime());

    const resolutionTimes = complaints
      .filter(c => c.resolvedAt)
      .map(c => new Date(c.resolvedAt!).getTime() - new Date(c.createdAt).getTime());

    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 0;

    const avgResolutionTime = resolutionTimes.length > 0
      ? resolutionTimes.reduce((sum, time) => sum + time, 0) / resolutionTimes.length
      : 0;

    // SLA compliance (assuming 4h response, 48h resolution)
    const SLA_RESPONSE = 4 * 60 * 60 * 1000;
    const SLA_RESOLUTION = 48 * 60 * 60 * 1000;

    const onTimeSLA = complaints.filter(c => {
      if (c.resolvedAt) {
        const resolutionTime = new Date(c.resolvedAt).getTime() - new Date(c.createdAt).getTime();
        return resolutionTime <= SLA_RESOLUTION;
      }
      return false;
    }).length;

    const overdueCount = (resolved + rejected) - onTimeSLA;
    const slaComplianceRate = (resolved + rejected) > 0 ? (onTimeSLA / (resolved + rejected)) * 100 : 0;

    const timeBased = {
      avgResponseTime,
      avgResponseTimeFormatted: formatDuration(avgResponseTime),
      avgResolutionTime,
      avgResolutionTimeFormatted: formatDuration(avgResolutionTime),
      onTimeSLA,
      overdueCount,
      slaComplianceRate,
    };

    // ============================================
    // TREND ANALYSIS (Last 7 days)
    // ============================================

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const totalThisWeek = complaints.filter(c => 
      new Date(c.createdAt) >= sevenDaysAgo
    ).length;

    const totalLastWeek = complaints.filter(c => 
      new Date(c.createdAt) >= fourteenDaysAgo && new Date(c.createdAt) < sevenDaysAgo
    ).length;

    const changePercentage = totalLastWeek > 0
      ? ((totalThisWeek - totalLastWeek) / totalLastWeek) * 100
      : totalThisWeek > 0 ? 100 : 0;

    const resolvedThisWeek = complaints.filter(c =>
      c.resolvedAt && new Date(c.resolvedAt) >= sevenDaysAgo
    ).length;

    const resolvedLastWeek = complaints.filter(c =>
      c.resolvedAt && new Date(c.resolvedAt) >= fourteenDaysAgo && new Date(c.resolvedAt) < sevenDaysAgo
    ).length;

    const resolutionRateChange = resolvedLastWeek > 0
      ? ((resolvedThisWeek - resolvedLastWeek) / resolvedLastWeek) * 100
      : resolvedThisWeek > 0 ? 100 : 0;

    const trend = {
      totalThisWeek,
      totalLastWeek,
      changePercentage,
      isIncreasing: changePercentage > 0,
      resolvedThisWeek,
      resolvedLastWeek,
      resolutionRateChange,
    };

    // ============================================
    // BY PRIORITY
    // ============================================

    const priorityLabels = {
      low: 'Thấp',
      medium: 'Trung bình',
      high: 'Cao',
      urgent: 'Khẩn cấp',
    };

    const priorities: Array<'low' | 'medium' | 'high' | 'urgent'> = ['low', 'medium', 'high', 'urgent'];

    const byPriority = priorities.map(priority => {
      const priorityComplaints = complaints.filter(c => c.priority === priority);
      const count = priorityComplaints.length;

      const priorityResolutionTimes = priorityComplaints
        .filter(c => c.resolvedAt)
        .map(c => new Date(c.resolvedAt!).getTime() - new Date(c.createdAt).getTime());

      const avgResolutionTime = priorityResolutionTimes.length > 0
        ? priorityResolutionTimes.reduce((sum, time) => sum + time, 0) / priorityResolutionTimes.length
        : 0;

      return {
        priority,
        label: priorityLabels[priority],
        count,
        percentage: (count / total) * 100,
        avgResolutionTime,
      };
    }).filter(item => item.count > 0);

    // ============================================
    // RETURN STATS
    // ============================================

    return {
      overview,
      verification,
      byType,
      byResolution,
      byAssignee,
      timeBased,
      trend,
      byPriority,
    };
  }, [complaints, employees]);
}

/**
 * Helper: Get empty statistics structure
 */
function getEmptyStatistics(): ComplaintStatistics {
  return {
    overview: {
      total: 0,
      pending: 0,
      investigating: 0,
      resolved: 0,
      rejected: 0,
      pendingPercentage: 0,
      investigatingPercentage: 0,
      resolvedPercentage: 0,
      rejectedPercentage: 0,
    },
    verification: {
      verifiedCorrect: 0,
      verifiedIncorrect: 0,
      pendingVerification: 0,
      correctRate: 0,
      incorrectRate: 0,
    },
    byType: [],
    byResolution: [],
    byAssignee: [],
    timeBased: {
      avgResponseTime: 0,
      avgResponseTimeFormatted: '-',
      avgResolutionTime: 0,
      avgResolutionTimeFormatted: '-',
      onTimeSLA: 0,
      overdueCount: 0,
      slaComplianceRate: 0,
    },
    trend: {
      totalThisWeek: 0,
      totalLastWeek: 0,
      changePercentage: 0,
      isIncreasing: false,
      resolvedThisWeek: 0,
      resolvedLastWeek: 0,
      resolutionRateChange: 0,
    },
    byPriority: [],
  };
}

/**
 * Format duration từ milliseconds
 */
function formatDuration(ms: number): string {
  if (!ms) return '-';

  const hours = Math.floor(ms / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days} ngày ${remainingHours}h` : `${days} ngày`;
  }

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  return `${minutes}m`;
}
