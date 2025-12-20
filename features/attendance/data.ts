import type { Employee } from '../employees/types';
import type { DailyRecord, AttendanceDataRow, AnyAttendanceDataRow } from './types';
import { getCurrentDate, getDayOfWeek } from '../../lib/date-utils';
import type { EmployeeSettings } from '../settings/employees/types';
import { recalculateSummary } from './utils';
import { asSystemId } from '../../lib/id-types';

const DEFAULT_AUDIT_TIMESTAMP = '2025-01-01T08:00:00Z';
const DEFAULT_AUDIT_AUTHOR = asSystemId('EMP000001');

const buildDefaultRecord = (day: Date, settings: EmployeeSettings): DailyRecord => {
  const weekday = getDayOfWeek(day);
  const today = getCurrentDate();
  if (weekday === null || !settings.workingDays.includes(weekday)) {
    return { status: 'weekend' };
  }
  if (day > today) {
    return { status: 'future' };
  }
  // Trả về trạng thái trống - không có dữ liệu chấm công
  return { status: 'absent' };
};

export const generateMockAttendance = (employees: Employee[], year: number, month: number, settings: EmployeeSettings): AttendanceDataRow[] => {
  const daysInMonth = new Date(year, month, 0).getDate();

  return employees.map(emp => {
    const row: AnyAttendanceDataRow = {
      systemId: emp.systemId,
      employeeSystemId: emp.systemId,
      employeeId: emp.id,
      fullName: emp.fullName,
      // @ts-ignore
      department: emp.department,
      createdAt: DEFAULT_AUDIT_TIMESTAMP,
      updatedAt: DEFAULT_AUDIT_TIMESTAMP,
      createdBy: DEFAULT_AUDIT_AUTHOR,
      updatedBy: DEFAULT_AUDIT_AUTHOR,
    };

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);
      row[`day_${day}`] = buildDefaultRecord(currentDate, settings);
    }
    
    const summary = recalculateSummary(row, year, month, settings);

    return { ...row, ...summary } as AttendanceDataRow;
  });
};
