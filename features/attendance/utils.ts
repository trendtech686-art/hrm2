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
            // Use local time (getHours/getMinutes) for Vietnam timezone GMT+7
            const hours = serial.getHours();
            const minutes = serial.getMinutes();
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
): Pick<AttendanceDataRow, 'workDays' | 'leaveDays' | 'absentDays' | 'lateArrivals' | 'earlyDepartures' | 'otHours' | 'otHoursWeekday' | 'otHoursWeekend' | 'otHoursHoliday'> {
    let totalWorkMinutes = 0; // Tổng phút làm việc trong giờ hành chính (8:30-18:00)
    let leaveDays = 0;
    let absentDays = 0;
    let lateArrivals = 0;
    let earlyDepartures = 0;
    
    // OT theo loại ngày
    let otMinutesWeekday = 0;  // Làm thêm ngày thường (sau 18h)
    let otMinutesWeekend = 0;  // Làm thêm cuối tuần
    let otMinutesHoliday = 0;  // Làm thêm ngày lễ
    
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // Tính số giờ làm việc tiêu chuẩn 1 ngày (trừ nghỉ trưa)
    // VD: 8:30-18:00 = 9.5h, trừ nghỉ trưa 1.5h = 8h
    const workStartParts = settings.workStartTime.split(':').map(Number);
    const workEndParts = settings.workEndTime.split(':').map(Number);
    const workStartMinutes = workStartParts[0] * 60 + workStartParts[1];
    const workEndMinutes = workEndParts[0] * 60 + workEndParts[1];
    const standardDayMinutes = workEndMinutes - workStartMinutes - settings.lunchBreakDuration;
    
    // Lấy giờ nghỉ trưa từ settings (nếu có), fallback về hardcode
    const lunchStartParts = (settings.lunchBreakStart || '12:00').split(':').map(Number);
    const lunchEndParts = (settings.lunchBreakEnd || '13:30').split(':').map(Number);
    const lunchStartMinutes = lunchStartParts[0] * 60 + lunchStartParts[1];
    const lunchEndMinutes = lunchEndParts[0] * 60 + lunchEndParts[1];

    for (let d = 1; d <= daysInMonth; d++) {
        const record = row[`day_${d}`] as DailyRecord;
        const workDate = new Date(year, month - 1, d);
        const dayOfWeek = getDayOfWeek(workDate);
        const isWorkingDay = dayOfWeek !== null && settings.workingDays.includes(dayOfWeek);
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // CN = 0, T7 = 6
        const isHoliday = record?.status === 'holiday';

        if (record) {
            // Xử lý cho ngày làm việc (thứ 2-6)
            if (isWorkingDay) {
                // Tính giờ làm việc thực tế từ checkIn/checkOut
                if (record.checkIn && record.checkOut) {
                    const workDateStr = toISODate(workDate);
                    const checkInTime = new Date(`${workDateStr}T${record.checkIn}`);
                    const checkOutTime = new Date(`${workDateStr}T${record.checkOut}`);
                    
                    if (isValidDate(checkInTime) && isValidDate(checkOutTime) && isDateAfter(checkOutTime, checkInTime)) {
                        const checkInMins = checkInTime.getHours() * 60 + checkInTime.getMinutes();
                        const checkOutMins = checkOutTime.getHours() * 60 + checkOutTime.getMinutes();
                        
                        // ===== TÍNH GIỜ CÔNG (trong giờ hành chính 8:30-18:00) =====
                        // Giờ vào tính công = max(checkIn, workStart)
                        const effectiveStartMins = Math.max(checkInMins, workStartMinutes);
                        // Giờ ra tính công = min(checkOut, workEnd)
                        const effectiveEndMins = Math.min(checkOutMins, workEndMinutes);
                        
                        let workedMinutes = effectiveEndMins - effectiveStartMins;
                        
                        // Trừ nghỉ trưa nếu làm qua giờ nghỉ trưa
                        if (effectiveStartMins < lunchStartMinutes && effectiveEndMins > lunchEndMinutes) {
                            workedMinutes -= settings.lunchBreakDuration;
                        } else if (effectiveStartMins < lunchEndMinutes && effectiveEndMins > lunchStartMinutes) {
                            // Nếu chỉ chạm 1 phần giờ nghỉ trưa
                            const overlapStart = Math.max(effectiveStartMins, lunchStartMinutes);
                            const overlapEnd = Math.min(effectiveEndMins, lunchEndMinutes);
                            workedMinutes -= Math.max(0, overlapEnd - overlapStart);
                        }
                        
                        totalWorkMinutes += Math.max(0, workedMinutes);
                        
                        // ===== TÍNH GIỜ LÀM THÊM (sau giờ tan làm 18:00) =====
                        if (checkOutMins > workEndMinutes) {
                            const otMinutes = checkOutMins - workEndMinutes;
                            if (isHoliday) {
                                otMinutesHoliday += otMinutes;
                            } else {
                                otMinutesWeekday += otMinutes;
                            }
                        }
                        
                        // Early departure calculation - ra trước giờ tan làm
                        if (checkOutMins < workEndMinutes) {
                            earlyDepartures++;
                        }
                    }
                }
                
                // Đếm ngày nghỉ phép
                if (record.status === 'leave') {
                    leaveDays += 1;
                }

                // Late arrival calculation
                if (record.checkIn) {
                    const workDateStr = toISODate(workDate);
                    const checkInTime = new Date(`${workDateStr}T${record.checkIn}`);
                    const workStartTime = new Date(`${workDateStr}T${settings.workStartTime}`);
                    const allowedLateTime = new Date(workStartTime.getTime() + settings.allowedLateMinutes * 60000);

                    if (isDateAfter(checkInTime, allowedLateTime)) {
                        lateArrivals++;
                    }
                }
            }
            
            // ===== XỬ LÝ LÀM THÊM CUỐI TUẦN / NGÀY LỄ =====
            // Nếu là cuối tuần hoặc ngày lễ mà có checkIn/checkOut → tính toàn bộ là OT
            if ((isWeekend || isHoliday) && record.checkIn && record.checkOut) {
                const workDateStr = toISODate(workDate);
                const checkInTime = new Date(`${workDateStr}T${record.checkIn}`);
                const checkOutTime = new Date(`${workDateStr}T${record.checkOut}`);
                
                if (isValidDate(checkInTime) && isValidDate(checkOutTime) && isDateAfter(checkOutTime, checkInTime)) {
                    let otMinutes = (checkOutTime.getTime() - checkInTime.getTime()) / 60000;
                    
                    // Trừ nghỉ trưa nếu làm qua trưa
                    const checkInMins = checkInTime.getHours() * 60 + checkInTime.getMinutes();
                    const checkOutMins = checkOutTime.getHours() * 60 + checkOutTime.getMinutes();
                    if (checkInMins < lunchStartMinutes && checkOutMins > lunchEndMinutes) {
                        otMinutes -= settings.lunchBreakDuration;
                    }
                    
                    if (isHoliday) {
                        otMinutesHoliday += Math.max(0, otMinutes);
                    } else {
                        otMinutesWeekend += Math.max(0, otMinutes);
                    }
                }
            }
            
            // OT từ cột overtimeCheckIn/overtimeCheckOut riêng (nếu có)
            if (record.overtimeCheckIn && record.overtimeCheckOut) {
                const workDateStr = toISODate(workDate);
                const otStartDate = new Date(`${workDateStr}T${record.overtimeCheckIn}`);
                const otEndDate = new Date(`${workDateStr}T${record.overtimeCheckOut}`);
                if (isValidDate(otStartDate) && isValidDate(otEndDate) && isDateAfter(otEndDate, otStartDate)) {
                    const diffInMinutes = (otEndDate.getTime() - otStartDate.getTime()) / 60000;
                    if (isHoliday) {
                        otMinutesHoliday += diffInMinutes;
                    } else if (isWeekend) {
                        otMinutesWeekend += diffInMinutes;
                    } else {
                        otMinutesWeekday += diffInMinutes;
                    }
                }
            }
        }
    }
    
    // Tính số công = Tổng giờ làm / Giờ tiêu chuẩn 1 ngày (tối đa = số ngày làm việc trong tháng)
    const workDays = standardDayMinutes > 0 
        ? parseFloat((totalWorkMinutes / standardDayMinutes).toFixed(2))
        : 0;
    
    // Tính ngày vắng = Tổng ngày làm việc trong tháng - ngày có công - ngày phép
    const totalWorkingDaysInMonth = Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(year, month - 1, i + 1);
        const dow = getDayOfWeek(d);
        return dow !== null && settings.workingDays.includes(dow) ? 1 : 0;
    }).reduce((a, b) => a + b, 0);
    
    absentDays = Math.max(0, totalWorkingDaysInMonth - Math.ceil(workDays) - leaveDays);
    
    // Convert OT từ phút sang giờ
    const otHoursWeekday = parseFloat((otMinutesWeekday / 60).toFixed(2));
    const otHoursWeekend = parseFloat((otMinutesWeekend / 60).toFixed(2));
    const otHoursHoliday = parseFloat((otMinutesHoliday / 60).toFixed(2));
    const otHours = parseFloat((otHoursWeekday + otHoursWeekend + otHoursHoliday).toFixed(2));
    
    return {
        workDays,
        leaveDays,
        absentDays,
        lateArrivals,
        earlyDepartures,
        otHours,
        otHoursWeekday,
        otHoursWeekend,
        otHoursHoliday,
    };
}

/**
 * Tính tiền làm thêm (OT) dựa trên số giờ và cài đặt
 * 
 * Công thức:
 * - Ngày thường: otHoursWeekday * otHourlyRate (VNĐ/giờ)
 * - Cuối tuần: otHoursWeekend * otHourlyRate * otRateWeekend (hệ số 1.5)
 * - Ngày lễ: otHoursHoliday * otHourlyRate * otRateHoliday (hệ số 3)
 * 
 * VD: settings.otHourlyRate = 25000, otRateWeekend = 1.5, otRateHoliday = 3
 * - 2 giờ OT ngày thường = 2 * 25000 = 50,000 VNĐ
 * - 2 giờ OT cuối tuần = 2 * 25000 * 1.5 = 75,000 VNĐ
 * - 2 giờ OT ngày lễ = 2 * 25000 * 3 = 150,000 VNĐ
 */
export function calculateOvertimePay(
    otHoursWeekday: number,
    otHoursWeekend: number,
    otHoursHoliday: number,
    settings: EmployeeSettings
): {
    weekdayPay: number;
    weekendPay: number;
    holidayPay: number;
    totalOtPay: number;
} {
    const hourlyRate = settings.otHourlyRate || 0;
    
    // Ngày thường: tiền/giờ * số giờ
    const weekdayPay = otHoursWeekday * hourlyRate;
    
    // Cuối tuần: tiền/giờ * hệ số cuối tuần * số giờ
    const weekendPay = otHoursWeekend * hourlyRate * (settings.otRateWeekend || 1.5);
    
    // Ngày lễ: tiền/giờ * hệ số ngày lễ * số giờ  
    const holidayPay = otHoursHoliday * hourlyRate * (settings.otRateHoliday || 3);
    
    const totalOtPay = weekdayPay + weekendPay + holidayPay;
    
    return {
        weekdayPay: Math.round(weekdayPay),
        weekendPay: Math.round(weekendPay),
        holidayPay: Math.round(holidayPay),
        totalOtPay: Math.round(totalOtPay),
    };
}

/**
 * Tính tiền OT từ AttendanceDataRow
 */
export function calculateOvertimePayFromRow(
    row: AttendanceDataRow,
    settings: EmployeeSettings
): ReturnType<typeof calculateOvertimePay> {
    return calculateOvertimePay(
        row.otHoursWeekday || 0,
        row.otHoursWeekend || 0,
        row.otHoursHoliday || 0,
        settings
    );
}