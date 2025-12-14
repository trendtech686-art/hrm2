# 👥 EMPLOYEES UPGRADE PLAN V2

> Tài liệu rà soát và nâng cấp chức năng Nhân viên (Employees)
> Ngày tạo: 29/11/2025
> Trạng thái: Đang triển khai

---

## 📋 MỤC LỤC

1. [Tổng quan](#tổng-quan)
2. [Phân tích hiện trạng](#phân-tích-hiện-trạng)
3. [Đánh giá điểm mạnh](#đánh-giá-điểm-mạnh)
4. [Vấn đề cần khắc phục](#vấn-đề-cần-khắc-phục)
5. [Prisma Schema](#prisma-schema)
6. [API Design](#api-design)
7. [React Query Hooks](#react-query-hooks)
8. [UI Components](#ui-components)
9. [Mobile-First Design](#mobile-first-design)
10. [Roadmap](#roadmap)

---

## 🎯 TỔNG QUAN

### Chức năng hiện tại
- Quản lý thông tin nhân viên toàn diện (cá nhân, công việc, lương, hợp đồng)
- Hệ thống địa chỉ 2-level/3-level linh hoạt
- Quản lý phân quyền role-based
- Tích hợp với Tasks, Leaves, Attendance, Payroll
- Quản lý tài liệu đính kèm
- Org chart hierarchy (managerId)

### Mục tiêu nâng cấp
- Chuyển từ Zustand + localStorage → **Prisma + PostgreSQL**
- Tối ưu API với **React Query**
- Cải thiện UX với **shadcn/ui + mobile-first**
- Sẵn sàng deploy trên **VPS/Next.js**

---

## 📊 PHÂN TÍCH HIỆN TRẠNG

### A. FILES STRUCTURE

```
features/employees/
├── types.ts              ✅ Excellent (2-level/3-level address)
├── validation.ts         ✅ Good (Zod schemas)
├── store.ts             ⚠️ Needs migration (Zustand → Prisma)
├── page.tsx             ✅ Good (responsive, filters, export)
├── detail-page.tsx      ✅ Good (tabs, related data)
├── employee-form.tsx    ⚠️ Needs review
├── employee-form-page.tsx ⚠️ Complex (needs splitting)
├── columns.tsx          ✅ Good
├── roles.ts             ✅ Good
├── permissions.ts       ✅ Good
├── document-store.ts    ⚠️ Needs Prisma migration
├── employee-comp-store.ts ⚠️ Needs Prisma migration
├── components/
│   ├── EmployeePersonalTab.tsx
│   ├── EmployeeEmploymentTab.tsx
│   ├── EmployeePayrollTab.tsx
│   ├── EmployeeAddressesTab.tsx
│   └── EmployeeAccountFormTab.tsx
```

### B. TYPE DEFINITIONS (types.ts)

**✅ Điểm mạnh:**
- Dual-ID pattern: `systemId` + `id` (businessId)
- Address type safety: `TwoLevelAddress | ThreeLevelAddress`
- Type guards: `isTwoLevelAddress()`, `isThreeLevelAddress()`
- Comprehensive fields (personal, employment, salary, contract)
- Audit fields (createdBy, updatedBy, timestamps)

**⚠️ Cần cải thiện:**
- Một số field optional có thể làm required
- Thiếu enum cho một số field (department, contractType)
- Skills/certifications dùng string[] (nên dùng relation)

### C. VALIDATION (validation.ts)

**✅ Điểm mạnh:**
- Zod schemas với cross-field validation
- Custom validators (phone, email, nationalId)
- Business ID sanitization
- Age validation (18-65)
- Self-manager check

**⚠️ Cần cải thiện:**
- Some messages in Vietnamese (inconsistent)
- Missing validation for optional fields
- No async validation for unique checks

### D. STORE (store.ts)

**✅ Điểm mạnh:**
- CRUD operations đầy đủ
- Integrated với store-factory
- Search with Fuse.js
- Persistence với localStorage
- Breadcrumb auto-generation

**❌ Cần migration:**
- Zustand → Prisma ORM
- In-memory → PostgreSQL
- Add proper error handling
- Implement optimistic updates

### E. UI COMPONENTS

**✅ Page.tsx - Excellent:**
- Responsive data table
- Advanced filters (branch, department, job title, status)
- Mobile card view
- Column customization
- Export/Import support
- Bulk actions

**✅ Detail-page.tsx - Good:**
- Comprehensive tabs (personal, addresses, work, account, documents, penalties, leaves, tasks, payroll)
- Stats cards
- Related data tables
- Mobile-friendly

**⚠️ Forms - Needs improvement:**
- employee-form-page.tsx quá dài (800+ lines)
- Cần tách thành smaller components
- Address form phức tạp

---

## 💪 ĐÁNH GIÁ ĐIỂM MẠNH

### 1. Data Model
- ✅ Dual-ID pattern hoàn hảo
- ✅ Address flexibility (2-level/3-level)
- ✅ Comprehensive employee data
- ✅ Role-based permissions

### 2. Business Logic
- ✅ Smart address handling
- ✅ Manager hierarchy validation
- ✅ Leave quota tracking
- ✅ Salary component management

### 3. UI/UX
- ✅ Mobile-first responsive
- ✅ Advanced filtering
- ✅ Column customization
- ✅ Export/Import
- ✅ Bulk operations

### 4. Integration
- ✅ Well integrated with Tasks, Leaves, Attendance, Payroll
- ✅ Document management
- ✅ Activity history
- ✅ Breadcrumb auto-gen

---

## ⚠️ VẤN ĐỀ CẦN KHẮC PHỤC

### 🔴 LỖI NGHIÊM TRỌNG (Critical Bugs)

| # | Lỗi | File | Chi tiết | Độ ưu tiên |
|---|-----|------|----------|------------|
| 1 | **zodResolver bị tắt** | `employee-form.tsx` | Comment `// resolver: zodResolver(employeeFormSchema)` → Form không validate, user submit bất kỳ dữ liệu nào | 🔴 Critical |
| 2 | **Password hash không an toàn** | `employee-account-tab.tsx` | SHA-256 client-side không salt, dễ brute-force. Password lưu trong localStorage | 🔴 Critical |
| 3 | **Address schema mismatch** | `validation.ts` | Khai báo `permanentAddress: z.string()` nhưng `types.ts` là object `EmployeeAddress` | 🟠 High |
| 4 | **Document store nuốt lỗi** | `document-store.ts` | `confirmAllStagingDocuments` có `catch` rỗng, mất file âm thầm không báo user | 🟠 High |
| 5 | **RBAC không được áp dụng** | `permissions.ts` | Định nghĩa 100+ permissions nhưng không module nào check trước khi render | 🟡 Medium |
| 6 | **Payroll profile ở client** | `employee-comp-store.ts` | Lưu localStorage, mất khi đổi máy/browser, payroll module không đọc được | 🟡 Medium |
| 7 | **Tasks integration bị ngắt** | `detail-page.tsx` | `employeeTasks = []` hardcode, không kết nối với Task Store | 🟡 Medium |
| 8 | **validateUniqueId không atomic** | `employee-form.tsx` | 2 tab cùng tạo có thể trùng ID do check trước `add` | 🟡 Medium |

### 1. Architecture Issues

**❌ Problem:** Zustand + localStorage không scale
**✅ Solution:**
```typescript
// Current: In-memory store
const baseStore = createCrudStore<Employee>(initialData, 'employees', {
  persistKey: 'hrm-employees'
});

// Target: Prisma + PostgreSQL
const employees = await prisma.employee.findMany({
  where: { isDeleted: false },
  include: {
    branch: true,
    manager: true,
    documents: true,
  }
});
```

### 2. Performance Issues

**❌ Problem:** Fuse.js search trên client-side
**✅ Solution:**
```typescript
// Use PostgreSQL full-text search
const employees = await prisma.employee.findMany({
  where: {
    OR: [
      { fullName: { contains: query, mode: 'insensitive' } },
      { id: { contains: query, mode: 'insensitive' } },
      { workEmail: { contains: query, mode: 'insensitive' } },
    ]
  }
});
```

### 3. Form Complexity

**❌ Problem:** employee-form-page.tsx quá dài
**✅ Solution:** Tách thành wizard steps
```
Step 1: Personal Info
Step 2: Addresses
Step 3: Employment Info
Step 4: Salary & Contract
Step 5: Account Setup (optional)
```

### 4. Address Storage

**❌ Problem:** JSON trong 1 field + validation mismatch
**⚠️ Bug hiện tại:** `validation.ts` khai báo `permanentAddress: z.string()` nhưng `types.ts` định nghĩa là object `EmployeeAddress`. Khi bật zodResolver sẽ lỗi type.
**✅ Solution:** Separate table với proper relations
```prisma
model EmployeeAddress {
  id              String   @id
  employeeId      String
  employee        Employee @relation(fields: [employeeId], references: [id])
  type            AddressType // PERMANENT, TEMPORARY
  inputLevel      AddressInputLevel // TWO_LEVEL, THREE_LEVEL
  street          String
  wardId          String
  ward            Ward @relation(fields: [wardId], references: [id])
  districtId      String
  district        District @relation(fields: [districtId], references: [id])
  provinceId      String
  province        Province @relation(fields: [provinceId], references: [id])
}
```

---

## 🗄️ PRISMA SCHEMA

```prisma
// ========================================
// ENUM DEFINITIONS
// ========================================

enum Gender {
  MALE      // Nam
  FEMALE    // Nữ
  OTHER     // Khác
}

enum MaritalStatus {
  SINGLE    // Độc thân
  MARRIED   // Đã kết hôn
  OTHER     // Khác
}

enum EmployeeType {
  FULL_TIME     // Chính thức
  PROBATION     // Thử việc
  INTERN        // Thực tập sinh
  PART_TIME     // Bán thời gian
}

enum EmploymentStatus {
  ACTIVE        // Đang làm việc
  ON_LEAVE      // Tạm nghỉ
  TERMINATED    // Đã nghỉ việc
}

enum ContractType {
  INDEFINITE    // Vô thời hạn
  PROBATION     // Thử việc
  ONE_YEAR      // 1 năm
  TWO_YEARS     // 2 năm
  THREE_YEARS   // 3 năm
  UNDETERMINED  // Không xác định
}

enum PerformanceRating {
  EXCELLENT     // Xuất sắc
  GOOD          // Tốt
  SATISFACTORY  // Đạt yêu cầu
  NEEDS_IMPROVEMENT // Cần cải thiện
}

enum ShiftType {
  ADMINISTRATIVE  // Hành chính
  MORNING         // Ca sáng
  AFTERNOON       // Ca chiều
  NIGHT           // Ca đêm
  ROTATING        // Luân ca
}

enum AddressType {
  PERMANENT   // Thường trú
  TEMPORARY   // Tạm trú
}

enum AddressInputLevel {
  TWO_LEVEL   // Province + Ward (District auto-filled)
  THREE_LEVEL // Province + District + Ward
}

// ========================================
// EMPLOYEE MODEL
// ========================================

model Employee {
  // ✅ Primary Keys
  id                    String   @id @default(cuid())
  systemId              String   @unique @default(cuid())
  businessId            String   @unique // NV001, NV002 (user-facing)
  
  // ✅ Personal Information
  fullName              String
  dob                   DateTime
  placeOfBirth          String?
  gender                Gender
  nationalId            String?  @unique
  nationalIdIssueDate   DateTime?
  nationalIdIssuePlace  String?
  phone                 String   @unique
  personalEmail         String?
  workEmail             String   @unique
  maritalStatus         MaritalStatus?
  emergencyContactName  String?
  emergencyContactPhone String?
  personalTaxId         String?  @unique
  socialInsuranceNumber String?  @unique
  avatarUrl             String?
  
  // ✅ Banking Information
  bankAccountNumber     String?
  bankName              String?
  bankBranch            String?
  
  // ✅ Employment Information
  jobTitleId            String
  jobTitle              JobTitle @relation(fields: [jobTitleId], references: [id])
  departmentId          String?
  department            Department? @relation(fields: [departmentId], references: [id])
  branchId              String?
  branch                Branch? @relation(fields: [branchId], references: [id])
  hireDate              DateTime
  employeeType          EmployeeType
  employmentStatus      EmploymentStatus @default(ACTIVE)
  terminationDate       DateTime?
  reasonForLeaving      String?
  role                  String // Role from roles.ts
  
  // ✅ Contract Information
  contractNumber        String?
  contractStartDate     DateTime?
  contractEndDate       DateTime?
  probationEndDate      DateTime?
  contractType          ContractType?
  
  // ✅ Work Schedule
  workingHoursPerDay    Int      @default(8)
  workingDaysPerWeek    Int      @default(5)
  shiftType             ShiftType?
  
  // ✅ Salary & Allowances
  baseSalary            Decimal  @default(0) @db.Decimal(15, 2)
  socialInsuranceSalary Decimal? @db.Decimal(15, 2)
  positionAllowance     Decimal? @db.Decimal(15, 2)
  mealAllowance         Decimal? @db.Decimal(15, 2)
  otherAllowances       Decimal? @db.Decimal(15, 2)
  
  // ✅ Performance & Review
  performanceRating     PerformanceRating?
  lastReviewDate        DateTime?
  nextReviewDate        DateTime?
  
  // ✅ Skills & Certifications
  skills                String[] // JSON array of skill names
  certifications        String[] // JSON array of certification names
  
  // ✅ Leave Tracking
  annualLeaveBalance    Int      @default(12)
  annualLeaveTaken      Int      @default(0)
  sickLeaveBalance      Int      @default(30)
  sickLeaveTaken        Int      @default(0)
  paidLeaveTaken        Int      @default(0)
  unpaidLeaveTaken      Int      @default(0)
  leaveTaken            Int      @default(0) // Total
  
  // ✅ Organization Chart
  managerId             String?
  manager               Employee? @relation("EmployeeHierarchy", fields: [managerId], references: [id])
  subordinates          Employee[] @relation("EmployeeHierarchy")
  positionX             Float?
  positionY             Float?
  
  // ✅ Audit Fields
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  deletedAt             DateTime?
  isDeleted             Boolean   @default(false)
  createdBy             String?
  createdByEmployee     Employee? @relation("EmployeeCreatedBy", fields: [createdBy], references: [id])
  updatedBy             String?
  updatedByEmployee     Employee? @relation("EmployeeUpdatedBy", fields: [updatedBy], references: [id])
  
  // ✅ Relations
  addresses             EmployeeAddress[]
  documents             EmployeeDocument[]
  leaves                Leave[]
  attendances           Attendance[]
  payslips              Payslip[]
  tasks                 Task[] @relation("TaskAssignees")
  createdTasks          Task[] @relation("TaskCreator")
  penalties             Penalty[]
  orders                Order[] @relation("OrderSalesperson")
  createdOrders         Order[] @relation("OrderCreator")
  createdEmployees      Employee[] @relation("EmployeeCreatedBy")
  updatedEmployees      Employee[] @relation("EmployeeUpdatedBy")
  
  // ✅ User Account Link (1-to-1)
  userId                String?  @unique
  user                  User?    @relation(fields: [userId], references: [id])
  
  notes                 String?
  
  @@index([businessId])
  @@index([fullName])
  @@index([workEmail])
  @@index([phone])
  @@index([branchId])
  @@index([departmentId])
  @@index([managerId])
  @@index([employmentStatus])
  @@index([isDeleted])
  @@map("employees")
}

// ========================================
// EMPLOYEE ADDRESS MODEL
// ========================================

model EmployeeAddress {
  id            String             @id @default(cuid())
  employeeId    String
  employee      Employee           @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  type          AddressType        // PERMANENT or TEMPORARY
  inputLevel    AddressInputLevel  // TWO_LEVEL or THREE_LEVEL
  
  // Address Components
  street        String
  wardId        String
  ward          Ward               @relation(fields: [wardId], references: [id])
  districtId    String?
  district      District?          @relation(fields: [districtId], references: [id])
  provinceId    String
  province      Province           @relation(fields: [provinceId], references: [id])
  
  createdAt     DateTime           @default(now())
  updatedAt     DateTime           @updatedAt
  
  @@index([employeeId])
  @@index([type])
  @@map("employee_addresses")
}

// ========================================
// EMPLOYEE DOCUMENT MODEL
// ========================================

model EmployeeDocument {
  id              String    @id @default(cuid())
  employeeId      String
  employee        Employee  @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  
  documentType    String    // CV, Certificate, Contract, ID Card, etc.
  fileName        String
  fileUrl         String
  fileSize        Int
  mimeType        String
  description     String?
  
  uploadedAt      DateTime  @default(now())
  uploadedBy      String?
  
  @@index([employeeId])
  @@index([documentType])
  @@map("employee_documents")
}

// ========================================
// SUPPORTING MODELS
// ========================================

model JobTitle {
  id            String     @id @default(cuid())
  systemId      String     @unique @default(cuid())
  businessId    String     @unique
  name          String     @unique
  description   String?
  level         Int?       // Cấp độ (1, 2, 3...)
  isActive      Boolean    @default(true)
  employees     Employee[]
  
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  
  @@map("job_titles")
}

model Department {
  id            String     @id @default(cuid())
  systemId      String     @unique @default(cuid())
  businessId    String     @unique
  name          String     @unique
  description   String?
  managerId     String?    // Head of department
  isActive      Boolean    @default(true)
  employees     Employee[]
  
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  
  @@map("departments")
}

// Province/District/Ward models (from existing schema)
model Province {
  id                String             @id
  name              String
  nameEn            String?
  fullName          String
  fullNameEn        String?
  codeName          String?
  districts         District[]
  employeeAddresses EmployeeAddress[]
  
  @@map("provinces")
}

model District {
  id                String             @id
  name              String
  nameEn            String?
  fullName          String?
  fullNameEn        String?
  codeName          String?
  provinceId        String
  province          Province           @relation(fields: [provinceId], references: [id])
  wards             Ward[]
  employeeAddresses EmployeeAddress[]
  
  @@index([provinceId])
  @@map("districts")
}

model Ward {
  id                String             @id
  name              String
  nameEn            String?
  fullName          String?
  fullNameEn        String?
  codeName          String?
  districtId        String
  district          District           @relation(fields: [districtId], references: [id])
  employeeAddresses EmployeeAddress[]
  
  @@index([districtId])
  @@map("wards")
}
```

---

## 🔌 API DESIGN

### REST API Routes (Next.js App Router)

```typescript
// app/api/employees/route.ts
// GET  /api/employees - List employees with filters
// POST /api/employees - Create employee

// app/api/employees/[id]/route.ts
// GET    /api/employees/[id] - Get employee by systemId
// PATCH  /api/employees/[id] - Update employee
// DELETE /api/employees/[id] - Soft delete employee

// app/api/employees/[id]/restore/route.ts
// POST /api/employees/[id]/restore - Restore deleted employee

// app/api/employees/[id]/addresses/route.ts
// GET  /api/employees/[id]/addresses - Get employee addresses
// POST /api/employees/[id]/addresses - Add address

// app/api/employees/[id]/documents/route.ts
// GET  /api/employees/[id]/documents - Get employee documents
// POST /api/employees/[id]/documents - Upload document

// app/api/employees/search/route.ts
// GET /api/employees/search?q=john - Search employees

// app/api/employees/export/route.ts
// POST /api/employees/export - Export to Excel/CSV

// app/api/employees/import/route.ts
// POST /api/employees/import - Import from Excel/CSV
```

### API Implementation Examples

```typescript
// app/api/employees/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '40');
    const search = searchParams.get('search') || '';
    const branchId = searchParams.get('branchId');
    const departmentId = searchParams.get('departmentId');
    const status = searchParams.get('status');

    const where: any = {
      isDeleted: false,
    };

    // Search filter
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { businessId: { contains: search, mode: 'insensitive' } },
        { workEmail: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    // Other filters
    if (branchId) where.branchId = branchId;
    if (departmentId) where.departmentId = departmentId;
    if (status) where.employmentStatus = status;

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        include: {
          branch: true,
          department: true,
          jobTitle: true,
          manager: { select: { id: true, fullName: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.employee.count({ where }),
    ]);

    return NextResponse.json({
      data: employees,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate with Zod
    const validatedData = employeeFormSchema.parse(body);

    // Generate business ID if not provided
    const businessId = validatedData.businessId || await generateEmployeeBusinessId();

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        businessId,
        fullName: validatedData.fullName,
        dob: validatedData.dob,
        gender: validatedData.gender,
        phone: validatedData.phone,
        workEmail: validatedData.workEmail,
        branchId: validatedData.branchId,
        jobTitleId: validatedData.jobTitleId,
        departmentId: validatedData.departmentId,
        hireDate: validatedData.hireDate,
        employeeType: validatedData.employeeType,
        employmentStatus: validatedData.employmentStatus,
        baseSalary: validatedData.baseSalary,
        createdBy: session.user.employeeId,
        // ... other fields
      },
      include: {
        branch: true,
        department: true,
        jobTitle: true,
      },
    });

    // Create addresses if provided
    if (body.permanentAddress) {
      await prisma.employeeAddress.create({
        data: {
          employeeId: employee.id,
          type: 'PERMANENT',
          inputLevel: body.permanentAddress.inputLevel,
          street: body.permanentAddress.street,
          wardId: body.permanentAddress.wardId,
          districtId: body.permanentAddress.districtId,
          provinceId: body.permanentAddress.provinceId,
        },
      });
    }

    return NextResponse.json({ data: employee }, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}

// Helper function
async function generateEmployeeBusinessId(): Promise<string> {
  const lastEmployee = await prisma.employee.findFirst({
    where: { businessId: { startsWith: 'NV' } },
    orderBy: { businessId: 'desc' },
  });

  if (!lastEmployee) return 'NV0001';

  const lastNumber = parseInt(lastEmployee.businessId.substring(2));
  const nextNumber = lastNumber + 1;
  return `NV${nextNumber.toString().padStart(4, '0')}`;
}
```

---

## ⚛️ REACT QUERY HOOKS

```typescript
// lib/api/employees.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Employee } from '@/types/employee';

// ========================================
// API FUNCTIONS
// ========================================

export const employeesApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    branchId?: string;
    departmentId?: string;
    status?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.branchId) searchParams.set('branchId', params.branchId);
    if (params?.departmentId) searchParams.set('departmentId', params.departmentId);
    if (params?.status) searchParams.set('status', params.status);

    const response = await fetch(`/api/employees?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`/api/employees/${id}`);
    if (!response.ok) throw new Error('Failed to fetch employee');
    return response.json();
  },

  create: async (data: Partial<Employee>) => {
    const response = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create employee');
    return response.json();
  },

  update: async (id: string, data: Partial<Employee>) => {
    const response = await fetch(`/api/employees/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update employee');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/employees/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete employee');
    return response.json();
  },

  restore: async (id: string) => {
    const response = await fetch(`/api/employees/${id}/restore`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to restore employee');
    return response.json();
  },

  search: async (query: string) => {
    const response = await fetch(`/api/employees/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search employees');
    return response.json();
  },
};

// ========================================
// REACT QUERY HOOKS
// ========================================

export const useEmployees = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  branchId?: string;
  departmentId?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => employeesApi.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useEmployee = (id: string | undefined) => {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: () => employeesApi.getById(id!),
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) =>
      employeesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employees', variables.id] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useRestoreEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeesApi.restore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useSearchEmployees = (query: string) => {
  return useQuery({
    queryKey: ['employees', 'search', query],
    queryFn: () => employeesApi.search(query),
    enabled: query.length > 2,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};
```

---

## 🎨 UI COMPONENTS

### 1. Employee List Page (Refactored)

```typescript
// app/(dashboard)/employees/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useEmployees } from '@/lib/api/employees';
import { DataTable } from '@/components/data-table';
import { getEmployeeColumns } from './columns';
import { EmployeeFilters } from './employee-filters';
import { EmployeeMobileCard } from './employee-mobile-card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';

export default function EmployeesPage() {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const [filters, setFilters] = useState({
    page: 1,
    limit: 40,
    search: '',
    branchId: '',
    departmentId: '',
    status: '',
  });

  const { data, isLoading, error } = useEmployees(filters);

  const columns = useMemo(() => getEmployeeColumns(), []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Nhân viên</h1>
        <Button onClick={() => router.push('/employees/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm nhân viên
        </Button>
      </div>

      <EmployeeFilters filters={filters} onFiltersChange={setFilters} />

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error loading employees</div>
      ) : isMobile ? (
        <div className="space-y-4">
          {data?.data.map((employee) => (
            <EmployeeMobileCard key={employee.id} employee={employee} />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data?.data || []}
          pageCount={data?.meta.totalPages || 0}
          onRowClick={(row) => router.push(`/employees/${row.id}`)}
        />
      )}
    </div>
  );
}
```

### 2. Employee Form (Multi-Step Wizard)

```typescript
// app/(dashboard)/employees/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateEmployee } from '@/lib/api/employees';
import { EmployeeFormWizard } from './employee-form-wizard';
import { toast } from 'sonner';

export default function NewEmployeePage() {
  const router = useRouter();
  const createEmployee = useCreateEmployee();
  const [currentStep, setCurrentStep] = useState(1);

  const handleSubmit = async (data: any) => {
    try {
      const result = await createEmployee.mutateAsync(data);
      toast.success('Thêm nhân viên thành công');
      router.push(`/employees/${result.data.id}`);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm nhân viên');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Thêm nhân viên mới</h1>
      
      <EmployeeFormWizard
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onSubmit={handleSubmit}
        isSubmitting={createEmployee.isPending}
      />
    </div>
  );
}

// components/employees/employee-form-wizard.tsx
import { FormStep1Personal } from './form-steps/step1-personal';
import { FormStep2Addresses } from './form-steps/step2-addresses';
import { FormStep3Employment } from './form-steps/step3-employment';
import { FormStep4Salary } from './form-steps/step4-salary';
import { FormStep5Account } from './form-steps/step5-account';

const steps = [
  { id: 1, title: 'Thông tin cá nhân', component: FormStep1Personal },
  { id: 2, title: 'Địa chỉ', component: FormStep2Addresses },
  { id: 3, title: 'Công việc', component: FormStep3Employment },
  { id: 4, title: 'Lương & HĐ', component: FormStep4Salary },
  { id: 5, title: 'Tài khoản', component: FormStep5Account },
];

export function EmployeeFormWizard({ currentStep, onStepChange, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({});

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div>
      {/* Wizard progress indicator */}
      <WizardProgress steps={steps} currentStep={currentStep} />

      {/* Current step form */}
      <CurrentStepComponent
        data={formData}
        onNext={(data) => {
          setFormData({ ...formData, ...data });
          onStepChange(currentStep + 1);
        }}
        onBack={() => onStepChange(currentStep - 1)}
        onSubmit={(data) => {
          const finalData = { ...formData, ...data };
          onSubmit(finalData);
        }}
        isLastStep={currentStep === steps.length}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
```

---

## 📱 MOBILE-FIRST DESIGN

### Mobile Employee Card

```typescript
// components/employees/employee-mobile-card.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MapPin, Calendar } from 'lucide-react';

export function EmployeeMobileCard({ employee }) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => router.push(`/employees/${employee.id}`)}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={employee.avatarUrl} />
            <AvatarFallback>{getInitials(employee.fullName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">
              {employee.fullName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {employee.jobTitle?.name}
            </p>
            <Badge variant={employee.employmentStatus === 'ACTIVE' ? 'default' : 'secondary'} className="mt-1">
              {employee.employmentStatus}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {employee.businessId}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="h-4 w-4 mr-2" />
            <a href={`tel:${employee.phone}`} className="hover:text-primary">
              {employee.phone}
            </a>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="h-4 w-4 mr-2" />
            <a href={`mailto:${employee.workEmail}`} className="hover:text-primary truncate">
              {employee.workEmail}
            </a>
          </div>
          {employee.branch && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="truncate">{employee.branch.name}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Vào làm: {formatDate(employee.hireDate)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 🗺️ ROADMAP

### 🚨 HOTFIX (Làm ngay trước khi migration)

| # | Task | Độ ưu tiên |
|---|------|------------|
| 1 | Bật lại `zodResolver(employeeFormSchema)` trong `employee-form.tsx` | 🔴 Critical |
| 2 | Fix address schema trong `validation.ts` để match với `types.ts` | 🔴 Critical |
| 3 | Thêm error handling trong `document-store.ts` (không nuốt lỗi) | 🟠 High |
| 4 | Kết nối lại Tasks integration trong `detail-page.tsx` | 🟡 Medium |

### Phase 1: Database Migration (Week 1-2)
- [ ] Setup Prisma với PostgreSQL
- [ ] Tạo migrations cho Employee models
- [ ] Seed data from existing localStorage
- [ ] Test data integrity

### Phase 2: API Development (Week 2-3)
- [ ] Implement REST API routes
- [ ] Add authentication middleware
- [ ] Add validation với Zod
- [ ] Add error handling
- [ ] Write API tests

### Phase 3: React Query Integration (Week 3-4)
- [ ] Create React Query hooks
- [ ] Replace Zustand với React Query
- [ ] Implement optimistic updates
- [ ] Add loading/error states
- [ ] Test caching behavior

### Phase 4: UI/UX Improvements (Week 4-5)
- [ ] Refactor form thành wizard steps
- [ ] Improve mobile responsiveness
- [ ] Add skeleton loaders
- [ ] Improve error messages
- [ ] Add success animations

### Phase 5: Testing & Optimization (Week 5-6)
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Documentation

### Phase 6: Deployment (Week 6)
- [ ] Setup VPS environment
- [ ] Configure Next.js production build
- [ ] Setup PostgreSQL on VPS
- [ ] Deploy và monitor
- [ ] User acceptance testing

---

## ✅ CHECKLIST

### Database
- [ ] Prisma schema defined
- [ ] Migrations created
- [ ] Seed scripts ready
- [ ] Indexes optimized

### API
- [ ] All CRUD endpoints implemented
- [ ] Authentication added
- [ ] Validation added
- [ ] Error handling complete
- [ ] Tests written

### Frontend
- [ ] React Query hooks created
- [ ] Forms refactored
- [ ] Mobile-first responsive
- [ ] Loading states added
- [ ] Error handling improved

### Integration
- [ ] Tasks integration tested
- [ ] Leaves integration tested
- [ ] Attendance integration tested
- [ ] Payroll integration tested
- [ ] Documents integration tested

### Deployment
- [ ] VPS configured
- [ ] Database deployed
- [ ] Application deployed
- [ ] SSL configured
- [ ] Monitoring setup

---

**Ngày cập nhật:** 29/11/2025
**Phiên bản:** 1.1 (Merged từ V1, V2, và phân tích lỗi)
**Người thực hiện:** Development Team
**Trạng thái:** Đang triển khai
