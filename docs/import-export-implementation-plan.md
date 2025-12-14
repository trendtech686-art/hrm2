# 📋 Import/Export System - Kế hoạch triển khai

> **Ngày tạo:** 2025-12-11  
> **Cập nhật:** 2025-12-11 (v2 - bổ sung preview, upsert, template)  
> **Trạng thái:** Planning  
> **Lưu ý:** Thiết kế để dễ dàng migrate sang Next.js + Database thật

---

## 🎯 Mục tiêu

### Export:
1. ✅ Tùy chọn trường xuất (columns selection)
2. ✅ Giới hạn kết quả xuất:
   - Kết quả đã lọc (filtered)
   - Chỉ trang này (current-page)
   - Tất cả (all)
3. ✅ Lưu lịch sử export

### Import:
1. ✅ **Rà soát nội dung trước khi nhập** (Preview step)
2. ✅ **Dừng lại và báo lỗi** nếu dữ liệu không hợp lệ
3. ✅ **Thư mục file mẫu** (`public/templates/`)
4. ✅ **Hỗ trợ Update** (Upsert) - nếu đã có thì update theo Business ID
5. ✅ Lưu lịch sử import

### Chung:
1. ✅ Tạo Store lưu lịch sử thực (persist localStorage → sau chuyển sang DB)
2. ✅ Tạo Config cho các entity chính
3. ✅ Tích hợp vào các module
4. ✅ Chuẩn bị sẵn cho Next.js migration

---

## 🏗️ Kiến trúc hệ thống

### Hiện tại (React + Vite + localStorage)
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  List Page      │────▶│  GenericImport/  │────▶│  Zustand Store  │
│  (Employee,     │     │  ExportDialog    │     │  (localStorage) │
│   Product...)   │     └──────────────────┘     └─────────────────┘
└─────────────────┘              │
                                 ▼
                    ┌──────────────────────┐
                    │  Entity Config       │
                    │  (fields, validate)  │
                    └──────────────────────┘
```

### Tương lai (Next.js + PostgreSQL/Prisma)
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  List Page      │────▶│  GenericImport/  │────▶│  API Route      │
│  (Server Comp)  │     │  ExportDialog    │     │  /api/import    │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                 │                        │
                                 ▼                        ▼
                    ┌──────────────────────┐    ┌─────────────────┐
                    │  Entity Config       │    │  Prisma ORM     │
                    │  (fields, validate)  │    │  (PostgreSQL)   │
                    └──────────────────────┘    └─────────────────┘
```

### 🔄 Import Flow (Chi tiết các bước)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        IMPORT WORKFLOW                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Step 1: CHỌN FILE                                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ • Chọn file Excel (.xlsx, .xls)                             │   │
│  │ • Tải file mẫu: /templates/Mau_Nhap_XXX.xlsx               │   │
│  │ • Validate: file size, format                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              ▼                                      │
│  Step 2: RÀ SOÁT (Preview) ⭐ QUAN TRỌNG                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ • Parse Excel → Array of rows                               │   │
│  │ • Validate từng field theo config                           │   │
│  │ • Check Business ID đã tồn tại? → Mark "Sẽ cập nhật"        │   │
│  │ • Check Business ID mới? → Mark "Sẽ thêm mới"               │   │
│  │ • Check unique fields (email, phone) → Mark "Trùng"         │   │
│  │ • Hiển thị bảng preview với status từng dòng                │   │
│  │ • Nếu có lỗi: DỪNG LẠI, hiện danh sách lỗi chi tiết         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              ▼                                      │
│  Step 3: XÁC NHẬN                                                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ • Hiển thị summary: N thêm mới, M cập nhật, K lỗi           │   │
│  │ • User chọn: [Hủy] hoặc [Tiếp tục import]                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              ▼                                      │
│  Step 4: THỰC HIỆN IMPORT                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ • Insert records mới                                        │   │
│  │ • Update records đã có (theo Business ID)                   │   │
│  │ • Lưu log vào ImportExportStore                             │   │
│  │ • Hiển thị kết quả: Thành công / Thất bại                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 📊 Export Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        EXPORT WORKFLOW                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Step 1: CHỌN PHẠM VI                                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ○ Kết quả đã lọc (12 dòng)                                  │   │
│  │ ○ Chỉ trang này (12 dòng)                                   │   │
│  │ ● Tất cả (120 dòng)                                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              ▼                                      │
│  Step 2: CHỌN TRƯỜNG HIỂN THỊ                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ☑ Chọn tất cả                                               │   │
│  │ ────────────────────────────────────────                    │   │
│  │ Thông tin cơ bản:                                           │   │
│  │   ☑ Mã NV    ☑ Họ tên    ☑ Giới tính                        │   │
│  │ Liên hệ:                                                    │   │
│  │   ☑ SĐT     ☑ Email     ☐ Địa chỉ                           │   │
│  │ Công việc:                                                  │   │
│  │   ☑ Phòng ban  ☑ Chức vụ  ☐ Ngày vào làm                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              ▼                                      │
│  Step 3: XUẤT FILE                                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ • Generate Excel với columns đã chọn                        │   │
│  │ • Download file: DanhSach_NhanVien_2025-12-11.xlsx          │   │
│  │ • Lưu log vào ImportExportStore                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Cấu trúc Files

```
lib/import-export/
├── index.ts                      # Main exports
├── types.ts                      # Types & Interfaces
├── import-export-store.ts        # Zustand store (localStorage)
├── import-export-service.ts      # Service layer (dễ swap sang API)
├── utils.ts                      # Helper functions
└── configs/
    ├── index.ts                  # Re-export all configs
    ├── employee.config.ts
    ├── product.config.ts
    ├── customer.config.ts
    ├── order.config.ts
    ├── supplier.config.ts
    └── ... (các entity khác)

public/templates/                 # 📂 FILE MẪU IMPORT
├── Mau_Nhap_Nhan_Vien.xlsx
├── Mau_Nhap_San_Pham.xlsx
├── Mau_Nhap_Khach_Hang.xlsx
├── Mau_Nhap_Don_Hang.xlsx
├── Mau_Nhap_Nha_Cung_Cap.xlsx
└── ... (các entity khác)
```

---

## 📅 Phase 1: Foundation (Nền tảng)

### Task 1.1: Tạo Types
**File:** `lib/import-export/types.ts`

```typescript
// ============================================
// IMPORT/EXPORT TYPES
// ============================================

import type { SystemId } from '../id-types';

// --- Log Entry Types ---
export interface ImportLogEntry {
  id: string;
  entityType: string;           // 'employees', 'products', etc.
  entityDisplayName: string;    // 'Nhân viên', 'Sản phẩm'
  fileName: string;
  fileSize: number;
  
  // Results
  totalRows: number;
  successCount: number;
  errorCount: number;
  skippedCount: number;         // Bỏ qua (duplicate, etc.)
  insertedCount: number;        // 🆕 Số record mới thêm
  updatedCount: number;         // 🆕 Số record cập nhật
  
  // Import mode
  mode: 'insert-only' | 'update-only' | 'upsert';  // 🆕
  
  // Metadata
  performedBy: string;          // User name
  performedById: SystemId;      // User systemId
  performedAt: string;          // ISO date string
  branchId?: string;            // Nếu import theo chi nhánh
  branchName?: string;
  
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
  filters?: Record<string, any>;
  
  // Metadata
  performedBy: string;
  performedById: SystemId;
  performedAt: string;
  
  status: 'success' | 'failed';
}

// --- Config Types ---
export interface FieldConfig<T = any> {
  key: keyof T | string;
  label: string;                 // Tên cột trong Excel (tiếng Việt)
  required?: boolean;
  type: 'string' | 'number' | 'date' | 'boolean' | 'enum' | 'email' | 'phone';
  
  // For enum type
  enumValues?: string[];
  enumLabels?: Record<string, string>;  // { 'male': 'Nam', 'female': 'Nữ' }
  
  // Validation
  validator?: (value: any, row: any) => string | null;  // Return error message or null
  
  // Transform
  importTransform?: (value: any) => any;   // Excel → App
  exportTransform?: (value: any) => any;   // App → Excel
  
  // Export options
  exportable?: boolean;          // Default true
  exportGroup?: string;          // Group trong export dialog
  defaultSelected?: boolean;     // Pre-selected trong export
  
  // Sample data for template
  example?: string;
}

export interface ImportExportConfig<T> {
  entityType: string;            // 'employees', 'products'
  displayName: string;           // 'Nhân viên', 'Sản phẩm'
  
  // Fields configuration
  fields: FieldConfig<T>[];
  
  // Template
  templateFileName: string;      // 'Mau_Nhap_Nhan_Vien.xlsx'
  templateDownloadUrl?: string;  // '/templates/Mau_Nhap_Nhan_Vien.xlsx'
  sheetName?: string;            // Default: displayName
  
  // ============================================
  // 🔑 UPSERT MODE (Insert hoặc Update)
  // ============================================
  // Business ID là key chính để xác định record
  businessIdField: keyof T;      // 'id' - field chứa Business ID (VD: NV000001)
  
  // Cho phép update nếu đã tồn tại
  allowUpdate?: boolean;         // Default: true
  
  // Cho phép insert mới nếu chưa tồn tại  
  allowInsert?: boolean;         // Default: true
  
  // Unique key for duplicate check (ngoài businessId)
  uniqueFields?: (keyof T)[];    // ['email', 'phone'] - các field phải unique
  
  // ============================================
  // 🔍 PREVIEW & VALIDATION
  // ============================================
  // Bắt buộc preview trước khi import
  requirePreview?: boolean;      // Default: true
  
  // Dừng ngay khi gặp lỗi đầu tiên
  stopOnFirstError?: boolean;    // Default: false
  
  // Số lượng lỗi tối đa cho phép tiếp tục
  maxErrorsAllowed?: number;     // Default: 0 (không cho phép lỗi)
  
  // Branch requirement
  requireBranch?: boolean;
  
  // Row-level validation (after field validation)
  validateRow?: (row: T, index: number, existingData: T[]) => Array<{ field?: string; message: string }>;
  
  // ============================================
  // HOOKS
  // ============================================
  // Check xem record đã tồn tại chưa (return existing record hoặc null)
  findExisting?: (row: T, existingData: T[]) => T | null;
  
  beforeImport?: (data: T[]) => Promise<T[]> | T[];
  afterImport?: (results: { 
    inserted: T[]; 
    updated: T[]; 
    failed: any[];
    skipped: any[];
  }) => void;
  
  // Max rows
  maxRows?: number;              // Default: 1000
}

// --- Service Types (cho tương lai API) ---
export interface ImportResult<T = any> {
  success: boolean;
  data: T[];
  errors: Array<{ row: number; field?: string; message: string }>;
  summary: {
    total: number;
    inserted: number;      // Mới thêm
    updated: number;       // Mới thêm (cập nhật)
    failed: number;
    skipped: number;       // Bỏ qua (duplicate không cho update)
  };
}

// --- Preview Types (cho bước rà soát) ---
export interface ImportPreviewRow<T = any> {
  rowIndex: number;        // Số dòng trong Excel (bắt đầu từ 2)
  data: T;                 // Dữ liệu đã parse
  status: 'valid' | 'error' | 'duplicate' | 'will-update' | 'will-insert';
  errors: Array<{ field?: string; message: string }>;
  existingRecord?: T;      // Record hiện có nếu là duplicate/will-update
}

export interface ImportPreviewResult<T = any> {
  rows: ImportPreviewRow<T>[];
  summary: {
    total: number;
    valid: number;
    errors: number;
    willInsert: number;
    willUpdate: number;
    duplicates: number;    // Duplicate nhưng không cho update
  };
  canProceed: boolean;     // Có thể tiếp tục import không
}

export interface ExportResult {
  success: boolean;
  fileName: string;
  fileUrl?: string;              // Nếu export server-side
  totalRows: number;
}
```

### Task 1.2: Tạo Store
**File:** `lib/import-export/import-export-store.ts`

```typescript
// ============================================
// IMPORT/EXPORT STORE
// Persist: localStorage (sẽ migrate sang DB sau)
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ImportLogEntry, ExportLogEntry } from './types';
import { generateSystemId } from '../id-utils';

const MAX_LOGS = 200;  // Giới hạn logs để tránh localStorage quá tải

interface ImportExportState {
  importLogs: ImportLogEntry[];
  exportLogs: ExportLogEntry[];
  
  // Actions
  addImportLog: (log: Omit<ImportLogEntry, 'id'>) => string;
  addExportLog: (log: Omit<ExportLogEntry, 'id'>) => string;
  
  // Queries
  getLogsByEntity: (entityType: string) => {
    imports: ImportLogEntry[];
    exports: ExportLogEntry[];
  };
  getRecentLogs: (limit?: number) => (ImportLogEntry | ExportLogEntry)[];
  
  // Management
  deleteLog: (id: string, type: 'import' | 'export') => void;
  clearLogs: (entityType?: string) => void;
}

export const useImportExportStore = create<ImportExportState>()(
  persist(
    (set, get) => ({
      importLogs: [],
      exportLogs: [],
      
      addImportLog: (log) => {
        const id = generateSystemId('import-logs', get().importLogs.length + 1);
        const newLog: ImportLogEntry = { ...log, id };
        
        set((state) => ({
          importLogs: [newLog, ...state.importLogs].slice(0, MAX_LOGS),
        }));
        
        return id;
      },
      
      addExportLog: (log) => {
        const id = generateSystemId('export-logs', get().exportLogs.length + 1);
        const newLog: ExportLogEntry = { ...log, id };
        
        set((state) => ({
          exportLogs: [newLog, ...state.exportLogs].slice(0, MAX_LOGS),
        }));
        
        return id;
      },
      
      getLogsByEntity: (entityType) => ({
        imports: get().importLogs.filter((l) => l.entityType === entityType),
        exports: get().exportLogs.filter((l) => l.entityType === entityType),
      }),
      
      getRecentLogs: (limit = 50) => {
        const all = [
          ...get().importLogs.map((l) => ({ ...l, _type: 'import' as const })),
          ...get().exportLogs.map((l) => ({ ...l, _type: 'export' as const })),
        ];
        return all
          .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())
          .slice(0, limit);
      },
      
      deleteLog: (id, type) => {
        if (type === 'import') {
          set((state) => ({
            importLogs: state.importLogs.filter((l) => l.id !== id),
          }));
        } else {
          set((state) => ({
            exportLogs: state.exportLogs.filter((l) => l.id !== id),
          }));
        }
      },
      
      clearLogs: (entityType) => {
        if (entityType) {
          set((state) => ({
            importLogs: state.importLogs.filter((l) => l.entityType !== entityType),
            exportLogs: state.exportLogs.filter((l) => l.entityType !== entityType),
          }));
        } else {
          set({ importLogs: [], exportLogs: [] });
        }
      },
    }),
    {
      name: 'hrm-import-export-logs',
      version: 1,
    }
  )
);

// ============================================
// FUTURE: API Service (Next.js migration)
// ============================================
// Khi migrate sang Next.js, tạo file import-export-api.ts:
//
// export async function saveImportLog(log: ImportLogEntry) {
//   return fetch('/api/import-export/logs', {
//     method: 'POST',
//     body: JSON.stringify({ type: 'import', log }),
//   });
// }
//
// export async function getImportExportLogs(params: {
//   entityType?: string;
//   type?: 'import' | 'export';
//   limit?: number;
// }) {
//   const query = new URLSearchParams(params as any);
//   return fetch(`/api/import-export/logs?${query}`).then(r => r.json());
// }
```

### Task 1.3: Tạo Utils (Preview & Validate)
**File:** `lib/import-export/utils.ts`

```typescript
import type { 
  ImportExportConfig, 
  ImportPreviewRow, 
  ImportPreviewResult 
} from './types';

/**
 * Rà soát dữ liệu trước khi import
 * Trả về preview với status từng dòng
 */
export function previewImportData<T>(
  parsedRows: Partial<T>[],
  config: ImportExportConfig<T>,
  existingData: T[]
): ImportPreviewResult<T> {
  const rows: ImportPreviewRow<T>[] = [];
  let valid = 0, errors = 0, willInsert = 0, willUpdate = 0, duplicates = 0;

  parsedRows.forEach((row, index) => {
    const rowErrors: Array<{ field?: string; message: string }> = [];
    
    // 1. Validate từng field theo config
    for (const field of config.fields) {
      const value = row[field.key as keyof T];
      
      // Check required
      if (field.required && (value === undefined || value === null || value === '')) {
        rowErrors.push({ field: field.key as string, message: `${field.label} là bắt buộc` });
      }
      
      // Run custom validator
      if (field.validator && value) {
        const error = field.validator(value, row);
        if (error) {
          rowErrors.push({ field: field.key as string, message: error });
        }
      }
    }
    
    // 2. Validate row-level
    if (config.validateRow) {
      const rowLevelErrors = config.validateRow(row as T, index, existingData);
      rowErrors.push(...rowLevelErrors);
    }
    
    // 3. Check existing (upsert logic)
    let existingRecord: T | null = null;
    let status: ImportPreviewRow<T>['status'] = 'valid';
    
    if (config.findExisting) {
      existingRecord = config.findExisting(row as T, existingData);
    }
    
    if (rowErrors.length > 0) {
      status = 'error';
      errors++;
    } else if (existingRecord) {
      if (config.allowUpdate) {
        status = 'will-update';
        willUpdate++;
      } else {
        status = 'duplicate';
        duplicates++;
        rowErrors.push({ message: `Đã tồn tại: ${row[config.businessIdField]}` });
      }
    } else {
      if (config.allowInsert) {
        status = 'will-insert';
        willInsert++;
      } else {
        status = 'error';
        errors++;
        rowErrors.push({ message: 'Không tìm thấy record để cập nhật' });
      }
    }
    
    if (status === 'valid' || status === 'will-insert' || status === 'will-update') {
      valid++;
    }
    
    rows.push({
      rowIndex: index + 2, // Excel row (header = 1)
      data: row as T,
      status,
      errors: rowErrors,
      existingRecord: existingRecord || undefined,
    });
  });

  return {
    rows,
    summary: { 
      total: parsedRows.length, 
      valid, 
      errors, 
      willInsert, 
      willUpdate, 
      duplicates 
    },
    canProceed: errors === 0 || (config.maxErrorsAllowed ? errors <= config.maxErrorsAllowed : false),
  };
}
```

### Task 1.4: Cập nhật History Page
**File:** `features/shared/import-export-history-page.tsx`

```
- Thay useState(generateSampleLogs()) → useImportExportStore()
- Kết nối real data
- Giữ nguyên UI
```

---

## 📅 Phase 2: Entity Configs

### Task 2.1: Employee Config
**File:** `lib/import-export/configs/employee.config.ts`

```typescript
import type { ImportExportConfig, FieldConfig } from '../types';
import type { Employee } from '@/features/employees/types';

const fields: FieldConfig<Employee>[] = [
  {
    key: 'id',
    label: 'Mã nhân viên',
    required: true,
    type: 'string',
    example: 'NV000001',
    validator: (v) => {
      if (!v) return 'Mã nhân viên là bắt buộc';
      if (!/^NV\d{6}$/.test(v)) return 'Mã NV phải theo format NV000001';
      return null;
    },
    exportGroup: 'Thông tin cơ bản',
  },
  {
    key: 'fullName',
    label: 'Họ và tên',
    required: true,
    type: 'string',
    example: 'Nguyễn Văn A',
    exportGroup: 'Thông tin cơ bản',
  },
  {
    key: 'phone',
    label: 'Số điện thoại',
    required: true,
    type: 'phone',
    example: '0901234567',
    validator: (v) => {
      if (!v) return 'SĐT là bắt buộc';
      if (!/^0\d{9}$/.test(v.replace(/\s/g, ''))) return 'SĐT không hợp lệ';
      return null;
    },
    exportGroup: 'Liên hệ',
  },
  {
    key: 'workEmail',
    label: 'Email công việc',
    type: 'email',
    example: 'nguyenvana@company.com',
    validator: (v) => {
      if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Email không hợp lệ';
      return null;
    },
    exportGroup: 'Liên hệ',
  },
  {
    key: 'gender',
    label: 'Giới tính',
    required: true,
    type: 'enum',
    enumValues: ['Nam', 'Nữ', 'Khác'],
    example: 'Nam',
    exportGroup: 'Thông tin cơ bản',
  },
  {
    key: 'dob',
    label: 'Ngày sinh',
    type: 'date',
    example: '1990-01-15',
    importTransform: (v) => {
      // Excel date → ISO string
      if (typeof v === 'number') {
        // Excel serial date
        const date = new Date((v - 25569) * 86400 * 1000);
        return date.toISOString().split('T')[0];
      }
      return v;
    },
    exportTransform: (v) => v ? new Date(v).toLocaleDateString('vi-VN') : '',
    exportGroup: 'Thông tin cơ bản',
  },
  {
    key: 'department',
    label: 'Phòng ban',
    type: 'enum',
    enumValues: ['Kỹ thuật', 'Nhân sự', 'Kinh doanh', 'Marketing'],
    example: 'Kinh doanh',
    exportGroup: 'Công việc',
  },
  {
    key: 'jobTitle',
    label: 'Chức vụ',
    required: true,
    type: 'string',
    example: 'Nhân viên',
    exportGroup: 'Công việc',
  },
  {
    key: 'hireDate',
    label: 'Ngày vào làm',
    type: 'date',
    example: '2024-01-01',
    importTransform: (v) => {
      if (typeof v === 'number') {
        const date = new Date((v - 25569) * 86400 * 1000);
        return date.toISOString().split('T')[0];
      }
      return v;
    },
    exportGroup: 'Công việc',
  },
  {
    key: 'baseSalary',
    label: 'Lương cơ bản',
    type: 'number',
    example: '15000000',
    importTransform: (v) => Number(v) || 0,
    exportTransform: (v) => v?.toLocaleString('vi-VN') || '0',
    validator: (v) => {
      if (v && v < 0) return 'Lương không được âm';
      return null;
    },
    exportGroup: 'Lương & Phúc lợi',
  },
  {
    key: 'employmentStatus',
    label: 'Trạng thái',
    type: 'enum',
    enumValues: ['Đang làm việc', 'Tạm nghỉ', 'Đã nghỉ việc'],
    example: 'Đang làm việc',
    exportGroup: 'Công việc',
  },
];

export const employeeImportExportConfig: ImportExportConfig<Employee> = {
  entityType: 'employees',
  displayName: 'Nhân viên',
  
  // Template
  templateFileName: 'Mau_Nhap_Nhan_Vien.xlsx',
  templateDownloadUrl: '/templates/Mau_Nhap_Nhan_Vien.xlsx',
  sheetName: 'Danh sách nhân viên',
  
  // 🔑 UPSERT CONFIG
  businessIdField: 'id',         // Mã NV (VD: NV000001) làm key chính
  allowUpdate: true,             // Cho phép update nếu mã NV đã có
  allowInsert: true,             // Cho phép thêm mới
  uniqueFields: ['workEmail', 'phone'],  // Email và SĐT phải unique
  
  // 🔍 PREVIEW CONFIG  
  requirePreview: true,          // Bắt buộc xem trước
  stopOnFirstError: false,       // Không dừng ngay, hiển thị tất cả lỗi
  maxErrorsAllowed: 0,           // Không cho phép import nếu có lỗi
  
  requireBranch: false,
  maxRows: 500,
  fields,
  
  // Tìm record đã tồn tại theo Business ID
  findExisting: (row, existingData) => {
    return existingData.find(e => e.id === row.id) || null;
  },
  
  validateRow: (row, index, existingData) => {
    const errors: Array<{ field?: string; message: string }> = [];
    
    // Validate ngày sinh < ngày hiện tại
    if (row.dob) {
      const dob = new Date(row.dob);
      if (dob > new Date()) {
        errors.push({ field: 'dob', message: 'Ngày sinh không thể trong tương lai' });
      }
    }
    
    // Validate ngày vào làm
    if (row.hireDate && row.dob) {
      const hire = new Date(row.hireDate);
      const dob = new Date(row.dob);
      const age = (hire.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      if (age < 16) {
        errors.push({ field: 'hireDate', message: 'Nhân viên phải đủ 16 tuổi khi vào làm' });
      }
    }
    
    // Check unique email (trừ chính record đang update)
    if (row.workEmail) {
      const duplicate = existingData.find(
        e => e.workEmail === row.workEmail && e.id !== row.id
      );
      if (duplicate) {
        errors.push({ 
          field: 'workEmail', 
          message: `Email đã được sử dụng bởi ${duplicate.fullName} (${duplicate.id})` 
        });
      }
    }
    
    return errors;
  },
  
  afterImport: (results) => {
    console.log(`Import nhân viên hoàn tất:
      - Thêm mới: ${results.inserted.length}
      - Cập nhật: ${results.updated.length}
      - Lỗi: ${results.failed.length}
      - Bỏ qua: ${results.skipped.length}`);
  },
};
```

### Task 2.2: Product Config
**File:** `lib/import-export/configs/product.config.ts`

```typescript
// Tương tự employee config
// Fields: id, name, sku, categoryName, unit, costPrice, sellPrice, stock, status
```

### Task 2.3: Customer Config
**File:** `lib/import-export/configs/customer.config.ts`

```typescript
// Fields: id, name, phone, email, address, customerGroup, taxCode
```

---

## 📅 Phase 2.5: 🆕 Import Chấm công từ Máy CC (ĐẶC BIỆT)

> ⚠️ **LƯU Ý QUAN TRỌNG:** File từ máy chấm công có format đặc biệt, KHÔNG phải dạng bảng chuẩn!  
> 📁 **File mẫu:** `docs/file/t11.xls`

### Phân tích cấu trúc file máy chấm công:

**Các Sheet trong file:**
| Sheet | Mô tả | Sử dụng |
|-------|-------|---------|
| Bảng cài đặt xếp ca | Xếp ca theo ngày 1-30 | Tham khảo |
| **Bảng tổng hợp chấm công** | Tổng hợp theo tháng | ⭐ **DÙNG CHÍNH** |
| 1,2,3 / 4,5,6 / ... | Chi tiết từng NV (Sáng/Chiều/Tăng ca) | Chi tiết |

**Cấu trúc Sheet "Bảng tổng hợp chấm công":**
```
Row 0: "Bảng tổng hợp chấm công"
Row 1: "Ngày thống kê:2025-11-01~2025-11-30"
Row 2-3: Headers (merged cells)
Row 4+: Dữ liệu nhân viên
```

| Cột | Field | Ví dụ |
|-----|-------|-------|
| A | Mã NV (máy CC) | 1, 2, 3... |
| B | Họ tên | "lang", "duc dat" |
| C | Phòng ban | "CÔNG TY" |
| D | TG làm việc (chuẩn) | 160 giờ |
| E | TG làm việc (thực tế) | 145.28 giờ |
| F | Đến muộn (lần) | 9 |
| G | Đến muộn (phút) | 97 |
| H | Về sớm (lần) | 5 |
| I | Về sớm (phút) | 36 |
| J | Tăng ca bình thường | 6.55 giờ |
| K | Tăng ca đặc biệt | 43.5 giờ |
| L | Số ngày (chuẩn/thực) | "20/19" |
| M | Công tác (ngày) | 0 |
| N | Nghỉ không phép | 1 |
| O | Nghỉ phép | 0 |

### ❗ Vấn đề cần giải quyết:

| # | Vấn đề | Giải pháp |
|---|--------|-----------|
| 1 | **Mã NV khác nhau**: Máy CC dùng 1,2,3... còn hệ thống dùng NV000001 | Mapping theo **tên** hoặc cấu hình **bảng ánh xạ** |
| 2 | **Header phức tạp**: 2 dòng header với merged cells | Custom parser, chỉ định `headerRowIndex=2`, `dataStartRowIndex=4` |
| 3 | **Dữ liệu tổng hợp tháng** (không phải từng ngày) | Lưu vào bảng `AttendanceSummary` riêng |
| 4 | **Cần employee mapping** | Bước mapping thủ công hoặc lưu mapping table |

### Config đề xuất:

**File:** `lib/import-export/configs/attendance.config.ts`

```typescript
export interface AttendanceImportRow {
  machineEmployeeId: number;    // Mã NV từ máy CC (1, 2, 3...)
  employeeName: string;         // Tên để mapping
  department: string;
  standardHours: number;        // 160
  actualHours: number;          // 145.28
  lateCount: number;            // Số lần đến muộn
  lateMinutes: number;          // Tổng phút đến muộn
  earlyLeaveCount: number;      // Số lần về sớm  
  earlyLeaveMinutes: number;    // Tổng phút về sớm
  overtimeNormal: number;       // Tăng ca thường (giờ)
  overtimeSpecial: number;      // Tăng ca đặc biệt (giờ)
  workDays: string;             // "20/19"
  businessTrip: number;         // Công tác (ngày)
  absentWithoutLeave: number;   // Nghỉ không phép (ngày)
  paidLeave: number;            // Nghỉ phép (ngày)
}

export const attendanceImportConfig: ImportExportConfig<AttendanceImportRow> = {
  entityType: 'attendance',
  displayName: 'Chấm công (từ máy CC)',
  
  // ⚠️ SPECIAL: Custom parser cho format máy chấm công
  customParser: true,
  sourceSheetName: 'Bảng tổng hợp chấm công',
  headerRowIndex: 2,            // 0-indexed
  dataStartRowIndex: 4,
  
  templateFileName: 'Mau_ChamCong_MayCC.xls',
  templateDownloadUrl: '/templates/Mau_ChamCong_MayCC.xls',
  
  // ⭐ MAPPING: Tên NV máy CC → Mã NV hệ thống
  requireEmployeeMapping: true,
  mappingField: 'employeeName',
  
  // Không dùng businessIdField thông thường
  // Upsert theo composite key: (employeeSystemId + month + year)
  businessIdField: null,
  compositeKey: ['employeeSystemId', 'month', 'year'],
  
  allowUpdate: true,
  allowInsert: true,
  requirePreview: true,
  
  fields: [
    { key: 'machineEmployeeId', label: 'Mã NV (máy)', type: 'number', required: true },
    { key: 'employeeName', label: 'Họ tên', type: 'string', required: true },
    { key: 'department', label: 'Phòng ban', type: 'string' },
    { key: 'standardHours', label: 'Giờ chuẩn', type: 'number' },
    { key: 'actualHours', label: 'Giờ thực tế', type: 'number' },
    { key: 'lateCount', label: 'Đến muộn (lần)', type: 'number' },
    { key: 'lateMinutes', label: 'Đến muộn (phút)', type: 'number' },
    { key: 'earlyLeaveCount', label: 'Về sớm (lần)', type: 'number' },
    { key: 'earlyLeaveMinutes', label: 'Về sớm (phút)', type: 'number' },
    { key: 'overtimeNormal', label: 'Tăng ca thường', type: 'number' },
    { key: 'overtimeSpecial', label: 'Tăng ca đặc biệt', type: 'number' },
    { key: 'workDays', label: 'Ngày công', type: 'string' },
    { key: 'businessTrip', label: 'Công tác', type: 'number' },
    { key: 'absentWithoutLeave', label: 'Nghỉ KP', type: 'number' },
    { key: 'paidLeave', label: 'Nghỉ phép', type: 'number' },
  ],
};
```

### Import Flow cho Chấm công (4 bước):

```
┌─────────────────────────────────────────────────────────────────────┐
│                  IMPORT CHẤM CÔNG TỪ MÁY CC                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Step 1: CHỌN FILE + THÁNG                                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 📁 Chọn file: [t11.xls                            ] [Browse]│   │
│  │ 📅 Tháng/Năm: [Tháng 11 ▼] [2025 ▼]                         │   │
│  │ ℹ️ Auto-detect: "2025-11-01 ~ 2025-11-30"                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              ▼                                      │
│  Step 2: MAPPING NHÂN VIÊN ⭐                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ⚠️ 2 nhân viên cần mapping thủ công:                        │   │
│  │                                                             │   │
│  │ Tên máy CC       →  Nhân viên hệ thống                      │   │
│  │ ────────────────────────────────────────────                │   │
│  │ "duc dat"        →  [Nguyễn Đức Đạt (NV000002) ▼]           │   │
│  │ "hieuNho"        →  [Trần Văn Hiếu (NV000010) ▼]            │   │
│  │                                                             │   │
│  │ ✅ 10 nhân viên đã tự động mapping                          │   │
│  │ [Lưu mapping cho lần sau]                                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              ▼                                      │
│  Step 3: RÀ SOÁT (Preview)                                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Mã NV     │ Tên       │ Giờ TT  │ Muộn  │ Sớm  │ TC   │ St │   │
│  │ NV000001  │ lang      │ 0h      │ 0p    │ 0p   │ 0h   │ 🆕 │   │
│  │ NV000002  │ duc dat   │ 5.07h   │ 176p  │ 0p   │ 5.3h │ 🔄 │   │
│  │ NV000007  │ dung      │ 145.3h  │ 97p   │ 36p  │ 50h  │ 🆕 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  📊 Tổng: 12 NV | Thêm mới: 8 | Cập nhật: 4                        │
│                              ▼                                      │
│  Step 4: XÁC NHẬN IMPORT                                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │        [Quay lại]              [Xác nhận Import] ✅         │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Bảng Mapping nhân viên (lưu để tái sử dụng):

```typescript
// Lưu trong store hoặc DB
interface EmployeeMappingEntry {
  machineEmployeeId: number;    // 1, 2, 3...
  machineName: string;          // "duc dat", "hieuNho"
  systemEmployeeId: string;     // "NV000002"
  systemEmployeeName: string;   // "Nguyễn Đức Đạt"
  createdAt: string;
  updatedAt: string;
}
```

---

## 📅 Phase 3: Cập nhật Import Dialog (Preview Step)

### Task 3.0: UI Mockup - Bước Rà soát (Preview)

```
┌─────────────────────────────────────────────────────────────────────┐
│  Nhập dữ liệu nhân viên                                       [X]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📁 File: DanhSach_NhanVien_Import.xlsx (15 dòng)                  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 📊 Tổng kết rà soát                                         │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │  ✅ Sẽ thêm mới:     8 dòng                                 │   │
│  │  🔄 Sẽ cập nhật:     5 dòng                                 │   │
│  │  ❌ Có lỗi:          2 dòng                                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ⚠️ Có 2 dòng lỗi. Vui lòng sửa file và nhập lại.                  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Dòng │ Mã NV    │ Họ tên      │ Trạng thái  │ Chi tiết      │   │
│  ├──────┼──────────┼─────────────┼─────────────┼───────────────┤   │
│  │  2   │ NV000001 │ Nguyễn A    │ 🔄 Cập nhật │               │   │
│  │  3   │ NV000015 │ Trần B      │ ✅ Thêm mới │               │   │
│  │  4   │ NV000002 │ Lê C        │ 🔄 Cập nhật │               │   │
│  │  5   │          │ Phạm D      │ ❌ Lỗi      │ Mã NV bắt buộc│   │
│  │  6   │ NV000016 │ Hoàng E     │ ✅ Thêm mới │               │   │
│  │  7   │ NV000017 │ Vũ F        │ ❌ Lỗi      │ Email trùng   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [Tải file mẫu]               [Quay lại]  [Tiếp tục import] (❌)   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Nếu không có lỗi:
┌─────────────────────────────────────────────────────────────────────┐
│  ✅ Tất cả 15 dòng hợp lệ. Sẵn sàng import.                        │
│                                                                     │
│  [Tải file mẫu]               [Quay lại]  [Tiếp tục import] (✅)   │
└─────────────────────────────────────────────────────────────────────┘
```

### Task 3.1: Cập nhật GenericImportDialog

### Task 3.1: Cập nhật GenericImportDialog
**File:** `components/shared/generic-import-dialog.tsx`

```typescript
// Thêm:
import { useImportExportStore } from '@/lib/import-export/import-export-store';
import { getCurrentUserInfo } from '@/contexts/auth-context';

// Trong handleImport success:
const { addImportLog } = useImportExportStore();
const user = getCurrentUserInfo();

addImportLog({
  entityType: config.entityType,
  entityDisplayName: config.displayName,
  fileName: file.name,
  fileSize: file.size,
  totalRows: parsedData.length,
  successCount: result.success,
  errorCount: result.failed,
  skippedCount: result.skipped || 0,
  performedBy: user.name,
  performedById: user.systemId,
  performedAt: new Date().toISOString(),
  branchId: selectedBranchId,
  errors: validationErrors.slice(0, 50),
  status: result.failed === 0 ? 'success' : result.success > 0 ? 'partial' : 'failed',
});
```

### Task 3.2: Cập nhật GenericExportDialog
**File:** `components/shared/generic-export-dialog.tsx`

```typescript
// Tương tự, thêm addExportLog sau khi export thành công
```

### Task 3.3: Tích hợp vào Employees Page
**File:** `features/employees/list-page.tsx`

```typescript
import { GenericImportDialog } from '@/components/shared/generic-import-dialog';
import { GenericExportDialog } from '@/components/shared/generic-export-dialog';
import { employeeImportExportConfig } from '@/lib/import-export/configs/employee.config';

// Trong component:
const [importOpen, setImportOpen] = useState(false);
const [exportOpen, setExportOpen] = useState(false);

// Trong JSX - thêm vào toolbar:
<Button variant="outline" onClick={() => setImportOpen(true)}>
  <Upload className="mr-2 h-4 w-4" />
  Nhập file
</Button>
<Button variant="outline" onClick={() => setExportOpen(true)}>
  <Download className="mr-2 h-4 w-4" />
  Xuất file
</Button>

// Dialogs:
<GenericImportDialog
  open={importOpen}
  onOpenChange={setImportOpen}
  config={employeeImportExportConfig}
  onImport={handleImport}
/>

<GenericExportDialog
  open={exportOpen}
  onOpenChange={setExportOpen}
  config={employeeImportExportConfig}
  allData={allEmployees}
  currentPageData={currentPageData}
/>
```

---

## 🔄 Migration Guide (Next.js + Database)

### Database Schema (Prisma)

```prisma
model ImportExportLog {
  id              String   @id @default(cuid())
  type            String   // 'import' | 'export'
  entityType      String   // 'employees', 'products'
  entityDisplayName String
  fileName        String
  fileSize        Int?
  
  // Results
  totalRows       Int
  successCount    Int?
  errorCount      Int?
  skippedCount    Int?
  scope           String?  // 'all', 'current-page', 'selected'
  
  // Metadata
  performedById   String
  performedBy     String
  performedAt     DateTime @default(now())
  branchId        String?
  
  // Details (JSON)
  errors          Json?
  filters         Json?
  columnsExported Json?
  
  status          String   // 'success', 'partial', 'failed'
  
  // Relations
  user            User     @relation(fields: [performedById], references: [id])
  
  @@index([entityType])
  @@index([performedById])
  @@index([performedAt])
}
```

### API Routes (Next.js)

```typescript
// app/api/import-export/logs/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entityType = searchParams.get('entityType');
  const type = searchParams.get('type');
  const limit = Number(searchParams.get('limit')) || 50;
  
  const logs = await prisma.importExportLog.findMany({
    where: {
      ...(entityType && { entityType }),
      ...(type && { type }),
    },
    orderBy: { performedAt: 'desc' },
    take: limit,
  });
  
  return Response.json(logs);
}

export async function POST(request: Request) {
  const body = await request.json();
  const log = await prisma.importExportLog.create({ data: body });
  return Response.json(log);
}
```

### Service Layer Migration

```typescript
// lib/import-export/import-export-service.ts

// Hiện tại (localStorage):
export const importExportService = {
  addLog: (log) => useImportExportStore.getState().addImportLog(log),
  getLogs: (params) => useImportExportStore.getState().getLogsByEntity(params.entityType),
};

// Tương lai (API):
export const importExportService = {
  addLog: (log) => fetch('/api/import-export/logs', {
    method: 'POST',
    body: JSON.stringify(log),
  }),
  getLogs: (params) => fetch(`/api/import-export/logs?${new URLSearchParams(params)}`).then(r => r.json()),
};
```

---

## ✅ Checklist triển khai

### Phase 0: Chuẩn bị File Mẫu 📂
- [ ] Tạo thư mục `public/templates/`
- [ ] Tạo `Mau_Nhap_Nhan_Vien.xlsx` với header + 2-3 dòng mẫu
- [ ] Tạo `Mau_Nhap_San_Pham.xlsx`
- [ ] Tạo `Mau_Nhap_Khach_Hang.xlsx`
- [ ] Tạo `Mau_Nhap_Nha_Cung_Cap.xlsx`
- [ ] Copy `docs/file/t11.xls` → `public/templates/Mau_ChamCong_MayCC.xls`

### Phase 1: Foundation
- [ ] Tạo `lib/import-export/types.ts`
- [ ] Tạo `lib/import-export/import-export-store.ts`
- [ ] Tạo `lib/import-export/utils.ts` (preview, validate functions)
- [ ] Tạo `lib/import-export/attendance-parser.ts` (parser riêng cho máy CC)
- [ ] Tạo `lib/import-export/index.ts`
- [ ] Cập nhật `features/shared/import-export-history-page.tsx`
- [ ] Test: Xem history page với real store

### Phase 2: Configs
- [ ] Tạo `lib/import-export/configs/employee.config.ts`
- [ ] Tạo `lib/import-export/configs/product.config.ts`
- [ ] Tạo `lib/import-export/configs/customer.config.ts`
- [ ] Tạo `lib/import-export/configs/attendance.config.ts` ⭐ (máy chấm công)
- [ ] Tạo `lib/import-export/configs/index.ts`

### Phase 2.5: Employee Mapping Store (cho Chấm công)
- [ ] Tạo `lib/import-export/employee-mapping-store.ts`
- [ ] UI mapping: Tên máy CC → Mã NV hệ thống
- [ ] Lưu mapping để tái sử dụng

### Phase 3: Cập nhật Dialogs
- [ ] Cập nhật `GenericImportDialog`:
  - [ ] Thêm bước Preview (rà soát trước khi import)
  - [ ] Hiển thị status từng dòng: ✅ Sẽ thêm / 🔄 Sẽ cập nhật / ❌ Lỗi
  - [ ] Nút "Tải file mẫu" với link `templateDownloadUrl`
  - [ ] Logic Upsert: insert hoặc update theo Business ID
  - [ ] Dừng lại nếu có lỗi và hiển thị chi tiết
  - [ ] Ghi log vào store
- [ ] Cập nhật `GenericExportDialog`:
  - [ ] Đảm bảo có 3 scope: filtered/current-page/all
  - [ ] Tùy chọn columns theo group
  - [ ] Ghi log vào store

### Phase 4: Integration (List Pages)
- [ ] Tích hợp vào `features/employees/list-page.tsx`
- [ ] Tích hợp vào `features/products/list-page.tsx`
- [ ] Tích hợp vào `features/customers/list-page.tsx`

### Phase 5: Testing (Các module cơ bản)
- [ ] Test import file mẫu đúng format → thành công
- [ ] Test import file có lỗi validate → dừng + hiển thị lỗi
- [ ] Test import với mã NV mới → thêm mới
- [ ] Test import với mã NV đã có → cập nhật
- [ ] Test import với email/SĐT trùng → báo lỗi
- [ ] Test export scope: all / current-page / filtered
- [ ] Test export với tùy chọn columns
- [ ] Test history page hiển thị đúng logs
- [ ] Test clear logs

### Phase 5.5: Testing Chấm công (Máy CC) ⭐
- [ ] Test parse file `t11.xls` đúng cấu trúc
- [ ] Test auto-detect tháng/năm từ file
- [ ] Test auto-mapping nhân viên (khớp tên)
- [ ] Test mapping thủ công (tên không khớp)
- [ ] Test lưu mapping để tái sử dụng
- [ ] Test import chấm công tháng mới → thêm mới
- [ ] Test import chấm công tháng đã có → cập nhật

### Phase 6: Rollout (các module còn lại)
- [ ] Orders
- [ ] Suppliers
- [ ] Inventory
- [ ] Attendance ⭐ (đã có config đặc biệt)
- [ ] ...

---

## 📝 Notes

1. **Backward Compatible**: Các component hiện tại (`GenericImportDialog`, `GenericExportDialog`) giữ nguyên interface, chỉ thêm logic log

2. **Performance**: Giới hạn 200 logs trong localStorage, query theo entityType để filter

3. **Error Handling**: Chỉ lưu 50 lỗi đầu tiên để tránh data quá lớn

4. **Migration Path**: Service layer trung gian giúp swap localStorage ↔ API dễ dàng

5. **Reusable Configs**: Mỗi entity 1 config file, dễ maintain và extend

6. **🆕 Upsert Logic**: 
   - Nếu `businessIdField` (VD: NV000001) đã tồn tại → **UPDATE**
   - Nếu `businessIdField` chưa có → **INSERT**
   - Check `uniqueFields` (email, phone) để đảm bảo không trùng với record khác

7. **🆕 Preview Mandatory**: Bắt buộc rà soát trước khi import, không cho "import mù"

8. **🆕 Template Files**: File mẫu đặt trong `public/templates/`, dễ dàng download từ dialog

9. **🆕 Attendance Import (Máy CC)**: 
   - File từ máy chấm công có format đặc biệt (không phải bảng chuẩn)
   - Cần custom parser riêng
   - Mapping tên NV máy CC → Mã NV hệ thống (lưu để tái sử dụng)
   - Upsert theo composite key: `(employeeSystemId, month, year)`
   - File mẫu: `docs/file/t11.xls`
