import type { LeaveRequest } from './types';
import type { AttendanceDayKey, AttendanceDataRow, AnyAttendanceDataRow, DailyRecord } from '../attendance/types';
import { useAttendanceStore } from '../attendance/store';
import { useEmployeeSettingsStore } from '../settings/employees/employee-settings-store';
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
  const workingDays = new Set(useEmployeeSettingsStore.getState().settings.workingDays);
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

const applyUpdatesForMonth = (monthKey: string, days: DayContext[], leave: LeaveRequest, mode: 'apply' | 'clear') => {
  if (days.length === 0) return;

  const attendanceStore = useAttendanceStore.getState();
  const monthData = attendanceStore.getAttendanceData(monthKey);
  if (!monthData?.length) return;

  const [yearStr, monthStr] = monthKey.split('-');
  const year = Number(yearStr) || new Date().getFullYear();
  const month = Number(monthStr) || new Date().getMonth() + 1;
  const settings = useEmployeeSettingsStore.getState().settings;

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

  if (didChange) {
    attendanceStore.saveAttendanceData(monthKey, updatedRows);
  }
};

export const leaveAttendanceSync = {
  apply(leave: LeaveRequest) {
    const monthMap = collectWorkingDays(leave);
    monthMap.forEach((days, monthKey) => applyUpdatesForMonth(monthKey, days, leave, 'apply'));
  },
  clear(leave: LeaveRequest) {
    const monthMap = collectWorkingDays(leave);
    monthMap.forEach((days, monthKey) => applyUpdatesForMonth(monthKey, days, leave, 'clear'));
  },
};
