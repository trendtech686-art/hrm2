import type { SystemId, BusinessId } from '../../lib/id-types.ts';

export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'half-day' | 'weekend' | 'holiday' | 'future';

export interface DailyRecord {
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  overtimeCheckIn?: string;
  overtimeCheckOut?: string;
  notes?: string;
}

export type DepartmentName = "Kỹ thuật" | "Nhân sự" | "Kinh doanh" | "Marketing";

export type AttendanceDayKey = `day_${number}`;

type AttendanceDayRecords = Partial<Record<AttendanceDayKey, DailyRecord>>;

type AttendanceSummaryFields = {
  systemId: SystemId; // Lưu cho table responsive
  employeeSystemId: SystemId; // Khóa nội bộ để query/update
  employeeId: BusinessId; // Mã hiển thị cho người dùng
  fullName: string;
  department: DepartmentName;
  workDays: number;
  leaveDays: number;
  absentDays: number;
  lateArrivals: number;
  earlyDepartures: number;
  otHours: number;
};

export type AttendanceDataRow = AttendanceSummaryFields & AttendanceDayRecords;

// Helper type for dynamic updates/calculations before summary fields are finalized
export type AnyAttendanceDataRow = AttendanceDayRecords & {
  systemId: SystemId;
  employeeSystemId: SystemId;
  employeeId: BusinessId;
  fullName: string;
  department: DepartmentName;
  workDays?: number;
  leaveDays?: number;
  absentDays?: number;
  lateArrivals?: number;
  earlyDepartures?: number;
  otHours?: number;
  [key: string]: unknown;
};

export type ImportPreviewRow = {
  excelRow: number;
  sheetName: string;
  employeeSystemId?: SystemId;
  employeeId?: BusinessId;
  employeeName?: string;
  day: number;
  checkIn?: string;
  checkOut?: string;
  overtimeCheckIn?: string;
  overtimeCheckOut?: string;
  status: 'ok' | 'error' | 'warning';
  message: string;
  rawData: unknown[];
};
