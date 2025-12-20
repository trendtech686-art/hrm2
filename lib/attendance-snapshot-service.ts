import { useAttendanceStore } from '../features/attendance/store';
import type { AttendanceDataRow } from '../features/attendance/types';
import type { SystemId, BusinessId } from './id-types';

type SnapshotQuery = {
  monthKey: string;
  employeeSystemId: SystemId;
};

export type AttendanceSnapshot = {
  monthKey: string;
  employeeSystemId: SystemId;
  employeeId: BusinessId;
  fullName: string;
  department: AttendanceDataRow['department'];
  totals: {
    workDays: number;
    leaveDays: number;
    absentDays: number;
    lateArrivals: number;
    earlyDepartures: number;
    otHours: number;
    // Chi tiết OT theo loại ngày
    otHoursWeekday?: number;   // Làm thêm ngày thường (sau giờ tan làm)
    otHoursWeekend?: number;   // Làm thêm cuối tuần
    otHoursHoliday?: number;   // Làm thêm ngày lễ
  };
  locked: boolean;
  status: 'pending' | 'locked';
  generatedAt: string;
};

const buildSnapshot = (
  row: AttendanceDataRow,
  query: SnapshotQuery,
  locked: boolean
): AttendanceSnapshot => ({
  monthKey: query.monthKey,
  employeeSystemId: query.employeeSystemId,
  employeeId: row.employeeId,
  fullName: row.fullName,
  department: row.department,
  totals: {
    workDays: row.workDays,
    leaveDays: row.leaveDays,
    absentDays: row.absentDays,
    lateArrivals: row.lateArrivals,
    earlyDepartures: row.earlyDepartures,
    otHours: row.otHours,
    otHoursWeekday: row.otHoursWeekday ?? 0,
    otHoursWeekend: row.otHoursWeekend ?? 0,
    otHoursHoliday: row.otHoursHoliday ?? 0,
  },
  locked,
  status: locked ? 'locked' : 'pending',
  generatedAt: new Date().toISOString(),
});

const getLatestLockedMonthKey = () => {
  const { lockedMonths } = useAttendanceStore.getState();
  const lockedKeys = Object.entries(lockedMonths)
    .filter(([, isLocked]) => Boolean(isLocked))
    .map(([monthKey]) => monthKey)
    .sort()
    .reverse();
  return lockedKeys[0];
};

export const attendanceSnapshotService = {
  getSnapshot({ monthKey, employeeSystemId }: SnapshotQuery): AttendanceSnapshot | null {
    const state = useAttendanceStore.getState();
    const monthRows = state.attendanceData[monthKey];
    if (!monthRows?.length) {
      return null;
    }
    const targetRow = monthRows.find((row) => row.employeeSystemId === employeeSystemId);
    if (!targetRow) {
      return null;
    }
    const locked = Boolean(state.lockedMonths[monthKey]);
    return buildSnapshot(targetRow, { monthKey, employeeSystemId }, locked);
  },
  getLatestLockedSnapshot(employeeSystemId: SystemId): AttendanceSnapshot | null {
    const latestLockedKey = getLatestLockedMonthKey();
    if (!latestLockedKey) {
      return null;
    }
    return this.getSnapshot({ monthKey: latestLockedKey, employeeSystemId });
  },
};
