/**
 * Nhóm thời gian cho báo cáo (dùng chung client + API tổng hợp server).
 */

import {
  format,
  parseISO,
  startOfWeek,
  startOfQuarter,
  startOfYear,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
} from 'date-fns';
import { vi } from 'date-fns/locale';
import type { ReportDateRange, TimeGrouping } from '../types';

export function getTimeKey(
  date: Date,
  grouping: TimeGrouping,
): { key: string; label: string } {
  switch (grouping) {
    case 'day':
      return {
        key: format(date, 'yyyy-MM-dd'),
        label: format(date, 'dd/MM', { locale: vi }),
      };
    case 'week': {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      return {
        key: format(weekStart, 'yyyy-ww'),
        label: `T${format(weekStart, 'w')} (${format(weekStart, 'dd/MM')})`,
      };
    }
    case 'month':
      return {
        key: format(date, 'yyyy-MM'),
        label: format(date, 'MM/yyyy', { locale: vi }),
      };
    case 'quarter': {
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      return {
        key: `${date.getFullYear()}-Q${quarter}`,
        label: `Q${quarter}/${date.getFullYear()}`,
      };
    }
    case 'year':
      return {
        key: format(date, 'yyyy'),
        label: format(date, 'yyyy'),
      };
    default:
      return {
        key: format(date, 'yyyy-MM-dd'),
        label: format(date, 'dd/MM', { locale: vi }),
      };
  }
}

export function generateTimePeriods(
  dateRange: ReportDateRange,
  grouping: TimeGrouping,
): { key: string; label: string }[] {
  const start = parseISO(dateRange.from);
  const end = parseISO(dateRange.to);

  let dates: Date[] = [];

  switch (grouping) {
    case 'day':
      dates = eachDayOfInterval({ start, end });
      break;
    case 'week':
      dates = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });
      break;
    case 'month':
      dates = eachMonthOfInterval({ start, end });
      break;
    case 'quarter': {
      let current = startOfQuarter(start);
      while (current <= end) {
        dates.push(current);
        current = new Date(current.getFullYear(), current.getMonth() + 3, 1);
      }
      break;
    }
    case 'year': {
      let currentYear = startOfYear(start);
      while (currentYear <= end) {
        dates.push(currentYear);
        currentYear = new Date(currentYear.getFullYear() + 1, 0, 1);
      }
      break;
    }
  }

  return dates.map((d) => getTimeKey(d, grouping));
}
