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
    const row: AnyAttendanceDataRow = {
      systemId: emp.systemId,
      employeeSystemId: emp.systemId,
      employeeId: emp.id,
      fullName: emp.fullName,
      department: emp.department,
    };

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);
      if (isDateAfter(currentDate, today)) {
        row[`day_${day}`] = { status: 'future' };
        continue;
      }
      
      const record = generateRandomRecord(currentDate, settings);
      row[`day_${day}`] = record;
    }
    
    const summary = recalculateSummary(row, year, month, settings);

    return { ...row, ...summary } as AttendanceDataRow;
  });
};
