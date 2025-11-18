export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'half-day' | 'weekend' | 'holiday' | 'future';

export interface DailyRecord {
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  overtimeCheckIn?: string;
  overtimeCheckOut?: string;
  notes?: string;
}

export interface AttendanceDataRow {
  systemId: string;
  id: string;
  fullName: string;
  department: "Kỹ thuật" | "Nhân sự" | "Kinh doanh" | "Marketing";
  [day: `day_${number}`]: DailyRecord | any;
  workDays: number;
  leaveDays: number;
  absentDays: number;
  lateArrivals: number;
  earlyDepartures: number;
  otHours: number;
}

// Helper type for dynamic updates
export type AnyAttendanceDataRow = Omit<AttendanceDataRow, `day_${number}`> & { [key: string]: any };

export type ImportPreviewRow = {
  excelRow: number;
  sheetName: string;
  employeeId?: string;
  employeeName?: string;
  day: number;
  checkIn?: string;
  checkOut?: string;
  overtimeCheckIn?: string;
  overtimeCheckOut?: string;
  status: 'ok' | 'error' | 'warning';
  message: string;
  rawData: any[];
};
