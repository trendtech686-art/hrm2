import type { LeaveRequest } from '@/lib/types/prisma-extended';
import type { AttendanceDayKey, AttendanceDataRow, AnyAttendanceDataRow, DailyRecord } from '../attendance/types';
import { getEmployeeSettingsSync } from '../settings/employees/employee-settings-service';
import { recalculateSummary } from '../attendance/utils';
import { getCurrentDate } from '../../lib/date-utils';

const LEAVE_NOTE_PREFIX = '[LEAVE:';

type DayContext = {
  date: Date;
  dayOfMonth: number;
};

type MonthDayMap = Map<string, DayContext[]>;

const buildMonthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const buildLeaveNote = (leave: LeaveRequest) => {
  const description = `${LEAVE_NOTE_PREFIX}${leave.systemId}] ${leave.leaveTypeName}`;
  return leave.reason ? `${description} - ${leave.reason}` : description;
};

const isSameLeaveNote = (record: DailyRecord | undefined, leave: LeaveRequest) => {
  if (!record?.notes) return false;
  return record.notes.includes(`${LEAVE_NOTE_PREFIX}${leave.systemId}]`);
};

const cloneDate = (input: Date) => new Date(input.getFullYear(), input.getMonth(), input.getDate());

const parseLeaveBoundary = (value: string): Date => {
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const collectWorkingDays = (leave: LeaveRequest): MonthDayMap => {
  const workingDays = new Set(getEmployeeSettingsSync().workingDays);
  if (!leave.startDate || !leave.endDate) return new Map();

  let start = parseLeaveBoundary(leave.startDate);
  let end = parseLeaveBoundary(leave.endDate);
  if (start > end) {
    const temp = start;
    start = end;
    end = temp;
  }

  const monthMap: MonthDayMap = new Map();
  for (let cursor = cloneDate(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    const dayOfWeek = cursor.getDay();
    if (!workingDays.has(dayOfWeek)) {
      continue;
    }

    const monthKey = buildMonthKey(cursor);
    const entry: DayContext = { date: cloneDate(cursor), dayOfMonth: cursor.getDate() };
    const existing = monthMap.get(monthKey);
    if (existing) {
      existing.push(entry);
    } else {
      monthMap.set(monthKey, [entry]);
    }
  }

  return monthMap;
};

const buildLeaveRecord = (leave: LeaveRequest): DailyRecord => ({
  status: 'leave',
  notes: buildLeaveNote(leave),
});

const buildRevertedRecord = (context: DayContext): DailyRecord => {
  const today = getCurrentDate();
  if (context.date > today) {
    return { status: 'future' };
  }
  return { status: 'absent' };
};

/**
 * Pure function: apply leave updates to attendance data for a specific month.
 * Returns the modified data (does NOT mutate input).
 */
const applyUpdatesToData = (
  monthData: AttendanceDataRow[],
  monthKey: string,
  days: DayContext[],
  leave: LeaveRequest,
  mode: 'apply' | 'clear',
): AttendanceDataRow[] | null => {
  if (days.length === 0 || !monthData.length) return null;

  const [yearStr, monthStr] = monthKey.split('-');
  const year = Number(yearStr) || new Date().getFullYear();
  const month = Number(monthStr) || new Date().getMonth() + 1;
  const settings = getEmployeeSettingsSync();

  let didChange = false;
  const updatedRows: AttendanceDataRow[] = monthData.map((row) => {
    if (row.employeeSystemId !== leave.employeeSystemId) {
      return row;
    }

    let rowChanged = false;
    const mutableRow: AnyAttendanceDataRow = { ...row };

    days.forEach((ctx) => {
      const dayKey = `day_${ctx.dayOfMonth}` as AttendanceDayKey;
      const currentRecord = mutableRow[dayKey] as DailyRecord | undefined;

      if (mode === 'apply') {
        mutableRow[dayKey] = buildLeaveRecord(leave);
        rowChanged = true;
        return;
      }

      if (mode === 'clear' && currentRecord && isSameLeaveNote(currentRecord, leave)) {
        mutableRow[dayKey] = buildRevertedRecord(ctx);
        rowChanged = true;
      }
    });

    if (!rowChanged) {
      return row;
    }

    didChange = true;
    const summary = recalculateSummary(mutableRow, year, month, settings);
    return { ...mutableRow, ...summary } as AttendanceDataRow;
  });

  return didChange ? updatedRows : null;
};

/**
 * Pure API: apply/clear leave data on an attendance dataset.
 * The caller provides the data and receives the modified result.
 */
export const leaveAttendanceSync = {
  /**
   * Apply a leave to the given attendance data for a specific month.
   * Returns updated data, or null if no changes were made.
   */
  applyToData(leave: LeaveRequest, monthKey: string, monthData: AttendanceDataRow[]): AttendanceDataRow[] | null {
    const monthMap = collectWorkingDays(leave);
    const days = monthMap.get(monthKey);
    if (!days) return null;
    return applyUpdatesToData(monthData, monthKey, days, leave, 'apply');
  },

  /**
   * Clear a leave from the given attendance data for a specific month.
   * Returns updated data, or null if no changes were made.
   */
  clearFromData(leave: LeaveRequest, monthKey: string, monthData: AttendanceDataRow[]): AttendanceDataRow[] | null {
    const monthMap = collectWorkingDays(leave);
    const days = monthMap.get(monthKey);
    if (!days) return null;
    return applyUpdatesToData(monthData, monthKey, days, leave, 'clear');
  },

  /** @deprecated Backward-compat stub for deprecated leaves/store.ts — no-op */
  apply(_leave: LeaveRequest) { /* no-op: store is deprecated */ },
  /** @deprecated Backward-compat stub for deprecated leaves/store.ts — no-op */
  clear(_leave: LeaveRequest) { /* no-op: store is deprecated */ },
};
