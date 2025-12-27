/**
 * Attendance Mapper - Bảng chấm công
 * Đồng bộ với variables/bang-cham-cong.ts
 */

import { 
  PrintData, 
  PrintLineItem,
  formatCurrency, 
  formatDate,
  formatTime,
  getStoreData,
  StoreSettings
} from '@/lib/print-service';

// ============================================
// TYPES
// ============================================

export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'half-day' | 'weekend' | 'holiday' | 'future';

export interface DailyAttendanceRecord {
  day: number;
  dayOfWeek?: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  overtimeCheckIn?: string;
  overtimeCheckOut?: string;
  notes?: string;
}

export interface AttendanceSheetForPrint {
  // Thông tin kỳ
  monthKey: string; // yyyy-MM
  month?: number;
  year?: number;
  departmentName?: string;
  isLocked?: boolean;
  
  // Audit
  createdAt?: string | Date;
  createdBy?: string;
  
  // Tổng kết
  totalEmployees: number;
  totalWorkDays: number;
  totalLeaveDays: number;
  totalAbsentDays: number;
  totalLateArrivals: number;
  totalEarlyDepartures: number;
  totalOtHours: number;
  
  // Chi tiết nhân viên
  employees?: AttendanceEmployeeForPrint[];
}

export interface AttendanceEmployeeForPrint {
  employeeCode: string;
  employeeName: string;
  departmentName?: string;
  workDays: number;
  leaveDays: number;
  absentDays: number;
  lateArrivals: number;
  earlyDepartures: number;
  otHours: number;
  // Dữ liệu từng ngày (day_1 đến day_31)
  dailyRecords?: Record<string, AttendanceStatus | string>;
  // Chi tiết giờ vào/ra (checkin_1 đến checkin_31, checkout_1 đến checkout_31)
  dailyCheckIn?: Record<string, string>;
  dailyCheckOut?: Record<string, string>;
  dailyOtIn?: Record<string, string>;
  dailyOtOut?: Record<string, string>;
  dailyNotes?: Record<string, string>;
}

// Chi tiết chấm công từng nhân viên (để in chi tiết cá nhân)
export interface AttendanceDetailForPrint {
  // Thông tin kỳ
  monthKey: string;
  
  // Thông tin nhân viên
  employeeCode: string;
  employeeName: string;
  departmentName?: string;
  
  // Tổng kết
  workDays: number;
  leaveDays: number;
  absentDays: number;
  lateArrivals: number;
  earlyDepartures: number;
  otHours: number;
  
  // Chi tiết từng ngày
  dailyDetails?: DailyAttendanceRecord[];
}

// ============================================
// STATUS MAPS
// ============================================

const STATUS_MAP: Record<AttendanceStatus, string> = {
  'present': 'Có mặt',
  'absent': 'Vắng',
  'leave': 'Nghỉ phép',
  'half-day': 'Nửa ngày',
  'weekend': 'Cuối tuần',
  'holiday': 'Nghỉ lễ',
  'future': '-',
};

const STATUS_SHORT_MAP: Record<AttendanceStatus, string> = {
  'present': '✓',
  'absent': 'X',
  'leave': 'P',
  'half-day': '½',
  'weekend': '-',
  'holiday': 'L',
  'future': '-',
};

const DAY_OF_WEEK_MAP: Record<number, string> = {
  0: 'CN',
  1: 'T2',
  2: 'T3',
  3: 'T4',
  4: 'T5',
  5: 'T6',
  6: 'T7',
};

// ============================================
// SHEET MAPPER (Bảng chấm công tổng)
// ============================================

export function mapAttendanceSheetToPrintData(
  sheet: AttendanceSheetForPrint, 
  storeSettings: StoreSettings
): PrintData {
  const [year, month] = sheet.monthKey.split('-').map(Number);
  
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN BẢNG CHẤM CÔNG ===
    '{month_year}': `${month}/${year}`,
    '{month}': String(month),
    '{year}': String(year),
    '{department_name}': sheet.departmentName || 'Tất cả phòng ban',
    '{is_locked}': sheet.isLocked ? 'Đã khóa' : 'Đang mở',
    '{created_on}': formatDate(sheet.createdAt),
    '{created_by}': sheet.createdBy || '',
    
    // === TỔNG KẾT ===
    '{total_employees}': String(sheet.totalEmployees),
    '{total_work_days}': String(sheet.totalWorkDays),
    '{total_leave_days}': String(sheet.totalLeaveDays),
    '{total_absent_days}': String(sheet.totalAbsentDays),
    '{total_late_arrivals}': String(sheet.totalLateArrivals),
    '{total_early_departures}': String(sheet.totalEarlyDepartures),
    '{total_ot_hours}': String(sheet.totalOtHours),
  };
}

export function mapAttendanceSheetLineItems(
  employees?: AttendanceEmployeeForPrint[],
  monthKey?: string
): PrintLineItem[] {
  if (!employees?.length) return [];
  
  // Parse year and month for day of week calculation
  const [year, month] = monthKey ? monthKey.split('-').map(Number) : [new Date().getFullYear(), new Date().getMonth() + 1];
  
  return employees.map((emp, index) => {
    const lineItem: PrintLineItem = {
      '{line_index}': String(index + 1),
      '{employee_code}': emp.employeeCode,
      '{employee_name}': emp.employeeName,
      '{department_name}': emp.departmentName || '',
      '{work_days}': String(emp.workDays),
      '{leave_days}': String(emp.leaveDays),
      '{absent_days}': String(emp.absentDays),
      '{late_arrivals}': String(emp.lateArrivals),
      '{early_departures}': String(emp.earlyDepartures),
      '{ot_hours}': String(emp.otHours),
    };
    
    // Add day_1 to day_31 with all details
    for (let d = 1; d <= 31; d++) {
      const dayKey = `day_${d}`;
      const status = emp.dailyRecords?.[dayKey] as AttendanceStatus | undefined;
      
      // Day status (short form)
      lineItem[`{${dayKey}}`] = status ? STATUS_SHORT_MAP[status] || status : '';
      
      // Day of week
      const date = new Date(year, month - 1, d);
      const isValidDate = date.getMonth() === month - 1; // Check if day exists in month
      lineItem[`{dow_${d}}`] = isValidDate ? DAY_OF_WEEK_MAP[date.getDay()] || '' : '';
      
      // Check-in/out times
      lineItem[`{checkin_${d}}`] = emp.dailyCheckIn?.[dayKey] || '';
      lineItem[`{checkout_${d}}`] = emp.dailyCheckOut?.[dayKey] || '';
      
      // OT times  
      lineItem[`{ot_in_${d}}`] = emp.dailyOtIn?.[dayKey] || '';
      lineItem[`{ot_out_${d}}`] = emp.dailyOtOut?.[dayKey] || '';
      
      // Notes
      lineItem[`{note_${d}}`] = emp.dailyNotes?.[dayKey] || '';
    }
    
    return lineItem;
  });
}

// ============================================
// DETAIL MAPPER (Chi tiết chấm công cá nhân)
// ============================================

export function mapAttendanceDetailToPrintData(
  detail: AttendanceDetailForPrint,
  storeSettings: StoreSettings
): PrintData {
  const [year, month] = detail.monthKey.split('-').map(Number);
  
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN NHÂN VIÊN ===
    '{employee_code}': detail.employeeCode,
    '{employee_name}': detail.employeeName,
    '{department_name}': detail.departmentName || '',
    
    // === THÔNG TIN KỲ ===
    '{month_year}': `${month}/${year}`,
    
    // === TỔNG KẾT ===
    '{work_days}': String(detail.workDays),
    '{leave_days}': String(detail.leaveDays),
    '{absent_days}': String(detail.absentDays),
    '{late_arrivals}': String(detail.lateArrivals),
    '{early_departures}': String(detail.earlyDepartures),
    '{ot_hours}': String(detail.otHours),
  };
}

export function mapAttendanceDetailLineItems(
  dailyDetails?: DailyAttendanceRecord[]
): PrintLineItem[] {
  if (!dailyDetails?.length) return [];
  
  return dailyDetails.map((record, index) => ({
    '{line_index}': String(index + 1),
    '{day}': String(record.day),
    '{day_of_week}': record.dayOfWeek || getDayOfWeekLabel(record.day),
    '{status}': STATUS_MAP[record.status] || record.status,
    '{check_in}': record.checkIn || '',
    '{check_out}': record.checkOut || '',
    '{ot_check_in}': record.overtimeCheckIn || '',
    '{ot_check_out}': record.overtimeCheckOut || '',
    '{notes}': record.notes || '',
  }));
}

// Helper to get day of week label from day number (requires year/month context)
function getDayOfWeekLabel(day: number, year?: number, month?: number): string {
  if (!year || !month) return '';
  const date = new Date(year, month - 1, day);
  return DAY_OF_WEEK_MAP[date.getDay()] || '';
}
