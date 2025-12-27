# Generic Import/Export Components Guide

This guide explains how to use the generic import and export dialog components across different modules in the application.

## Overview

The system provides three reusable components for import/export functionality:

1. **GenericExportDialog** - Export data to Excel with scope selection and column chooser
2. **GenericImportDialog** - Import data from Excel with validation and error handling
3. **ImportExportHistoryPage** - Management page for viewing import/export logs

## 1. GenericExportDialog

### Purpose
Allows users to export data to Excel files with:
- Scope selection (all data vs current page)
- Column selection with grouping
- Auto-sized columns
- Vietnamese headers

### Props Interface

```typescript
interface GenericExportDialogProps<T> {
  // Dialog state
  open: boolean;
  onOpenChange: (open: boolean) => void;
  
  // Data configuration
  title: string;                    // Dialog title (e.g., "Xuất danh sách nhân viên")
  currentPageData: T[];             // Data on current page
  allData: T[];                     // All data (for "Tất cả" option)
  
  // Column configuration
  columnGroups: ColumnGroup[];      // Grouped columns for selection
  
  // Export handler
  onExport: (scope: 'all' | 'current', selectedColumns: string[], data: T[]) => Promise<void>;
  
  // Optional
  fileName?: string;                // Base filename (default: 'export')
  sheetName?: string;               // Excel sheet name (default: 'Data')
}

interface ColumnGroup {
  id: string;                       // Group ID
  label: string;                    // Group display name
  columns: ColumnOption[];          // Columns in this group
}

interface ColumnOption {
  key: string;                      // Data field key
  label: string;                    // Column header in Excel
  defaultSelected?: boolean;        // Pre-selected (default: true)
}
```

### Usage Example - Employees Module

```typescript
import { GenericExportDialog } from '@/components/shared/generic-export-dialog';
import * as XLSX from 'xlsx';

function EmployeesPage() {
  const [showExportDialog, setShowExportDialog] = React.useState(false);
  const { employees } = useEmployeeStore();
  const currentPageEmployees = employees.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize
  );

  const columnGroups: ColumnGroup[] = [
    {
      id: 'basic',
      label: 'Thông tin cơ bản',
      columns: [
        { key: 'fullName', label: 'Họ và tên' },
        { key: 'employeeCode', label: 'Mã nhân viên' },
        { key: 'email', label: 'Email' },
        { key: 'phoneNumber', label: 'Số điện thoại' },
      ]
    },
    {
      id: 'work',
      label: 'Thông tin công việc',
      columns: [
        { key: 'departmentName', label: 'Phòng ban' },
        { key: 'jobTitle', label: 'Chức vụ' },
        { key: 'employmentStatus', label: 'Trạng thái' },
        { key: 'startDate', label: 'Ngày vào làm' },
      ]
    },
    {
      id: 'salary',
      label: 'Thông tin lương',
      columns: [
        { key: 'baseSalary', label: 'Lương cơ bản' },
        { key: 'allowances', label: 'Phụ cấp' },
      ]
    }
  ];

  const handleExport = async (
    scope: 'all' | 'current',
    selectedColumns: string[],
    data: Employee[]
  ) => {
    // Transform data for export
    const exportData = data.map(emp => {
      const row: any = {};
      selectedColumns.forEach(key => {
        row[key] = emp[key as keyof Employee];
      });
      return row;
    });

    // Create workbook
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Nhân viên');

    // Auto-size columns
    const maxWidth = 50;
    ws['!cols'] = selectedColumns.map(() => ({ wch: maxWidth }));

    // Download file
    const fileName = `nhan-vien_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(wb, fileName);

    toast.success(`Đã xuất ${data.length} nhân viên`);
  };

  return (
    <>
      <Button onClick={() => setShowExportDialog(true)}>
        <Download className="mr-2 h-4 w-4" />
        Xuất Excel
      </Button>

      <GenericExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        title="Xuất danh sách nhân viên"
        currentPageData={currentPageEmployees}
        allData={employees}
        columnGroups={columnGroups}
        onExport={handleExport}
        fileName="nhan-vien"
        sheetName="Nhân viên"
      />
    </>
  );
}
```

## 2. GenericImportDialog

### Purpose
Allows users to import data from Excel files with:
- Branch selection (optional/required)
- Template download with Vietnamese headers
- File validation with error/warning reporting
- Step-by-step wizard UI
- Progress tracking

### Props Interface

```typescript
interface GenericImportDialogProps<T> {
  // Dialog state
  open: boolean;
  onOpenChange: (open: boolean) => void;
  
  // Configuration
  title: string;                        // Dialog title
  templateFileName: string;             // Template file name (e.g., "mau-nhap-nhan-vien.xlsx")
  
  // Branch selection
  requireBranch: boolean;               // Whether branch selection is required
  branches?: Array<{ id: string; name: string }>; // Available branches
  
  // Template configuration
  templateColumns: TemplateColumn[];    // Column definitions for template
  
  // Validation & Import
  validateRow: (row: any, rowIndex: number) => ValidationResult;
  onImport: (data: T[], branchId?: string) => Promise<{ success: number; failed: number }>;
  
  // Optional
  maxFileSize?: number;                 // Max file size in bytes (default: 5MB)
  allowedExtensions?: string[];         // Allowed extensions (default: ['.xlsx', '.xls'])
}

interface TemplateColumn {
  key: string;                          // Data field key
  label: string;                        // Vietnamese header in template
  required?: boolean;                   // Is this field required?
  example?: string;                     // Example value for template
}

interface ValidationResult {
  valid: boolean;
  errors?: string[];                    // Critical errors (prevent import)
  warnings?: string[];                  // Non-critical warnings
}
```

### Usage Example - Employees Module

```typescript
import { GenericImportDialog } from '@/components/shared/generic-import-dialog';

function EmployeesPage() {
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const { addEmployee } = useEmployeeStore();
  const { branches } = useBranchStore();

  const templateColumns: TemplateColumn[] = [
    { key: 'employeeCode', label: 'Mã nhân viên', required: true, example: 'NV001' },
    { key: 'fullName', label: 'Họ và tên', required: true, example: 'Nguyễn Văn A' },
    { key: 'email', label: 'Email', required: true, example: 'nguyenvana@example.com' },
    { key: 'phoneNumber', label: 'Số điện thoại', required: false, example: '0912345678' },
    { key: 'departmentName', label: 'Phòng ban', required: true, example: 'Kinh doanh' },
    { key: 'jobTitle', label: 'Chức vụ', required: true, example: 'Nhân viên' },
    { key: 'startDate', label: 'Ngày vào làm', required: true, example: '01/01/2024' },
    { key: 'baseSalary', label: 'Lương cơ bản', required: false, example: '10000000' },
  ];

  const validateRow = (row: any, rowIndex: number): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field validation
    if (!row.employeeCode?.trim()) {
      errors.push(`Dòng ${rowIndex}: Thiếu mã nhân viên`);
    }
    if (!row.fullName?.trim()) {
      errors.push(`Dòng ${rowIndex}: Thiếu họ tên`);
    }
    if (!row.email?.trim()) {
      errors.push(`Dòng ${rowIndex}: Thiếu email`);
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (row.email && !emailRegex.test(row.email)) {
      errors.push(`Dòng ${rowIndex}: Email không hợp lệ`);
    }

    // Phone number format validation
    if (row.phoneNumber && !/^\d{10,11}$/.test(row.phoneNumber.replace(/\s/g, ''))) {
      warnings.push(`Dòng ${rowIndex}: Số điện thoại không đúng định dạng`);
    }

    // Date validation
    if (row.startDate) {
      const date = new Date(row.startDate);
      if (isNaN(date.getTime())) {
        errors.push(`Dòng ${rowIndex}: Ngày vào làm không hợp lệ`);
      }
    }

    // Salary validation
    if (row.baseSalary && isNaN(Number(row.baseSalary))) {
      errors.push(`Dòng ${rowIndex}: Lương cơ bản phải là số`);
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  };

  const handleImport = async (
    data: Employee[],
    branchId?: string
  ): Promise<{ success: number; failed: number }> => {
    let successCount = 0;
    let failedCount = 0;

    for (const employee of data) {
      try {
        await addEmployee({
          ...employee,
          branchId: branchId || employee.branchId,
          systemId: generateId(),
          createdAt: new Date().toISOString(),
        });
        successCount++;
      } catch (error) {
        console.error('Import error:', error);
        failedCount++;
      }
    }

    return { success: successCount, failed: failedCount };
  };

  return (
    <>
      <Button onClick={() => setShowImportDialog(true)}>
        <Upload className="mr-2 h-4 w-4" />
        Nhập Excel
      </Button>

      <GenericImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        title="Nhập danh sách nhân viên"
        templateFileName="mau-nhap-nhan-vien.xlsx"
        requireBranch={true}
        branches={branches}
        templateColumns={templateColumns}
        validateRow={validateRow}
        onImport={handleImport}
        maxFileSize={5 * 1024 * 1024} // 5MB
      />
    </>
  );
}
```

## 3. ImportExportHistoryPage

### Purpose
Centralized page for viewing and managing all import/export operations across the system.

### Features
- Search by filename
- Filter by action type (import/export)
- Filter by module (employees, customers, products, etc.)
- Filter by performer
- Filter by status (success, failed, partial)
- View details
- Download exported files
- Delete logs

### Route
```
/settings/import-export-logs
```

### Access
Add a link in your settings menu:
```typescript
<Link to="/settings/import-export-logs">
  <History className="mr-2 h-4 w-4" />
  Lịch sử nhập xuất
</Link>
```

### Data Structure

```typescript
interface ImportExportLog {
  systemId: string;
  fileName: string;
  action: 'import' | 'export';
  module: string;                   // 'employees', 'customers', 'products', etc.
  moduleName: string;               // Display name
  performer: string;
  performerId: string;
  timestamp: string;                // ISO date string
  status: 'success' | 'failed' | 'partial';
  recordCount: number;
  successCount?: number;
  failedCount?: number;
  errorDetails?: string;
  fileUrl?: string;
  fileSize?: number;
}
```

## Integration Checklist

When adding import/export to a new module:

### Export
- [ ] Define `ColumnGroup[]` with grouped columns
- [ ] Implement `handleExport` function
- [ ] Add "Xuất Excel" button
- [ ] Add `GenericExportDialog` component
- [ ] Test with current page data
- [ ] Test with all data
- [ ] Test column selection

### Import
- [ ] Define `TemplateColumn[]` for template generation
- [ ] Implement `validateRow` function with business rules
- [ ] Implement `handleImport` function
- [ ] Add "Nhập Excel" button
- [ ] Add `GenericImportDialog` component
- [ ] Test template download
- [ ] Test validation with invalid data
- [ ] Test successful import
- [ ] Test branch selection (if required)

### History Tracking
- [ ] Create log entry after export
- [ ] Create log entry after import
- [ ] Store file metadata
- [ ] Enable download for export files
- [ ] Enable view details for logs

## Best Practices

### Export
1. **Column Organization**: Group related columns together for better UX
2. **Default Selection**: Pre-select commonly used columns
3. **Auto-sizing**: Always auto-size columns for readability
4. **Filename Convention**: Use format `{module}_{timestamp}.xlsx`
5. **Toast Feedback**: Show success message with record count

### Import
1. **Clear Templates**: Provide example values in template
2. **Comprehensive Validation**: Check both format and business rules
3. **Error Messages**: Be specific about what's wrong and where
4. **Warnings vs Errors**: Distinguish critical errors from warnings
5. **Progress Feedback**: Show progress for large imports
6. **Rollback**: Consider transaction rollback on critical errors

### General
1. **Consistent UI**: Use same dialog style across all modules
2. **Performance**: Handle large datasets efficiently
3. **File Size Limits**: Enforce reasonable file size limits
4. **Security**: Validate file types and content
5. **Logging**: Always create history logs for audit trail

## Error Handling

### Common Validation Scenarios

```typescript
// Required field
if (!row.fieldName?.trim()) {
  errors.push(`Dòng ${rowIndex}: Thiếu ${fieldLabel}`);
}

// Email format
if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
  errors.push(`Dòng ${rowIndex}: Email không hợp lệ`);
}

// Phone number
if (row.phone && !/^\d{10,11}$/.test(row.phone.replace(/\s/g, ''))) {
  warnings.push(`Dòng ${rowIndex}: Số điện thoại không đúng định dạng`);
}

// Date format
const date = new Date(row.date);
if (isNaN(date.getTime())) {
  errors.push(`Dòng ${rowIndex}: Ngày không hợp lệ`);
}

// Number format
if (row.amount && isNaN(Number(row.amount))) {
  errors.push(`Dòng ${rowIndex}: ${fieldLabel} phải là số`);
}

// Enum validation
const validStatuses = ['active', 'inactive'];
if (!validStatuses.includes(row.status)) {
  errors.push(`Dòng ${rowIndex}: Trạng thái không hợp lệ`);
}

// Foreign key validation (async)
const department = await findDepartmentByName(row.departmentName);
if (!department) {
  errors.push(`Dòng ${rowIndex}: Không tìm thấy phòng ban "${row.departmentName}"`);
}
```

## Performance Optimization

### Large File Handling

```typescript
// Batch import
const BATCH_SIZE = 100;
for (let i = 0; i < data.length; i += BATCH_SIZE) {
  const batch = data.slice(i, i + BATCH_SIZE);
  await importBatch(batch);
  
  // Update progress
  const progress = Math.round(((i + batch.length) / data.length) * 100);
  onProgress?.(progress);
}

// Stream processing for very large files
// Use XLSX streaming API or process in chunks
```

## Examples by Module

| Module | Scope | Columns | Branch Required |
|--------|-------|---------|-----------------|
| Employees | All/Page | 15+ (basic, work, salary) | Yes |
| Customers | All/Page | 10+ (basic, contact, address) | No |
| Products | All/Page | 20+ (basic, pricing, inventory) | No |
| Orders | All/Page | 12+ (order info, customer, items) | Yes |
| Suppliers | All/Page | 8+ (basic, contact) | No |

## Support

For questions or issues:
1. Check this guide first
2. Review existing implementations (employees, customers)
3. Check component source code with detailed comments
4. Ask the development team
