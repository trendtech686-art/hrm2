import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate, toISODate, isValidDate, isDateAfter, getStartOfDay, getEndOfDay, getDayOfWeek } from '../../lib/date-utils.ts';
import type { AttendanceDataRow, DailyRecord, AnyAttendanceDataRow } from './types.ts';
import type { EmployeeSettings } from '../settings/employees/types.ts';
// Function to convert Excel serial time number to HH:mm format
export function excelSerialToTime(serial: any): string {
    if (typeof serial === 'string') {
        // If it's already a time string, just ensure format
        const parts = serial.split(':');
        if (parts.length >= 2) {
            return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
        }
        return '';
    }
    if (typeof serial !== 'number' || serial < 0 || serial > 1) {
        // It might be a Date object from cellDates:true
        if (serial instanceof Date) {
            // Using UTC hours/minutes is safer for Excel dates to avoid timezone shifts.
            const hours = serial.getUTCHours();
            const minutes = serial.getUTCMinutes();
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        }
        return ''; // Invalid time serial
    }
    const totalSeconds = Math.round(serial * 86400);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}


export function recalculateSummary(
    row: AnyAttendanceDataRow, 
    year: number, 
    month: number, 
    settings: EmployeeSettings
): Pick<AttendanceDataRow, 'workDays' | 'leaveDays' | 'absentDays' | 'lateArrivals' | 'earlyDepartures' | 'otHours'> {
    let workDays = 0;
    let leaveDays = 0;
    let absentDays = 0;
    let lateArrivals = 0;
    let otHours = 0;
    
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
        const record = row[`day_${d}`] as DailyRecord;
        const workDate = new Date(year, month - 1, d);
        const isWorkingDay = settings.workingDays.includes(getDayOfWeek(workDate));

        if(record && isWorkingDay) {
           switch(record.status) {
               case 'present': workDays += 1; break;
               case 'half-day': workDays += 0.5; break;
               case 'leave': leaveDays += 1; break;
               case 'absent': absentDays += 1; break;
           }

           // Late arrival calculation
           if ((record.status === 'present' || record.status === 'half-day') && record.checkIn) {
               const workDateStr = toISODate(workDate);
               const checkInTime = new Date(`${workDateStr}T${record.checkIn}`);
               const workStartTime = new Date(`${workDateStr}T${settings.workStartTime}`);
               const allowedLateTime = new Date(workStartTime.getTime() + settings.allowedLateMinutes * 60000);

               if (isDateAfter(checkInTime, allowedLateTime)) {
                   lateArrivals++;
               }
           }
            
            // OT calculation
           if (record.overtimeCheckIn && record.overtimeCheckOut) {
                const workDateStr = toISODate(workDate);
                const otStartDate = new Date(`${workDateStr}T${record.overtimeCheckIn}`);
                const otEndDate = new Date(`${workDateStr}T${record.overtimeCheckOut}`);
                if (isValidDate(otStartDate) && isValidDate(otEndDate) && isDateAfter(otEndDate, otStartDate)) {
                    const diffInMinutes = (otEndDate.getTime() - otStartDate.getTime()) / 60000;
                    otHours += diffInMinutes / 60;
                }
           }
        }
    }
    
    return {
        workDays,
        leaveDays,
        absentDays,
        lateArrivals,
        earlyDepartures: row.earlyDepartures || 0, // Not implemented yet
        otHours: parseFloat(otHours.toFixed(2)),
    };
}
