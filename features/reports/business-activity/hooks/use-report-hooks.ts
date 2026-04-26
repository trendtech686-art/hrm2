/**
 * Shared hooks for Business Activity Reports
 */
import * as React from 'react';
import { format, startOfMonth, endOfMonth, subMonths, subDays, startOfYear, endOfYear, subYears } from 'date-fns';
import type { ReportDateRange } from '../types';

/**
 * ✅ FIX: Shared hook for default date range
 * Prevents hydration mismatch by using useMemo
 */
export function useDefaultDateRange(): ReportDateRange {
  return React.useMemo(() => ({
    from: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
    to: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  }), []);
}

/**
 * Shared hook for date presets
 * Prevents hydration mismatch by using useMemo
 */
export function useDatePresets(): { label: string; from: string; to: string }[] {
  const fmtDate = (d: Date) => format(d, 'yyyy-MM-dd');
  return React.useMemo(() => {
    const today = new Date();
    return [
      { label: 'Hôm nay', from: fmtDate(today), to: fmtDate(today) },
      { label: 'Hôm qua', from: fmtDate(subDays(today, 1)), to: fmtDate(subDays(today, 1)) },
      { label: '7 ngày qua', from: fmtDate(subDays(today, 6)), to: fmtDate(today) },
      { label: '30 ngày qua', from: fmtDate(subDays(today, 29)), to: fmtDate(today) },
      { label: 'Tháng trước', from: fmtDate(startOfMonth(subMonths(today, 1))), to: fmtDate(endOfMonth(subMonths(today, 1))) },
      { label: 'Tháng này', from: fmtDate(startOfMonth(today)), to: fmtDate(today) },
      { label: 'Năm trước', from: fmtDate(startOfYear(subYears(today, 1))), to: fmtDate(endOfYear(subYears(today, 1))) },
      { label: 'Năm nay', from: fmtDate(startOfYear(today)), to: fmtDate(today) },
    ];
  }, []);
}
