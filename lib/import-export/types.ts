/**
 * Import/Export System - Type Definitions
 * 
 * Types cho hệ thống import/export với các tính năng:
 * - Preview (rà soát) trước khi import
 * - Upsert (insert/update theo Business ID)
 * - Logging lịch sử
 * - Hỗ trợ file máy chấm công
 */

import type { SystemId } from '../id-types';

// ============================================
// IMPORT MODE TYPE
// ============================================
export type ImportMode = 'insert-only' | 'update-only' | 'upsert';

// ============================================
// LOG ENTRY TYPES
// ============================================

export interface ImportLogEntry {
  id: string;
  entityType: string;           // 'employees', 'products', 'attendance'
  entityDisplayName: string;    // 'Nhân viên', 'Sản phẩm', 'Chấm công'
  fileName: string;
  fileSize: number;
  
  // Results
  totalRows: number;
  successCount: number;
  errorCount: number;
  skippedCount: number;         // Bỏ qua (duplicate không cho update)
  insertedCount: number;        // Số record mới thêm
  updatedCount: number;         // Số record cập nhật
  
  // Import mode
  mode: 'insert-only' | 'update-only' | 'upsert';
  
  // Metadata
  performedBy: string;          // User name
  performedById: SystemId;      // User systemId
  performedAt: string;          // ISO date string
  branchId?: string;
  branchName?: string;
  
  // For attendance import
  month?: number;
  year?: number;
  
  // Error details (giới hạn 50 lỗi đầu tiên)
  errors?: Array<{
    row: number;
    field?: string;
    message: string;
  }>;
  
  // Status
  status: 'success' | 'partial' | 'failed';
}

export interface ExportLogEntry {
  id: string;
  entityType: string;
  entityDisplayName: string;
  fileName: string;
  fileSize?: number;
  
  // Results
  totalRows: number;
  scope: 'all' | 'current-page' | 'selected' | 'filtered';
  
  // Columns exported
  columnsExported: string[];
  
  // Filter applied (nếu có)
  filters?: Record<string, unknown>;
  
  // Metadata
  performedBy: string;
  performedById: SystemId;
  performedAt: string;
  
  status: 'success' | 'failed';
}

// ============================================
// FIELD CONFIG TYPES
// ============================================

export interface FieldConfig<T = unknown> {
  key: keyof T | string;
  label: string;                 // Tên cột trong Excel (tiếng Việt)
  required?: boolean;
  type: 'string' | 'number' | 'date' | 'boolean' | 'enum' | 'email' | 'phone';
  
  // For enum type
  enumValues?: string[];
  enumLabels?: Record<string, string>;  // { 'male': 'Nam', 'female': 'Nữ' }
  
  // Validation
  validator?: (value: unknown, row: unknown) => string | null | true;  // Return error message, null or true for valid
  
  // Transform
  importTransform?: (value: unknown) => unknown;   // Excel → App
  exportTransform?: (value: unknown) => unknown;   // App → Excel
  
  // Visibility
  hidden?: boolean;              // Hide from UI/export but still process
  
  // Export options
  exportable?: boolean;          // Default true
  group?: string;                // Group trong export dialog
  exportGroup?: string;          // Alias for group (backward compatible)
  defaultSelected?: boolean;     // Pre-selected trong export
  
  // Sample data for template
  example?: string;
  
  // Default value when importing empty
  defaultValue?: unknown;
  
  // Simple transform (for display purposes)
  transform?: (value: unknown) => unknown;
  
  // Reverse transform (string back to original type)
  reverseTransform?: (value: unknown) => unknown;
}

// ============================================
// IMPORT/EXPORT CONFIG TYPES
// ============================================

export interface ImportExportConfig<T> {
  entityType: string;            // 'employees', 'products'
  entityDisplayName: string;     // 'Nhân viên', 'Sản phẩm'
  
  // Fields configuration
  fields: FieldConfig<T>[];
  
  // Template
  templateFileName: string;      // 'Mau_Nhap_Nhan_Vien.xlsx'
  templateDownloadUrl?: string;  // '/templates/Mau_Nhap_Nhan_Vien.xlsx'
  sheetName?: string;            // Default: entityDisplayName
  
  // ============================================
  // UPSERT MODE (Insert hoặc Update)
  // ============================================
  // Business ID là key chính để xác định record
  upsertKey?: keyof T | string;  // Business ID field - null cho attendance (dùng compositeKey)
  
  // Cho phép update nếu đã tồn tại
  allowUpdate?: boolean;         // Default: true
  
  // Cho phép insert mới nếu chưa tồn tại  
  allowInsert?: boolean;         // Default: true
  
  // Unique key for duplicate check (ngoài businessId)
  uniqueFields?: (keyof T | string)[];    // ['email', 'phone'] - các field phải unique
  
  // Composite key cho attendance (thay vì upsertKey)
  compositeKey?: string[];       // ['employeeSystemId', 'month', 'year']
  
  // ============================================
  // PREVIEW & VALIDATION
  // ============================================
  requirePreview?: boolean;      // Default: true
  stopOnFirstError?: boolean;    // Default: false
  maxErrorsAllowed?: number;     // Default: 0 (không cho phép lỗi)
  
  // Branch requirement
  requireBranch?: boolean;
  
  // Row-level validation (mode is passed to allow skipping duplicate checks in upsert mode)
  validateRow?: (row: T, index: number, existingData: T[], mode?: ImportMode) => Array<{ field?: string; message: string }>;
  
  // ============================================
  // CUSTOM PARSER (cho file đặc biệt như máy chấm công)
  // ============================================
  customParser?: boolean;
  sourceSheetName?: string;      // Sheet name trong Excel
  headerRowIndex?: number;       // 0-indexed
  dataStartRowIndex?: number;
  
  // Employee mapping (cho attendance)
  requireEmployeeMapping?: boolean;
  mappingField?: keyof T;        // Field dùng để mapping (vd: 'employeeName')
  
  // ============================================
  // HOOKS
  // ============================================
  findExisting?: (row: T, existingData: T[]) => T | null;
  beforeImport?: (data: T[]) => Promise<T[]> | T[];
  afterImport?: (results: ImportResult<T>) => void;
  
  // Pre-transform raw row (normalize rawData trước khi transform)
  // Dùng để merge/alias các cột từ template mới
  preTransformRawRow?: (rawRow: Record<string, unknown>) => Record<string, unknown>;
  
  // Post-transform row (sau khi transform field values)
  // Dùng để enrich data, lookup IDs, etc.
  // Params: row, index, branchSystemId (for inventory)
  postTransformRow?: (row: Partial<T>, index?: number, branchSystemId?: string) => Partial<T>;
  
  // Max rows
  maxRows?: number;              // Default: 1000
}

// ============================================
// RESULT TYPES
// ============================================

export interface ImportResult<T = unknown> {
  success: boolean;
  data: T[];
  inserted: T[];
  updated: T[];
  failed: Array<{ row: number; data: Partial<T>; errors: string[] }>;
  skipped: Array<{ row: number; data: Partial<T>; reason: string }>;
  errors: Array<{ row: number; field?: string; message: string }>;
  summary: {
    total: number;
    inserted: number;
    updated: number;
    failed: number;
    skipped: number;
  };
}

export interface ExportResult {
  success: boolean;
  fileName: string;
  fileUrl?: string;
  totalRows: number;
}

// ============================================
// PREVIEW TYPES (Bước rà soát)
// ============================================

export type ImportPreviewStatus = 
  | 'valid'
  | 'warning' 
  | 'error' 
  | 'duplicate' 
  | 'will-update' 
  | 'will-insert';

export interface ImportPreviewRow<T = unknown> {
  rowNumber: number;       // Số dòng trong Excel (bắt đầu từ 2, vì 1 là header)
  rawData: Record<string, unknown>;  // Dữ liệu thô từ Excel
  transformedData: Partial<T> | null; // Dữ liệu đã transform (null nếu error)
  status: ImportPreviewStatus;
  errors: Array<{ field?: string; message: string }>;
  warnings: Array<{ field?: string; message: string }>;
  isExisting?: boolean;    // True nếu record đã tồn tại (will-update)
  existingRecord?: T;      // Record hiện có nếu là duplicate/will-update
}

export interface ImportPreviewResult<T = unknown> {
  rows: ImportPreviewRow<T>[];
  totalRows: number;
  validCount: number;
  warningCount: number;
  errorCount: number;
  duplicateCount: number;
  isValid: boolean;        // true nếu có thể proceed (validCount + warningCount > 0)
}

// ============================================
// EMPLOYEE MAPPING TYPES (cho Chấm công)
// ============================================

export interface EmployeeMappingEntry {
  id: string;
  machineEmployeeId: number;    // Mã NV từ máy CC (1, 2, 3...)
  machineName: string;          // Tên trong máy CC ("duc dat", "hieuNho")
  systemEmployeeId: string;     // Mã NV hệ thống ("NV000002")
  systemEmployeeName: string;   // Tên đầy đủ ("Nguyễn Đức Đạt")
  createdAt: string;
  updatedAt: string;
}

// ============================================
// ATTENDANCE IMPORT TYPES
// ============================================

export interface AttendanceImportRow {
  machineEmployeeId: number;
  employeeName: string;
  department: string;
  standardHours: number;
  actualHours: number;
  lateCount: number;
  lateMinutes: number;
  earlyLeaveCount: number;
  earlyLeaveMinutes: number;
  overtimeNormal: number;
  overtimeSpecial: number;
  workDays: string;             // "20/19"
  businessTrip: number;
  absentWithoutLeave: number;
  paidLeave: number;
}

export interface AttendanceSummary {
  id: string;
  employeeSystemId: string;
  employeeBusinessId: string;
  employeeName: string;
  month: number;
  year: number;
  standardHours: number;
  actualHours: number;
  lateCount: number;
  lateMinutes: number;
  earlyLeaveCount: number;
  earlyLeaveMinutes: number;
  overtimeNormal: number;
  overtimeSpecial: number;
  workDaysStandard: number;
  workDaysActual: number;
  businessTrip: number;
  absentWithoutLeave: number;
  paidLeave: number;
  importedAt: string;
  importLogId: string;
}
