# 📋 PAYROLL MODULE - RÀ SOÁT VÀ NÂNG CẤP

> Ngày tạo: 29/11/2025  
> Trạng thái: ✅ Hoàn thành phân tích  
> Mục tiêu: shadcn + mobile-first + Prisma/PostgreSQL + Next.js + VPS deployment

---

## 📊 TỔNG QUAN MODULE

### Mục đích
Module Payroll (Bảng lương) quản lý:
- Chạy bảng lương theo từng batch (kỳ)
- Template mẫu lương với các thành phần cố định
- Tính toán lương dựa trên attendance, leaves, compensation
- Duyệt và khóa batch lương
- Xuất báo cáo phiếu lương (CSV)
- Audit log cho mọi thao tác

### Vị trí trong hệ thống
```
┌──────────────┐      ┌──────────────┐
│   SETTINGS   │─────►│   EMPLOYEES  │
│ (components) │      │ (compensation│
└──────────────┘      │   data)      │
                      └──────┬───────┘
                             │
                             ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  ATTENDANCE  │─────►│   PAYROLL    │◄─────│    LEAVES    │
│  (work days, │      │   (Engine)   │      │  (deductions)│
│   OT hours)  │      └──────┬───────┘      └──────────────┘
└──────────────┘             │
                             ▼
                      ┌──────────────┐
                      │  CASHBOOK /  │ (Future: Payment tracking)
                      │  PAYMENTS    │
                      └──────────────┘
```

---

## 📁 CẤU TRÚC FILES HIỆN TẠI

### Core Files
```
features/payroll/
├── payroll-batch-store.ts           ✅ Zustand store (batch + payslip)
├── payroll-template-store.ts        ✅ Zustand store (templates)
├── list-page.tsx                    ✅ Batch list page
├── detail-page.tsx                  ✅ Batch detail + actions
├── run-page.tsx                     ✅ Wizard (3 steps) to create batch
├── template-page.tsx                ✅ Template CRUD
└── components/
    ├── batch-filters.tsx            ✅ Filter controls
    ├── payslip-table.tsx            ✅ Payslip data table
    ├── status-badge.tsx             ✅ Status badge component
    └── summary-cards.tsx            ✅ KPI cards

lib/
├── payroll-types.ts                 ✅ Type definitions
├── payroll-engine.ts                ✅ Calculation engine
└── attendance-snapshot-service.ts   ✅ Snapshot for locked attendance
```

---

## 🔍 PHÂN TÍCH CHI TIẾT

### A. TYPES (lib/payroll-types.ts)

#### Đánh giá
✅ **Điểm mạnh:**
- Đầy đủ type definitions với dual-ID
- Clear separation: Batch, Payslip, Template, AuditLog
- Type-safe với audit actions

✅ **Core Types:**
```typescript
export interface PayrollBatch {
  systemId: SystemId;
  id: BusinessId;                   // PR-2025-11-001
  title: string;
  status: PayrollBatchStatus;       // draft | reviewed | locked
  
  // Relations
  templateSystemId?: SystemId;
  payslipSystemIds: SystemId[];
  
  // Period
  payPeriod: PayrollPeriod;         // monthKey, startDate, endDate
  payrollDate: string;              // Date trả lương
  referenceAttendanceMonthKeys: string[]; // ["2025-11"]
  
  // Summary
  totalGross: number;
  totalNet: number;
  
  // Approval workflow
  reviewedAt?: string;
  reviewedBy?: SystemId;
  lockedAt?: string;
  lockedBy?: SystemId;
  
  notes?: string;
  
  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: SystemId;
  updatedBy: SystemId;
}

export interface Payslip {
  systemId: SystemId;
  id: BusinessId;                   // PSL-001
  
  // Relations
  batchSystemId: SystemId;
  employeeSystemId: SystemId;
  employeeId: BusinessId;           // NV001
  departmentSystemId?: SystemId;
  
  // Period
  periodMonthKey: string;           // "2025-11"
  attendanceSnapshotSystemId?: SystemId;
  
  // Components
  components: PayrollComponentEntry[];
  
  // Totals
  totals: PayrollTotals;
  
  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: SystemId;
  updatedBy: SystemId;
}

export interface PayrollComponentEntry {
  componentSystemId: SystemId;
  name: string;
  type: 'earning' | 'deduction' | 'contribution';
  calculationType: 'fixed' | 'rate' | 'formula';
  value: number;                    // Calculated value
  formula?: string;
  note?: string;
}

export interface PayrollTotals {
  earnings: number;                 // Tổng thu nhập
  deductions: number;               // Tổng khấu trừ (thuế, BHXH NV, etc.)
  contributions: number;            // Đóng góp DN (BHXH DN, BHYT DN, etc.)
  netPay: number;                   // Thực lĩnh
}

export interface PayrollTemplate {
  systemId: SystemId;
  id: BusinessId;                   // PT-001
  name: string;
  code?: string;
  description?: string;
  componentSystemIds: SystemId[];   // Components to include
  isDefault: boolean;
  createdAt: string;
  createdBy: SystemId;
  updatedAt: string;
  updatedBy: SystemId;
}

export interface PayrollAuditLog {
  systemId: SystemId;
  id: BusinessId;
  batchSystemId: SystemId;
  action: PayrollAuditAction;       // run | recalculate | review | lock | unlock | export
  actorSystemId: SystemId;
  actorDisplayName?: string;
  payload?: Record<string, unknown>;
  createdAt: string;
}

export type PayrollBatchStatus = 'draft' | 'reviewed' | 'locked';
export type PayrollAuditAction = 'run' | 'recalculate' | 'review' | 'lock' | 'unlock' | 'export';
```

⚠️ **Vấn đề:**
- Không có `branchSystemId` trong Payslip (nếu cần multi-branch)
- `PayrollComponentEntry` chưa track input variables (e.g., attendanceDays, otHours)
- Không có versioning cho PayrollTemplate (khi template thay đổi sau khi batch đã run)
- Thiếu payment tracking (đã trả/chưa trả cho nhân viên)

#### Đề xuất: Prisma Schema
```prisma
model PayrollBatch {
  systemId          String   @id @default(uuid())
  id                String   @unique // PR-2025-11-001
  
  title             String
  status            PayrollBatchStatus @default(DRAFT)
  
  // Relations
  templateSystemId  String?
  template          PayrollTemplate? @relation(fields: [templateSystemId], references: [systemId])
  payslips          Payslip[]
  
  // Period
  payPeriod         Json     // { monthKey, startDate, endDate }
  payrollDate       DateTime // Ngày trả lương
  referenceAttendanceMonthKeys String[] // ["2025-11", "2025-10"]
  
  // Summary (calculated)
  totalGross        Float    @default(0)
  totalNet          Float    @default(0)
  
  // Approval workflow
  reviewedAt        DateTime?
  reviewedBy        String?
  lockedAt          DateTime?
  lockedBy          String?
  
  notes             String?
  
  // Audit
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  createdBy         String
  updatedBy         String
  
  // Audit logs
  auditLogs         PayrollAuditLog[]
  
  @@index([status])
  @@index([payrollDate])
}

model Payslip {
  systemId          String   @id @default(uuid())
  id                String   @unique // PSL-001
  
  // Relations
  batchSystemId     String
  batch             PayrollBatch @relation(fields: [batchSystemId], references: [systemId], onDelete: Cascade)
  employeeSystemId  String
  employee          Employee @relation(fields: [employeeSystemId], references: [systemId])
  departmentSystemId String?
  department        Department? @relation(fields: [departmentSystemId], references: [systemId])
  branchSystemId    String?
  branch            Branch? @relation(fields: [branchSystemId], references: [systemId])
  
  // Period
  periodMonthKey    String   // "2025-11"
  attendanceSnapshotSystemId String?
  attendanceSnapshot AttendanceSnapshot? @relation(fields: [attendanceSnapshotSystemId], references: [systemId])
  
  // Components (stored as JSON for flexibility)
  components        Json     // PayrollComponentEntry[]
  
  // Totals
  earnings          Float    @default(0)
  deductions        Float    @default(0)
  contributions     Float    @default(0)
  netPay            Float    @default(0)
  
  // Payment tracking
  isPaid            Boolean  @default(false)
  paidAt            DateTime?
  paidBy            String?
  paymentMethod     String?  // bank_transfer | cash | cheque
  paymentReference  String?  // Transaction ID, cheque number, etc.
  
  // Audit
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  createdBy         String
  updatedBy         String
  
  @@unique([batchSystemId, employeeSystemId])
  @@index([employeeSystemId])
  @@index([periodMonthKey])
}

model PayrollTemplate {
  systemId          String   @id @default(uuid())
  id                String   @unique // PT-001
  
  name              String
  code              String?
  description       String?
  
  // Components (array of systemIds)
  componentSystemIds String[] // Reference to SalaryComponent
  
  isDefault         Boolean  @default(false)
  isActive          Boolean  @default(true)
  
  // Versioning (future)
  version           Int      @default(1)
  
  // Audit
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  createdBy         String
  updatedBy         String
  
  // Relations
  batches           PayrollBatch[]
  
  @@index([isDefault])
}

model PayrollAuditLog {
  systemId          String   @id @default(uuid())
  id                String   @unique
  
  // Relations
  batchSystemId     String
  batch             PayrollBatch @relation(fields: [batchSystemId], references: [systemId], onDelete: Cascade)
  
  action            PayrollAuditAction
  actorSystemId     String
  actorDisplayName  String?
  payload           Json?
  
  createdAt         DateTime @default(now())
  
  @@index([batchSystemId])
  @@index([createdAt])
}

model AttendanceSnapshot {
  systemId          String   @id @default(uuid())
  
  // Relations
  employeeSystemId  String
  employee          Employee @relation(fields: [employeeSystemId], references: [systemId])
  
  // Period
  monthKey          String   // "2025-11"
  
  // Snapshot data
  workDays          Float
  leaveDays         Float
  absentDays        Float
  lateArrivals      Int
  earlyDepartures   Int
  otHours           Float
  
  // Lock info
  locked            Boolean  @default(false)
  lockedAt          DateTime?
  lockedBy          String?
  
  // Audit
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  payslips          Payslip[]
  
  @@unique([employeeSystemId, monthKey])
  @@index([monthKey])
  @@index([locked])
}

enum PayrollBatchStatus {
  DRAFT
  REVIEWED
  LOCKED
}

enum PayrollAuditAction {
  RUN
  RECALCULATE
  REVIEW
  LOCK
  UNLOCK
  EXPORT
  PAYMENT_RECORDED
}
```

**Lưu ý về cấu trúc:**
- **AttendanceSnapshot**: Snapshot dữ liệu chấm công khi lock tháng → Tránh bị thay đổi sau khi trả lương
- **Payment tracking**: Thêm isPaid, paidAt, paymentMethod để track việc chi trả
- **Versioning**: Template có version để track changes (future feature)
- **JSON storage**: Components lưu dạng JSON để linh hoạt (có thể normalize sau nếu cần)

---

### B. STORES (payroll-batch-store.ts, payroll-template-store.ts)

#### Đánh giá
✅ **Điểm mạnh:**
- Dual-ID generation logic rất tốt
- Audit log tự động cho mọi action
- Lock month attendance khi lock batch
- Counter management cho ID generation
- Persistent storage (localStorage)

✅ **Batch Store Actions:**
```typescript
type PayrollBatchStoreState = {
  batches: PayrollBatch[];
  payslips: Payslip[];
  auditLogs: PayrollAuditLog[];
  counters: CounterMap;
  
  // CRUD
  createBatch: (input: CreateBatchInput) => PayrollBatch;
  createBatchWithResults: (input, payslips) => PayrollBatch;
  updateBatchStatus: (systemId, status, note?) => void;
  
  // Payslips
  addPayslips: (batchSystemId, inputs) => void;
  
  // Audit
  logAction: (input: LogActionInput) => PayrollAuditLog;
  
  // Query
  getBatchBySystemId: (systemId) => PayrollBatch | undefined;
  getPayslipsByBatch: (batchSystemId) => Payslip[];
};
```

✅ **Template Store Actions:**
```typescript
type PayrollTemplateStoreState = {
  templates: PayrollTemplate[];
  counter: TemplateCounterState;
  
  // CRUD
  createTemplate: (input: TemplateInput) => PayrollTemplate;
  updateTemplate: (systemId, input) => PayrollTemplate | undefined;
  deleteTemplate: (systemId) => void;
  
  // Default management
  setDefaultTemplate: (systemId) => PayrollTemplate | undefined;
  getDefaultTemplate: () => PayrollTemplate | undefined;
  ensureDefaultTemplate: () => PayrollTemplate;
  
  // Query
  getTemplateBySystemId: (systemId) => PayrollTemplate | undefined;
};
```

⚠️ **Vấn đề:**
- Lưu toàn bộ data trong localStorage → Size limit
- Không có backend sync
- Không có optimistic updates
- Recalculate logic còn đơn giản (chỉ đếm payslips)
- Không track errors trong calculation

#### Đề xuất: React Query Migration
```typescript
// hooks/use-payroll-batches.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const usePayrollBatches = (filters?: PayrollBatchFilters) => {
  return useQuery({
    queryKey: ['payroll', 'batches', filters],
    queryFn: () => fetchPayrollBatches(filters),
  });
};

export const usePayrollBatchDetail = (batchSystemId: SystemId) => {
  return useQuery({
    queryKey: ['payroll', 'batch', batchSystemId],
    queryFn: () => fetchPayrollBatchDetail(batchSystemId),
    enabled: Boolean(batchSystemId),
  });
};

export const useCreatePayrollBatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: CreatePayrollBatchParams) => 
      createPayrollBatch(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll', 'batches'] });
    },
  });
};

export const useUpdateBatchStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: { 
      batchSystemId: SystemId; 
      status: PayrollBatchStatus; 
      note?: string;
    }) => updateBatchStatus(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['payroll', 'batch', variables.batchSystemId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['payroll', 'batches'] 
      });
    },
  });
};

export const usePayrollTemplates = () => {
  return useQuery({
    queryKey: ['payroll', 'templates'],
    queryFn: () => fetchPayrollTemplates(),
  });
};

export const useCreatePayrollTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: CreatePayrollTemplateParams) => 
      createPayrollTemplate(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll', 'templates'] });
    },
  });
};
```

---

### C. PAYROLL ENGINE (lib/payroll-engine.ts)

#### Đánh giá hiện tại
✅ **Điểm mạnh:**
- Central calculation logic
- Input validation
- Warning system
- Batch processing

⚠️ **Vấn đề cần khắc phục:**
- Calculation logic còn đơn giản (giả định fixed salary)
- Chưa tích hợp đầy đủ với Attendance data
- Chưa xử lý complex formulas
- Không có error recovery
- Không track calculation history

#### Đề xuất: Enhanced Payroll Engine
```typescript
// lib/payroll-engine-v2.ts

export class PayrollEngineV2 {
  /**
   * Run payroll for multiple employees
   */
  static async runBatch(params: {
    employeeSystemIds: SystemId[];
    templateSystemId: SystemId;
    monthKey: string;
  }): Promise<PayrollBatchResult> {
    const results: PayrollResult[] = [];
    const errors: PayrollError[] = [];
    
    for (const employeeSystemId of params.employeeSystemIds) {
      try {
        const result = await this.calculatePayroll({
          employeeSystemId,
          templateSystemId: params.templateSystemId,
          monthKey: params.monthKey,
        });
        results.push(result);
      } catch (error) {
        errors.push({
          employeeSystemId,
          error: error.message,
        });
      }
    }
    
    return {
      results,
      errors,
      totalGross: results.reduce((sum, r) => sum + r.totals.earnings, 0),
      totalNet: results.reduce((sum, r) => sum + r.totals.netPay, 0),
    };
  }
  
  /**
   * Calculate payroll for single employee
   */
  static async calculatePayroll(params: {
    employeeSystemId: SystemId;
    templateSystemId: SystemId;
    monthKey: string;
  }): Promise<PayrollResult> {
    // 1. Get employee data
    const employee = await this.getEmployee(params.employeeSystemId);
    
    // 2. Get template
    const template = await this.getTemplate(params.templateSystemId);
    
    // 3. Get attendance snapshot (locked data)
    const attendance = await this.getAttendanceSnapshot(
      params.employeeSystemId,
      params.monthKey
    );
    
    // 4. Get leaves
    const leaves = await this.getApprovedLeaves(
      params.employeeSystemId,
      params.monthKey
    );
    
    // 5. Calculate each component
    const components = await this.calculateComponents({
      employee,
      template,
      attendance,
      leaves,
    });
    
    // 6. Calculate totals
    const totals = this.calculateTotals(components);
    
    // 7. Validate
    const warnings = this.validate({
      employee,
      attendance,
      components,
      totals,
    });
    
    return {
      employeeSystemId: employee.systemId,
      employeeId: employee.id,
      employeeName: employee.fullName,
      components,
      totals,
      warnings,
      calculatedAt: new Date().toISOString(),
    };
  }
  
  /**
   * Calculate individual salary components
   */
  private static async calculateComponents(context: {
    employee: Employee;
    template: PayrollTemplate;
    attendance: AttendanceSnapshot;
    leaves: LeaveRequest[];
  }): Promise<PayrollComponentEntry[]> {
    const { employee, template, attendance } = context;
    const components: PayrollComponentEntry[] = [];
    
    // Get component definitions from settings
    const componentDefs = await this.getSalaryComponentDefinitions(
      template.componentSystemIds
    );
    
    for (const def of componentDefs) {
      const value = await this.calculateComponentValue(def, {
        employee,
        attendance,
      });
      
      components.push({
        componentSystemId: def.systemId,
        name: def.name,
        type: def.type,
        calculationType: def.calculationType,
        value,
        formula: def.formula,
        note: def.note,
      });
    }
    
    return components;
  }
  
  /**
   * Calculate component value based on type
   */
  private static async calculateComponentValue(
    component: SalaryComponentDefinition,
    context: {
      employee: Employee;
      attendance: AttendanceSnapshot;
    }
  ): Promise<number> {
    switch (component.calculationType) {
      case 'fixed':
        return component.fixedValue ?? 0;
      
      case 'rate':
        // Example: baseSalary / 26 * workDays
        return this.calculateRateBasedValue(component, context);
      
      case 'formula':
        // Parse và execute formula
        return this.evaluateFormula(component.formula!, context);
      
      default:
        return 0;
    }
  }
  
  /**
   * Calculate rate-based value
   */
  private static calculateRateBasedValue(
    component: SalaryComponentDefinition,
    context: { employee: Employee; attendance: AttendanceSnapshot }
  ): number {
    const { employee, attendance } = context;
    
    // Example formulas:
    // - Daily wage: baseSalary / 26 * workDays
    // - Hourly wage: baseSalary / 208 * hours
    // - OT: baseSalary / 208 * otHours * 1.5
    
    const baseSalary = employee.baseSalary ?? 0;
    const standardWorkDays = 26;
    const standardWorkHours = 208;
    
    switch (component.code) {
      case 'SALARY':
        // Base salary (pro-rated)
        return (baseSalary / standardWorkDays) * attendance.workDays;
      
      case 'OT':
        // Overtime (1.5x rate)
        const hourlyRate = baseSalary / standardWorkHours;
        return hourlyRate * attendance.otHours * 1.5;
      
      case 'LEAVE_DEDUCTION':
        // Unpaid leave deduction
        const dailyRate = baseSalary / standardWorkDays;
        return dailyRate * attendance.absentDays;
      
      default:
        return component.fixedValue ?? 0;
    }
  }
  
  /**
   * Evaluate formula string
   */
  private static evaluateFormula(
    formula: string,
    context: { employee: Employee; attendance: AttendanceSnapshot }
  ): number {
    // Simple formula evaluator
    // Example formulas:
    // - "baseSalary * 0.1" → Allowance 10% of base
    // - "baseSalary / 26 * workDays" → Pro-rated salary
    // - "(baseSalary * 12) * 0.05 / 12" → Annual bonus / 12
    
    try {
      // Replace variables
      let expression = formula;
      expression = expression.replace(/baseSalary/g, String(context.employee.baseSalary ?? 0));
      expression = expression.replace(/workDays/g, String(context.attendance.workDays));
      expression = expression.replace(/otHours/g, String(context.attendance.otHours));
      expression = expression.replace(/absentDays/g, String(context.attendance.absentDays));
      
      // Evaluate (SAFE evaluation only with whitelisted operators)
      return this.safeEval(expression);
    } catch (error) {
      console.error('Formula evaluation error:', error);
      return 0;
    }
  }
  
  /**
   * Safe formula evaluation
   */
  private static safeEval(expression: string): number {
    // Use math.js or similar library for safe evaluation
    // For now, simple eval (CAUTION: Only use with trusted formulas)
    const allowedChars = /^[0-9+\-*/(). ]+$/;
    if (!allowedChars.test(expression)) {
      throw new Error('Invalid formula characters');
    }
    
    // eslint-disable-next-line no-eval
    return eval(expression);
  }
  
  /**
   * Calculate totals
   */
  private static calculateTotals(
    components: PayrollComponentEntry[]
  ): PayrollTotals {
    const earnings = components
      .filter(c => c.type === 'earning')
      .reduce((sum, c) => sum + c.value, 0);
    
    const deductions = components
      .filter(c => c.type === 'deduction')
      .reduce((sum, c) => sum + c.value, 0);
    
    const contributions = components
      .filter(c => c.type === 'contribution')
      .reduce((sum, c) => sum + c.value, 0);
    
    const netPay = earnings - deductions;
    
    return {
      earnings,
      deductions,
      contributions,
      netPay,
    };
  }
  
  /**
   * Validate payroll result
   */
  private static validate(context: {
    employee: Employee;
    attendance: AttendanceSnapshot;
    components: PayrollComponentEntry[];
    totals: PayrollTotals;
  }): string[] {
    const warnings: string[] = [];
    
    // Check negative net pay
    if (context.totals.netPay < 0) {
      warnings.push('Thực lĩnh âm. Kiểm tra lại khấu trừ.');
    }
    
    // Check missing attendance
    if (!context.attendance.locked) {
      warnings.push('Chấm công chưa được khóa.');
    }
    
    // Check work days
    if (context.attendance.workDays === 0) {
      warnings.push('Không có ngày làm việc.');
    }
    
    // Check absent days
    if (context.attendance.absentDays > 5) {
      warnings.push(`Vắng mặt ${context.attendance.absentDays} ngày.`);
    }
    
    return warnings;
  }
}
```

---

### D. UI PAGES

#### 1. List Page (list-page.tsx)

✅ **Features:**
- Batch list với filters (status, month, keyword)
- Summary KPI cards (current month total, pending review, awaiting lock)
- Status badges
- Click to detail

✅ **UI:**
- Responsive cards
- Table view
- Filter controls
- Clear CTAs

⚠️ **Vấn đề:**
- Không có pagination (tất cả batches load cùng lúc)
- Không có sorting options
- Search chỉ trên client-side

#### 2. Detail Page (detail-page.tsx)

✅ **Features:**
- Batch information
- Status workflow (Draft → Reviewed → Locked)
- Payslip table
- Department summary
- Export reports (CSV)
- Audit log
- Approval dialogs

✅ **UI:**
- Information cards
- Action buttons
- Tables
- Status hints

⚠️ **Vấn đề:**
- Export chỉ có CSV (chưa có Excel, PDF)
- Không có email payslip to employees
- Không có bulk payment recording
- Mobile UX chưa tối ưu

#### 3. Run Page (run-page.tsx) - Wizard

✅ **Features:**
- 3-step wizard:
  1. **Period selection**: Month, payroll date, template
  2. **Employee selection**: Multi-select với search
  3. **Preview & confirm**: Show calculated results
- Validation (locked month, approved leaves, snapshots)
- Blocking reasons display
- Auto-calculation on step 3

✅ **UI:**
- Step indicator
- Forms với validation
- Preview table
- Warnings & errors

⚠️ **Vấn đề:**
- Step 3 calculation chạy trên client (nặng khi nhiều NV)
- Không có "Save draft" để tiếp tục sau
- Không có comparison với tháng trước
- Không có bulk import employees từ file

#### 4. Template Page (template-page.tsx)

✅ **Features:**
- Template CRUD
- Component selection (checkboxes)
- Default template management
- Component list với details

✅ **UI:**
- Table view
- Dialog form
- Component picker

⚠️ **Vấn đề:**
- Không có template preview (sample calculation)
- Không có template duplication
- Không có template history/versioning

---

### E. LIÊN KẾT VỚI CÁC MODULE KHÁC

| Module | Liên kết | Loại | Mô tả |
|--------|----------|------|-------|
| **Employees** | employeeSystemId, baseSalary, compensation | FK + Data | Lấy thông tin lương cơ bản, allowances |
| **Attendance** | AttendanceSnapshot | Data | Work days, OT hours, late arrivals |
| **Leaves** | Leave requests | Data | Nghỉ phép có lương/không lương |
| **Settings** | Salary components, work schedule | Config | Định nghĩa các thành phần lương, công thức |
| **Cashbook** | Payment records (future) | Integration | Track actual payments |
| **Departments** | departmentSystemId | FK | Group by department |

#### Integration Logic:
✅ **Attendance → Payroll:**
- When attendance month is locked → Create snapshot
- Payroll uses snapshot (not live attendance) → Immutable

✅ **Leaves → Payroll:**
- Approved leaves affect attendance snapshot
- Paid leaves → No deduction
- Unpaid leaves → Deduct from salary

⚠️ **Gaps:**
- No direct integration với Cashbook (payment tracking)
- No email/SMS notification to employees
- No employee self-service portal
- No tax filing integration

---

## 🎯 ĐỀ XUẤT NÂNG CẤP

### Phase 1: Database & API (Priority: HIGH)

#### 1.1. Prisma Schema
```prisma
// See section A. TYPES - Đề xuất: Prisma Schema
```

#### 1.2. API Routes

**GET /api/payroll/batches**
```typescript
// List all payroll batches with filters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const monthKey = searchParams.get('monthKey');
  const keyword = searchParams.get('keyword');
  
  const batches = await prisma.payrollBatch.findMany({
    where: {
      ...(status && status !== 'all' && { status }),
      ...(monthKey && {
        referenceAttendanceMonthKeys: {
          has: monthKey,
        },
      }),
      ...(keyword && {
        OR: [
          { id: { contains: keyword, mode: 'insensitive' } },
          { title: { contains: keyword, mode: 'insensitive' } },
        ],
      }),
    },
    include: {
      template: true,
      _count: {
        select: { payslips: true },
      },
    },
    orderBy: { payrollDate: 'desc' },
  });
  
  return NextResponse.json(batches);
}
```

**POST /api/payroll/batches**
```typescript
// Create new payroll batch
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { 
    title, 
    templateSystemId, 
    payPeriod, 
    payrollDate, 
    referenceAttendanceMonthKeys,
    employeeSystemIds 
  } = body;
  
  // Validate locked months
  for (const monthKey of referenceAttendanceMonthKeys) {
    const isLocked = await checkMonthLocked(monthKey);
    if (!isLocked) {
      return NextResponse.json(
        { error: `Tháng ${monthKey} chưa được khóa` },
        { status: 400 }
      );
    }
  }
  
  // Create batch
  const batch = await prisma.payrollBatch.create({
    data: {
      id: await generatePayrollBatchId(),
      title,
      templateSystemId,
      payPeriod,
      payrollDate: new Date(payrollDate),
      referenceAttendanceMonthKeys,
      status: 'DRAFT',
      createdBy: req.user.systemId,
      updatedBy: req.user.systemId,
    },
  });
  
  // Calculate payrolls
  const results = await PayrollEngineV2.runBatch({
    employeeSystemIds,
    templateSystemId,
    monthKey: payPeriod.monthKey,
  });
  
  // Create payslips
  for (const result of results.results) {
    await prisma.payslip.create({
      data: {
        id: await generatePayslipId(),
        batchSystemId: batch.systemId,
        employeeSystemId: result.employeeSystemId,
        periodMonthKey: payPeriod.monthKey,
        components: result.components,
        earnings: result.totals.earnings,
        deductions: result.totals.deductions,
        contributions: result.totals.contributions,
        netPay: result.totals.netPay,
        createdBy: req.user.systemId,
        updatedBy: req.user.systemId,
      },
    });
  }
  
  // Update batch totals
  await prisma.payrollBatch.update({
    where: { systemId: batch.systemId },
    data: {
      totalGross: results.totalGross,
      totalNet: results.totalNet,
    },
  });
  
  // Log action
  await createAuditLog({
    batchSystemId: batch.systemId,
    action: 'RUN',
    actorSystemId: req.user.systemId,
  });
  
  return NextResponse.json(batch);
}
```

**PATCH /api/payroll/batches/:systemId/status**
```typescript
// Update batch status (review/lock)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { systemId: string } }
) {
  const { status, note } = await req.json();
  
  const batch = await prisma.payrollBatch.update({
    where: { systemId: params.systemId },
    data: {
      status,
      ...(status === 'REVIEWED' && {
        reviewedAt: new Date(),
        reviewedBy: req.user.systemId,
      }),
      ...(status === 'LOCKED' && {
        lockedAt: new Date(),
        lockedBy: req.user.systemId,
      }),
      updatedBy: req.user.systemId,
    },
  });
  
  // Log action
  await createAuditLog({
    batchSystemId: batch.systemId,
    action: status === 'REVIEWED' ? 'REVIEW' : 'LOCK',
    actorSystemId: req.user.systemId,
    payload: note ? { note } : undefined,
  });
  
  // If locked, lock attendance months
  if (status === 'LOCKED') {
    for (const monthKey of batch.referenceAttendanceMonthKeys) {
      await lockAttendanceMonth(monthKey);
    }
  }
  
  return NextResponse.json(batch);
}
```

**GET /api/payroll/templates**
```typescript
// List templates
export async function GET(req: NextRequest) {
  const templates = await prisma.payrollTemplate.findMany({
    where: { isActive: true },
    orderBy: [
      { isDefault: 'desc' },
      { name: 'asc' },
    ],
  });
  
  return NextResponse.json(templates);
}
```

**POST /api/payroll/templates**
```typescript
// Create template
export async function POST(req: NextRequest) {
  const { name, code, description, componentSystemIds, isDefault } = await req.json();
  
  // If setting as default, unset others
  if (isDefault) {
    await prisma.payrollTemplate.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    });
  }
  
  const template = await prisma.payrollTemplate.create({
    data: {
      id: await generateTemplateId(),
      name,
      code,
      description,
      componentSystemIds,
      isDefault,
      createdBy: req.user.systemId,
      updatedBy: req.user.systemId,
    },
  });
  
  return NextResponse.json(template);
}
```

---

### Phase 2: Enhanced Features (Priority: MEDIUM)

#### 2.1. Payment Tracking
```typescript
// POST /api/payroll/payslips/:systemId/payment
export async function POST(
  req: NextRequest,
  { params }: { params: { systemId: string } }
) {
  const { paymentMethod, paymentReference } = await req.json();
  
  const payslip = await prisma.payslip.update({
    where: { systemId: params.systemId },
    data: {
      isPaid: true,
      paidAt: new Date(),
      paidBy: req.user.systemId,
      paymentMethod,
      paymentReference,
    },
  });
  
  // Create cashbook entry (if integrated)
  await createCashbookEntry({
    type: 'payment',
    amount: payslip.netPay,
    employeeSystemId: payslip.employeeSystemId,
    reference: payslip.id,
  });
  
  return NextResponse.json(payslip);
}
```

#### 2.2. Bulk Payment Recording
```typescript
// POST /api/payroll/batches/:systemId/bulk-payment
export async function POST(
  req: NextRequest,
  { params }: { params: { systemId: string } }
) {
  const { paymentMethod, payslipSystemIds } = await req.json();
  
  // Update all payslips
  await prisma.payslip.updateMany({
    where: {
      systemId: { in: payslipSystemIds },
      batchSystemId: params.systemId,
    },
    data: {
      isPaid: true,
      paidAt: new Date(),
      paidBy: req.user.systemId,
      paymentMethod,
    },
  });
  
  return NextResponse.json({ success: true });
}
```

#### 2.3. Email Payslips
```typescript
// POST /api/payroll/payslips/:systemId/email
export async function POST(
  req: NextRequest,
  { params }: { params: { systemId: string } }
) {
  const payslip = await prisma.payslip.findUnique({
    where: { systemId: params.systemId },
    include: {
      employee: true,
      batch: true,
    },
  });
  
  if (!payslip || !payslip.employee.email) {
    return NextResponse.json(
      { error: 'Employee email not found' },
      { status: 400 }
    );
  }
  
  // Generate PDF
  const pdfBuffer = await generatePayslipPDF(payslip);
  
  // Send email
  await sendEmail({
    to: payslip.employee.email,
    subject: `Phiếu lương tháng ${payslip.periodMonthKey}`,
    body: generatePayslipEmailBody(payslip),
    attachments: [
      {
        filename: `Phieu_luong_${payslip.id}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
  
  return NextResponse.json({ success: true });
}
```

#### 2.4. Export to Excel/PDF
```typescript
// GET /api/payroll/batches/:systemId/export
export async function GET(
  req: NextRequest,
  { params }: { params: { systemId: string } }
) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'csv'; // csv | excel | pdf
  
  const batch = await prisma.payrollBatch.findUnique({
    where: { systemId: params.systemId },
    include: {
      payslips: {
        include: {
          employee: true,
          department: true,
        },
      },
    },
  });
  
  if (!batch) {
    return NextResponse.json(
      { error: 'Batch not found' },
      { status: 404 }
    );
  }
  
  let fileBuffer: Buffer;
  let filename: string;
  let mimeType: string;
  
  switch (format) {
    case 'excel':
      fileBuffer = await generateExcelReport(batch);
      filename = `Payroll_${batch.id}.xlsx`;
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      break;
    
    case 'pdf':
      fileBuffer = await generatePDFReport(batch);
      filename = `Payroll_${batch.id}.pdf`;
      mimeType = 'application/pdf';
      break;
    
    default:
      fileBuffer = Buffer.from(generateCSVReport(batch));
      filename = `Payroll_${batch.id}.csv`;
      mimeType = 'text/csv';
  }
  
  // Log export
  await createAuditLog({
    batchSystemId: batch.systemId,
    action: 'EXPORT',
    actorSystemId: req.user.systemId,
    payload: { format },
  });
  
  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
```

---

### Phase 3: Mobile Optimization (Priority: MEDIUM)

#### 3.1. Mobile-First Components

**Batch List (Mobile):**
```tsx
// components/mobile/payroll-batch-card.tsx
export function PayrollBatchCard({ batch }: { batch: PayrollBatch }) {
  return (
    <Card className="cursor-pointer" onClick={() => navigate(...)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{batch.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{batch.id}</p>
          </div>
          <PayrollStatusBadge status={batch.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-muted-foreground">Tháng tham chiếu</div>
            <div className="font-semibold">{formatMonthKey(batch.referenceAttendanceMonthKeys[0])}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Ngày trả</div>
            <div className="font-semibold">{formatDate(batch.payrollDate)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Nhân viên</div>
            <div className="font-semibold">{batch.payslips.length}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Thực lĩnh</div>
            <div className="font-semibold text-primary">{formatCurrency(batch.totalNet)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Wizard (Mobile):**
- Step indicator dạng stepper nhỏ gọn
- Forms full-screen trên mobile
- Preview dạng cards thay vì table
- Bottom sheet cho actions

---

### Phase 4: Advanced Features (Priority: LOW)

#### 4.1. Payroll Comparison
```typescript
// Compare current vs previous month
export async function comparePayrollMonths(
  currentMonthKey: string,
  previousMonthKey: string
): Promise<PayrollComparison> {
  const current = await getMonthPayroll(currentMonthKey);
  const previous = await getMonthPayroll(previousMonthKey);
  
  return {
    totalNetChange: current.totalNet - previous.totalNet,
    totalNetChangePercent: ((current.totalNet - previous.totalNet) / previous.totalNet) * 100,
    employeeChanges: current.employees.map(emp => {
      const prevEmp = previous.employees.find(e => e.systemId === emp.systemId);
      return {
        employeeSystemId: emp.systemId,
        employeeName: emp.name,
        currentNet: emp.netPay,
        previousNet: prevEmp?.netPay ?? 0,
        change: emp.netPay - (prevEmp?.netPay ?? 0),
      };
    }),
  };
}
```

#### 4.2. Tax Filing Integration
- Export format cho thuế TNCN
- Tờ khai thuế
- Báo cáo BHXH, BHYT

#### 4.3. Employee Self-Service Portal
- Nhân viên xem phiếu lương của mình
- Download PDF payslip
- View payment history
- Tax documents

---

## ✅ CHECKLIST RÀ SOÁT

### A. Code Quality
- [x] Types đầy đủ, dual-ID
- [x] Zustand stores với persistence
- [x] Calculation engine với validation
- [x] Error handling (basic)
- [x] Loading states
- [ ] TypeScript strict mode compliance

### B. UI/UX
- [x] Desktop list/detail pages
- [x] Wizard workflow
- [x] shadcn/ui components
- [ ] Mobile responsive (cần redesign)
- [x] Loading skeletons
- [ ] Error boundaries
- [x] Toast notifications

### C. Performance
- [ ] Component splitting (detail-page.tsx > 500 lines)
- [ ] Lazy loading
- [x] Memoization (some)
- [ ] Pagination

### D. Database Ready
- [x] Prisma schema designed
- [x] Relations mapped
- [x] Indexes identified
- [ ] Migration strategy

### E. API Ready
- [x] API routes designed
- [x] React Query hooks designed
- [x] Error handling
- [x] Audit logging

---

## 🚀 MIGRATION PLAN

### Step 1: Database
1. Create Prisma models
2. Run migrations
3. Seed templates

### Step 2: API
1. Implement API routes
2. Test với Postman
3. Error handling
4. Rate limiting

### Step 3: Frontend
1. Migrate stores to React Query
2. Update UI to use APIs
3. Test workflows

### Step 4: Features
1. Payment tracking
2. Email payslips
3. Excel/PDF export
4. Mobile optimization

---

## 📊 PRIORITY SUMMARY

| Task | Priority | Effort | Impact |
|------|----------|--------|--------|
| Prisma schema + API | 🔴 HIGH | 4 days | Critical foundation |
| React Query migration | 🔴 HIGH | 2 days | Sync with backend |
| Enhanced engine | 🟡 MEDIUM | 3 days | Better calculations |
| Payment tracking | 🟡 MEDIUM | 2 days | Complete workflow |
| Export Excel/PDF | 🟡 MEDIUM | 2 days | Business requirement |
| Mobile UI | 🟢 LOW | 3 days | User experience |
| Email payslips | 🟢 LOW | 2 days | Automation |
| Self-service portal | 🟢 LOW | 5 days | Future feature |

**Total estimated effort: ~23 days**

---

*Document created: 29/11/2025*  
*Last updated: 29/11/2025*  
*Status: ✅ Completed Review*  
*Next: Implement Phase 1 (Database & API)*
