/**
 * Attendance Import/Export Config
 * 
 * Cấu hình import chấm công từ máy CC
 * 
 * ⚠️ LƯU Ý: File từ máy CC có format đặc biệt
 * - Sheet "Bảng tổng hợp chấm công"
 * - Header phức tạp (2 dòng, merged cells)
 * - Mã NV máy CC khác mã NV hệ thống → cần mapping
 */

import type { ImportExportConfig, FieldConfig, AttendanceImportRow } from '@/lib/import-export/types';

// ============================================
// FIELD DEFINITIONS
// ============================================

const attendanceFields: FieldConfig<AttendanceImportRow>[] = [
  {
    key: 'machineEmployeeId',
    label: 'Mã NV (máy) (*)',
    required: true,
    type: 'number',
    example: '1',
    exportGroup: 'Thông tin NV',
    defaultSelected: true,
  },
  {
    key: 'employeeName',
    label: 'Họ tên (*)',
    required: true,
    type: 'string',
    example: 'nguyen van a',
    exportGroup: 'Thông tin NV',
    defaultSelected: true,
  },
  {
    key: 'department',
    label: 'Phòng ban',
    type: 'string',
    example: 'CÔNG TY',
    exportGroup: 'Thông tin NV',
  },
  {
    key: 'standardHours',
    label: 'Giờ chuẩn',
    type: 'number',
    example: '160',
    exportGroup: 'Thời gian',
    defaultSelected: true,
  },
  {
    key: 'actualHours',
    label: 'Giờ thực tế',
    type: 'number',
    example: '145.28',
    exportGroup: 'Thời gian',
    defaultSelected: true,
  },
  {
    key: 'lateCount',
    label: 'Đến muộn (lần)',
    type: 'number',
    example: '3',
    exportGroup: 'Đến muộn/Về sớm',
    defaultSelected: true,
  },
  {
    key: 'lateMinutes',
    label: 'Đến muộn (phút)',
    type: 'number',
    example: '97',
    exportGroup: 'Đến muộn/Về sớm',
    defaultSelected: true,
  },
  {
    key: 'earlyLeaveCount',
    label: 'Về sớm (lần)',
    type: 'number',
    example: '2',
    exportGroup: 'Đến muộn/Về sớm',
  },
  {
    key: 'earlyLeaveMinutes',
    label: 'Về sớm (phút)',
    type: 'number',
    example: '36',
    exportGroup: 'Đến muộn/Về sớm',
  },
  {
    key: 'overtimeNormal',
    label: 'Tăng ca thường (giờ)',
    type: 'number',
    example: '6.55',
    exportGroup: 'Tăng ca',
    defaultSelected: true,
  },
  {
    key: 'overtimeSpecial',
    label: 'Tăng ca đặc biệt (giờ)',
    type: 'number',
    example: '43.5',
    exportGroup: 'Tăng ca',
  },
  {
    key: 'workDays',
    label: 'Ngày công (chuẩn/thực)',
    type: 'string',
    example: '20/19',
    exportGroup: 'Ngày công',
    defaultSelected: true,
  },
  {
    key: 'businessTrip',
    label: 'Công tác (ngày)',
    type: 'number',
    example: '2',
    exportGroup: 'Nghỉ phép',
  },
  {
    key: 'absentWithoutLeave',
    label: 'Nghỉ không phép (ngày)',
    type: 'number',
    example: '1',
    exportGroup: 'Nghỉ phép',
    defaultSelected: true,
  },
  {
    key: 'paidLeave',
    label: 'Nghỉ phép (ngày)',
    type: 'number',
    example: '0',
    exportGroup: 'Nghỉ phép',
  },
];

// ============================================
// CONFIG
// ============================================

export const attendanceImportExportConfig: ImportExportConfig<AttendanceImportRow> = {
  entityType: 'attendance',
  entityDisplayName: 'Chấm công (từ máy CC)',

  // Template - dùng file gốc từ máy CC
  templateFileName: 'Mau_ChamCong_MayCC.xls',
  templateDownloadUrl: '/templates/Mau_ChamCong_MayCC.xls',
  
  // ⚠️ SPECIAL: Custom parser
  customParser: true,
  sourceSheetName: 'Bảng tổng hợp chấm công',
  headerRowIndex: 2,        // 0-indexed (row 3 trong Excel)
  dataStartRowIndex: 4,     // 0-indexed (row 5 trong Excel)

  // Fields
  fields: attendanceFields,

  // ⚠️ KHÔNG dùng upsertKey thông thường
  // Vì máy CC dùng mã 1,2,3... không phải NV000001
  upsertKey: undefined,
  
  // Thay vào đó: Composite key cho upsert
  compositeKey: ['employeeSystemId', 'month', 'year'],

  // Employee mapping
  requireEmployeeMapping: true,
  mappingField: 'employeeName',

  // Upsert config
  allowUpdate: true,        // Cho phép update nếu tháng đã có
  allowInsert: true,        // Cho phép thêm mới

  // Preview config
  requirePreview: true,
  stopOnFirstError: false,
  maxErrorsAllowed: 0,

  maxRows: 100,             // Thường mỗi tháng < 100 NV

  // Validation
  validateRow: (row, _index, _existingData) => {
    const errors: Array<{ field?: string; message: string }> = [];

    // Check tên không rỗng
    if (!row.employeeName || row.employeeName.trim() === '') {
      errors.push({ field: 'employeeName', message: 'Họ tên không được trống' });
    }

    // Check giờ thực tế không âm
    if (row.actualHours < 0) {
      errors.push({ field: 'actualHours', message: 'Giờ thực tế không được âm' });
    }

    // Check giờ thực tế không vượt quá chuẩn + tăng ca quá nhiều
    const maxHours = row.standardHours + 100; // Tối đa 100 giờ tăng ca/tháng
    if (row.actualHours > maxHours) {
      errors.push({ 
        field: 'actualHours', 
        message: `Giờ thực tế (${row.actualHours}h) vượt quá giới hạn (${maxHours}h)` 
      });
    }

    // Check số phút đến muộn hợp lý
    if (row.lateMinutes > 0 && row.lateCount === 0) {
      errors.push({ 
        field: 'lateCount', 
        message: 'Có phút đến muộn nhưng số lần = 0' 
      });
    }

    return errors;
  },

  // After import hook
  afterImport: (results) => {
    console.log(`Import chấm công hoàn tất:
      - Thêm mới: ${results.inserted.length}
      - Cập nhật: ${results.updated.length}
      - Lỗi: ${results.failed.length}
      - Bỏ qua: ${results.skipped.length}`);
  },
};

// Export fields cho re-use
export { attendanceFields };
