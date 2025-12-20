# 🚀 KẾ HOẠCH CHUYỂN ĐỔI SANG NEXT.JS

> **Cập nhật:** 19/12/2025  
> **Trạng thái:** ✅ Approved - Sẵn sàng triển khai  
> **Mục tiêu:** shadcn + mobile-first + Prisma/PostgreSQL + Next.js 15 + VPS deployment

---

## � NAMING CONVENTION

### Tại sao dùng `erp` thay vì `hrm`?

| Tên | Viết tắt của | Mô tả |
|-----|-------------|-------|
| **ERP** | Enterprise Resource Planning | Hệ thống quản lý tổng hợp (Sales, HR, Inventory, Finance...) |
| **HRM** | Human Resource Management | Chỉ quản lý nhân sự |

Vì hệ thống này có nhiều modules (không chỉ HR), nên dùng `erp` cho infrastructure:

| Thành phần | Tên | Giải thích |
|------------|-----|------------|
| Database | `erp_db` | Tên database PostgreSQL |
| DB User | `erp_user` | User kết nối database |
| App Container | `erp_app` | Docker container cho Next.js |
| Nginx Container | `erp_nginx` | Reverse proxy container |
| Redis Container | `erp_redis` | Cache container |
| Project Folder | `erp-nextjs` | Tên folder trên VPS |

**Lưu ý:** Route group `(hrm)` trong Next.js vẫn giữ nguyên vì đúng là module Human Resource.

---

## �📊 TỔNG QUAN HỆ THỐNG HIỆN TẠI

### Thống kê codebase (19/12/2025)

| Metric | Số lượng | Ghi chú |
|--------|----------|---------|
| **Routes** | 95+ | Định nghĩa trong `lib/router.ts` |
| **Features/Modules** | 37 | Trong folder `features/` |
| **Zustand Stores** | 50+ | localStorage persistence |
| **API Endpoints** | 51 | Express server (file upload, GHTK) |
| **Components UI** | 100+ | shadcn/ui + custom |
| **Lines of Code** | ~150,000+ | TypeScript + React |

### Cấu trúc modules hiện tại

```
features/
├── 📁 HRM (Nhân sự) - 4 modules
│   ├── employees/        # Quản lý nhân viên
│   ├── attendance/       # Chấm công  
│   ├── leaves/           # Nghỉ phép
│   └── payroll/          # Bảng lương
│
├── 📁 SALES (Bán hàng) - 8 modules
│   ├── customers/        # Khách hàng
│   ├── products/         # Sản phẩm
│   ├── brands/           # Thương hiệu
│   ├── categories/       # Danh mục
│   ├── orders/           # Đơn hàng
│   ├── sales-returns/    # Trả hàng
│   ├── packaging/        # Đóng gói
│   └── shipments/        # Vận chuyển
│
├── 📁 PROCUREMENT (Mua hàng) - 4 modules
│   ├── suppliers/        # Nhà cung cấp
│   ├── purchase-orders/  # Đơn mua hàng
│   ├── purchase-returns/ # Trả hàng NCC
│   └── inventory-receipts/ # Nhập kho
│
├── 📁 INVENTORY (Kho) - 5 modules
│   ├── stock-locations/  # Vị trí kho
│   ├── stock-transfers/  # Chuyển kho
│   ├── stock-history/    # Lịch sử tồn kho
│   ├── inventory-checks/ # Kiểm kho
│   └── cost-adjustments/ # Điều chỉnh giá vốn
│
├── 📁 FINANCE (Tài chính) - 4 modules
│   ├── cashbook/         # Sổ quỹ
│   ├── receipts/         # Phiếu thu
│   ├── payments/         # Phiếu chi
│   └── reconciliation/   # Đối soát
│
├── 📁 OPERATIONS (Vận hành) - 5 modules
│   ├── tasks/            # Công việc
│   ├── warranty/         # Bảo hành
│   ├── complaints/       # Khiếu nại
│   ├── audit-log/        # Log hệ thống
│   └── wiki/             # Tài liệu
│
├── 📁 REPORTS (Báo cáo) - 1 module
│   └── reports/          # 27+ loại báo cáo
│       ├── sales/time, employee, product, order, branch, customer
│       ├── delivery/time, employee, shipment, carrier, branch
│       ├── returns/order, product
│       ├── payments/time, employee, method, branch
│       └── inventory/product, branch, category
│
├── 📁 SETTINGS (Cài đặt) - 20+ sub-modules
│   └── settings/
│       ├── appearance/   # Giao diện
│       ├── branches/     # Chi nhánh
│       ├── departments/  # Phòng ban
│       ├── job-titles/   # Chức vụ
│       ├── pricing/      # Bảng giá
│       ├── taxes/        # Thuế
│       ├── shipping/     # Vận chuyển
│       ├── printer/      # In ấn
│       ├── pkgx/         # Tích hợp PKGX
│       └── ...
│
└── 📁 OTHER - 3 modules
    ├── auth/             # Đăng nhập
    ├── dashboard/        # Trang chủ
    └── shared/           # Components dùng chung
```

### Danh sách Zustand Stores (50 files)

```
features/attendance/store.ts
features/audit-log/store.ts
features/cashbook/store.ts
features/complaints/store.ts
features/cost-adjustments/store.ts
features/customers/store.ts
features/customers/sla/store.ts
features/employees/store.ts
features/inventory-checks/store.ts
features/inventory-receipts/store.ts
features/leaves/store.ts
features/orders/store.ts
features/payments/store.ts
features/products/store.ts
features/purchase-orders/store.ts
features/purchase-returns/store.ts
features/receipts/store.ts
features/sales-returns/store.ts
features/shipments/store.ts
features/stock-history/store.ts
features/stock-locations/store.ts
features/stock-transfers/store.ts
features/suppliers/store.ts
features/tasks/store.ts
features/warranty/store.ts
features/wiki/store.ts
features/settings/appearance/store.ts
features/settings/branches/store.ts
features/settings/departments/store.ts
features/settings/job-titles/store.ts
features/settings/payments/methods/store.ts
features/settings/payments/types/store.ts
features/settings/penalties/store.ts
features/settings/pkgx/store.ts
features/settings/pricing/store.ts
features/settings/printer/store.ts
features/settings/provinces/store.ts
features/settings/receipt-types/store.ts
features/settings/sales-channels/store.ts
features/settings/shipping/store.ts
features/settings/store-info/store-info-store.ts
features/settings/target-groups/store.ts
features/settings/taxes/store.ts
features/settings/trendtech/store.ts
features/settings/units/store.ts
lib/store-factory.ts
```

### Backend API hiện tại (Express.js)

**File:** `server/server.js` - 3,420 lines - 51 endpoints

```
📁 File Upload APIs (20 endpoints)
├── POST   /api/staging/upload                    # Upload tạm
├── POST   /api/staging/confirm/:sessionId/...    # Confirm staging → permanent
├── GET    /api/staging/files/:sessionId          # List staging files
├── GET    /api/staging/files/:sessionId/:filename # Get staging file
├── DELETE /api/staging/:sessionId                # Xóa session staging
├── POST   /api/upload/:employeeId/:docType/:docName # Direct upload
├── GET    /api/files/:employeeId/:documentType?  # Get employee files
├── GET    /api/files/employees/:employeeId/...   # Serve employee files
├── GET    /api/files/products/:productId/...     # Serve product images
├── GET    /api/files/customers/:customerId/...   # Serve customer files
├── GET    /api/files/warranty/:warrantyId/...    # Serve warranty images
├── GET    /api/files/complaints/:complaintId/... # Serve complaint images
├── GET    /api/files/comments/...                # Serve comment images
├── GET    /api/files/print-templates/...         # Serve print template images
├── GET    /api/files/tasks/:taskId/evidence/...  # Serve task evidence
├── DELETE /api/files/:fileId                     # Xóa file
├── DELETE /api/files/employee/:employeeId        # Xóa all files của employee
├── POST   /api/comments/upload-image             # Upload comment image
├── POST   /api/print-templates/upload-image      # Upload print template image
└── POST   /api/tasks/:taskId/evidence            # Upload task evidence

📁 Shipping APIs - GHTK Integration (15 endpoints)
├── POST /api/shipping/ghtk/calculate-fee         # Tính phí ship
├── GET  /api/shipping/ghtk/solutions             # Lấy giải pháp ship
├── POST /api/shipping/ghtk/create-order          # Tạo đơn GHTK (draft)
├── POST /api/shipping/ghtk/submit-order          # Submit đơn GHTK
├── GET  /api/shipping/ghtk/list-pick-addresses   # Danh sách địa chỉ lấy hàng
├── GET  /api/shipping/ghtk/get-specific-addresses # Lấy địa chỉ cụ thể
├── GET  /api/shipping/ghtk/order-status/:code    # Trạng thái đơn
├── GET  /api/shipping/ghtk/track/:code           # Theo dõi đơn
├── GET  /api/shipping/ghtk/print-label/:code     # In nhãn vận đơn
├── POST /api/shipping/ghtk/cancel-order          # Hủy đơn
├── GET  /api/shipping/ghtk/test-connection       # Test kết nối GHTK
├── POST /api/shipping/ghtk/parse-error           # Parse lỗi GHTK
├── POST /api/shipping/ghtk/webhook               # Webhook nhận update từ GHTK
└── GET  /api/shipping/ghtk/webhook/poll          # Poll webhook queue

📁 Branding APIs (4 endpoints)
├── POST   /api/branding/upload                   # Upload logo/favicon
├── GET    /api/branding/:filename                # Serve branding file
├── DELETE /api/branding/:type                    # Xóa branding
└── GET    /api/branding                          # List branding files

📁 Complaint APIs (1 endpoint)
└── POST /api/complaints/:complaintId/comments/upload # Upload complaint comment image

📁 Health & Test (2 endpoints)
├── GET /api-test                                 # API test endpoint
└── GET /health                                   # Health check
```

### Database hiện tại

```
server/hrm_files.db (SQLite)
└── Table: files
    ├── id (TEXT PRIMARY KEY)
    ├── employee_id (TEXT)
    ├── document_type (TEXT)
    ├── document_name (TEXT)
    ├── original_name (TEXT)
    ├── filename (TEXT)
    ├── filepath (TEXT)
    ├── filesize (INTEGER)
    ├── mimetype (TEXT)
    ├── status (TEXT) - 'staging' | 'permanent'
    ├── session_id (TEXT)
    ├── uploaded_at (DATETIME)
    ├── confirmed_at (DATETIME)
    ├── file_slug (TEXT)
    ├── display_name (TEXT)
    └── filename_metadata (TEXT)
```

---

## 1. MỤC TIÊU MIGRATION

### Mục tiêu chính
- ✅ **Prisma + PostgreSQL** - Database thật thay localStorage
- ✅ **Next.js 15 App Router** - SSR/SSG, SEO ready
- ✅ **React Query** - Thay Zustand cho server state
- ✅ **shadcn/ui** - Giữ nguyên (đã có)
- ✅ **Mobile-first** - Responsive design (đã có)
- ✅ **VPS Deployment** - Production ready

### Những gì giữ nguyên
- 95+ routes hiện tại
- 100+ UI components  
- Business logic trong features
- shadcn/ui components
- Tailwind CSS styling

### Những gì thay đổi
| Hiện tại | Sau migration |
|----------|---------------|
| Vite + React Router | Next.js 15 App Router |
| Zustand + localStorage | React Query + PostgreSQL |
| Express server (file only) | Next.js API Routes + Prisma |
| Client-side routing | Server + Client routing |

---

## 2. PHÂN ĐOẠN APP ROUTER

### Route Groups đề xuất

| Segment | Nội dung | Routes | Layout |
|---------|----------|--------|--------|
| `(hrm)` | Nhân sự, chấm công, nghỉ phép, payroll | ~15 | HRM sidebar |
| `(sales)` | Customers, products, orders, returns, shipping | ~25 | Sales sidebar |
| `(procurement)` | Suppliers, purchase orders/returns | ~12 | Procurement sidebar |
| `(inventory)` | Stock locations, transfers, checks | ~10 | Inventory sidebar |
| `(finance)` | Cashbook, receipts, payments | ~8 | Finance sidebar |
| `(operations)` | Tasks, warranty, complaints, wiki | ~15 | Operations sidebar |
| `(reports)` | Tất cả báo cáo | ~27 | Reports layout |
| `(settings)` | Cài đặt hệ thống | ~15 | Settings sidebar |
| `(public)` | Login, complaint tracking | ~5 | No auth layout |

### Cấu trúc thư mục Next.js

```
app/
├── layout.tsx              # Root layout (ThemeProvider, Fonts)
├── loading.tsx             # Global loading
├── error.tsx               # Global error boundary
├── not-found.tsx           # 404 page
│
├── (public)/               # Public pages (no auth)
│   ├── layout.tsx          # No sidebar layout
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   └── complaint-tracking/
│       └── [trackingCode]/
│           └── page.tsx
│
├── (hrm)/                  # HRM module
│   ├── layout.tsx          # HRM sidebar + header
│   ├── employees/
│   │   ├── page.tsx        # List employees
│   │   ├── new/
│   │   │   └── page.tsx    # Create employee
│   │   └── [systemId]/
│   │       ├── page.tsx    # View employee
│   │       └── edit/
│   │           └── page.tsx # Edit employee
│   ├── attendance/
│   │   └── page.tsx
│   ├── leaves/
│   │   ├── page.tsx
│   │   └── [systemId]/
│   │       └── page.tsx
│   └── payroll/
│       ├── page.tsx
│       ├── run/
│       │   └── page.tsx
│       └── [systemId]/
│           └── page.tsx
│
├── (sales)/                # Sales module
│   ├── layout.tsx
│   ├── customers/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [systemId]/
│   │       ├── page.tsx
│   │       └── edit/
│   │           └── page.tsx
│   ├── products/
│   │   ├── page.tsx
│   │   ├── trash/
│   │   │   └── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [systemId]/
│   │       ├── page.tsx
│   │       └── edit/
│   │           └── page.tsx
│   ├── orders/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [systemId]/
│   │       ├── page.tsx
│   │       ├── edit/
│   │       │   └── page.tsx
│   │       └── return/
│   │           └── page.tsx
│   └── returns/
│       ├── page.tsx
│       └── [systemId]/
│           └── page.tsx
│
├── (procurement)/          # Procurement module
│   ├── layout.tsx
│   ├── suppliers/
│   ├── purchase-orders/
│   └── purchase-returns/
│
├── (inventory)/            # Inventory module
│   ├── layout.tsx
│   ├── stock-locations/
│   ├── stock-transfers/
│   ├── inventory-checks/
│   └── cost-adjustments/
│
├── (finance)/              # Finance module
│   ├── layout.tsx
│   ├── cashbook/
│   ├── receipts/
│   └── payments/
│
├── (operations)/           # Operations module
│   ├── layout.tsx
│   ├── tasks/
│   ├── warranty/
│   ├── complaints/
│   └── wiki/
│
├── (reports)/              # Reports module
│   ├── layout.tsx
│   └── [...slug]/          # Catch-all for report routes
│       └── page.tsx
│
├── (settings)/             # Settings module
│   ├── layout.tsx
│   └── settings/
│       ├── page.tsx
│       ├── appearance/
│       ├── employees/
│       ├── branches/
│       └── ...
│
└── api/                    # API Routes
    ├── auth/
    │   ├── login/
    │   │   └── route.ts
    │   └── [...nextauth]/
    │       └── route.ts
    ├── employees/
    │   ├── route.ts        # GET list, POST create
    │   └── [systemId]/
    │       └── route.ts    # GET, PUT, DELETE
    ├── customers/
    ├── products/
    ├── orders/
    ├── upload/
    │   └── route.ts
    └── shipping/
        └── ghtk/
            └── route.ts
```

---

## 3. PRISMA SCHEMA

### Core Models

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============ SYSTEM ============

model User {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: USR001
  email         String   @unique
  password      String
  role          UserRole @default(STAFF)
  isActive      Boolean  @default(true)
  
  employeeId    String?  @unique
  employee      Employee? @relation(fields: [employeeId], references: [systemId])
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("users")
}

enum UserRole {
  ADMIN
  MANAGER
  STAFF
}

// ============ HRM ============

model Employee {
  systemId        String   @id @default(uuid())
  id              String   @unique // Business ID: NV001
  
  // Personal info
  fullName        String
  email           String?
  phone           String?
  avatar          String?
  dateOfBirth     DateTime?
  gender          Gender?
  nationalId      String?
  
  // Employment
  departmentId    String?
  department      Department? @relation(fields: [departmentId], references: [systemId])
  jobTitleId      String?
  jobTitle        JobTitle? @relation(fields: [jobTitleId], references: [systemId])
  branchId        String?
  branch          Branch? @relation(fields: [branchId], references: [systemId])
  managerId       String?
  manager         Employee? @relation("EmployeeManager", fields: [managerId], references: [systemId])
  subordinates    Employee[] @relation("EmployeeManager")
  
  startDate       DateTime?
  endDate         DateTime?
  status          EmployeeStatus @default(ACTIVE)
  
  // Salary
  baseSalary      Decimal? @db.Decimal(15,2)
  
  // Relations
  user            User?
  attendance      AttendanceMonth[]
  leaves          Leave[]
  orders          Order[] @relation("OrderEmployee")
  tasks           Task[] @relation("TaskAssignee")
  
  // Audit
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  createdBy       String?
  updatedBy       String?
  
  @@map("employees")
}

enum Gender {
  MALE
  FEMALE
  OTHER
}

enum EmployeeStatus {
  ACTIVE
  INACTIVE
  TERMINATED
}

model Department {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: PB001
  name          String
  description   String?
  managerId     String?
  
  employees     Employee[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("departments")
}

model JobTitle {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: CV001
  name          String
  description   String?
  
  employees     Employee[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("job_titles")
}

model Branch {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: CN001
  name          String
  address       String?
  phone         String?
  isDefault     Boolean  @default(false)
  
  employees     Employee[]
  products      ProductStock[]
  orders        Order[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("branches")
}

// ============ ATTENDANCE ============

model AttendanceMonth {
  systemId        String   @id @default(uuid())
  id              String   @unique // Business ID: ATT-2025-11-001
  
  employeeId      String
  employee        Employee @relation(fields: [employeeId], references: [systemId])
  
  year            Int
  month           Int
  
  workDays        Float    @default(0)
  leaveDays       Float    @default(0)
  absentDays      Float    @default(0)
  lateArrivals    Int      @default(0)
  earlyDepartures Int      @default(0)
  otHours         Float    @default(0)
  
  isLocked        Boolean  @default(false)
  lockedAt        DateTime?
  
  dailyRecords    AttendanceDailyRecord[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([employeeId, year, month])
  @@map("attendance_months")
}

model AttendanceDailyRecord {
  systemId          String   @id @default(uuid())
  
  attendanceMonthId String
  attendanceMonth   AttendanceMonth @relation(fields: [attendanceMonthId], references: [systemId], onDelete: Cascade)
  
  date              DateTime
  day               Int
  
  status            AttendanceStatus @default(ABSENT)
  checkIn           String?
  checkOut          String?
  overtimeCheckIn   String?
  overtimeCheckOut  String?
  
  isLate            Boolean  @default(false)
  isEarlyDeparture  Boolean  @default(false)
  workHours         Float?
  otHours           Float?
  
  notes             String?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@unique([attendanceMonthId, day])
  @@map("attendance_daily_records")
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LEAVE
  HALF_DAY
  WEEKEND
  HOLIDAY
}

model Leave {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: NP001
  
  employeeId    String
  employee      Employee @relation(fields: [employeeId], references: [systemId])
  
  type          LeaveType
  startDate     DateTime
  endDate       DateTime
  totalDays     Float
  reason        String?
  status        LeaveStatus @default(PENDING)
  
  approvedBy    String?
  approvedAt    DateTime?
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("leaves")
}

enum LeaveType {
  ANNUAL
  SICK
  UNPAID
  MATERNITY
  OTHER
}

enum LeaveStatus {
  PENDING
  APPROVED
  REJECTED
  CANCELLED
}

// ============ SALES ============

model Customer {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: KH001
  
  name          String
  phone         String?
  email         String?
  address       String?
  customerGroup String?
  taxCode       String?
  
  // SLA
  totalOrders   Int      @default(0)
  totalSpent    Decimal  @default(0) @db.Decimal(15,2)
  totalDebt     Decimal  @default(0) @db.Decimal(15,2)
  
  orders        Order[]
  complaints    Complaint[]
  warranties    Warranty[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("customers")
}

model Product {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: SP001
  sku           String   @unique
  barcode       String?
  
  name          String
  description   String?
  
  categoryId    String?
  category      Category? @relation(fields: [categoryId], references: [systemId])
  brandId       String?
  brand         Brand? @relation(fields: [brandId], references: [systemId])
  
  // Pricing
  costPrice     Decimal  @default(0) @db.Decimal(15,2)
  sellPrice     Decimal  @default(0) @db.Decimal(15,2)
  
  // Inventory
  totalStock    Int      @default(0)
  minStock      Int      @default(0)
  
  // Images
  images        String[] // Array of image URLs
  
  // Status
  isActive      Boolean  @default(true)
  isTrashed     Boolean  @default(false)
  
  stocks        ProductStock[]
  orderItems    OrderItem[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("products")
}

model ProductStock {
  systemId      String   @id @default(uuid())
  
  productId     String
  product       Product  @relation(fields: [productId], references: [systemId])
  branchId      String
  branch        Branch   @relation(fields: [branchId], references: [systemId])
  
  quantity      Int      @default(0)
  
  updatedAt     DateTime @updatedAt
  
  @@unique([productId, branchId])
  @@map("product_stocks")
}

model Category {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: DM001
  name          String
  parentId      String?
  parent        Category? @relation("CategoryHierarchy", fields: [parentId], references: [systemId])
  children      Category[] @relation("CategoryHierarchy")
  
  products      Product[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("categories")
}

model Brand {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: TH001
  name          String
  logo          String?
  
  products      Product[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("brands")
}

model Order {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: DH001
  
  customerId    String?
  customer      Customer? @relation(fields: [customerId], references: [systemId])
  employeeId    String?
  employee      Employee? @relation("OrderEmployee", fields: [employeeId], references: [systemId])
  branchId      String?
  branch        Branch?  @relation(fields: [branchId], references: [systemId])
  
  orderDate     DateTime @default(now())
  status        OrderStatus @default(PENDING)
  
  // Amounts
  subtotal      Decimal  @default(0) @db.Decimal(15,2)
  discount      Decimal  @default(0) @db.Decimal(15,2)
  tax           Decimal  @default(0) @db.Decimal(15,2)
  shipping      Decimal  @default(0) @db.Decimal(15,2)
  total         Decimal  @default(0) @db.Decimal(15,2)
  paid          Decimal  @default(0) @db.Decimal(15,2)
  debt          Decimal  @default(0) @db.Decimal(15,2)
  
  notes         String?
  
  items         OrderItem[]
  payments      Payment[]
  returns       SalesReturn[]
  shipments     Shipment[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("orders")
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPING
  DELIVERED
  COMPLETED
  CANCELLED
  RETURNED
}

model OrderItem {
  systemId      String   @id @default(uuid())
  
  orderId       String
  order         Order    @relation(fields: [orderId], references: [systemId], onDelete: Cascade)
  productId     String
  product       Product  @relation(fields: [productId], references: [systemId])
  
  quantity      Int
  unitPrice     Decimal  @db.Decimal(15,2)
  discount      Decimal  @default(0) @db.Decimal(15,2)
  total         Decimal  @db.Decimal(15,2)
  
  @@map("order_items")
}

// ============ FINANCE ============

model Payment {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: PT001
  
  type          PaymentType // RECEIPT or PAYMENT
  
  orderId       String?
  order         Order?   @relation(fields: [orderId], references: [systemId])
  
  amount        Decimal  @db.Decimal(15,2)
  method        String   // CASH, TRANSFER, CARD
  notes         String?
  
  paymentDate   DateTime @default(now())
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("payments")
}

enum PaymentType {
  RECEIPT   // Phiếu thu
  PAYMENT   // Phiếu chi
}

// ============ OPERATIONS ============

model Task {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: CV001
  
  title         String
  description   String?
  
  assigneeId    String?
  assignee      Employee? @relation("TaskAssignee", fields: [assigneeId], references: [systemId])
  
  dueDate       DateTime?
  priority      TaskPriority @default(MEDIUM)
  status        TaskStatus @default(TODO)
  
  evidence      String[] // Array of file URLs
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  createdBy     String?
  
  @@map("tasks")
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  REVIEW
  DONE
  CANCELLED
}

model Warranty {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: BH001
  trackingCode  String   @unique
  
  customerId    String?
  customer      Customer? @relation(fields: [customerId], references: [systemId])
  
  productName   String
  serialNumber  String?
  issueDescription String?
  
  status        WarrantyStatus @default(PENDING)
  
  receivedDate  DateTime @default(now())
  completedDate DateTime?
  
  images        String[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("warranties")
}

enum WarrantyStatus {
  PENDING
  PROCESSING
  WAITING_PARTS
  COMPLETED
  RETURNED
  CANCELLED
}

model Complaint {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: KN001
  
  customerId    String?
  customer      Customer? @relation(fields: [customerId], references: [systemId])
  
  title         String
  description   String?
  
  status        ComplaintStatus @default(OPEN)
  priority      ComplaintPriority @default(MEDIUM)
  
  images        String[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  resolvedAt    DateTime?
  
  @@map("complaints")
}

enum ComplaintStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
}

enum ComplaintPriority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

// ============ FILES ============

model File {
  systemId      String   @id @default(uuid())
  
  entityType    String   // employee, product, customer, warranty, complaint, task
  entityId      String
  
  originalName  String
  filename      String
  filepath      String
  filesize      Int
  mimetype      String
  
  uploadedAt    DateTime @default(now())
  uploadedBy    String?
  
  @@index([entityType, entityId])
  @@map("files")
}

// Add more models: SalesReturn, Supplier, PurchaseOrder, StockTransfer, InventoryCheck, etc.
```

---

## 4. CHIẾN LƯỢC MIGRATION

### Phase 1: Setup Foundation (1 tuần)

```
Week 1:
├── Day 1-2: Setup Next.js project
│   ├── npx create-next-app@latest erp-nextjs --typescript --tailwind --app
│   ├── Copy shadcn components
│   ├── Setup Prisma + PostgreSQL (Docker local)
│   └── Basic layout structure
│
├── Day 3-4: Authentication
│   ├── NextAuth.js setup
│   ├── Login/Register pages
│   ├── Middleware auth guard
│   └── Session management
│
└── Day 5: API Routes foundation
    ├── /api/auth/[...nextauth]
    ├── /api/health
    └── Test Prisma connection
```

### Phase 2: Core Modules Migration (2 tuần)

```
Week 2-3:
├── Week 2: HRM + Settings
│   ├── Employees CRUD + API
│   ├── Departments, Job Titles
│   ├── Branches
│   └── Basic settings pages
│
└── Week 3: Sales Core
    ├── Customers CRUD + API
    ├── Products CRUD + API
    ├── Categories, Brands
    └── File upload migration
```

### Phase 3: Business Modules (2 tuần)

```
Week 4-5:
├── Week 4: Orders + Inventory
│   ├── Orders CRUD
│   ├── Order Items
│   ├── Stock management
│   └── Stock transfers
│
└── Week 5: Finance + Operations
    ├── Cashbook
    ├── Receipts/Payments
    ├── Tasks
    └── Warranties
```

### Phase 4: Reports + Polish (1 tuần)

```
Week 6:
├── Reports module
├── Dashboard
├── Mobile optimization
├── Performance tuning
└── Bug fixes
```

### Phase 5: Deployment (1 tuần)

```
Week 7:
├── VPS setup (DigitalOcean/Vultr/Contabo)
├── PostgreSQL production
├── Domain + SSL
├── CI/CD pipeline
└── Monitoring setup

Week 8 (Buffer):
├── Testing (Unit + E2E)
├── Bug fixes
├── Documentation
└── User training
```

---

## 5. MIGRATION CHECKLIST

### Pre-Migration
- [x] Backup localStorage data to JSON *(Skipped - using hrm2/features/*/data.ts mock data instead)*
- [ ] Document all current routes
- [x] List all Zustand stores and their structure *(45 stores identified)*
- [x] Export component dependencies *(Copied to erp-nextjs)*

### Phase 1 Checklist
- [x] Next.js 15 project created *(D:\erp-nextjs)*
- [x] TypeScript configured
- [x] Tailwind CSS working
- [x] shadcn/ui components copied *(182 files)*
- [x] Prisma schema created *(13 models)*
- [x] PostgreSQL connected *(Docker erp_db)*
- [x] Database seeded *(Mock data from hrm2)*
- [ ] NextAuth configured
- [ ] Basic auth working

### Phase 2 Checklist
- [ ] Employee API (CRUD)
- [ ] Customer API (CRUD)
- [ ] Product API (CRUD)
- [ ] File upload working
- [ ] React Query hooks created
- [ ] Data migration scripts ready

### Phase 3 Checklist
- [ ] Orders API (CRUD)
- [ ] Inventory APIs
- [ ] Finance APIs
- [ ] All business logic migrated

### Phase 4 Checklist
- [ ] All reports working
- [ ] Dashboard complete
- [ ] Mobile responsive
- [ ] Performance optimized

### Phase 5 Checklist
- [ ] VPS configured
- [ ] Database production ready
- [ ] SSL certificate
- [ ] Domain configured
- [ ] Monitoring active
- [ ] Backup scheduled

---

## 6. TECH STACK SAU MIGRATION

```json
{
  "framework": "Next.js 15",
  "language": "TypeScript 5.x",
  "styling": "Tailwind CSS 3.x",
  "ui": "shadcn/ui",
  "database": "PostgreSQL 16",
  "orm": "Prisma 5.x",
  "auth": "NextAuth.js 5.x",
  "state": {
    "server": "@tanstack/react-query 5.x",
    "client": "zustand 4.x (chỉ UI state)"
  },
  "forms": "react-hook-form + zod",
  "charts": "recharts",
  "tables": "@tanstack/react-table",
  "deployment": {
    "platform": "VPS (DigitalOcean/Vultr)",
    "runtime": "Node.js 20 LTS",
    "process": "PM2",
    "proxy": "Nginx",
    "ssl": "Let's Encrypt"
  }
}
```

---

## 7. VPS REQUIREMENTS

### Minimum Specs

| Resource | Requirement | Ghi chú |
|----------|-------------|---------|
| RAM | 2GB | 4GB recommended |
| CPU | 2 vCPU | |
| Storage | 50GB SSD | For DB + uploads |
| Bandwidth | 2TB/month | |
| OS | Ubuntu 22.04 LTS | |

### Estimated Cost

| Provider | Plan | Price/month |
|----------|------|-------------|
| DigitalOcean | Basic Droplet | $12-24 |
| Vultr | Cloud Compute | $12-24 |
| Linode | Shared CPU | $12-24 |

### Services to Install (Cách cũ - KHÔNG DÙNG)

~~Cài thủ công Node.js, PostgreSQL, Nginx...~~

### 🐳 DOCKER DEPLOYMENT (RECOMMENDED)

Chỉ cần cài Docker trên VPS:

```bash
# Cài Docker + Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

**Cấu trúc Docker:**

```
erp-nextjs/
├── Dockerfile              # Build Next.js app
├── docker-compose.yml      # Orchestrate all services
├── docker-compose.prod.yml # Production overrides
├── nginx/
│   └── nginx.conf          # Reverse proxy config
└── .env.production         # Production env vars
```

**Dockerfile:**

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**docker-compose.yml:**

```yaml
# docker-compose.yml
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:16-alpine
    container_name: erp_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER:-erp_user}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-erp_secure_123}
      POSTGRES_DB: ${DB_NAME:-erp_db}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-erp_user}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Next.js Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: erp_app
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql://${DB_USER:-erp_user}:${DB_PASSWORD:-erp_secure_123}@db:5432/${DB_NAME:-erp_db}
      NEXTAUTH_URL: ${NEXTAUTH_URL:-http://localhost:3000}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "3000:3000"

  # Nginx Reverse Proxy (Production)
  nginx:
    image: nginx:alpine
    container_name: erp_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./uploads:/var/www/uploads:ro
    depends_on:
      - app

  # Redis Cache (Optional)
  redis:
    image: redis:7-alpine
    container_name: erp_redis
    restart: unless-stopped
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

**nginx/nginx.conf:**

```nginx
events {
    worker_connections 1024;
}

http {
    upstream nextjs {
        server app:3000;
    }

    server {
        listen 80;
        server_name yourdomain.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;

        # Gzip
        gzip on;
        gzip_types text/plain text/css application/json application/javascript;

        # Static files (uploads)
        location /uploads {
            alias /var/www/uploads;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Next.js app
        location / {
            proxy_pass http://nextjs;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

**.env.production:**

```env
# Database
DB_USER=erp_user
DB_PASSWORD=your_secure_password_here
DB_NAME=erp_production

# Auth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_secret_key_here

# App
NODE_ENV=production
```

---

## 🚀 DEPLOY COMMANDS

### Lần đầu deploy:

```bash
# 1. SSH vào VPS
ssh root@your-vps-ip

# 2. Cài Docker
curl -fsSL https://get.docker.com | sh

# 3. Clone repo
git clone https://github.com/your-repo/erp-nextjs.git
cd erp-nextjs

# 4. Tạo .env.production
cp .env.example .env.production
nano .env.production  # Edit với values thật

# 5. Build và chạy
docker-compose up -d --build

# 6. Chạy migrations
docker-compose exec app npx prisma migrate deploy

# 7. Seed data (nếu cần)
docker-compose exec app npx prisma db seed
```

### Update code:

```bash
# Pull code mới
git pull

# Rebuild và restart (zero-downtime)
docker-compose up -d --build

# Chạy migrations (nếu có)
docker-compose exec app npx prisma migrate deploy
```

### Useful commands:

```bash
# Xem logs
docker-compose logs -f app

# Restart service
docker-compose restart app

# Vào container
docker-compose exec app sh

# Database backup
docker-compose exec db pg_dump -U erp_user erp_db > backup.sql

# Database restore
cat backup.sql | docker-compose exec -T db psql -U erp_user erp_db

# Stop all
docker-compose down

# Stop và xóa data (CẢNH BÁO!)
docker-compose down -v
```

### SSL với Let's Encrypt:

```bash
# Cài certbot
sudo apt install certbot

# Tạo SSL cert
sudo certbot certonly --standalone -d yourdomain.com

# Copy cert vào nginx folder
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./nginx/ssl/

# Restart nginx
docker-compose restart nginx

# Auto-renew (crontab)
0 0 1 * * certbot renew --quiet && docker-compose restart nginx
```

---

## 8. RISK ASSESSMENT

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data loss during migration | High | Backup all localStorage + test migration scripts |
| Breaking changes | Medium | Incremental migration, keep old app running parallel |
| Performance regression | Medium | Load testing, caching strategy |
| Learning curve | Low | Team already knows React, TypeScript, Tailwind |
| Timeline slip | Medium | Buffer time in each phase |

---

## 9. ROLLBACK PLAN

Nếu migration gặp vấn đề:

1. **Phase 1-2 issues**: Tiếp tục dùng Vite app, fix issues offline
2. **Phase 3-4 issues**: Partial rollback, run both apps parallel
3. **Production issues**: DNS switch back to old app (if deployed parallel)

---

## 10. SUCCESS METRICS

| Metric | Target | Hiện tại |
|--------|--------|----------|
| Page load time | < 2s | ~3s (SPA) |
| Time to Interactive | < 3s | ~4s |
| Lighthouse Score | > 90 | ~70 |
| API response time | < 200ms | N/A (localStorage) |
| Database queries | < 50ms | N/A |
| Uptime | 99.9% | N/A |

---

**Document created:** 23/11/2025  
**Last updated:** 19/12/2025  
**Status:** ✅ Approved - Ready for implementation  
**Next step:** Phase 1 - Setup Foundation
---

## 11. THIẾU SÓT TRONG PRISMA SCHEMA

### Models cần bổ sung thêm:

```prisma
// ============ PROCUREMENT ============

model Supplier {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: NCC001
  
  name          String
  phone         String?
  email         String?
  address       String?
  taxCode       String?
  contactPerson String?
  
  // SLA
  totalOrders   Int      @default(0)
  totalPurchased Decimal @default(0) @db.Decimal(15,2)
  totalDebt     Decimal  @default(0) @db.Decimal(15,2)
  
  purchaseOrders PurchaseOrder[]
  
  isActive      Boolean  @default(true)
  isTrashed     Boolean  @default(false)
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("suppliers")
}

model PurchaseOrder {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: MH001
  
  supplierId    String
  supplier      Supplier @relation(fields: [supplierId], references: [systemId])
  branchId      String?
  employeeId    String?
  
  orderDate     DateTime @default(now())
  expectedDate  DateTime?
  status        PurchaseOrderStatus @default(DRAFT)
  
  subtotal      Decimal  @default(0) @db.Decimal(15,2)
  discount      Decimal  @default(0) @db.Decimal(15,2)
  tax           Decimal  @default(0) @db.Decimal(15,2)
  total         Decimal  @default(0) @db.Decimal(15,2)
  paid          Decimal  @default(0) @db.Decimal(15,2)
  debt          Decimal  @default(0) @db.Decimal(15,2)
  
  notes         String?
  
  items         PurchaseOrderItem[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("purchase_orders")
}

enum PurchaseOrderStatus {
  DRAFT
  PENDING
  CONFIRMED
  RECEIVING
  COMPLETED
  CANCELLED
}

model PurchaseOrderItem {
  systemId      String   @id @default(uuid())
  
  purchaseOrderId String
  purchaseOrder PurchaseOrder @relation(fields: [purchaseOrderId], references: [systemId], onDelete: Cascade)
  productId     String
  
  quantity      Int
  receivedQty   Int      @default(0)
  unitPrice     Decimal  @db.Decimal(15,2)
  discount      Decimal  @default(0) @db.Decimal(15,2)
  total         Decimal  @db.Decimal(15,2)
  
  @@map("purchase_order_items")
}

// ============ INVENTORY ============

model StockLocation {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: VT001
  
  name          String
  branchId      String
  description   String?
  isDefault     Boolean  @default(false)
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("stock_locations")
}

model StockTransfer {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: CK001
  
  fromBranchId  String
  toBranchId    String
  employeeId    String?
  
  transferDate  DateTime @default(now())
  status        StockTransferStatus @default(DRAFT)
  
  notes         String?
  
  items         StockTransferItem[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("stock_transfers")
}

enum StockTransferStatus {
  DRAFT
  PENDING
  IN_TRANSIT
  COMPLETED
  CANCELLED
}

model StockTransferItem {
  systemId      String   @id @default(uuid())
  
  transferId    String
  transfer      StockTransfer @relation(fields: [transferId], references: [systemId], onDelete: Cascade)
  productId     String
  
  quantity      Int
  receivedQty   Int      @default(0)
  
  @@map("stock_transfer_items")
}

model InventoryCheck {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: KK001
  
  branchId      String
  employeeId    String?
  
  checkDate     DateTime @default(now())
  status        InventoryCheckStatus @default(DRAFT)
  
  notes         String?
  
  items         InventoryCheckItem[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("inventory_checks")
}

enum InventoryCheckStatus {
  DRAFT
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model InventoryCheckItem {
  systemId      String   @id @default(uuid())
  
  checkId       String
  check         InventoryCheck @relation(fields: [checkId], references: [systemId], onDelete: Cascade)
  productId     String
  
  systemQty     Int      // Số lượng theo hệ thống
  actualQty     Int      // Số lượng thực tế
  difference    Int      // Chênh lệch
  
  notes         String?
  
  @@map("inventory_check_items")
}

// ============ SALES RETURN ============

model SalesReturn {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: TH001
  
  orderId       String
  order         Order    @relation(fields: [orderId], references: [systemId])
  customerId    String?
  employeeId    String?
  branchId      String?
  
  returnDate    DateTime @default(now())
  status        SalesReturnStatus @default(PENDING)
  reason        String?
  
  subtotal      Decimal  @default(0) @db.Decimal(15,2)
  total         Decimal  @default(0) @db.Decimal(15,2)
  refunded      Decimal  @default(0) @db.Decimal(15,2)
  
  items         SalesReturnItem[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("sales_returns")
}

enum SalesReturnStatus {
  PENDING
  APPROVED
  COMPLETED
  REJECTED
}

model SalesReturnItem {
  systemId      String   @id @default(uuid())
  
  returnId      String
  return        SalesReturn @relation(fields: [returnId], references: [systemId], onDelete: Cascade)
  productId     String
  
  quantity      Int
  unitPrice     Decimal  @db.Decimal(15,2)
  total         Decimal  @db.Decimal(15,2)
  
  reason        String?
  
  @@map("sales_return_items")
}

// ============ SHIPMENT ============

model Shipment {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: VD001
  trackingCode  String?  @unique
  
  orderId       String
  order         Order    @relation(fields: [orderId], references: [systemId])
  
  carrier       String   // GHTK, GHN, etc.
  status        ShipmentStatus @default(PENDING)
  
  // Shipping info
  recipientName    String?
  recipientPhone   String?
  recipientAddress String?
  
  // Fees
  shippingFee   Decimal  @default(0) @db.Decimal(15,2)
  codAmount     Decimal  @default(0) @db.Decimal(15,2)
  
  // Dates
  createdAt     DateTime @default(now())
  pickedAt      DateTime?
  deliveredAt   DateTime?
  
  updatedAt     DateTime @updatedAt
  
  @@map("shipments")
}

enum ShipmentStatus {
  PENDING
  PICKED
  IN_TRANSIT
  DELIVERING
  DELIVERED
  RETURNED
  CANCELLED
}

// ============ CASHBOOK ============

model CashAccount {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: TK001
  
  name          String
  type          CashAccountType
  branchId      String?
  
  balance       Decimal  @default(0) @db.Decimal(15,2)
  
  isActive      Boolean  @default(true)
  
  transactions  CashTransaction[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("cash_accounts")
}

enum CashAccountType {
  CASH
  BANK
  WALLET
}

model CashTransaction {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: GD001
  
  accountId     String
  account       CashAccount @relation(fields: [accountId], references: [systemId])
  
  type          CashTransactionType
  amount        Decimal  @db.Decimal(15,2)
  
  // Reference
  referenceType String?  // order, receipt, payment, etc.
  referenceId   String?
  
  description   String?
  transactionDate DateTime @default(now())
  
  createdAt     DateTime @default(now())
  createdBy     String?
  
  @@map("cash_transactions")
}

enum CashTransactionType {
  INCOME
  EXPENSE
  TRANSFER_IN
  TRANSFER_OUT
}

// ============ PAYROLL ============

model Payroll {
  systemId      String   @id @default(uuid())
  id            String   @unique // Business ID: BL-2025-11
  
  year          Int
  month         Int
  
  status        PayrollStatus @default(DRAFT)
  
  totalEmployees Int     @default(0)
  totalGross    Decimal  @default(0) @db.Decimal(15,2)
  totalDeductions Decimal @default(0) @db.Decimal(15,2)
  totalNet      Decimal  @default(0) @db.Decimal(15,2)
  
  items         PayrollItem[]
  
  processedAt   DateTime?
  processedBy   String?
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@unique([year, month])
  @@map("payrolls")
}

enum PayrollStatus {
  DRAFT
  PROCESSING
  COMPLETED
  PAID
}

model PayrollItem {
  systemId      String   @id @default(uuid())
  
  payrollId     String
  payroll       Payroll  @relation(fields: [payrollId], references: [systemId], onDelete: Cascade)
  employeeId    String
  
  // Working
  workDays      Float    @default(0)
  otHours       Float    @default(0)
  leaveDays     Float    @default(0)
  
  // Earnings
  baseSalary    Decimal  @default(0) @db.Decimal(15,2)
  otPay         Decimal  @default(0) @db.Decimal(15,2)
  allowances    Decimal  @default(0) @db.Decimal(15,2)
  bonus         Decimal  @default(0) @db.Decimal(15,2)
  grossSalary   Decimal  @default(0) @db.Decimal(15,2)
  
  // Deductions
  socialInsurance Decimal @default(0) @db.Decimal(15,2)
  healthInsurance Decimal @default(0) @db.Decimal(15,2)
  tax           Decimal  @default(0) @db.Decimal(15,2)
  otherDeductions Decimal @default(0) @db.Decimal(15,2)
  totalDeductions Decimal @default(0) @db.Decimal(15,2)
  
  // Net
  netSalary     Decimal  @default(0) @db.Decimal(15,2)
  
  notes         String?
  
  @@map("payroll_items")
}

// ============ SETTINGS ============

model Setting {
  systemId      String   @id @default(uuid())
  
  key           String   @unique
  value         Json
  type          String   // string, number, boolean, json
  category      String   // general, appearance, invoice, etc.
  
  updatedAt     DateTime @updatedAt
  updatedBy     String?
  
  @@map("settings")
}

model IdCounter {
  systemId      String   @id @default(uuid())
  
  entityType    String   @unique // employee, customer, order, etc.
  prefix        String
  currentValue  Int      @default(0)
  padding       Int      @default(3)
  
  updatedAt     DateTime @updatedAt
  
  @@map("id_counters")
}

// ============ AUDIT LOG ============

model AuditLog {
  systemId      String   @id @default(uuid())
  
  entityType    String   // employee, order, product, etc.
  entityId      String
  action        String   // CREATE, UPDATE, DELETE
  
  userId        String?
  userName      String?
  
  oldData       Json?
  newData       Json?
  changes       Json?    // Diff between old and new
  
  ipAddress     String?
  userAgent     String?
  
  createdAt     DateTime @default(now())
  
  @@index([entityType, entityId])
  @@index([userId])
  @@index([createdAt])
  @@map("audit_logs")
}
```

---

## 12. DATA MIGRATION STRATEGY

### 12.1 Export Data từ localStorage

```typescript
// scripts/export-localstorage.ts
const STORES_TO_EXPORT = [
  'hrm-employees',
  'hrm-customers', 
  'hrm-products',
  'hrm-orders',
  'hrm-attendance',
  'hrm-leaves',
  // ... all stores
];

async function exportAllData() {
  const data: Record<string, any> = {};
  
  for (const key of STORES_TO_EXPORT) {
    const stored = localStorage.getItem(key);
    if (stored) {
      data[key] = JSON.parse(stored);
    }
  }
  
  // Download as JSON
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hrm-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
}
```

### 12.2 Import Script cho PostgreSQL

```typescript
// scripts/import-to-postgres.ts
import { PrismaClient } from '@prisma/client';
import data from './hrm-backup.json';

const prisma = new PrismaClient();

async function importData() {
  // 1. Import Settings first (no dependencies)
  console.log('Importing settings...');
  for (const branch of data['hrm-branches']?.state?.items || []) {
    await prisma.branch.upsert({
      where: { id: branch.id },
      create: {
        systemId: branch.systemId,
        id: branch.id,
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        isDefault: branch.isDefault,
      },
      update: {},
    });
  }
  
  // 2. Import Departments, JobTitles
  // ...
  
  // 3. Import Employees (depends on departments, branches)
  console.log('Importing employees...');
  for (const emp of data['hrm-employees']?.state?.items || []) {
    await prisma.employee.upsert({
      where: { id: emp.id },
      create: {
        systemId: emp.systemId,
        id: emp.id,
        fullName: emp.fullName,
        email: emp.email,
        phone: emp.phone,
        // ... map all fields
      },
      update: {},
    });
  }
  
  // 4. Import Customers
  // 5. Import Products
  // 6. Import Orders (depends on customers, products, employees)
  // 7. Import Attendance, Leaves
  // 8. Import Finance data
  
  console.log('Import completed!');
}

importData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### 12.3 Migration Order

```
1. Settings (branches, departments, job-titles, taxes, etc.)
2. Users (admin accounts)
3. Employees (depends on branches, departments)
4. Customers
5. Suppliers
6. Categories, Brands
7. Products (depends on categories, brands)
8. Stock (product-branch inventory)
9. Orders (depends on customers, employees, products)
10. Purchase Orders (depends on suppliers, products)
11. Attendance (depends on employees)
12. Leaves (depends on employees)
13. Payroll (depends on employees, attendance)
14. Cashbook, Payments, Receipts
15. Tasks, Warranties, Complaints
16. Audit Logs (optional - start fresh)
```

---

## 13. CI/CD PIPELINE

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/hrm-nextjs
            git pull origin main
            docker-compose up -d --build
            docker-compose exec -T app npx prisma migrate deploy
            echo "Deployed at $(date)"
```

### Secrets cần setup trong GitHub:
- `VPS_HOST`: IP của VPS
- `VPS_USER`: username SSH (root hoặc deploy user)
- `VPS_SSH_KEY`: Private SSH key

---

## 14. MONITORING & LOGGING

### 14.1 Health Check API

```typescript
// app/api/health/route.ts
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'ok',
        redis: 'ok', // if using
      }
    });
  } catch (error) {
    return Response.json({
      status: 'unhealthy',
      error: error.message,
    }, { status: 500 });
  }
}
```

### 14.2 Uptime Monitoring (Free options)

- **UptimeRobot**: Free 50 monitors
- **Better Uptime**: Free tier
- **Cronitor**: Free tier

### 14.3 Error Tracking

```typescript
// Sentry integration (optional)
// npm install @sentry/nextjs

// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
});
```

### 14.4 Docker Logs

```bash
# Xem logs realtime
docker-compose logs -f app

# Logs với timestamp
docker-compose logs -t app

# Logs của DB
docker-compose logs -f db

# Export logs
docker-compose logs --no-color app > app.log
```

---

## 15. BACKUP STRATEGY

### 15.1 Database Backup

```bash
# Manual backup
docker-compose exec db pg_dump -U erp_user erp_db > backup_$(date +%Y%m%d).sql

# Automated backup (crontab)
# Chạy mỗi ngày lúc 2:00 AM
0 2 * * * cd /var/www/erp-nextjs && docker-compose exec -T db pg_dump -U erp_user erp_db > /backups/db_$(date +\%Y\%m\%d).sql

# Backup với compression
docker-compose exec db pg_dump -U erp_user erp_db | gzip > backup_$(date +%Y%m%d).sql.gz
```

### 15.2 File Upload Backup

```bash
# Sync uploads to backup location
rsync -avz ./uploads/ /backups/uploads/

# Or to external storage (S3, etc.)
aws s3 sync ./uploads/ s3://your-bucket/erp-uploads/
```

### 15.3 Full Backup Script

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# Database
docker-compose exec -T db pg_dump -U erp_user erp_db | gzip > $BACKUP_DIR/database.sql.gz

# Uploads
tar -czf $BACKUP_DIR/uploads.tar.gz ./uploads/

# Keep last 7 days only
find /backups -type d -mtime +7 -exec rm -rf {} +

echo "Backup completed: $BACKUP_DIR"
```

---

## 16. SECURITY CHECKLIST

### Pre-deployment
- [ ] Change all default passwords
- [ ] Generate strong NEXTAUTH_SECRET (32+ chars)
- [ ] Setup firewall (UFW)
- [ ] Disable root SSH login
- [ ] Setup SSH key authentication
- [ ] Enable fail2ban

### Application
- [ ] HTTPS only (redirect HTTP → HTTPS)
- [ ] CORS configured properly
- [ ] Rate limiting on APIs
- [ ] Input validation (Zod)
- [ ] SQL injection protection (Prisma)
- [ ] XSS protection (React default)
- [ ] CSRF protection (NextAuth)

### Database
- [ ] Strong password
- [ ] No public access (localhost only)
- [ ] Regular backups
- [ ] Encrypted at rest (optional)

### Firewall Rules

```bash
# UFW setup
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 17. PERFORMANCE OPTIMIZATION

### Next.js

```javascript
// next.config.js
module.exports = {
  output: 'standalone', // For Docker
  
  images: {
    remotePatterns: [
      { hostname: 'localhost' },
      { hostname: 'yourdomain.com' },
    ],
  },
  
  // Enable experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};
```

### Database Indexes (đã có trong Prisma schema)

```prisma
// Thêm indexes cho queries phổ biến
@@index([createdAt])
@@index([status])
@@index([customerId])
@@index([employeeId])
```

### Caching Strategy

```typescript
// React Query defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

---

## 18. ENVIRONMENT VARIABLES

### Development (.env.local)

```env
# Database
DATABASE_URL="postgresql://erp_user:erp_dev_123@localhost:5432/erp_dev"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key-change-in-production"

# File Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="10485760"  # 10MB

# GHTK Shipping (if using)
GHTK_API_TOKEN="your_ghtk_token"
GHTK_API_URL="https://services.giaohangtietkiem.vn"

# Optional
NODE_ENV="development"
```

### Production (.env.production)

```env
# Database
DATABASE_URL="postgresql://erp_user:${DB_PASSWORD}@db:5432/erp_db"

# Auth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# File Upload
UPLOAD_DIR="/app/uploads"
MAX_FILE_SIZE="10485760"

# GHTK Shipping
GHTK_API_TOKEN="your_production_token"
GHTK_API_URL="https://services.giaohangtietkiem.vn"

# Monitoring (optional)
SENTRY_DSN="https://xxx@sentry.io/xxx"

# App
NODE_ENV="production"
```

### Generate NEXTAUTH_SECRET

```bash
# Linux/Mac
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 19. TESTING STRATEGY

### 19.1 Unit Tests (Vitest)

```typescript
// __tests__/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '@/lib/utils';

describe('formatCurrency', () => {
  it('should format VND correctly', () => {
    expect(formatCurrency(1000000)).toBe('1.000.000 ₫');
  });
});
```

### 19.2 API Tests

```typescript
// __tests__/api/employees.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '@/lib/prisma';

describe('/api/employees', () => {
  beforeAll(async () => {
    // Seed test data
    await prisma.employee.deleteMany({});
  });

  it('should create employee', async () => {
    const response = await fetch('/api/employees', {
      method: 'POST',
      body: JSON.stringify({ fullName: 'Test User', email: 'test@test.com' }),
    });
    expect(response.status).toBe(201);
  });
});
```

### 19.3 E2E Tests (Playwright)

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('should login successfully', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'admin@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

### 19.4 Test Scripts

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

## 20. ESTIMATED TOTAL EFFORT

| Phase | Duration | Tasks |
|-------|----------|-------|
| Phase 1: Foundation | 1 week | Next.js, Prisma, Auth |
| Phase 2: Core Modules | 2 weeks | Employees, Customers, Products |
| Phase 3: Business | 2 weeks | Orders, Inventory, Finance |
| Phase 4: Reports | 1 week | Reports, Dashboard |
| Phase 5: Deploy | 1 week | Docker, VPS, CI/CD |
| **Buffer** | 1 week | Bug fixes, testing |
| **Total** | **8 weeks** | |

### Timeline (Flexible - Start anytime)

| Phase | Week | Tasks |
|-------|------|-------|
| 1 | Week 1 | Setup Next.js, Prisma, Auth |
| 2 | Week 2-3 | HRM, Settings, Customers, Products |
| 3 | Week 4-5 | Orders, Inventory, Finance, Operations |
| 4 | Week 6 | Reports, Dashboard, Polish |
| 5 | Week 7 | Docker, VPS, CI/CD, Domain |
| Buffer | Week 8 | Testing, Bug fixes, Documentation |

### Team Recommendation
- 1 Full-stack developer: 8 weeks
- 2 Full-stack developers: 4-5 weeks

---

## 21. QUICK START GUIDE

### Bắt đầu nhanh (sau khi đọc plan)

```bash
# 1. Tạo project mới
npx create-next-app@latest erp-nextjs --typescript --tailwind --app --src-dir

# 2. Cài dependencies
cd erp-nextjs
npm install prisma @prisma/client @tanstack/react-query next-auth zod react-hook-form

# 3. Setup Prisma
npx prisma init

# 4. Copy Prisma schema từ plan này vào prisma/schema.prisma

# 5. Tạo database (Docker)
docker run --name erp_db -e POSTGRES_USER=erp_user -e POSTGRES_PASSWORD=erp_dev_123 -e POSTGRES_DB=erp_dev -p 5432:5432 -d postgres:16-alpine

# 6. Run migrations
npx prisma migrate dev --name init

# 7. Start dev server
npm run dev
```

### Folder Structure để copy

```
erp-nextjs/
├── app/                    # Next.js App Router
├── components/             # Copy từ hrm2/components
├── lib/                    # Copy utilities
├── prisma/                 # Database schema
├── public/                 # Static files
└── types/                  # TypeScript types
```

---

## 22. MULTI-TENANT CONSIDERATIONS (Future)

### Nếu cần multi-tenant sau này

```prisma
// Thêm tenantId vào mỗi model
model Tenant {
  systemId    String   @id @default(uuid())
  name        String
  domain      String?  @unique
  
  users       User[]
  employees   Employee[]
  customers   Customer[]
  // ... other models
  
  createdAt   DateTime @default(now())
  
  @@map("tenants")
}

// Mỗi model thêm tenantId
model Employee {
  // ... existing fields
  
  tenantId    String
  tenant      Tenant @relation(fields: [tenantId], references: [systemId])
  
  @@index([tenantId])
}
```

### Row Level Security (RLS)

```sql
-- Enable RLS on tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Policy for tenant isolation
CREATE POLICY tenant_isolation ON employees
  USING (tenant_id = current_setting('app.current_tenant')::uuid);
```

**Lưu ý:** Hiện tại plan này cho SINGLE TENANT. Multi-tenant sẽ cần refactor.

---

## 23. API RESPONSE STANDARDS

### Response Format

```typescript
// Success response
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Not authorized |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `INTERNAL_ERROR` | 500 | Server error |

### API Versioning

```
/api/v1/employees     # Current version
/api/v2/employees     # Future version (if breaking changes)
```

---

## 24. PRINT/EXPORT FEATURES

### Current Print Templates

Hệ thống hiện tại có các template in:
- Invoice (Hóa đơn bán hàng)
- Receipt (Phiếu thu)
- Payment (Phiếu chi)
- Warranty Card (Phiếu bảo hành)
- Barcode Labels (Nhãn mã vạch)
- Order Picking List (Phiếu lấy hàng)

### Migration Strategy

```typescript
// Print API
// app/api/print/[template]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { template: string } }
) {
  const { template } = params;
  const searchParams = new URL(request.url).searchParams;
  const id = searchParams.get('id');
  
  // Generate HTML/PDF based on template
  const html = await renderTemplate(template, id);
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}
```

### Export Features

```typescript
// Excel export using xlsx
import * as XLSX from 'xlsx';

export async function exportToExcel(data: any[], filename: string) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, `${filename}.xlsx`);
}
```

---

## 25. NOTIFICATION SYSTEM (Future)

### Database Schema

```prisma
model Notification {
  systemId    String   @id @default(uuid())
  
  userId      String
  user        User     @relation(fields: [userId], references: [systemId])
  
  type        NotificationType
  title       String
  message     String
  
  entityType  String?  // order, task, etc.
  entityId    String?
  
  isRead      Boolean  @default(false)
  readAt      DateTime?
  
  createdAt   DateTime @default(now())
  
  @@index([userId, isRead])
  @@map("notifications")
}

enum NotificationType {
  ORDER_CREATED
  ORDER_STATUS_CHANGED
  TASK_ASSIGNED
  TASK_DUE
  LOW_STOCK
  PAYMENT_RECEIVED
  SYSTEM
}
```

### Real-time Options

1. **Polling** (Simple): Fetch every 30s
2. **Server-Sent Events** (Medium): One-way real-time
3. **WebSocket** (Advanced): Two-way real-time (Socket.io)

### Implementation Priority

```
Phase 1: Database + API (store notifications)
Phase 2: UI (bell icon, dropdown)
Phase 3: Real-time (optional - SSE or WebSocket)
Phase 4: Push notifications (optional - Web Push API)
```

---

## 📋 SUMMARY CHECKLIST

### Before Starting Migration

- [ ] Backup tất cả localStorage data
- [ ] Document tất cả custom business logic
- [ ] List tất cả third-party integrations (GHTK, etc.)
- [ ] Prepare VPS or cloud account
- [ ] Setup domain (nếu có)

### Phase 1 Complete When

- [ ] Next.js 15 project running
- [ ] Prisma connected to PostgreSQL
- [ ] Authentication working
- [ ] Basic CRUD for 1 module (e.g., Employees)

### Phase 2-3 Complete When

- [ ] All core modules migrated
- [ ] File upload working
- [ ] All data migrated from localStorage

### Phase 4-5 Complete When

- [ ] Reports working
- [ ] Deployed to VPS
- [ ] SSL certificate active
- [ ] Monitoring enabled
- [ ] Backup scheduled

### Go-Live Checklist

- [ ] All features tested
- [ ] Data verified
- [ ] Performance acceptable
- [ ] Team trained
- [ ] Rollback plan ready
- [ ] Support process defined

---

**Document created:** 23/11/2025  
**Last updated:** 19/12/2025  
**Version:** 2.3  
**Status:** 🔄 Đang triển khai - Phase 1  
**Next step:** Phase 2 - CRUD APIs

---

## 📈 IMPLEMENTATION LOG

### 19/12/2025 - Phase 1 Started
| Time | Task | Status | Notes |
|------|------|--------|-------|
| 21:00 | 1.1 Create Next.js project | ✅ Done | D:\erp-nextjs created |
| 21:05 | 1.2 Setup Prisma + PostgreSQL | ✅ Done | Docker container erp_db running |
| 21:15 | 1.3 Create Prisma Schema | ✅ Done | 13 models: User, Employee, Department, JobTitle, Branch, Customer, Product, Category, Brand, Order, etc. |
| 19:30 | 1.4 Seed Database | ✅ Done | Mock data from hrm2/features/*/data.ts imported: 2 branches, 5 depts, 6 job titles, 3 employees, 3 users, 3 customers, 8 products |
| 19:35 | 1.5 Copy shadcn/ui components | ✅ Done | 182 files copied from hrm2/components |
| 19:40 | 1.6 Copy features folder | ✅ Done | 38 modules with types and business logic |