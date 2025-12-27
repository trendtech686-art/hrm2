/**
 * Attendance Parser
 * 
 * Parser riêng cho file từ máy chấm công
 * File có format đặc biệt: header phức tạp, merged cells, etc.
 * 
 * Cấu trúc file t11.xls:
 * - Sheet "Bảng tổng hợp chấm công": Tổng hợp theo tháng (DÙNG CHÍNH)
 * - Row 0: Tiêu đề
 * - Row 1: Ngày thống kê (VD: "Ngày thống kê:2025-11-01~2025-11-30")
 * - Row 2-3: Headers
 * - Row 4+: Dữ liệu nhân viên
 */

import * as XLSX from 'xlsx';
import type { AttendanceImportRow } from '@/lib/import-export/types';

// ============================================
// TYPES
// ============================================

export interface AttendanceParseResult {
  success: boolean;
  data: AttendanceImportRow[];
  month: number;
  year: number;
  dateRange: { from: string; to: string };
  errors: Array<{ row: number; message: string }>;
}

// ============================================
// PARSER
// ============================================

/**
 * Parse file chấm công từ máy CC
 */
export function parseAttendanceFile(file: ArrayBuffer): AttendanceParseResult {
  try {
    const workbook = XLSX.read(file, { type: 'array' });
    
    // Tìm sheet "Bảng tổng hợp chấm công"
    const sheetName = 'Bảng tổng hợp chấm công';
    const sheet = workbook.Sheets[sheetName];
    
    if (!sheet) {
      return {
        success: false,
        data: [],
        month: 0,
        year: 0,
        dateRange: { from: '', to: '' },
        errors: [{ row: 0, message: `Không tìm thấy sheet "${sheetName}"` }],
      };
    }
    
    // Convert to array
    const rawData = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 });
    
    // Parse date range từ row 1
    const dateRangeRow = rawData[1] as string[];
    const dateRange = parseDateRange(dateRangeRow?.[0] || '');
    
    // Parse data từ row 4 trở đi
    const data: AttendanceImportRow[] = [];
    const errors: Array<{ row: number; message: string }> = [];
    
    for (let i = 4; i < rawData.length; i++) {
      const row = rawData[i] as unknown[];
      if (!row || row.length === 0) continue;
      
      // Skip if no employee ID
      const machineId = row[0];
      if (machineId === undefined || machineId === null || machineId === '') continue;
      
      try {
        const parsed = parseAttendanceRow(row, i + 1); // Excel row = index + 1
        data.push(parsed);
      } catch (err) {
        errors.push({
          row: i + 1,
          message: err instanceof Error ? err.message : 'Lỗi không xác định',
        });
      }
    }
    
    return {
      success: errors.length === 0,
      data,
      month: dateRange.month,
      year: dateRange.year,
      dateRange: { from: dateRange.from, to: dateRange.to },
      errors,
    };
  } catch (err) {
    return {
      success: false,
      data: [],
      month: 0,
      year: 0,
      dateRange: { from: '', to: '' },
      errors: [{ row: 0, message: `Lỗi đọc file: ${err instanceof Error ? err.message : 'Unknown'}` }],
    };
  }
}

/**
 * Parse date range từ string "Ngày thống kê:2025-11-01~2025-11-30"
 */
function parseDateRange(text: string): { from: string; to: string; month: number; year: number } {
  const match = text.match(/(\d{4}-\d{2}-\d{2})~(\d{4}-\d{2}-\d{2})/);
  
  if (match) {
    const from = match[1];
    const to = match[2];
    const [year, month] = from.split('-').map(Number);
    return { from, to, month, year };
  }
  
  // Default to current month
  const now = new Date();
  return {
    from: '',
    to: '',
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
}

/**
 * Parse một dòng dữ liệu nhân viên
 * 
 * Cột trong file:
 * A (0): Mã NV (máy)
 * B (1): Họ tên
 * C (2): Phòng ban
 * D (3): TG làm việc chuẩn
 * E (4): TG làm việc thực tế
 * F (5): Đến muộn (lần)
 * G (6): Đến muộn (phút)
 * H (7): Về sớm (lần)
 * I (8): Về sớm (phút)
 * J (9): Tăng ca bình thường
 * K (10): Tăng ca đặc biệt
 * L (11): Số ngày (chuẩn/thực)
 * M (12): Công tác
 * N (13): Nghỉ không phép
 * O (14): Nghỉ phép
 */
function parseAttendanceRow(row: unknown[], excelRow: number): AttendanceImportRow {
  const getNumber = (value: unknown): number => {
    if (value === undefined || value === null || value === '') return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };
  
  const getString = (value: unknown): string => {
    if (value === undefined || value === null) return '';
    return String(value).trim();
  };
  
  return {
    machineEmployeeId: getNumber(row[0]),
    employeeName: getString(row[1]),
    department: getString(row[2]),
    standardHours: getNumber(row[3]),
    actualHours: getNumber(row[4]),
    lateCount: getNumber(row[5]),
    lateMinutes: getNumber(row[6]),
    earlyLeaveCount: getNumber(row[7]),
    earlyLeaveMinutes: getNumber(row[8]),
    overtimeNormal: getNumber(row[9]),
    overtimeSpecial: getNumber(row[10]),
    workDays: getString(row[11]),
    businessTrip: getNumber(row[12]),
    absentWithoutLeave: getNumber(row[13]),
    paidLeave: getNumber(row[14]),
  };
}

// ============================================
// UTILITIES
// ============================================

/**
 * Parse workDays string "20/19" → { standard: 20, actual: 19 }
 */
export function parseWorkDays(workDays: string): { standard: number; actual: number } {
  const cleaned = workDays.replace(/\s/g, '');
  const match = cleaned.match(/(\d+)\/(\d+)/);
  
  if (match) {
    return {
      standard: parseInt(match[1], 10),
      actual: parseInt(match[2], 10),
    };
  }
  
  return { standard: 0, actual: 0 };
}

/**
 * Get available sheets in workbook
 */
export function getAvailableSheets(file: ArrayBuffer): string[] {
  const workbook = XLSX.read(file, { type: 'array' });
  return workbook.SheetNames;
}

/**
 * Preview first N rows of a sheet
 */
export function previewSheet(
  file: ArrayBuffer,
  sheetName: string,
  maxRows = 10
): unknown[][] {
  const workbook = XLSX.read(file, { type: 'array' });
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) return [];
  
  const data = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 });
  return data.slice(0, maxRows);
}
