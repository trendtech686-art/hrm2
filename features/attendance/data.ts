import type { DailyRecord, AttendanceDataRow, AnyAttendanceDataRow } from './types';
import { getCurrentDate, getDayOfWeek } from '../../lib/date-utils';
import type { EmployeeSettings } from '../settings/employees/types';
import { recalculateSummary } from './utils';
import { asSystemId, asBusinessId, type SystemId, type BusinessId } from '../../lib/id-types';

// Minimal type for employee data needed by attendance
type MinimalEmployeeData = {
  systemId: string;
  id: string;
  fullName: string;
  department?: string | null;
};

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
  // Trả về trạng thái trống - chưa có dữ liệu chấm công (sẽ hiển thị "-" thay vì "V")
  return { status: 'empty' };
};

/**
 * Tạo cấu trúc chấm công trống cho danh sách nhân viên
 * KHÔNG phải mock data - chỉ là cấu trúc khung với status 'absent' / 'weekend' / 'future'
 * Dữ liệu thực sẽ được import từ file Excel
 */
export const generateEmptyAttendance = (employees: MinimalEmployeeData[], year: number, month: number, settings: EmployeeSettings): AttendanceDataRow[] => {
  const daysInMonth = new Date(year, month, 0).getDate();

  return employees.map(emp => {
    const row: AnyAttendanceDataRow = {
      systemId: asSystemId(emp.systemId),
      employeeSystemId: asSystemId(emp.systemId),
      employeeId: asBusinessId(emp.id),
      fullName: emp.fullName,
      department: emp.department as AnyAttendanceDataRow['department'],
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

// Alias for backward compatibility
export const generateMockAttendance = generateEmptyAttendance;
