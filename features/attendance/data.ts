import type { Employee } from '../employees/types.ts';
import type { DailyRecord, AttendanceStatus, AttendanceDataRow, AnyAttendanceDataRow } from './types.ts';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate, isDateAfter, getDayOfWeek } from '../../lib/date-utils.ts';
import type { EmployeeSettings } from '../settings/employees/types.ts';
import { recalculateSummary } from './utils.ts';
const statuses: AttendanceStatus[] = ['present', 'absent', 'leave', 'half-day'];

const generateRandomRecord = (day: Date, settings: EmployeeSettings): DailyRecord => {
  if (!settings.workingDays.includes(getDayOfWeek(day) ?? 0)) {
    return { status: 'weekend' };
  }

  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  switch (randomStatus) {
    case 'present':
      const isLate = Math.random() > 0.8;
      const [startHour, startMinute] = settings.workStartTime.split(':').map(Number);
      
      let checkInHour = isLate ? startHour : startHour - 1 + Math.floor(Math.random() * 2);
      if (checkInHour < 0) checkInHour = 0;
      if (checkInHour > 23) checkInHour = 23;
      
      let checkInMinute = isLate ? startMinute + settings.allowedLateMinutes + Math.floor(Math.random() * 15) : Math.floor(Math.random() * 60);
      if (checkInMinute > 59) checkInMinute = 59;
      
      return { 
          status: 'present', 
          checkIn: `${String(checkInHour).padStart(2, '0')}:${String(checkInMinute).padStart(2, '0')}`, 
          checkOut: '17:35' 
      };
    case 'half-day':
      return { status: 'half-day', checkIn: '08:30', checkOut: '12:00', notes: 'Nghỉ chiều' };
    case 'leave':
      return { status: 'leave', notes: 'Nghỉ phép năm' };
    case 'absent':
    default:
      return { status: 'absent' };
  }
};

export const generateMockAttendance = (employees: Employee[], year: number, month: number, settings: EmployeeSettings): AttendanceDataRow[] => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = getCurrentDate();

  return employees.map(emp => {
    const row: Partial<AnyAttendanceDataRow> & { id: string, fullName: string, systemId: string, department: Employee['department'] } = {
      systemId: emp.systemId,
      id: emp.id,
      fullName: emp.fullName,
      department: emp.department,
    };

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);
      if (isDateAfter(currentDate, today)) {
        (row as any)[`day_${day}`] = { status: 'future' };
        continue;
      }
      
      const record = generateRandomRecord(currentDate, settings);
      (row as any)[`day_${day}`] = record;
    }
    
    // FIX: Cast `row` to `AnyAttendanceDataRow`. The `recalculateSummary` function's parameter type is too strict,
    // requiring summary fields that this function is responsible for calculating. The `row` object at this point
    // contains all necessary data for the calculation. The `department` property was also added to the `row` object.
    const summary = recalculateSummary(row as AnyAttendanceDataRow, year, month, settings);

    return { ...row, ...summary } as AttendanceDataRow;
  });
};
