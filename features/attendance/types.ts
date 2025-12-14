import type { SystemId, BusinessId } from '../../lib/id-types.ts';

export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'half-day' | 'weekend' | 'holiday' | 'future';

export interface DailyRecord {
  status: AttendanceStatus;
  checkIn?: string | undefined;           // Sáng - Làm việc (giờ vào sáng)
  morningCheckOut?: string | undefined;   // Sáng - Tan làm (giờ ra sáng)
  afternoonCheckIn?: string | undefined;  // Chiều - Làm việc (giờ vào chiều)
  checkOut?: string | undefined;          // Chiều - Tan làm (giờ ra chiều)
  overtimeCheckIn?: string | undefined;
  overtimeCheckOut?: string | undefined;
  notes?: string | undefined;
}

export type DepartmentName = "Kỹ thuật" | "Nhân sự" | "Kinh doanh" | "Marketing";

export type AttendanceDayKey = `day_${number}`;

type AttendanceDayRecords = Partial<Record<AttendanceDayKey, DailyRecord>>;

type AttendanceSummaryFields = {
  systemId: SystemId; // Lưu cho table responsive
  employeeSystemId: SystemId; // Khóa nội bộ để query/update
  employeeId: BusinessId; // Mã hiển thị cho người dùng
  fullName: string;
  department: DepartmentName | undefined;
  workDays: number;
  leaveDays: number;
  absentDays: number;
  lateArrivals: number;
  earlyDepartures: number;
  otHours: number;
  // Chi tiết OT theo loại ngày
  otHoursWeekday?: number;   // Giờ làm thêm ngày thường (sau giờ tan làm)
  otHoursWeekend?: number;   // Giờ làm thêm cuối tuần
  otHoursHoliday?: number;   // Giờ làm thêm ngày lễ
};

export type AttendanceDataRow = AttendanceSummaryFields & AttendanceDayRecords;

// Helper type for dynamic updates/calculations before summary fields are finalized
export type AnyAttendanceDataRow = AttendanceDayRecords & {
  systemId: SystemId;
  employeeSystemId: SystemId;
  employeeId: BusinessId;
  fullName: string;
  department: DepartmentName | undefined;
  workDays?: number;
  leaveDays?: number;
  absentDays?: number;
  lateArrivals?: number;
  earlyDepartures?: number;
  otHours?: number;
  otHoursWeekday?: number;
  otHoursWeekend?: number;
  otHoursHoliday?: number;
  [key: string]: unknown;
};

export type ImportPreviewRow = {
  excelRow: number;
  sheetName: string;
  employeeSystemId?: SystemId | undefined;
  employeeId?: BusinessId | undefined;
  employeeName?: string | undefined;
  day: number;
  checkIn?: string | undefined;           // Sáng - Làm việc (giờ vào sáng)
  morningCheckOut?: string | undefined;   // Sáng - Tan làm (giờ ra sáng)
  afternoonCheckIn?: string | undefined;  // Chiều - Làm việc (giờ vào chiều)
  checkOut?: string | undefined;          // Chiều - Tan làm (giờ ra chiều)
  overtimeCheckIn?: string | undefined;
  overtimeCheckOut?: string | undefined;
  status: 'ok' | 'error' | 'warning';
  message: string;
  error?: string | undefined;
  rawData: unknown[];
};
