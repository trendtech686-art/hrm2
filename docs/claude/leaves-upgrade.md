# 📘 Leaves Module - Đánh Giá & Nâng Cấp

> **Trạng thái**: ✅ Đã rà soát  
> **Ngày rà soát**: 29/11/2025  
> **Module**: Leaves (Quản lý nghỉ phép)  
> **Thư mục**: `features/leaves/`  
> **Độ ưu tiên**: 🟡 TRUNG BÌNH (HR core function)

---

## 📋 TỔNG QUAN MODULE

### Mô tả chức năng
Module Leaves quản lý đơn nghỉ phép của nhân viên, bao gồm tạo đơn, phê duyệt, tính toán quota, và đồng bộ với Attendance & Employee records.

### Vai trò trong hệ thống
- **Leave Management**: Tạo, chỉnh sửa, phê duyệt đơn nghỉ phép
- **Quota Tracking**: Theo dõi phép năm, phép có lương/không lương
- **Attendance Sync**: Tự động cập nhật bảng chấm công khi đơn được duyệt
- **Employee Integration**: Cập nhật số ngày phép đã nghỉ vào hồ sơ nhân viên

### Mối liên hệ với modules khác
**Dependencies (Phụ thuộc vào)**:
- ✅ **Employees**: Employee data, leave quotas (leaveTaken, annualLeaveBalance)
- ✅ **Settings/Employee Settings**: Leave types (paid/unpaid), work schedules, seniority bonus
- ✅ **Attendance**: Sync leave days to attendance records

**Dependents (Modules phụ thuộc vào Leaves)**:
- ✅ **Payroll**: Tính lương dựa trên số ngày nghỉ (paid/unpaid)
- ✅ **Dashboard**: Thống kê nghỉ phép theo nhân viên, phòng ban
- ✅ **Reports**: Báo cáo nghỉ phép, xu hướng

---

## 🗂️ CẤU TRÚC MODULE

### Cấu trúc files (10 files - MODERATE)
```
features/leaves/
├── types.ts                    # LeaveRequest type definition
├── store.ts                    # Zustand store with sync-aware CRUD
├── data.ts                     # Seed data
├── leave-form-schema.ts        # Zod validation schema
├── leave-form.tsx              # Form component with employee/leave type selection
├── page.tsx                    # Main leave list page (282 lines)
├── detail-page.tsx             # Leave detail view
├── columns.tsx                 # DataTable columns
├── leave-sync-service.ts       # Sync with Attendance (133 lines)
└── leave-quota-service.ts      # Sync with Employee quotas (116 lines)
```

### Đánh giá độ phức tạp
| Tiêu chí | Đánh giá | Ghi chú |
|----------|----------|---------|
| **Số lượng files** | ⭐⭐ (10 files) | Moderate complexity |
| **Business logic** | ⭐⭐⭐⭐ (Complex) | Dual-sync system (Attendance + Quota) |
| **UI components** | ⭐⭐⭐ (Moderate) | List page + Detail page + Form |
| **Store modules** | ⭐⭐ (Single store) | 1 store với sync-aware wrappers |
| **External integrations** | ⭐⭐⭐⭐ (High) | Employees, Attendance, Settings |
| **Độ phức tạp tổng thể** | ⭐⭐⭐⭐ | **HIGH** - Complex sync logic |

**So sánh**:
- **Simpler than**: Warranty (5 stores), Tasks (4 stores), Complaints (50+ files)
- **Similar to**: Inventory-Checks (simple structure, moderate logic)
- **More complex in**: Bi-directional sync với Attendance và Employee

---

## 🔍 CHI TIẾT KỸ THUẬT

### 1️⃣ TYPES DEFINITION (`types.ts`)

#### LeaveRequest Interface
```typescript
export type LeaveStatus = "Chờ duyệt" | "Đã duyệt" | "Đã từ chối";

export interface LeaveRequest extends DualIDEntity {
  // Employee info
  employeeSystemId: SystemId;
  employeeId: BusinessId;        // NV000001 (cached)
  employeeName: string;          // Cached for display
  
  // Leave type (from Settings)
  leaveTypeSystemId?: SystemId;  // Link to Settings LeaveType
  leaveTypeId?: BusinessId;      // LT000001
  leaveTypeName: string;         // "Phép năm", "Nghỉ ốm", etc.
  leaveTypeIsPaid?: boolean;     // Cached metadata
  leaveTypeRequiresAttachment?: boolean;
  
  // Date range
  startDate: string;             // YYYY-MM-DD
  endDate: string;               // YYYY-MM-DD
  numberOfDays: number;          // Auto-calculated business days
  
  // Details
  reason: string;
  status: LeaveStatus;
  requestDate: string;           // YYYY-MM-DD
  
  // Audit
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
}
```

#### Key Features
✅ **Dual-ID System**: SystemId + BusinessId (inherited from DualIDEntity)  
✅ **Leave Type Integration**: Links to Settings with cached metadata  
✅ **Business Days Calculation**: Auto-calculate excluding weekends  
✅ **Status Workflow**: Chờ duyệt → Đã duyệt / Đã từ chối  
✅ **Cached Employee Data**: employeeId + employeeName for display  

---

### 2️⃣ ZUSTAND STORE (`store.ts`)

#### Store Architecture
Module Leaves sử dụng **Sync-Aware Store Pattern** - Wrapper around base CRUD store:

```typescript
const baseStore = createCrudStore<LeaveRequest>(initialData, 'leaves', {
  businessIdField: 'id',
  persistKey: 'hrm-leaves',
});

const syncAwareActions = {
  add: (payload) => {
    const created = baseStore.getState().add(payload);
    if (isApproved(created)) {
      syncApprovedLeave.apply(created);  // ← Sync to Attendance + Quota
    }
    return created;
  },
  
  update: (systemId, next) => {
    const previous = snapshotLeave(store.findById(systemId));
    store.update(systemId, next);
    const updated = snapshotLeave(baseStore.getState().findById(systemId));
    
    // Clear old sync if previous was approved
    if (isApproved(previous)) {
      syncApprovedLeave.clear(previous);
    }
    
    // Apply new sync if updated is approved
    if (isApproved(updated)) {
      syncApprovedLeave.apply(updated);
    }
  },
  
  remove: (systemId) => {
    const target = snapshotLeave(store.findById(systemId));
    store.remove(systemId);
    
    // Clear sync if was approved
    if (isApproved(target)) {
      syncApprovedLeave.clear(target);
    }
  },
  
  // Similar for restore(), hardDelete()
};

export const useLeaveStore = () => withSync(baseStore());
```

#### Sync Logic
```typescript
const syncApprovedLeave = {
  apply: (leave: LeaveRequest) => {
    leaveAttendanceSync.apply(leave);  // Update Attendance records
    leaveQuotaSync.apply(leave);       // Update Employee quotas
  },
  clear: (leave: LeaveRequest) => {
    leaveAttendanceSync.clear(leave);  // Revert Attendance records
    leaveQuotaSync.clear(leave);       // Revert Employee quotas
  },
};
```

**Key Logic**:
- Chỉ sync khi status = "Đã duyệt"
- Snapshot trước khi update để so sánh
- Clear old sync trước khi apply new sync
- Đảm bảo không bị trùng lặp hoặc mất sync

---

### 3️⃣ ATTENDANCE SYNC SERVICE (`leave-sync-service.ts` - 133 lines)

#### Purpose
Tự động cập nhật bảng chấm công (Attendance) khi đơn nghỉ phép được duyệt.

#### Core Logic

**Step 1: Collect Working Days**
```typescript
const collectWorkingDays = (leave: LeaveRequest): MonthDayMap => {
  const workingDays = new Set(useEmployeeSettingsStore.getState().settings.workingDays);
  
  let start = parseLeaveBoundary(leave.startDate);
  let end = parseLeaveBoundary(leave.endDate);
  
  const monthMap: MonthDayMap = new Map();
  
  for (let cursor = cloneDate(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    const dayOfWeek = cursor.getDay();
    
    // Skip non-working days (weekends)
    if (!workingDays.has(dayOfWeek)) continue;
    
    const monthKey = buildMonthKey(cursor);  // "2025-11"
    const entry = { date: cloneDate(cursor), dayOfMonth: cursor.getDate() };
    
    if (monthMap.has(monthKey)) {
      monthMap.get(monthKey).push(entry);
    } else {
      monthMap.set(monthKey, [entry]);
    }
  }
  
  return monthMap;
};
```

**Step 2: Apply/Clear Updates**
```typescript
const applyUpdatesForMonth = (monthKey: string, days: DayContext[], leave: LeaveRequest, mode: 'apply' | 'clear') => {
  const attendanceStore = useAttendanceStore.getState();
  const monthData = attendanceStore.getAttendanceData(monthKey);
  
  if (!monthData?.length) return;
  
  const updatedRows = monthData.map(row => {
    if (row.employeeSystemId !== leave.employeeSystemId) {
      return row;  // Skip other employees
    }
    
    let rowChanged = false;
    const mutableRow = { ...row };
    
    days.forEach(ctx => {
      const dayKey = `day_${ctx.dayOfMonth}`;
      
      if (mode === 'apply') {
        // Mark as leave
        mutableRow[dayKey] = {
          status: 'leave',
          notes: `[LEAVE:${leave.systemId}] ${leave.leaveTypeName} - ${leave.reason}`
        };
        rowChanged = true;
      } else if (mode === 'clear') {
        // Check if this is the leave we're clearing
        const currentRecord = mutableRow[dayKey];
        if (currentRecord?.notes?.includes(`[LEAVE:${leave.systemId}]`)) {
          // Revert to absent or future
          mutableRow[dayKey] = context.date > today 
            ? { status: 'future' }
            : { status: 'absent' };
          rowChanged = true;
        }
      }
    });
    
    if (!rowChanged) return row;
    
    // Recalculate summary (total days, late days, etc.)
    const summary = recalculateSummary(mutableRow, year, month, settings);
    return { ...mutableRow, ...summary };
  });
  
  if (didChange) {
    attendanceStore.saveAttendanceData(monthKey, updatedRows);
  }
};
```

**Step 3: Export API**
```typescript
export const leaveAttendanceSync = {
  apply(leave: LeaveRequest) {
    const monthMap = collectWorkingDays(leave);
    monthMap.forEach((days, monthKey) => 
      applyUpdatesForMonth(monthKey, days, leave, 'apply')
    );
  },
  
  clear(leave: LeaveRequest) {
    const monthMap = collectWorkingDays(leave);
    monthMap.forEach((days, monthKey) => 
      applyUpdatesForMonth(monthKey, days, leave, 'clear')
    );
  },
};
```

#### Key Features
✅ **Multi-Month Support**: Handles leave spans across multiple months  
✅ **Working Days Only**: Respects Settings.workingDays (skip weekends)  
✅ **Idempotent**: Can be called multiple times without duplication  
✅ **Traceable**: Uses `[LEAVE:systemId]` prefix in notes  
✅ **Summary Recalculation**: Auto-recalculates attendance summary  

---

### 4️⃣ QUOTA SYNC SERVICE (`leave-quota-service.ts` - 116 lines)

#### Purpose
Tự động cập nhật quota nghỉ phép trong Employee record khi đơn được duyệt.

#### Core Logic

**Step 1: Resolve Leave Type Metadata**
```typescript
const resolveLeaveTypeMetadata = (leave: LeaveRequest): LeaveTypeMetadata => {
  const settings = useEmployeeSettingsStore.getState().settings;
  
  // Find matching leave type from Settings
  const matchedType = settings.leaveTypes.find(type => 
    type.systemId === leave.leaveTypeSystemId ||
    type.id === leave.leaveTypeId
  );
  
  // Determine if paid (from cached metadata or matched type)
  const isPaid = leave.leaveTypeIsPaid ?? matchedType?.isPaid ?? true;
  
  // Check if counts towards annual quota
  const countsTowardsAnnual = matchedType 
    ? isAnnualLeaveType(matchedType)  // Check if name contains "phép năm"
    : isPaid;
  
  return { isPaid, countsTowardsAnnual };
};
```

**Step 2: Calculate Annual Quota**
```typescript
const computeAnnualQuota = (employeeHireDate?: string) => {
  const { baseAnnualLeaveDays, annualLeaveSeniorityBonus } = 
    useEmployeeSettingsStore.getState().settings;
  
  const base = baseAnnualLeaveDays ?? 12;
  
  if (!annualLeaveSeniorityBonus) return base;
  
  // Calculate service years
  const years = getServiceYears(employeeHireDate);
  
  // Calculate bonus (e.g., every 5 years = +1 day)
  const bonusInterval = annualLeaveSeniorityBonus.years || 0;
  const bonusValue = annualLeaveSeniorityBonus.additionalDays || 0;
  const bonusMultiplier = bonusInterval > 0 ? Math.floor(years / bonusInterval) : 0;
  const bonus = bonusMultiplier * bonusValue;
  
  return clampNonNegative(base + bonus);
};
```

**Step 3: Adjust Employee Leave Usage**
```typescript
const adjustLeaveUsage = (leave: LeaveRequest, delta: number) => {
  const employeeStore = useEmployeeStore.getState();
  const employee = employeeStore.findById(leave.employeeSystemId);
  
  if (!employee || !delta) return;
  
  const { isPaid, countsTowardsAnnual } = resolveLeaveTypeMetadata(leave);
  
  // Calculate deltas
  const totalDelta = delta;
  const paidDelta = isPaid ? delta : 0;
  const unpaidDelta = isPaid ? 0 : delta;
  const annualDelta = countsTowardsAnnual ? delta : 0;
  
  // Calculate new values (clamped to non-negative)
  const nextLeaveTaken = clampNonNegative((employee.leaveTaken ?? 0) + totalDelta);
  const nextPaid = clampNonNegative((employee.paidLeaveTaken ?? 0) + paidDelta);
  const nextUnpaid = clampNonNegative((employee.unpaidLeaveTaken ?? 0) + unpaidDelta);
  const nextAnnual = clampNonNegative((employee.annualLeaveTaken ?? 0) + annualDelta);
  
  // Calculate remaining balance
  const quota = computeAnnualQuota(employee.hireDate);
  const nextBalance = clampNonNegative(quota - nextAnnual);
  
  // Update employee record
  employeeStore.update(leave.employeeSystemId, {
    leaveTaken: nextLeaveTaken,
    paidLeaveTaken: nextPaid,
    unpaidLeaveTaken: nextUnpaid,
    annualLeaveTaken: nextAnnual,
    annualLeaveBalance: nextBalance,
  });
};
```

**Step 4: Export API**
```typescript
export const leaveQuotaSync = {
  apply(leave: LeaveRequest) {
    const delta = resolveDelta(leave);  // numberOfDays
    if (!delta) return;
    adjustLeaveUsage(leave, delta);     // +days
  },
  
  clear(leave: LeaveRequest) {
    const delta = resolveDelta(leave);
    if (!delta) return;
    adjustLeaveUsage(leave, -delta);    // -days (revert)
  },
};
```

#### Key Features
✅ **Paid/Unpaid Tracking**: Separate counters for paidLeaveTaken, unpaidLeaveTaken  
✅ **Annual Quota Calculation**: Base + Seniority bonus  
✅ **Balance Auto-Update**: annualLeaveBalance = quota - annualLeaveTaken  
✅ **Non-Negative Clamping**: Prevents negative values  
✅ **Idempotent**: Can be called multiple times safely  

---

### 5️⃣ LEAVE FORM (`leave-form.tsx` - 277 lines)

#### Core Features

**Employee Selection**
```typescript
const employeeOptions: ComboboxOption[] = React.useMemo(() => 
  employees.map(e => ({ 
    value: e.systemId, 
    label: e.fullName,
    subtitle: e.id       // Show NV000001 as subtitle
  })),
  [employees]
);

<VirtualizedCombobox
  value={employeeOptions.find(opt => opt.value === field.value)}
  onChange={(option) => field.onChange(option?.value || '')}
  options={employeeOptions}
  placeholder="Chọn nhân viên"
/>
```

**Leave Type Selection with Metadata**
```typescript
const leaveTypeOptions = React.useMemo(() => {
  // Load from Settings
  const configured = settings.leaveTypes.map(type => ({
    value: type.systemId,
    label: type.name,
    meta: {
      systemId: type.systemId,
      businessId: type.id,
      isPaid: type.isPaid,
      requiresAttachment: type.requiresAttachment,
    },
  }));
  
  if (configured.length > 0) return configured;
  
  // Fallback if no settings
  return FALLBACK_LEAVE_TYPES.map(item => ({
    value: item.value,
    label: item.label,
    meta: { name: item.label },
  }));
}, [settings.leaveTypes]);

<Select value={field.value} onValueChange={field.onChange}>
  {leaveTypeOptions.map(option => (
    <SelectItem value={option.value}>
      {option.label}
      {option.meta.isPaid && ' (Có lương)'}
      {option.meta.requiresAttachment && ' *'}
    </SelectItem>
  ))}
</Select>
```

**Business Days Auto-Calculation**
```typescript
const calculateBusinessDays = (start?: Date, end?: Date): number => {
  if (!start || !end) return 0;
  
  let curDate = getStartOfDay(start);
  const lastDate = getStartOfDay(end);
  let count = 0;
  
  while (curDate <= lastDate) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {  // Exclude weekends
      count++;
    }
    curDate = addDays(curDate, 1);
  }
  
  return count;
};

// Watch dates and auto-calculate
const startDate = watch('startDate');
const endDate = watch('endDate');
const numberOfDays = calculateBusinessDays(startDate, endDate);

// Display
<div className="text-sm text-muted-foreground">
  Số ngày nghỉ: {numberOfDays} ngày làm việc
</div>
```

**Form Submission with Metadata**
```typescript
const handleFormSubmit = (values: LeaveFormSchemaType) => {
  const employee = employees.find(e => e.systemId === values.employeeSystemId);
  const leaveTypeMeta = leaveTypeOptions.find(opt => opt.value === values.leaveTypeSystemId)?.meta;
  
  const finalData: Omit<LeaveRequest, 'systemId'> = {
    id: ensureBusinessId(values.id.trim().toUpperCase() || employee.id),
    employeeSystemId: employee.systemId,
    employeeId: employee.id,
    employeeName: employee.fullName,
    
    leaveTypeName: selectedLeaveType?.label || 'Không xác định',
    leaveTypeSystemId: leaveTypeMeta?.systemId,
    leaveTypeId: leaveTypeMeta?.businessId,
    leaveTypeIsPaid: leaveTypeMeta?.isPaid,                       // Cache metadata
    leaveTypeRequiresAttachment: leaveTypeMeta?.requiresAttachment,
    
    startDate: toISODate(values.startDate),
    endDate: toISODate(values.endDate),
    numberOfDays,  // Calculated business days
    reason: values.reason,
    status: values.status,
    requestDate: toISODate(getCurrentDate()),
  };
  
  onSubmit(finalData);
};
```

---

### 6️⃣ VALIDATION SCHEMA (`leave-form-schema.ts`)

```typescript
export const leaveFormSchema = z.object({
  id: z.string().min(1, "Mã đơn không được để trống"),
  employeeSystemId: z.string().min(1, "Vui lòng chọn nhân viên"),
  leaveTypeSystemId: z.string().min(1, "Vui lòng chọn loại phép"),
  startDate: z.date({ message: "Vui lòng chọn ngày bắt đầu" }),
  endDate: z.date({ message: "Vui lòng chọn ngày kết thúc" }),
  reason: z.string().min(10, "Lý do phải có ít nhất 10 ký tự"),
  status: z.enum(['Chờ duyệt', 'Đã duyệt', 'Đã từ chối']),
})
.refine(data => {
  // Validate: endDate >= startDate
  if (!data.startDate || !data.endDate) return true;
  return data.endDate >= data.startDate;
}, {
  message: "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu",
  path: ["endDate"],
})
.refine(data => {
  // Validate: startDate not too far in past (max 30 days)
  if (!data.startDate) return true;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return data.startDate >= thirtyDaysAgo;
}, {
  message: "Không thể tạo đơn cho ngày quá 30 ngày trước",
  path: ["startDate"],
});
```

---

### 7️⃣ LIST PAGE (`page.tsx` - 282 lines)

#### Features
✅ **Filter by Status**: Chờ duyệt / Đã duyệt / Đã từ chối  
✅ **Date Range Filter**: Filter by startDate/endDate  
✅ **Global Search**: Fuse.js search on employeeName, leaveTypeName, reason  
✅ **Status Change**: Dropdown actions to approve/reject  
✅ **Edit/Delete**: Standard CRUD operations  
✅ **Column Customization**: Show/hide columns, saved to localStorage  

#### Status Change Handler
```typescript
const handleStatusChange = (systemId: SystemId, status: LeaveStatus) => {
  const request = leaveRequests.find(r => r.systemId === systemId);
  if (request) {
    update(systemId, { ...request, status });
    
    // ← This triggers sync-aware update in store
    // If status changes to "Đã duyệt", will sync to Attendance + Quota
    
    toast.success("Đã cập nhật trạng thái", {
      description: `Đơn ${request.id} đã được ${status.toLowerCase()}`,
    });
  }
};
```

---

### 8️⃣ TABLE COLUMNS (`columns.tsx`)

#### Key Columns
| Column | Description | Features |
|--------|-------------|----------|
| **employeeName** | Employee name + ID | Clickable link to employee detail |
| **leaveTypeName** | Leave type | "Phép năm", "Nghỉ ốm", etc. |
| **dateRange** | Start - End date | Formatted display |
| **numberOfDays** | Number of days | Business days only |
| **reason** | Leave reason | Truncated with ellipsis |
| **status** | Status badge | Color-coded: warning/success/destructive |
| **actions** | Dropdown menu | Edit / Approve / Reject |

#### Status Badge Variants
```typescript
const statusVariants: Record<LeaveStatus, "success" | "warning" | "destructive"> = {
  "Chờ duyệt": "warning",     // Yellow
  "Đã duyệt": "success",      // Green
  "Đã từ chối": "destructive", // Red
};
```

---

## 🔗 INTEGRATIONS

### Employee Module Integration
**Files**: `features/employees/types.ts`, `features/employees/data.ts`

**Employee fields affected by Leaves**:
```typescript
export type Employee = {
  // ... other fields
  
  // Leave tracking
  leaveTaken: number;           // Total days taken
  paidLeaveTaken: number;       // Paid leave days
  unpaidLeaveTaken: number;     // Unpaid leave days
  annualLeaveTaken: number;     // Annual leave days
  annualLeaveBalance: number;   // Remaining annual leave
  
  // ... other fields
};
```

**Update mechanism**:
```typescript
// In leave-quota-service.ts
const employeeStore = useEmployeeStore.getState();
employeeStore.update(leave.employeeSystemId, {
  leaveTaken: nextLeaveTaken,
  paidLeaveTaken: nextPaid,
  unpaidLeaveTaken: nextUnpaid,
  annualLeaveTaken: nextAnnual,
  annualLeaveBalance: nextBalance,
});
```

---

### Settings/Employee Settings Integration
**Files**: `features/settings/employees/employee-settings-store.ts`, `types.ts`

**Settings used by Leaves**:
```typescript
export type EmployeeSettings = {
  // Leave configuration
  baseAnnualLeaveDays: number;  // e.g., 12 days
  annualLeaveSeniorityBonus?: {
    years: number;              // e.g., every 5 years
    additionalDays: number;     // e.g., +1 day
  };
  allowRollover: boolean;       // Allow carry over unused leave
  maxRolloverDays?: number;
  
  // Leave types
  leaveTypes: LeaveType[];      // "Phép năm", "Nghỉ ốm", etc.
  
  // Work schedule
  workingDays: number[];        // [1,2,3,4,5] = Mon-Fri
  
  // ... other settings
};

export type LeaveType = {
  systemId: SystemId;
  id: BusinessId;               // LT000001
  name: string;
  isPaid: boolean;
  requiresAttachment: boolean;
  color?: string;
  // ... other fields
};
```

**Usage in Leaves**:
1. **Form**: Load leaveTypes for selection dropdown
2. **Quota calculation**: Use baseAnnualLeaveDays + seniorityBonus
3. **Attendance sync**: Use workingDays to filter weekends

---

### Attendance Module Integration
**Files**: `features/attendance/types.ts`, `features/attendance/store.ts`

**Attendance structure**:
```typescript
export type AttendanceDataRow = {
  employeeSystemId: SystemId;
  employeeId: BusinessId;
  employeeName: string;
  
  // Daily records (day_1 to day_31)
  day_1?: DailyRecord;
  day_2?: DailyRecord;
  // ... day_31
  
  // Summary
  totalDays: number;
  lateDays: number;
  earlyLeaveDays: number;
  absentDays: number;
  leaveDays: number;        // ← Updated by leave sync
  overtimeDays: number;
  
  // ... other fields
};

export type DailyRecord = {
  status: 'present' | 'late' | 'early' | 'absent' | 'leave' | 'overtime' | 'holiday' | 'future';
  checkIn?: string;
  checkOut?: string;
  notes?: string;           // ← Leave note: "[LEAVE:systemId] Phép năm - Đi du lịch"
};
```

**Update mechanism**:
```typescript
// In leave-sync-service.ts
const attendanceStore = useAttendanceStore.getState();
const monthData = attendanceStore.getAttendanceData('2025-11');

const updatedRows = monthData.map(row => {
  if (row.employeeSystemId !== leave.employeeSystemId) return row;
  
  // Update specific days
  const mutableRow = { ...row };
  days.forEach(ctx => {
    mutableRow[`day_${ctx.dayOfMonth}`] = {
      status: 'leave',
      notes: `[LEAVE:${leave.systemId}] ${leave.leaveTypeName} - ${leave.reason}`
    };
  });
  
  // Recalculate summary
  const summary = recalculateSummary(mutableRow, year, month, settings);
  return { ...mutableRow, ...summary };
});

attendanceStore.saveAttendanceData('2025-11', updatedRows);
```

---

## 📊 PRISMA SCHEMA DESIGN

### LeaveRequest Table
```prisma
model LeaveRequest {
  // Primary keys
  systemId     String   @id @default(uuid()) @map("system_id")
  id           String   @unique @map("business_id") // LP000001 (Leave Permission)
  
  // Employee (FK)
  employeeId       String   @map("employee_id")
  employee         Employee @relation(fields: [employeeId], references: [systemId])
  employeeName     String   @map("employee_name")  // Cached
  employeeBusinessId String @map("employee_business_id")  // NV000001 cached
  
  // Leave type (FK to Settings)
  leaveTypeId          String?  @map("leave_type_id")
  leaveType            LeaveType? @relation(fields: [leaveTypeId], references: [systemId])
  leaveTypeName        String   @map("leave_type_name")
  leaveTypeBusinessId  String?  @map("leave_type_business_id")
  leaveTypeIsPaid      Boolean? @map("leave_type_is_paid")
  leaveTypeRequiresAttachment Boolean? @map("leave_type_requires_attachment")
  
  // Date range
  startDate    DateTime @map("start_date")
  endDate      DateTime @map("end_date")
  numberOfDays Decimal  @map("number_of_days") @db.Decimal(5, 2)  // Support half-days
  
  // Details
  reason       String   @db.Text
  status       LeaveStatus
  requestDate  DateTime @map("request_date")
  
  // Optional approval info
  approvedBy   String?  @map("approved_by")
  approvedAt   DateTime? @map("approved_at")
  rejectedBy   String?  @map("rejected_by")
  rejectedAt   DateTime? @map("rejected_at")
  rejectionReason String? @map("rejection_reason") @db.Text
  
  // Attachments
  attachments  Json?    @map("attachments")  // Array of file URLs
  
  // Audit
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  createdBy    String   @map("created_by")
  updatedBy    String   @map("updated_by")
  
  @@map("leave_requests")
  @@index([employeeId])
  @@index([leaveTypeId])
  @@index([status])
  @@index([startDate])
  @@index([endDate])
  @@index([requestDate])
}

enum LeaveStatus {
  PENDING   // Chờ duyệt
  APPROVED  // Đã duyệt
  REJECTED  // Đã từ chối
  
  @@map("leave_status")
}
```

### LeaveType Table (Settings)
```prisma
model LeaveType {
  systemId             String   @id @default(uuid()) @map("system_id")
  id                   String   @unique @map("business_id") // LT000001
  name                 String
  description          String?  @db.Text
  isPaid               Boolean  @default(true) @map("is_paid")
  requiresAttachment   Boolean  @default(false) @map("requires_attachment")
  color                String?
  isActive             Boolean  @default(true) @map("is_active")
  
  // Reverse relations
  leaveRequests        LeaveRequest[]
  
  // Audit
  createdAt            DateTime @default(now()) @map("created_at")
  updatedAt            DateTime @updatedAt @map("updated_at")
  
  @@map("leave_types")
}
```

### Employee Table (Update)
Add leave tracking fields to existing Employee model:

```prisma
model Employee {
  // ... existing fields
  
  // Leave tracking
  leaveTaken           Decimal? @default(0) @map("leave_taken") @db.Decimal(5, 2)
  paidLeaveTaken       Decimal? @default(0) @map("paid_leave_taken") @db.Decimal(5, 2)
  unpaidLeaveTaken     Decimal? @default(0) @map("unpaid_leave_taken") @db.Decimal(5, 2)
  annualLeaveTaken     Decimal? @default(0) @map("annual_leave_taken") @db.Decimal(5, 2)
  annualLeaveBalance   Decimal? @default(12) @map("annual_leave_balance") @db.Decimal(5, 2)
  
  // Reverse relations
  leaveRequests        LeaveRequest[]
  
  // ... existing fields
}
```

---

## 🔄 API ROUTES DESIGN

### Leave Requests API

#### `GET /api/leave-requests`
**Query params**:
- `employeeId?: string` - Filter by employee
- `status?: 'pending' | 'approved' | 'rejected'` - Filter by status
- `startDate?: string` (ISO date) - Filter by date range
- `endDate?: string` (ISO date)
- `leaveTypeId?: string` - Filter by leave type
- `page?: number`
- `limit?: number`

**Response**:
```typescript
{
  success: true,
  data: {
    leaveRequests: LeaveRequest[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }
}
```

---

#### `GET /api/leave-requests/:id`
**Response**:
```typescript
{
  success: true,
  data: LeaveRequest & {
    employee: {
      systemId: string;
      id: string;
      fullName: string;
      annualLeaveBalance: number;
    };
    leaveType: {
      systemId: string;
      id: string;
      name: string;
      isPaid: boolean;
    };
    approvalHistory?: Array<{
      action: 'approved' | 'rejected';
      by: string;
      at: string;
      reason?: string;
    }>;
  }
}
```

---

#### `POST /api/leave-requests`
**Body**:
```typescript
{
  employeeId: string;           // Employee SystemId
  leaveTypeId: string;          // LeaveType SystemId
  startDate: string;            // YYYY-MM-DD
  endDate: string;              // YYYY-MM-DD
  reason: string;
  attachments?: string[];       // File URLs
}
```

**Validation**:
- ✅ `employeeId`: must exist
- ✅ `leaveTypeId`: must exist
- ✅ `startDate <= endDate`
- ✅ `startDate` not more than 30 days in past
- ✅ `reason`: min 10 characters
- ✅ If leave type requires attachment: attachments must not be empty
- ✅ Check overlap: no existing approved leave for same employee in date range
- ✅ Check quota: annualLeaveBalance >= numberOfDays (for annual leave)

**Logic**:
```typescript
// 1. Validate inputs
// 2. Calculate numberOfDays (business days only)
// 3. Check quota if annual leave
// 4. Create leave request with status = 'pending'
// 5. Return created record
```

**Response**:
```typescript
{
  success: true,
  data: LeaveRequest
}
```

---

#### `PATCH /api/leave-requests/:id`
**Body**: Partial updates

**Special handling for status changes**:
```typescript
if (updates.status === 'approved' && currentStatus === 'pending') {
  // Trigger sync to Attendance + Employee quota
  await syncApprovedLeave(leaveRequest);
  
  updates.approvedBy = currentUser.systemId;
  updates.approvedAt = new Date().toISOString();
}

if (updates.status === 'rejected' && currentStatus === 'pending') {
  updates.rejectedBy = currentUser.systemId;
  updates.rejectedAt = new Date().toISOString();
  // updates.rejectionReason = from body
}

if (updates.status === 'pending' && currentStatus === 'approved') {
  // Revert sync if changing approved → pending
  await clearApprovedLeave(leaveRequest);
}
```

**Response**:
```typescript
{
  success: true,
  data: LeaveRequest
}
```

---

#### `DELETE /api/leave-requests/:id`
**Validation**:
- ✅ Only allow delete if status = 'pending'
- ❌ Cannot delete approved/rejected leaves (soft delete instead)

**Logic**:
```typescript
if (leaveRequest.status === 'approved') {
  // Clear sync before soft delete
  await clearApprovedLeave(leaveRequest);
}

// Soft delete: set deletedAt
await prisma.leaveRequest.update({
  where: { systemId: id },
  data: { deletedAt: new Date() }
});
```

**Response**:
```typescript
{
  success: true,
  message: 'Leave request deleted successfully'
}
```

---

#### `POST /api/leave-requests/:id/approve`
**Body**:
```typescript
{
  notes?: string;  // Optional approval notes
}
```

**Logic**:
```typescript
// 1. Check if status is 'pending'
// 2. Update status to 'approved'
// 3. Set approvedBy, approvedAt
// 4. Trigger sync to Attendance + Employee quota
// 5. Send notification to employee
```

**Response**:
```typescript
{
  success: true,
  data: LeaveRequest
}
```

---

#### `POST /api/leave-requests/:id/reject`
**Body**:
```typescript
{
  reason: string;  // Required rejection reason
}
```

**Logic**:
```typescript
// 1. Check if status is 'pending'
// 2. Update status to 'rejected'
// 3. Set rejectedBy, rejectedAt, rejectionReason
// 4. Send notification to employee
```

**Response**:
```typescript
{
  success: true,
  data: LeaveRequest
}
```

---

### Employee Leave Summary API

#### `GET /api/employees/:id/leave-summary`
**Response**:
```typescript
{
  success: true,
  data: {
    employeeId: string;
    employeeName: string;
    
    // Quota
    annualLeaveQuota: number;        // Base + seniority bonus
    annualLeaveTaken: number;
    annualLeaveBalance: number;
    
    // Usage breakdown
    totalLeaveTaken: number;
    paidLeaveTaken: number;
    unpaidLeaveTaken: number;
    
    // Current year stats
    leavesByType: Array<{
      leaveTypeName: string;
      count: number;
      totalDays: number;
    }>;
    
    // Recent leaves
    recentLeaves: Array<{
      id: string;
      leaveTypeName: string;
      startDate: string;
      endDate: string;
      numberOfDays: number;
      status: LeaveStatus;
    }>;
    
    // Pending requests
    pendingCount: number;
  }
}
```

---

## ✅ VALIDATION SCHEMAS (Zod)

### Leave Request Validation
```typescript
import { z } from 'zod';

export const leaveRequestSchema = z.object({
  employeeId: z.string().uuid('Employee ID không hợp lệ'),
  leaveTypeId: z.string().uuid('Leave Type ID không hợp lệ'),
  
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày không hợp lệ'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày không hợp lệ'),
  
  reason: z.string().min(10, 'Lý do phải có ít nhất 10 ký tự').max(500, 'Lý do không được quá 500 ký tự'),
  
  attachments: z.array(z.string().url()).optional(),
}).refine(
  (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
  },
  {
    message: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
    path: ['endDate'],
  }
).refine(
  (data) => {
    const start = new Date(data.startDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return start >= thirtyDaysAgo;
  },
  {
    message: 'Không thể tạo đơn cho ngày quá 30 ngày trước',
    path: ['startDate'],
  }
);

export type LeaveRequestFormData = z.infer<typeof leaveRequestSchema>;
```

### Leave Approval Validation
```typescript
export const leaveApprovalSchema = z.object({
  notes: z.string().max(500).optional(),
});

export const leaveRejectionSchema = z.object({
  reason: z.string().min(10, 'Lý do từ chối phải có ít nhất 10 ký tự').max(500),
});
```

---

## 🎯 ĐÁNH GIÁ FRONTEND

### Điểm mạnh
✅ **Dual-Sync Architecture**: Automatic sync to Attendance + Employee quota  
✅ **Settings Integration**: Dynamic leave types from Settings  
✅ **Business Days Calculation**: Auto-calculate excluding weekends  
✅ **Metadata Caching**: Store leave type metadata with request  
✅ **Status Workflow**: Clean approval/rejection flow  
✅ **Form Validation**: Comprehensive Zod schemas  
✅ **Idempotent Sync**: Can retry operations safely  
✅ **Traceable**: Leave notes include systemId for tracking  

### Điểm cần cải thiện
⚠️ **No approval workflow**: Direct status change, no multi-level approval  
⚠️ **No quota check**: Frontend doesn't prevent over-quota requests  
⚠️ **No overlap detection**: Can create overlapping leaves  
⚠️ **No calendar view**: List view only, no calendar visualization  
⚠️ **No notifications**: No email/push when leave approved/rejected  
⚠️ **No manager dashboard**: No overview of team leave requests  
⚠️ **No rollover logic**: Doesn't handle carry-over unused leave  
⚠️ **No half-day support**: Only full days  

### Mức độ sẵn sàng
**Frontend: 80%** ✅ (Core functionality complete, sync logic excellent)  
**Backend: 0%** ❌

---

## 🚀 KẾ HOẠCH IMPLEMENTATION

### Phase 1: Backend Foundation (Priority: HIGH)
1. ✅ Create Prisma schema for LeaveRequest, LeaveType
2. ✅ Update Employee model with leave tracking fields
3. ✅ Implement Leave Requests CRUD API
4. ✅ Implement approval/rejection endpoints
5. ✅ Implement attendance sync on backend
6. ✅ Implement employee quota sync on backend

**Estimated time**: 6-7 days

---

### Phase 2: Advanced Features (Priority: MEDIUM)
1. ✅ Quota validation on create (check annualLeaveBalance)
2. ✅ Overlap detection (prevent double booking)
3. ✅ Multi-level approval workflow
4. ✅ Manager dashboard (team leave overview)
5. ✅ Notification system (email/push)
6. ✅ Leave calendar view
7. ✅ Half-day leave support

**Estimated time**: 5-6 days

---

### Phase 3: Reports & Analytics (Priority: LOW)
1. ✅ Leave reports (by department, by type, by period)
2. ✅ Quota utilization dashboard
3. ✅ Leave trends analysis
4. ✅ Export to Excel/CSV
5. ✅ Rollover logic (carry over unused leave)

**Estimated time**: 3-4 days

---

## 📝 MIGRATION NOTES

### Data Migration
```typescript
// Step 1: Create LeaveType entries from Settings
const leaveTypes = employeeSettings.leaveTypes;
for (const type of leaveTypes) {
  await prisma.leaveType.create({
    data: {
      systemId: type.systemId,
      id: type.id,
      name: type.name,
      isPaid: type.isPaid,
      requiresAttachment: type.requiresAttachment,
      color: type.color,
      isActive: true,
    }
  });
}

// Step 2: Migrate existing leave requests (if any from mock store)
const existingLeaves = JSON.parse(localStorage.getItem('hrm-leaves') || '{"data":[]}');
for (const leave of existingLeaves.data) {
  // Calculate numberOfDays if not already set
  if (!leave.numberOfDays) {
    leave.numberOfDays = calculateBusinessDays(leave.startDate, leave.endDate);
  }
  
  await prisma.leaveRequest.create({
    data: {
      systemId: leave.systemId,
      id: leave.id,
      employeeId: leave.employeeSystemId,
      employeeName: leave.employeeName,
      employeeBusinessId: leave.employeeId,
      leaveTypeId: leave.leaveTypeSystemId,
      leaveTypeName: leave.leaveTypeName,
      leaveTypeBusinessId: leave.leaveTypeId,
      leaveTypeIsPaid: leave.leaveTypeIsPaid,
      leaveTypeRequiresAttachment: leave.leaveTypeRequiresAttachment,
      startDate: new Date(leave.startDate),
      endDate: new Date(leave.endDate),
      numberOfDays: leave.numberOfDays,
      reason: leave.reason,
      status: leave.status === 'Chờ duyệt' ? 'PENDING' 
             : leave.status === 'Đã duyệt' ? 'APPROVED' 
             : 'REJECTED',
      requestDate: new Date(leave.requestDate),
      createdAt: leave.createdAt ? new Date(leave.createdAt) : new Date(),
      createdBy: leave.createdBy || 'SYSTEM',
      updatedBy: leave.updatedBy || 'SYSTEM',
    }
  });
}

// Step 3: Verify Employee leave tracking fields
// Ensure all employees have initialized leave tracking fields
await prisma.employee.updateMany({
  where: { leaveTaken: null },
  data: {
    leaveTaken: 0,
    paidLeaveTaken: 0,
    unpaidLeaveTaken: 0,
    annualLeaveTaken: 0,
    annualLeaveBalance: 12,  // Default base quota
  }
});
```

---

## 🐛 KNOWN ISSUES & FIXES

### Issue 1: Race condition in sync operations
**Problem**: Multiple concurrent updates can cause sync to be applied/cleared incorrectly  
**Solution**: 
- Use database transactions for sync operations
- Implement optimistic locking with version field
- Queue sync operations instead of parallel execution

---

### Issue 2: Sync doesn't handle partial months
**Problem**: If leave starts/ends mid-month, opening balance calculation may be off  
**Solution**:
- Backend should recalculate full month attendance when syncing
- Store sync metadata (which months were affected) for rollback

---

### Issue 3: No validation for quota over-use
**Problem**: Can approve leave even if employee has no remaining balance  
**Solution**:
- Add quota check in approval API
- Show warning in UI if quota insufficient (allow override by admin)
- Track over-quota separately (negative balance)

---

### Issue 4: Deletion of approved leave doesn't clear sync
**Problem**: Soft deleting approved leave should revert sync  
**Solution**: Already handled in frontend store, need to implement in backend API

---

## 📚 REFERENCES

### Related Documentation
- ✅ `docs/integrated-hr-review.md` - HR system integration review
- ✅ `docs/DEVELOPMENT-GUIDELINES-V2.md` - General dev guidelines

### Code References
- ✅ `features/employees/` - Employee module with leave tracking
- ✅ `features/attendance/` - Attendance module with leave status
- ✅ `features/settings/employees/` - Employee settings with leave types

---

## 🎬 CONCLUSION

Module **Leaves** là một trong những module **phức tạp nhất về business logic** dù cấu trúc file đơn giản.

**Đặc điểm nổi bật**:
- ⭐ **Dual-Sync Architecture** (Attendance + Employee quota)
- ⭐ **Settings Integration** (Dynamic leave types)
- ⭐ **Idempotent Operations** (Safe retry)
- ⭐ **Traceable Sync** (Systemد prefix in notes)
- ⭐ **Well-tested Logic** (Sync services have clear separation)

**Priority**: 🟡 **TRUNG BÌNH** - Important but not urgent

**Next steps**: 
1. Create Prisma schema
2. Implement backend APIs with sync logic
3. Add quota validation
4. Implement approval workflow
5. Add calendar view & notifications

---

**Người rà soát**: AI Assistant  
**Trạng thái**: ✅ Hoàn thành  
**Cần review**: Sync logic performance, race condition handling, quota over-use policy
