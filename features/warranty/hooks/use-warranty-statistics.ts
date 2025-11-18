/**
 * Warranty Statistics Hook
 * Calculate comprehensive statistics for warranty tickets
 * Pattern copied from Complaints statistics
 */

import * as React from 'react';
import type { WarrantyTicket, WarrantyStatus } from '../types';

export interface WarrantyStatistics {
  overview: {
    total: number;
    incomplete: number;
    pending: number;
    processed: number;
    returned: number;
  };
  avgTimes: {
    responseTime: number;      // Avg time to start processing (minutes)
    processingTime: number;     // Avg time to complete processing (minutes)
    returnTime: number;         // Avg time to return to customer (minutes)
    totalTime: number;          // Avg total time (minutes)
  };
  byStatus: Array<{
    status: WarrantyStatus;
    count: number;
    percentage: number;
  }>;
  byEmployee: Array<{
    employeeId: string;
    employeeName: string;
    count: number;
    avgProcessingTime: number;
  }>;
  byBranch: Array<{
    branchId: string;
    branchName: string;
    count: number;
    percentage: number;
  }>;
  trend: {
    thisMonth: number;
    lastMonth: number;
    changePercentage: number;
    isIncreasing: boolean;
  };
}

export function useWarrantyStatistics(tickets: WarrantyTicket[]): WarrantyStatistics {
  return React.useMemo(() => {
    // Overview
    const total = tickets.length;
    const byStatusMap = tickets.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {} as Record<WarrantyStatus, number>);

    const overview = {
      total,
      incomplete: byStatusMap.incomplete || 0,
      pending: byStatusMap.pending || 0,
      processed: byStatusMap.processed || 0,
      returned: byStatusMap.returned || 0,
    };

    // Average Times
    const ticketsWithTimes = tickets.filter(t => t.createdAt);
    
    let totalResponseTime = 0;
    let totalProcessingTime = 0;
    let totalReturnTime = 0;
    let totalOverallTime = 0;
    let countWithResponse = 0;
    let countWithProcessing = 0;
    let countWithReturn = 0;
    let countCompleted = 0;

    ticketsWithTimes.forEach(ticket => {
      const createdAt = new Date(ticket.createdAt).getTime();
      
      // Response time (new -> pending)
      const processingStart = ticket.history.find(h => h.action.includes('pending'));
      if (processingStart) {
        const startTime = new Date(processingStart.performedAt).getTime();
        totalResponseTime += (startTime - createdAt) / (1000 * 60); // minutes
        countWithResponse++;
      }

      // Processing time (pending -> processed)
      const processedEntry = ticket.history.find(h => h.action.includes('processed'));
      if (processedEntry && processingStart) {
        const processedTime = new Date(processedEntry.performedAt).getTime();
        const startTime = new Date(processingStart.performedAt).getTime();
        totalProcessingTime += (processedTime - startTime) / (1000 * 60);
        countWithProcessing++;
      }

      // Return time (processed -> returned)
      if (ticket.returnedAt && processedEntry) {
        const returnTime = new Date(ticket.returnedAt).getTime();
        const processedTime = new Date(processedEntry.performedAt).getTime();
        totalReturnTime += (returnTime - processedTime) / (1000 * 60);
        countWithReturn++;
      }

      // Total time (created -> returned)
      if (ticket.returnedAt) {
        const returnTime = new Date(ticket.returnedAt).getTime();
        totalOverallTime += (returnTime - createdAt) / (1000 * 60);
        countCompleted++;
      }
    });

    const avgTimes = {
      responseTime: countWithResponse > 0 ? totalResponseTime / countWithResponse : 0,
      processingTime: countWithProcessing > 0 ? totalProcessingTime / countWithProcessing : 0,
      returnTime: countWithReturn > 0 ? totalReturnTime / countWithReturn : 0,
      totalTime: countCompleted > 0 ? totalOverallTime / countCompleted : 0,
    };

    // By Status
    const byStatus: WarrantyStatistics['byStatus'] = [
      { status: 'incomplete', count: overview.incomplete, percentage: total > 0 ? (overview.incomplete / total) * 100 : 0 },
      { status: 'pending', count: overview.pending, percentage: total > 0 ? (overview.pending / total) * 100 : 0 },
      { status: 'processed', count: overview.processed, percentage: total > 0 ? (overview.processed / total) * 100 : 0 },
      { status: 'returned', count: overview.returned, percentage: total > 0 ? (overview.returned / total) * 100 : 0 },
    ];

    // By Employee
    const employeeMap = new Map<string, { name: string; count: number; totalTime: number }>();
    tickets.forEach(ticket => {
      const existing = employeeMap.get(ticket.employeeSystemId) || {
        name: ticket.employeeName,
        count: 0,
        totalTime: 0,
      };
      
      existing.count++;
      
      // Calculate processing time for this ticket
      if (ticket.returnedAt && ticket.createdAt) {
        const createdAt = new Date(ticket.createdAt).getTime();
        const returnedAt = new Date(ticket.returnedAt).getTime();
        existing.totalTime += (returnedAt - createdAt) / (1000 * 60); // minutes
      }
      
      employeeMap.set(ticket.employeeSystemId, existing);
    });

    const byEmployee = Array.from(employeeMap.entries())
      .map(([id, data]) => ({
        employeeId: id,
        employeeName: data.name,
        count: data.count,
        avgProcessingTime: data.count > 0 ? data.totalTime / data.count : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10

    // By Branch
    const branchMap = new Map<string, { name: string; count: number }>();
    tickets.forEach(ticket => {
      const existing = branchMap.get(ticket.branchSystemId) || {
        name: ticket.branchName,
        count: 0,
      };
      existing.count++;
      branchMap.set(ticket.branchSystemId, existing);
    });

    const byBranch = Array.from(branchMap.entries())
      .map(([id, data]) => ({
        branchId: id,
        branchName: data.name,
        count: data.count,
        percentage: total > 0 ? (data.count / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Trend (this month vs last month)
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonth = tickets.filter(t => {
      const createdAt = new Date(t.createdAt);
      return createdAt >= thisMonthStart;
    }).length;

    const lastMonth = tickets.filter(t => {
      const createdAt = new Date(t.createdAt);
      return createdAt >= lastMonthStart && createdAt <= lastMonthEnd;
    }).length;

    const changePercentage = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

    const trend = {
      thisMonth,
      lastMonth,
      changePercentage,
      isIncreasing: thisMonth > lastMonth,
    };

    return {
      overview,
      avgTimes,
      byStatus,
      byEmployee,
      byBranch,
      trend,
    };
  }, [tickets]);
}

/**
 * Format minutes to readable time
 */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours < 24) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
}
