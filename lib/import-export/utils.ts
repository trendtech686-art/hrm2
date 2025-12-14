/**
 * Import/Export Utilities
 * 
 * Các hàm tiện ích cho import/export:
 * - Preview (rà soát) dữ liệu trước khi import
 * - Validate fields và rows
 * - Transform data
 */

import type {
  ImportExportConfig,
  ImportPreviewRow,
  ImportPreviewResult,
  ImportPreviewStatus,
  FieldConfig,
} from './types';
import { formatDateForDisplay } from '@/lib/date-utils';

// ============================================
// PREVIEW IMPORT DATA
// ============================================

type ImportMode = 'insert-only' | 'update-only' | 'upsert';

/**
 * Rà soát dữ liệu trước khi import
 * Trả về preview với status từng dòng
 */
export function previewImportData<T>(
  rawRows: Record<string, unknown>[],
  config: ImportExportConfig<T>,
  existingData: T[],
  mode: ImportMode = 'upsert',
  branchSystemId?: string
): ImportPreviewResult<T> {
  const rows: ImportPreviewRow<T>[] = [];
  let validCount = 0;
  let warningCount = 0;
  let errorCount = 0;
  let duplicateCount = 0;

  rawRows.forEach((rawData, index) => {
    const rowErrors: Array<{ field?: string; message: string }> = [];
    const rowWarnings: Array<{ field?: string; message: string }> = [];

    // 0.5. Apply preTransformRawRow if defined (normalize/merge raw columns)
    let normalizedRawData = rawData;
    if (config.preTransformRawRow) {
      normalizedRawData = config.preTransformRawRow(rawData);
    }

    // 1. Transform raw data to typed data
    let transformedData = transformImportRow<T>(normalizedRawData, config.fields);

    // 1.5. Apply postTransformRow if defined (enrich data, lookup IDs, etc.)
    if (config.postTransformRow) {
      transformedData = config.postTransformRow(transformedData, index, branchSystemId);
    }

    // 2. Validate từng field theo config
    for (const field of config.fields) {
      if (field.hidden) continue; // Skip hidden fields
      
      const value = transformedData[field.key as keyof typeof transformedData];
      const fieldErrors = validateField(value, field, transformedData);
      
      // Separate warnings from errors (warnings start with [Warning])
      fieldErrors.forEach(err => {
        if (err.message.startsWith('[Warning]')) {
          rowWarnings.push({ ...err, message: err.message.replace('[Warning] ', '') });
        } else {
          rowErrors.push(err);
        }
      });
    }

    // 3. Validate row-level (custom validation) - pass mode so it can skip duplicate checks in upsert
    if (config.validateRow) {
      const rowLevelErrors = config.validateRow(transformedData as T, index, existingData, mode);
      rowLevelErrors.forEach(err => {
        if (err.message.startsWith('[Warning]')) {
          rowWarnings.push({ ...err, message: err.message.replace('[Warning] ', '') });
        } else {
          rowErrors.push(err);
        }
      });
    }

    // 4. Check existing record (upsert logic)
    let existingRecord: T | null = null;
    let isExisting = false;
    let status: ImportPreviewStatus = 'valid';

    if (config.findExisting) {
      existingRecord = config.findExisting(transformedData as T, existingData);
    } else if (config.upsertKey) {
      // Default: find by upsertKey
      const businessId = transformedData[config.upsertKey as keyof typeof transformedData];
      existingRecord = existingData.find(
        (e) => e[config.upsertKey as keyof T] === businessId
      ) || null;
    }

    isExisting = existingRecord !== null;

    // 5. Determine status based on mode and validation
    if (rowErrors.length > 0) {
      status = 'error';
      errorCount++;
    } else if (isExisting) {
      if (mode === 'insert-only') {
        status = 'duplicate';
        duplicateCount++;
      } else if (mode === 'update-only' || mode === 'upsert') {
        status = 'will-update';
        if (rowWarnings.length > 0) {
          status = 'warning';
          warningCount++;
        } else {
          validCount++;
        }
      }
    } else {
      if (mode === 'update-only') {
        status = 'error';
        errorCount++;
        rowErrors.push({ message: 'Không tìm thấy record để cập nhật' });
      } else if (mode === 'insert-only' || mode === 'upsert') {
        status = 'will-insert';
        if (rowWarnings.length > 0) {
          status = 'warning';
          warningCount++;
        } else {
          validCount++;
        }
      }
    }

    rows.push({
      rowNumber: index + 2, // Excel row (header = row 1)
      rawData,
      transformedData: rowErrors.length > 0 ? null : transformedData as Partial<T>,
      status,
      errors: rowErrors,
      warnings: rowWarnings,
      isExisting,
      existingRecord: existingRecord || undefined,
    });
  });

  return {
    rows,
    totalRows: rawRows.length,
    validCount,
    warningCount,
    errorCount,
    duplicateCount,
    isValid: (validCount + warningCount) > 0,
  };
}

// ============================================
// FIELD VALIDATION
// ============================================

/**
 * Validate một field theo config
 */
export function validateField<T>(
  value: unknown,
  field: FieldConfig<T>,
  row: Partial<T>
): Array<{ field?: string; message: string }> {
  const errors: Array<{ field?: string; message: string }> = [];
  const fieldKey = field.key as string;

  // Check required
  if (field.required && (value === undefined || value === null || value === '')) {
    errors.push({ field: fieldKey, message: `${field.label} là bắt buộc` });
    return errors; // Skip other validations if required field is empty
  }

  // Skip validation if value is empty and not required
  if (value === undefined || value === null || value === '') {
    return errors;
  }

  // Type-specific validation
  switch (field.type) {
    case 'email':
      if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.push({ field: fieldKey, message: `${field.label} không đúng định dạng email` });
      }
      break;

    case 'phone':
      if (typeof value === 'string') {
        const cleaned = value.replace(/\s/g, '');
        if (!/^0\d{9,10}$/.test(cleaned)) {
          errors.push({ field: fieldKey, message: `${field.label} không đúng định dạng SĐT` });
        }
      }
      break;

    case 'number':
      if (typeof value !== 'number' && isNaN(Number(value))) {
        errors.push({ field: fieldKey, message: `${field.label} phải là số` });
      }
      break;

    case 'date':
      if (typeof value === 'string') {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          errors.push({ field: fieldKey, message: `${field.label} không đúng định dạng ngày` });
        }
      }
      break;

    case 'enum':
      if (field.enumValues && !field.enumValues.includes(String(value))) {
        errors.push({
          field: fieldKey,
          message: `${field.label} phải là một trong: ${field.enumValues.join(', ')}`,
        });
      }
      break;

    case 'boolean':
      const boolValues = ['true', 'false', '1', '0', 'yes', 'no', 'có', 'không'];
      if (typeof value === 'string' && !boolValues.includes(value.toLowerCase())) {
        errors.push({ field: fieldKey, message: `${field.label} phải là Có/Không` });
      }
      break;
  }

  // Custom validator
  if (field.validator) {
    const customError = field.validator(value, row);
    if (customError && customError !== true) {
      errors.push({ field: fieldKey, message: customError as string });
    }
  }

  return errors;
}

// ============================================
// DATA TRANSFORMATION
// ============================================

/**
 * Set nested value in object using dot notation key
 * e.g., setNestedValue(obj, 'permanentAddress.street', '123 ABC')
 */
function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === undefined) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  
  current[keys[keys.length - 1]] = value;
}

/**
 * Get nested value from object using dot notation key
 * e.g., getNestedValue(obj, 'permanentAddress.street')
 */
function getNestedValue(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== 'object') return undefined;
  
  const keys = path.split('.');
  let current = obj as Record<string, unknown>;
  
  for (const key of keys) {
    if (current === undefined || current === null) return undefined;
    current = current[key] as Record<string, unknown>;
  }
  
  return current;
}

/**
 * Transform dữ liệu từ Excel sang App format
 * Hỗ trợ nested keys như 'permanentAddress.street'
 */
export function transformImportRow<T>(
  row: Record<string, unknown>,
  fields: FieldConfig<T>[]
): Partial<T> {
  const result: Record<string, unknown> = {};

  for (const field of fields) {
    const key = field.key as string;
    let value = row[field.label] ?? row[key]; // Try label first, then key

    // Apply import transform
    if (field.importTransform && value !== undefined) {
      value = field.importTransform(value);
    } else {
      // Default transforms
      switch (field.type) {
        case 'number':
          value = value !== undefined && value !== '' ? Number(value) || 0 : undefined;
          break;
        case 'boolean':
          if (typeof value === 'string') {
            value = ['true', '1', 'yes', 'có'].includes(value.toLowerCase());
          }
          break;
        case 'date':
          // Excel serial date → ISO string
          if (typeof value === 'number') {
            const date = new Date((value - 25569) * 86400 * 1000);
            value = date.toISOString().split('T')[0];
          }
          break;
      }
    }

    // Apply default value if empty
    if ((value === undefined || value === null || value === '') && field.defaultValue !== undefined) {
      value = field.defaultValue;
    }

    if (value !== undefined && value !== '') {
      // Support nested keys like 'permanentAddress.street'
      if (key.includes('.')) {
        setNestedValue(result, key, value);
      } else {
        result[key] = value;
      }
    }
  }

  return result as Partial<T>;
}

/**
 * Transform dữ liệu từ App sang Excel format
 * Hỗ trợ nested keys như 'permanentAddress.street'
 */
export function transformExportRow<T>(
  row: T,
  fields: FieldConfig<T>[],
  selectedColumns?: string[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const field of fields) {
    // Skip if not selected
    if (selectedColumns && !selectedColumns.includes(field.key as string)) {
      continue;
    }

    // Skip if not exportable
    if (field.exportable === false) {
      continue;
    }

    const key = field.key as string;
    // Support nested keys like 'permanentAddress.street'
    let value = key.includes('.') 
      ? getNestedValue(row, key) 
      : row[key as keyof T];

    // Apply export transform
    if (field.exportTransform && value !== undefined) {
      value = field.exportTransform(value) as T[keyof T];
    } else if (field.transform && value !== undefined) {
      // Also use 'transform' for display purposes
      value = field.transform(value) as T[keyof T];
    } else {
      // Default transforms
      switch (field.type) {
        case 'date':
          if (value) {
            value = formatDateForDisplay(value as string) as T[keyof T];
          }
          break;
        case 'boolean':
          value = (value ? 'Có' : 'Không') as T[keyof T];
          break;
      }
    }

    result[field.label] = value;
  }

  return result;
}

// ============================================
// UNIQUE CHECK
// ============================================

/**
 * Check unique fields trong existing data
 */
export function checkUniqueFields<T>(
  row: Partial<T>,
  uniqueFields: (keyof T)[],
  existingData: T[],
  currentBusinessId?: unknown
): Array<{ field: string; message: string }> {
  const errors: Array<{ field: string; message: string }> = [];

  for (const field of uniqueFields) {
    const value = row[field];
    if (!value) continue;

    const duplicate = existingData.find((e) => {
      // Skip if same record (updating)
      if (currentBusinessId && e[field as keyof T] === currentBusinessId) {
        return false;
      }
      return e[field] === value;
    });

    if (duplicate) {
      errors.push({
        field: field as string,
        message: `${field as string} đã được sử dụng`,
      });
    }
  }

  return errors;
}

// ============================================
// FILE HELPERS
// ============================================

/**
 * Generate export filename
 */
export function generateExportFileName(
  entityDisplayName: string,
  scope: string
): string {
  const date = new Date().toISOString().split('T')[0];
  const scopeLabel = scope === 'all' ? 'TatCa' : scope === 'current-page' ? 'TrangHienTai' : 'DaLoc';
  return `${entityDisplayName.replace(/\s+/g, '_')}_${scopeLabel}_${date}.xlsx`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
