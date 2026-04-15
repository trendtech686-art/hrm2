/**
 * Payment Report Hooks
 * 
 * Hooks tính toán dữ liệu báo cáo thanh toán
 */

import * as React from 'react';
import { format, parseISO, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, startOfWeek, startOfQuarter, startOfYear, isWithinInterval } from 'date-fns';
import { vi } from 'date-fns/locale';
import { usePaymentsByDateRange } from './use-payment-report-data';
import { useAllBranches } from '@/features/settings/branches/hooks/use-all-branches';
import type {
  ReportDateRange,
  TimeGrouping,
  PaymentTimeReportRow,
  PaymentMethodReportRow,
  PaymentBranchReportRow,
} from '../types';
import type { SystemId } from '@/lib/id-types';

// Helper: Get time key
function getTimeKey(date: Date, grouping: TimeGrouping): { key: string; label: string } {
  switch (grouping) {
    case 'day':
      return { key: format(date, 'yyyy-MM-dd'), label: format(date, 'dd/MM', { locale: vi }) };
    case 'week': {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      return { key: format(weekStart, 'yyyy-ww'), label: `T${format(weekStart, 'w')} (${format(weekStart, 'dd/MM')})` };
    }
    case 'month':
      return { key: format(date, 'yyyy-MM'), label: format(date, 'MM/yyyy', { locale: vi }) };
    case 'quarter': {
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      return { key: `${date.getFullYear()}-Q${quarter}`, label: `Q${quarter}/${date.getFullYear()}` };
    }
    case 'year':
      return { key: format(date, 'yyyy'), label: format(date, 'yyyy') };
    default:
      return { key: format(date, 'yyyy-MM-dd'), label: format(date, 'dd/MM', { locale: vi }) };
  }
}

function generateTimePeriods(dateRange: ReportDateRange, grouping: TimeGrouping): { key: string; label: string }[] {
  const start = parseISO(dateRange.from);
  const end = parseISO(dateRange.to);
  let dates: Date[] = [];

  switch (grouping) {
    case 'day': dates = eachDayOfInterval({ start, end }); break;
    case 'week': dates = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 }); break;
    case 'month': dates = eachMonthOfInterval({ start, end }); break;
    case 'quarter': {
      let current = startOfQuarter(start);
      while (current <= end) { dates.push(current); current = new Date(current.getFullYear(), current.getMonth() + 3, 1); }
      break;
    }
    case 'year': {
      let currentYear = startOfYear(start);
      while (currentYear <= end) { dates.push(currentYear); currentYear = new Date(currentYear.getFullYear() + 1, 0, 1); }
      break;
    }
  }

  return dates.map(d => getTimeKey(d, grouping));
}

// Hook: Thanh toán theo thời gian
export function usePaymentTimeReport(
  dateRange: ReportDateRange,
  timeGrouping: TimeGrouping = 'day'
) {
  const { data: payments = [] } = usePaymentsByDateRange(dateRange);

  return React.useMemo(() => {
    const start = parseISO(dateRange.from);
    const end = parseISO(dateRange.to);

    const periods = generateTimePeriods(dateRange, timeGrouping);
    const dataMap = new Map<string, PaymentTimeReportRow>();

    periods.forEach(period => {
      dataMap.set(period.key, {
        key: period.key,
        label: period.label,
        transactionCount: 0,
        totalAmount: 0,
        completedCount: 0,
        completedAmount: 0,
        pendingCount: 0,
        pendingAmount: 0,
        failedCount: 0,
        failedAmount: 0,
      });
    });

    payments.forEach(payment => {
      const paymentDate = payment.date ? parseISO(payment.date) : null;
      if (!paymentDate || !isWithinInterval(paymentDate, { start, end })) return;

      const { key } = getTimeKey(paymentDate, timeGrouping);
      const row = dataMap.get(key);
      if (!row) return;

      row.transactionCount += 1;
      row.totalAmount += payment.amount || 0;

      if (payment.status === 'completed') {
        row.completedCount += 1;
        row.completedAmount += payment.amount || 0;
      } else if (payment.status === 'cancelled') {
        row.failedCount += 1;
        row.failedAmount += payment.amount || 0;
      }
    });

    const data = Array.from(dataMap.values());

    const summary = {
      transactionCount: data.reduce((sum, r) => sum + r.transactionCount, 0),
      totalAmount: data.reduce((sum, r) => sum + r.totalAmount, 0),
      averageAmount: 0,
    };
    summary.averageAmount = summary.transactionCount > 0 ? summary.totalAmount / summary.transactionCount : 0;

    return { data, summary };
  }, [payments, dateRange, timeGrouping]);
}

// Hook: Thanh toán theo phương thức
export function usePaymentMethodReport(dateRange: ReportDateRange) {
  const { data: payments = [] } = usePaymentsByDateRange(dateRange);

  return React.useMemo(() => {
    const start = parseISO(dateRange.from);
    const end = parseISO(dateRange.to);

    const filtered = payments.filter(p => {
      const date = p.date ? parseISO(p.date) : null;
      return date && isWithinInterval(date, { start, end });
    });

    const methodMap = new Map<string, PaymentMethodReportRow>();

    filtered.forEach(payment => {
      const methodId = payment.paymentMethodSystemId || 'unknown';
      const methodName = payment.paymentMethodName || 'Không xác định';

      if (!methodMap.has(methodId)) {
        methodMap.set(methodId, {
          methodId,
          methodName,
          transactionCount: 0,
          totalAmount: 0,
          percentage: 0,
        });
      }

      const row = methodMap.get(methodId)!;
      row.transactionCount += 1;
      row.totalAmount += payment.amount || 0;
    });

    const totalAmount = filtered.reduce((sum, p) => sum + (p.amount || 0), 0);
    methodMap.forEach(row => {
      row.percentage = totalAmount > 0 ? (row.totalAmount / totalAmount) * 100 : 0;
    });

    const data = Array.from(methodMap.values()).sort((a, b) => b.totalAmount - a.totalAmount);

    const summary = {
      transactionCount: data.reduce((sum, r) => sum + r.transactionCount, 0),
      totalAmount,
      averageAmount: data.length > 0 ? totalAmount / data.reduce((sum, r) => sum + r.transactionCount, 0) : 0,
    };

    return { data, summary };
  }, [payments, dateRange]);
}

// Hook: Thanh toán theo chi nhánh
export function usePaymentBranchReport(dateRange: ReportDateRange) {
  const { data: payments = [] } = usePaymentsByDateRange(dateRange);
  const { data: branches = [] } = useAllBranches();

  return React.useMemo(() => {
    const start = parseISO(dateRange.from);
    const end = parseISO(dateRange.to);

    const filtered = payments.filter(p => {
      const date = p.date ? parseISO(p.date) : null;
      return date && isWithinInterval(date, { start, end });
    });

    const branchMap = new Map<string, PaymentBranchReportRow>();

    // Pre-populate with known branches
    branches.forEach(branch => {
      branchMap.set(branch.systemId, {
        branchSystemId: branch.systemId,
        branchName: branch.name,
        transactionCount: 0,
        totalAmount: 0,
        cashAmount: 0,
        cardAmount: 0,
        bankTransferAmount: 0,
        otherAmount: 0,
      });
    });

    filtered.forEach(payment => {
      const branchId = (payment.branchSystemId || 'unknown') as SystemId;
      const branchName = payment.branchName || 'Không xác định';

      if (!branchMap.has(branchId)) {
        branchMap.set(branchId, {
          branchSystemId: branchId,
          branchName,
          transactionCount: 0,
          totalAmount: 0,
          cashAmount: 0,
          cardAmount: 0,
          bankTransferAmount: 0,
          otherAmount: 0,
        });
      }

      const row = branchMap.get(branchId)!;
      row.transactionCount += 1;
      row.totalAmount += payment.amount || 0;

      // Categorize by payment method name
      const method = (payment.paymentMethodName || '').toLowerCase();
      if (method.includes('tiền mặt') || method.includes('cash')) {
        row.cashAmount += payment.amount || 0;
      } else if (method.includes('thẻ') || method.includes('card') || method.includes('visa') || method.includes('mastercard')) {
        row.cardAmount += payment.amount || 0;
      } else if (method.includes('chuyển khoản') || method.includes('bank') || method.includes('ngân hàng')) {
        row.bankTransferAmount += payment.amount || 0;
      } else {
        row.otherAmount += payment.amount || 0;
      }
    });

    // Only include branches with transactions
    const data = Array.from(branchMap.values())
      .filter(r => r.transactionCount > 0)
      .sort((a, b) => b.totalAmount - a.totalAmount);

    const summary = {
      transactionCount: data.reduce((sum, r) => sum + r.transactionCount, 0),
      totalAmount: data.reduce((sum, r) => sum + r.totalAmount, 0),
      averageAmount: 0,
    };
    summary.averageAmount = summary.transactionCount > 0 ? summary.totalAmount / summary.transactionCount : 0;

    return { data, summary };
  }, [payments, branches, dateRange]);
}
