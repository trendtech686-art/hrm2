# 📋 ATTENDANCE MODULE - RÀ SOÁT VÀ NÂNG CẤP

> Ngày tạo: 29/11/2025  
> Trạng thái: ✅ Hoàn thành phân tích  
> Mục tiêu: shadcn + mobile-first + Prisma/PostgreSQL + Next.js + VPS deployment

---

## 📊 TỔNG QUAN MODULE

### Mục đích
Module Attendance (Chấm công) quản lý:
- Theo dõi giờ vào/ra hàng ngày của nhân viên
- Tính toán công, nghỉ phép, vắng mặt
- Quản lý tăng ca (overtime)
- Tính đi muộn, về sớm
- Khóa/mở khóa tháng chấm công
- Nhập/xuất file Excel hàng loạt
- Thống kê chấm công theo tháng

### Vị trí trong hệ thống
```
┌─────────────┐
│  SETTINGS   │ → Work schedule, shifts, working days
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  EMPLOYEES  │ → Employee master data
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────┐
│ ATTENDANCE  │◄─────┤  LEAVES  │ (Auto-sync approved leaves)
└──────┬──────┘      └──────────┘
       │
       ▼
┌─────────────┐
│   PAYROLL   │ → Working days, overtime for salary calculation
└─────────────┘
```

---

## 📁 CẤU TRÚC FILES HIỆN TẠI

### Core Files
```
features/attendance/
├── types.ts                 ✅ SystemId/BusinessId support
├── store.ts                 ✅ Zustand store with localStorage persistence
├── page.tsx                 ✅ Main attendance page (Calendar grid view)
├── columns.tsx              ✅ DataTable columns definition
├── data.ts                  ✅ Mock data generator
├── utils.ts                 ✅ Calculation utilities
└── components/
    ├── attendance-edit-dialog.tsx      ✅ Single cell editor
    ├── attendance-import-dialog.tsx    ✅ Excel import with preview
    ├── bulk-edit-dialog.tsx            ✅ Multi-cell editor
    ├── daily-status-cell.tsx           ✅ Day cell display
    ├── statistics-dashboard.tsx        ✅ Top KPIs
    └── summary-stat.tsx                ✅ Summary component
```

---

## 🔍 PHÂN TÍCH CHI TIẾT

### A. TYPES (types.ts)

#### Đánh giá
✅ **Điểm mạnh:**
- Đã sử dụng `SystemId` và `BusinessId` đúng chuẩn dual-ID
- Type definitions rõ ràng, đầy đủ
- Support đầy đủ các trạng thái attendance
- Type-safe với dynamic day columns (`AttendanceDayKey`)

✅ **Structure:**
```typescript
export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'half-day' | 'weekend' | 'holiday' | 'future';

export interface DailyRecord {
  status: AttendanceStatus;
  checkIn?: string;           // HH:mm format
  checkOut?: string;
  overtimeCheckIn?: string;
  overtimeCheckOut?: string;
  notes?: string;
}

export type AttendanceDataRow = {
  systemId: SystemId;           // For table row ID
  employeeSystemId: SystemId;   // FK to employee
  employeeId: BusinessId;       // Display ID (NV001)
  fullName: string;
  department: DepartmentName | undefined;
  workDays: number;             // Calculated
  leaveDays: number;            // Calculated
  absentDays: number;           // Calculated
  lateArrivals: number;         // Calculated
  earlyDepartures: number;      // Calculated
  otHours: number;              // Calculated
  // Dynamic day columns
  day_1?: DailyRecord;
  day_2?: DailyRecord;
  // ... day_31
};
```

⚠️ **Vấn đề:**
- `department` type là hardcoded string union → nên fetch từ Settings
- Chưa có `branchSystemId` (nếu cần theo dõi theo chi nhánh)
- Thiếu audit fields (createdAt, updatedAt, createdBy, updatedBy)
- Chưa có `shiftSystemId` nếu muốn track theo ca làm việc

#### Đề xuất Type Schema (Prisma)
```prisma
model AttendanceMonth {
  systemId          String   @id @default(uuid())
  id                String   @unique // Business ID: ATT-2025-11-001
  
  // Relations
  employeeSystemId  String
  employee          Employee @relation(fields: [employeeSystemId], references: [systemId])
  branchSystemId    String?
  branch            Branch?  @relation(fields: [branchSystemId], references: [systemId])
  
  // Period
  year              Int
  month             Int
  
  // Summary Stats (calculated)
  workDays          Float    @default(0)
  leaveDays         Float    @default(0)
  absentDays        Float    @default(0)
  lateArrivals      Int      @default(0)
  earlyDepartures   Int      @default(0)
  otHours           Float    @default(0)
  
  // Lock status
  isLocked          Boolean  @default(false)
  lockedAt          DateTime?
  lockedBy          String?
  
  // Audit
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  createdBy         String
  updatedBy         String
  
  // Daily records (relation)
  dailyRecords      AttendanceDailyRecord[]
  
  @@unique([employeeSystemId, year, month])
  @@index([year, month])
  @@index([employeeSystemId])
}

model AttendanceDailyRecord {
  systemId             String   @id @default(uuid())
  
  // Relations
  attendanceMonthId    String
  attendanceMonth      AttendanceMonth @relation(fields: [attendanceMonthId], references: [systemId], onDelete: Cascade)
  
  // Date
  date                 DateTime // Full date for the record
  day                  Int      // Day of month (1-31)
  
  // Status
  status               AttendanceStatus @default(ABSENT)
  
  // Check-in/out times
  checkIn              String?  // HH:mm format or DateTime?
  checkOut             String?
  overtimeCheckIn      String?
  overtimeCheckOut     String?
  
  // Calculated flags
  isLate               Boolean  @default(false)
  isEarlyDeparture     Boolean  @default(false)
  lateMinutes          Int?
  earlyMinutes         Int?
  workHours            Float?
  otHours              Float?
  
  // Notes
  notes                String?
  
  // Audit
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  createdBy            String
  updatedBy            String
  
  @@unique([attendanceMonthId, day])
  @@index([date])
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LEAVE
  HALF_DAY
  WEEKEND
  HOLIDAY
  FUTURE
}
```

**Lưu ý về cấu trúc:**
- **Normalized**: Tách riêng `AttendanceMonth` (summary) và `AttendanceDailyRecord` (chi tiết từng ngày)
- **Advantages**: 
  - Dễ query theo ngày cụ thể
  - Không giới hạn số ngày trong tháng
  - Dễ mở rộng thêm fields
  - Performance tốt hơn khi lọc theo date range
- **Trade-offs**: 
  - Cần nhiều records hơn (31 records/employee/month)
  - Query phức tạp hơn một chút để lấy full month

---

### B. STORE (store.ts)

#### Đánh giá
✅ **Điểm mạnh:**
- Sử dụng Zustand với persistence (localStorage)
- Lock/unlock month functionality
- Store full attendance data per month
- Type-safe actions

✅ **Current State Structure:**
```typescript
type AttendanceStoreState = {
  // Lock management
  lockedMonths: Record<string, boolean>; // key: "YYYY-MM"
  toggleLock: (monthYear: string) => void;
  lockMonth: (monthYear: string) => void;
  unlockMonth: (monthYear: string) => void;
  
  // Data storage
  attendanceData: Record<string, AttendanceDataRow[]>; // key: "YYYY-MM"
  saveAttendanceData: (monthKey: string, data: AttendanceDataRow[]) => void;
  getAttendanceData: (monthKey: string) => AttendanceDataRow[] | null;
  updateEmployeeRecord: (
    monthKey: string,
    employeeSystemId: SystemId,
    dayKey: AttendanceDayKey,
    record: DailyRecord
  ) => void;
};
```

⚠️ **Vấn đề:**
- Lưu toàn bộ data trong localStorage → Size limit issues khi nhiều tháng
- Không sync với backend
- Không có optimistic updates
- Lock status nên lưu trên server, không phải local

#### Đề xuất: React Query Store
```typescript
// hooks/use-attendance.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useAttendanceMonth = (year: number, month: number) => {
  return useQuery({
    queryKey: ['attendance', year, month],
    queryFn: () => fetchAttendanceMonth(year, month),
  });
};

export const useUpdateAttendanceRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: {
      monthId: SystemId;
      day: number;
      record: DailyRecord;
    }) => updateDailyRecord(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['attendance', variables.monthId] 
      });
    },
  });
};

export const useLockMonth = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: { year: number; month: number; lock: boolean }) => 
      toggleMonthLock(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['attendance', variables.year, variables.month] 
      });
    },
  });
};

export const useBulkImportAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: {
      year: number;
      month: number;
      records: Array<{ employeeSystemId: SystemId; dailyRecords: DailyRecord[] }>;
    }) => bulkImportAttendance(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['attendance', variables.year, variables.month] 
      });
    },
  });
};
```

---

### C. BUSINESS LOGIC

#### 1. Calculation Logic (utils.ts)

✅ **recalculateSummary()** - Tính toán thống kê tháng:
```typescript
export function recalculateSummary(
    row: AnyAttendanceDataRow, 
    year: number, 
    month: number, 
    settings: EmployeeSettings
): AttendanceSummary {
  // Logic:
  // 1. Duyệt qua tất cả các ngày trong tháng
  // 2. Đếm: present, leave, absent, half-day
  // 3. Tính late arrivals (checkIn > workStartTime + allowedLateMinutes)
  // 4. Tính OT hours (overtimeCheckOut - overtimeCheckIn)
  
  return {
    workDays,
    leaveDays,
    absentDays,
    lateArrivals,
    earlyDepartures,
    otHours,
  };
}
```

✅ **excelSerialToTime()** - Convert Excel time serial to HH:mm:
- Xử lý được cả Excel serial number và string format
- Hỗ trợ Date object từ cellDates:true

⚠️ **Vấn đề:**
- `earlyDepartures` chưa được implement (luôn trả về 0)
- Không tính break time (giờ nghỉ trưa)
- Không validate time ranges (checkOut phải > checkIn)
- Không tính night shift overtime

#### Đề xuất: Enhanced Calculation Service
```typescript
// services/attendance-calculation.service.ts

export class AttendanceCalculationService {
  /**
   * Calculate daily work hours
   */
  static calculateWorkHours(
    checkIn: string,
    checkOut: string,
    breakMinutes: number = 60
  ): number {
    const [inH, inM] = checkIn.split(':').map(Number);
    const [outH, outM] = checkOut.split(':').map(Number);
    
    const totalMinutes = (outH * 60 + outM) - (inH * 60 + inM);
    const workMinutes = Math.max(0, totalMinutes - breakMinutes);
    
    return workMinutes / 60;
  }
  
  /**
   * Calculate overtime hours
   */
  static calculateOTHours(
    overtimeCheckIn: string,
    overtimeCheckOut: string
  ): number {
    const [inH, inM] = overtimeCheckIn.split(':').map(Number);
    const [outH, outM] = overtimeCheckOut.split(':').map(Number);
    
    let totalMinutes = (outH * 60 + outM) - (inH * 60 + inM);
    
    // Handle night shift (cross midnight)
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60;
    }
    
    return totalMinutes / 60;
  }
  
  /**
   * Check if late arrival
   */
  static isLateArrival(
    checkIn: string,
    workStartTime: string,
    allowedLateMinutes: number
  ): { isLate: boolean; lateMinutes: number } {
    const [inH, inM] = checkIn.split(':').map(Number);
    const [startH, startM] = workStartTime.split(':').map(Number);
    
    const checkInMinutes = inH * 60 + inM;
    const startMinutes = startH * 60 + startM + allowedLateMinutes;
    
    const lateMinutes = Math.max(0, checkInMinutes - startMinutes);
    
    return {
      isLate: lateMinutes > 0,
      lateMinutes,
    };
  }
  
  /**
   * Check if early departure
   */
  static isEarlyDeparture(
    checkOut: string,
    workEndTime: string,
    allowedEarlyMinutes: number = 0
  ): { isEarly: boolean; earlyMinutes: number } {
    const [outH, outM] = checkOut.split(':').map(Number);
    const [endH, endM] = workEndTime.split(':').map(Number);
    
    const checkOutMinutes = outH * 60 + outM;
    const endMinutes = endH * 60 + endM - allowedEarlyMinutes;
    
    const earlyMinutes = Math.max(0, endMinutes - checkOutMinutes);
    
    return {
      isEarly: earlyMinutes > 0,
      earlyMinutes,
    };
  }
  
  /**
   * Calculate month summary
   */
  static calculateMonthSummary(
    dailyRecords: AttendanceDailyRecord[],
    settings: EmployeeSettings
  ): AttendanceSummary {
    let workDays = 0;
    let leaveDays = 0;
    let absentDays = 0;
    let lateArrivals = 0;
    let earlyDepartures = 0;
    let otHours = 0;
    
    dailyRecords.forEach(record => {
      // Count days
      switch (record.status) {
        case 'PRESENT':
          workDays += 1;
          break;
        case 'HALF_DAY':
          workDays += 0.5;
          break;
        case 'LEAVE':
          leaveDays += 1;
          break;
        case 'ABSENT':
          absentDays += 1;
          break;
      }
      
      // Check late/early
      if (record.checkIn && record.status === 'PRESENT') {
        const lateCheck = this.isLateArrival(
          record.checkIn,
          settings.workStartTime,
          settings.allowedLateMinutes
        );
        if (lateCheck.isLate) lateArrivals++;
      }
      
      if (record.checkOut && record.status === 'PRESENT') {
        const earlyCheck = this.isEarlyDeparture(
          record.checkOut,
          settings.workEndTime
        );
        if (earlyCheck.isEarly) earlyDepartures++;
      }
      
      // Calculate OT
      if (record.overtimeCheckIn && record.overtimeCheckOut) {
        otHours += this.calculateOTHours(
          record.overtimeCheckIn,
          record.overtimeCheckOut
        );
      }
    });
    
    return {
      workDays,
      leaveDays,
      absentDays,
      lateArrivals,
      earlyDepartures,
      otHours: parseFloat(otHours.toFixed(2)),
    };
  }
}
```

#### 2. Leave Integration (leaveAttendanceSync)

✅ **Current Implementation:**
- Automatically mark approved leaves in attendance
- Replays leaves when loading month data

⚠️ **Vấn đề:**
- Sync chỉ chạy một chiều (Leaves → Attendance)
- Không handle case xóa/reject leave sau khi đã sync
- Không track leave source trong attendance record

#### Đề xuất: Bi-directional Sync
```typescript
// services/leave-attendance-sync.service.ts

export class LeaveAttendanceSyncService {
  /**
   * Sync approved leave to attendance
   */
  static async syncLeaveToAttendance(leave: LeaveRequest): Promise<void> {
    if (leave.status !== 'Đã duyệt') return;
    
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);
    
    // For each day in range
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      await this.updateAttendanceRecord({
        employeeSystemId: leave.employeeSystemId,
        date: d,
        status: 'LEAVE',
        leaveRequestId: leave.systemId, // Track source
        notes: `Nghỉ phép: ${leave.leaveTypeName}`,
      });
    }
  }
  
  /**
   * Remove leave marks from attendance
   */
  static async unsyncLeaveFromAttendance(leave: LeaveRequest): Promise<void> {
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);
    
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      await this.revertAttendanceRecord({
        employeeSystemId: leave.employeeSystemId,
        date: d,
        leaveRequestId: leave.systemId,
      });
    }
  }
  
  /**
   * Handle leave status change
   */
  static async handleLeaveStatusChange(
    leave: LeaveRequest,
    oldStatus: string,
    newStatus: string
  ): Promise<void> {
    // Approved → sync to attendance
    if (oldStatus !== 'Đã duyệt' && newStatus === 'Đã duyệt') {
      await this.syncLeaveToAttendance(leave);
    }
    
    // Rejected/Cancelled → unsync from attendance
    if (oldStatus === 'Đã duyệt' && newStatus !== 'Đã duyệt') {
      await this.unsyncLeaveFromAttendance(leave);
    }
  }
}
```

---

### D. UI/UX COMPONENTS

#### 1. Main Page (page.tsx)

✅ **Features:**
- Calendar grid view (dynamic columns per day)
- Month/Year picker
- Department filter
- Search employees
- Statistics dashboard
- Lock/Unlock month
- Export to Excel
- Import from Excel
- Bulk edit mode
- Cell selection mode
- Quick fill (double-click)
- Data persistence (localStorage)

✅ **UI Components:**
- MonthYearPicker (chevron navigation)
- StatisticsDashboard (KPIs)
- ResponsiveDataTable
- Filter controls
- Action buttons

⚠️ **Vấn đề:**
- **Performance**: Render 31 columns × nhiều employees → Heavy DOM
- **Mobile**: Calendar grid không responsive trên màn hình nhỏ
- **UX**: Scroll ngang khó sử dụng
- **State**: Lưu data trong component state → mất khi refresh

#### Đề xuất: Mobile-first Redesign

**Desktop View** (giữ nguyên grid):
```tsx
// Existing calendar grid view
<DataTable columns={dayColumns} data={attendanceData} />
```

**Mobile View** (list + detail):
```tsx
// Mobile: List of employees
<AttendanceEmployeeList>
  {employees.map(emp => (
    <AttendanceEmployeeCard
      employee={emp}
      monthSummary={emp.summary}
      onClick={() => navigateToDailyView(emp.systemId)}
    />
  ))}
</AttendanceEmployeeList>

// Mobile: Daily detail view
<AttendanceDailyView
  employeeId={selectedEmployee}
  year={year}
  month={month}
>
  {daysInMonth.map(day => (
    <DailyRecordCard
      day={day}
      record={records[day]}
      onEdit={() => openEditDialog(day)}
    />
  ))}
</AttendanceDailyView>
```

**Responsive Strategy:**
```tsx
// hooks/use-attendance-view.ts
export const useAttendanceView = () => {
  const { isMobile } = useBreakpoint();
  
  if (isMobile) {
    return {
      viewType: 'list',
      component: MobileAttendanceList,
    };
  }
  
  return {
    viewType: 'grid',
    component: DesktopAttendanceGrid,
  };
};
```

#### 2. Import Dialog (attendance-import-dialog.tsx)

✅ **Features:**
- Upload Excel file
- Parse complex multi-sheet format
- Preview with validation
- Edit/Delete preview rows
- Bulk confirm import
- Download template

✅ **Validation:**
- Employee matching (by businessId)
- Time format validation
- Status indicators (ok/warning/error)

⚠️ **Vấn đề:**
- Excel format rất phức tạp (merged cells, multi-employee per sheet)
- Không support drag-drop multiple files
- Preview có thể quá nhiều rows → Performance
- Không có undo/rollback

#### Đề xuất: Simplified Import Format

**Option 1: Simple CSV**
```csv
Mã NV,Ngày,Giờ vào,Giờ ra,OT vào,OT ra,Ghi chú
NV001,2025-11-01,08:00,17:30,18:00,20:00,
NV001,2025-11-02,08:15,17:00,,,Đi muộn
NV002,2025-11-01,08:00,17:30,,,
```

**Option 2: JSON API**
```json
{
  "year": 2025,
  "month": 11,
  "records": [
    {
      "employeeId": "NV001",
      "dailyRecords": [
        {
          "day": 1,
          "checkIn": "08:00",
          "checkOut": "17:30",
          "overtimeCheckIn": "18:00",
          "overtimeCheckOut": "20:00"
        }
      ]
    }
  ]
}
```

#### 3. Edit Dialogs

✅ **attendance-edit-dialog.tsx** (Single cell):
- Status selection
- Time pickers (checkIn, checkOut, OT)
- Leave request detection
- Validation

✅ **bulk-edit-dialog.tsx** (Multiple cells):
- Same form for multiple cells
- Preview selected cells
- Bulk apply

⚠️ **Vấn đề:**
- Không hỗ trợ copy/paste từ Excel
- Không có keyboard shortcuts
- Không có history/undo

---

### E. LIÊN KẾT VỚI CÁC MODULE KHÁC

| Module | Liên kết | Loại | Mô tả |
|--------|----------|------|-------|
| **Employees** | employeeSystemId | FK | Chấm công cho nhân viên nào |
| **Settings** | Work schedule, shifts | Config | Cấu hình giờ làm, ngày làm việc |
| **Leaves** | Leave requests sync | Integration | Đơn nghỉ phép tự động đánh dấu trong attendance |
| **Payroll** | Work days, OT hours | Calculation | Dữ liệu chấm công dùng để tính lương |
| **Branches** | branchSystemId (missing) | FK | Chấm công theo chi nhánh |

#### Integration Issues:
⚠️ **Leaves → Attendance:**
- One-way sync only
- No rollback when leave is cancelled
- No conflict resolution

⚠️ **Attendance → Payroll:**
- No direct integration yet
- Payroll must manually fetch attendance data
- No validation rules (e.g., minimum work days)

---

## 🎯 ĐỀ XUẤT NÂNG CẤP

### Phase 1: Database & API (Priority: HIGH)

#### 1.1. Prisma Schema
```prisma
// See section A. TYPES - Đề xuất Type Schema above
```

#### 1.2. API Routes (Next.js)

**GET /api/attendance/month**
```typescript
// Get attendance for all employees in a month
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get('year')!);
  const month = parseInt(searchParams.get('month')!);
  const branchId = searchParams.get('branchId');
  
  const data = await prisma.attendanceMonth.findMany({
    where: {
      year,
      month,
      ...(branchId && { branchSystemId: branchId }),
    },
    include: {
      employee: {
        select: {
          systemId: true,
          id: true,
          fullName: true,
          department: true,
        },
      },
      dailyRecords: {
        orderBy: { day: 'asc' },
      },
    },
  });
  
  return NextResponse.json(data);
}
```

**POST /api/attendance/daily-record**
```typescript
// Create or update a single daily record
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { employeeSystemId, date, day, status, checkIn, checkOut, overtimeCheckIn, overtimeCheckOut, notes } = body;
  
  // Find or create month record
  const monthRecord = await prisma.attendanceMonth.upsert({
    where: {
      employeeSystemId_year_month: {
        employeeSystemId,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
      },
    },
    create: {
      employeeSystemId,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      // ... other fields
    },
    update: {},
  });
  
  // Upsert daily record
  const record = await prisma.attendanceDailyRecord.upsert({
    where: {
      attendanceMonthId_day: {
        attendanceMonthId: monthRecord.systemId,
        day,
      },
    },
    create: {
      attendanceMonthId: monthRecord.systemId,
      date,
      day,
      status,
      checkIn,
      checkOut,
      overtimeCheckIn,
      overtimeCheckOut,
      notes,
      createdBy: req.user.systemId,
      updatedBy: req.user.systemId,
    },
    update: {
      status,
      checkIn,
      checkOut,
      overtimeCheckIn,
      overtimeCheckOut,
      notes,
      updatedBy: req.user.systemId,
      updatedAt: new Date(),
    },
  });
  
  // Recalculate month summary
  await recalculateMonthSummary(monthRecord.systemId);
  
  return NextResponse.json(record);
}
```

**POST /api/attendance/bulk-import**
```typescript
// Bulk import from Excel
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { year, month, records } = body;
  
  // Validate all records first
  const validationErrors = await validateImportRecords(records);
  if (validationErrors.length > 0) {
    return NextResponse.json({ errors: validationErrors }, { status: 400 });
  }
  
  // Import in transaction
  const result = await prisma.$transaction(async (tx) => {
    for (const empRecord of records) {
      const monthRecord = await tx.attendanceMonth.upsert({
        where: {
          employeeSystemId_year_month: {
            employeeSystemId: empRecord.employeeSystemId,
            year,
            month,
          },
        },
        create: { /* ... */ },
        update: {},
      });
      
      for (const daily of empRecord.dailyRecords) {
        await tx.attendanceDailyRecord.upsert({
          where: {
            attendanceMonthId_day: {
              attendanceMonthId: monthRecord.systemId,
              day: daily.day,
            },
          },
          create: { /* ... */ },
          update: { /* ... */ },
        });
      }
      
      await recalculateMonthSummary(monthRecord.systemId, tx);
    }
  });
  
  return NextResponse.json({ success: true });
}
```

**POST /api/attendance/lock-month**
```typescript
// Lock/unlock a month
export async function POST(req: NextRequest) {
  const { year, month, lock } = await req.json();
  
  const result = await prisma.attendanceMonth.updateMany({
    where: { year, month },
    data: {
      isLocked: lock,
      lockedAt: lock ? new Date() : null,
      lockedBy: lock ? req.user.systemId : null,
    },
  });
  
  return NextResponse.json({ success: true });
}
```

#### 1.3. React Query Hooks
```typescript
// See section B. STORE - Đề xuất: React Query Store above
```

---

### Phase 2: Mobile-First UI (Priority: HIGH)

#### 2.1. Responsive Layouts

**Desktop (≥768px):**
- Keep calendar grid view
- Sticky columns (select, employee name, summary)
- Horizontal scroll for days
- Bulk edit mode

**Mobile (<768px):**
- Switch to list view
- Employee cards with summary stats
- Tap to expand daily details
- Swipe gestures for navigation

#### 2.2. Component Structure
```
features/attendance/
├── page.tsx                          # Route handler
├── components/
│   ├── desktop/
│   │   ├── attendance-grid.tsx       # Calendar grid (existing)
│   │   ├── day-columns.tsx
│   │   └── bulk-edit-toolbar.tsx
│   ├── mobile/
│   │   ├── attendance-list.tsx       # Employee list
│   │   ├── employee-card.tsx
│   │   ├── daily-view.tsx            # Single employee daily
│   │   └── daily-record-card.tsx
│   ├── shared/
│   │   ├── month-picker.tsx
│   │   ├── statistics-dashboard.tsx  # Existing, make responsive
│   │   ├── filters.tsx
│   │   └── edit-dialog.tsx
│   └── import-export/
│       ├── import-dialog.tsx
│       ├── export-dialog.tsx
│       └── template-generator.ts
```

#### 2.3. Mobile Components Example

**Employee Card (Mobile):**
```tsx
// components/mobile/employee-card.tsx
export function AttendanceEmployeeCard({ 
  employee, 
  monthSummary, 
  onClick 
}: AttendanceEmployeeCardProps) {
  return (
    <Card className="cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{employee.fullName}</CardTitle>
            <p className="text-sm text-muted-foreground">{employee.id}</p>
          </div>
          <Badge variant={monthSummary.workDays >= 22 ? 'success' : 'warning'}>
            {monthSummary.workDays} công
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div>
            <div className="text-muted-foreground">Nghỉ phép</div>
            <div className="font-semibold text-blue-600">{monthSummary.leaveDays}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Vắng</div>
            <div className="font-semibold text-red-600">{monthSummary.absentDays}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Đi trễ</div>
            <div className="font-semibold text-orange-600">{monthSummary.lateArrivals}</div>
          </div>
          <div>
            <div className="text-muted-foreground">OT</div>
            <div className="font-semibold text-purple-600">{monthSummary.otHours}h</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Daily View (Mobile):**
```tsx
// components/mobile/daily-view.tsx
export function AttendanceDailyView({ 
  employeeSystemId, 
  year, 
  month 
}: AttendanceDailyViewProps) {
  const { data: monthData, isLoading } = useAttendanceMonth(year, month, employeeSystemId);
  const daysInMonth = new Date(year, month, 0).getDate();
  
  return (
    <div className="space-y-2">
      <div className="sticky top-0 bg-background z-10 pb-2">
        <AttendanceMonthSummary summary={monthData?.summary} />
      </div>
      
      <ScrollArea className="h-[calc(100vh-200px)]">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const record = monthData?.dailyRecords.find(r => r.day === day);
          return (
            <DailyRecordCard
              key={day}
              day={day}
              date={new Date(year, month - 1, day)}
              record={record}
              onEdit={() => openEditDialog(day, record)}
            />
          );
        })}
      </ScrollArea>
    </div>
  );
}
```

---

### Phase 3: Advanced Features (Priority: MEDIUM)

#### 3.1. Check-in App (Mobile PWA)
```tsx
// features/attendance/check-in/
├── page.tsx                    # Check-in page
├── components/
│   ├── qr-scanner.tsx          # QR code scanner
│   ├── gps-tracker.tsx         # GPS location
│   ├── face-recognition.tsx    # Face recognition (future)
│   └── check-in-button.tsx
```

**Check-in Flow:**
1. Employee opens mobile app
2. App detects location (GPS)
3. Scan QR code at office entrance (optional)
4. Press "Check-in" button
5. Record saved with timestamp + location

**API:**
```typescript
// POST /api/attendance/check-in
export async function POST(req: NextRequest) {
  const { employeeSystemId, type, location, qrCode } = await req.json();
  // type: 'check-in' | 'check-out' | 'overtime-in' | 'overtime-out'
  
  // Validate location (within geofence)
  if (!isWithinOfficeArea(location)) {
    return NextResponse.json({ error: 'Bạn không ở trong khu vực văn phòng' }, { status: 400 });
  }
  
  const now = new Date();
  const record = await upsertDailyRecord({
    employeeSystemId,
    date: now,
    day: now.getDate(),
    [type === 'check-in' ? 'checkIn' : 'checkOut']: format(now, 'HH:mm'),
    location,
  });
  
  return NextResponse.json(record);
}
```

#### 3.2. Real-time Dashboard
```tsx
// features/attendance/dashboard/
├── page.tsx
├── components/
│   ├── live-attendance-map.tsx     # Who's checked in (map view)
│   ├── late-arrivals-alert.tsx     # Real-time late alerts
│   ├── absent-employees-list.tsx   # Who hasn't checked in
│   └── attendance-chart.tsx        # Charts
```

**WebSocket Integration:**
```typescript
// Real-time updates when someone checks in
const { data: liveAttendance } = useRealtimeAttendance(year, month, day);
```

#### 3.3. Integration with Hardware
- **Fingerprint scanner**: POST to `/api/attendance/biometric`
- **Face recognition device**: Similar API
- **RFID card reader**: Similar API

---

### Phase 4: Reports & Analytics (Priority: LOW)

#### 4.1. Reports
```tsx
// features/attendance/reports/
├── monthly-report.tsx      # Báo cáo tháng
├── overtime-report.tsx     # Báo cáo tăng ca
├── late-report.tsx         # Báo cáo đi trễ
└── export-pdf.ts           # Export PDF
```

#### 4.2. Analytics
- Attendance rate by department
- Late arrival trends
- Overtime trends
- Absenteeism patterns
- Employee comparison

---

## ✅ CHECKLIST RÀ SOÁT

### A. Code Quality
- [x] Types đầy đủ, sử dụng SystemId/BusinessId
- [x] Validation với time pickers
- [x] Store actions (Zustand)
- [x] Error handling (partial - cần improve)
- [x] Loading states
- [ ] No TypeScript errors (cần check strict mode)

### B. UI/UX
- [x] Desktop calendar grid
- [ ] Mobile responsive (cần redesign)
- [x] shadcn/ui components
- [x] Loading skeletons (via DataTable)
- [ ] Error boundaries (missing)
- [x] Toast notifications

### C. Performance
- [ ] Component splitting (page.tsx > 500 lines)
- [ ] Lazy loading (not implemented)
- [ ] Memoization (some, need more)
- [ ] Virtual scrolling (not implemented)

### D. Database Ready
- [x] Prisma schema designed (see proposals)
- [x] Relations mapped
- [x] Indexes identified
- [ ] Migration strategy (pending)

### E. API Ready
- [x] API routes designed (see proposals)
- [x] React Query hooks designed
- [x] Error handling strategy
- [x] Pagination support (via DataTable)

---

## 🚀 MIGRATION PLAN

### Step 1: Database Setup
1. Create Prisma models (AttendanceMonth, AttendanceDailyRecord)
2. Run migrations
3. Seed initial data (if needed)

### Step 2: API Implementation
1. Implement API routes
2. Test with Postman/Thunder Client
3. Add error handling
4. Add rate limiting

### Step 3: Frontend Migration
1. Replace Zustand with React Query
2. Migrate localStorage data to database (one-time script)
3. Update UI components to use new APIs
4. Test functionality

### Step 4: Mobile Optimization
1. Build mobile components
2. Add responsive breakpoints
3. Test on real devices
4. PWA setup (if needed)

### Step 5: Advanced Features
1. Check-in app
2. Real-time updates
3. Hardware integration
4. Reports

---

## 📊 DEPENDENCIES

### Current
```json
{
  "zustand": "^4.x",
  "xlsx": "^0.18.x",
  "fuse.js": "^7.x",
  "sonner": "^1.x",
  "react-hook-form": "^7.x",
  "@hookform/resolvers": "^3.x",
  "zod": "^3.x"
}
```

### New (Recommended)
```json
{
  "@tanstack/react-query": "^5.x",
  "@prisma/client": "^5.x",
  "date-fns": "^3.x" // Better than custom date-utils
}
```

---

## 🎯 PRIORITY SUMMARY

| Task | Priority | Effort | Impact |
|------|----------|--------|--------|
| Prisma schema + API | 🔴 HIGH | 3 days | Critical foundation |
| React Query migration | 🔴 HIGH | 2 days | Sync with backend |
| Mobile responsive UI | 🔴 HIGH | 3 days | User experience |
| Calculation service | 🟡 MEDIUM | 1 day | Bug fixes |
| Leave integration fix | 🟡 MEDIUM | 1 day | Data consistency |
| Check-in app | 🟢 LOW | 5 days | Future feature |
| Reports & analytics | 🟢 LOW | 3 days | Future feature |

**Total estimated effort: ~18 days**

---

## 📝 NOTES

### Strengths của code hiện tại:
1. ✅ Type-safe với dual-ID system
2. ✅ Calendar grid view rất trực quan (desktop)
3. ✅ Excel import/export mạnh mẽ
4. ✅ Bulk edit functionality
5. ✅ Lock month mechanism
6. ✅ Statistics dashboard
7. ✅ Leave integration

### Weaknesses cần khắc phục:
1. ❌ Không có backend/database
2. ❌ Mobile UX kém
3. ❌ Performance issues với nhiều employees
4. ❌ Calculation logic chưa đầy đủ (early departure)
5. ❌ Leave sync one-way only
6. ❌ Không có real-time updates
7. ❌ Không có check-in app

---

*Document created: 29/11/2025*  
*Last updated: 29/11/2025*  
*Status: ✅ Completed Review*  
*Next: Implement Phase 1 (Database & API)*
