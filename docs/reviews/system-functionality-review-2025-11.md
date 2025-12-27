# HRM2 – Báo cáo rà soát chức năng & liên kết (11/2025)

## 1. Phạm vi & phương pháp
- Lệnh xác nhận build: `npm run typecheck:strict` (23/11/2025) → xanh, không cảnh báo mới.
- Tài liệu tham chiếu chính: `docs/DEVELOPMENT-GUIDELINES-V2.md`, `docs/ID-GOVERNANCE.md`, `docs/integrated-hr-review.md`, `docs/payroll-roadmap.md`, `docs/payroll-operations-guide.md`, `docs/employee-feature-review.md`, `docs/employee-logic-review.md`, `docs/custom-fields-implementation.md`, `docs/task-evidence-approval-system.md`, `docs/complaint-detail-refactor-plan.md`, `docs/warranty-shared-types-guide.md`, `docs/router-breadcrumb-system-guide.md`.
- Mã nguồn đối chiếu: toàn bộ thư mục `features/*`, `components/*`, `contexts/*`, các store Zustand và hạ tầng router/breadcrumb.

## 2. Tình trạng tuân thủ guideline toàn hệ thống
- **Dual ID:** Các store chính dùng `systemId` cho khoá và URL, `id` để hiển thị; danh sách prefix cập nhật tại `docs/ID-GOVERNANCE.md`. Cần tiếp tục rà `features/employees` (nút hành động còn thiếu `h-9` và breadcrumb chưa đồng nhất theo `employee-feature-review.md`).
- **UI chuẩn shadcn + Tailwind:** Đa số module mới (Payroll, Tasks, Leaves, Attendance) đã đồng nhất chiều cao control, icon Lucide, text tiếng Việt. Những khu vực legacy (Customers/Sales) cần audit bổ sung vì chưa có báo cáo chi tiết gần đây.
- **Router/Breadcrumb:** 72 page import trực tiếp, 87 route định nghĩa trong `lib/route-definitions.tsx`, breadcrumb auto theo `lib/breadcrumb-system.ts` (xem `docs/router-breadcrumb-system-guide.md`).
- **Testing & CI:** Quy trình 4 bước (`npm run lint`, `npx tsx scripts/verify-branded-ids.ts --skip-json`, `npx tsc --noEmit`, `npm run test`) đã được đóng gói trong guideline; hiện repo chỉ còn nhu cầu chạy thủ công vì chưa có script `typecheck` gốc.

## 3. Ma trận chức năng theo domain

### 3.1 Nhân sự & vận hành nội bộ
| Module | Chức năng hiện có | Liên kết & logic | Ghi chú UI/Guideline | Sẵn sàng Next.js & DB |
| --- | --- | --- | --- | --- |
| **Employees** (`features/employees/*`) | CRUD nhân viên, tab thông tin cá nhân/lương/tài liệu, trash, bulk actions | Dùng `useEmployeeStore`, `useEmployeeCompStore`; tab Lương hiển thị snapshot payroll & cấu hình ca | Một số nút thiếu `h-9`, breadcrumb còn hardcode (xem `docs/employee-feature-review.md`), validation lệch schema (`docs/employee-logic-review.md`) | Stores đã persist qua `createCrudStore`; cần chuẩn hóa schema để map sang Prisma/Drizzle |
| **Employee Settings** (`features/employees/settings/*`) | Quản lý ca làm, thành phần lương, hạn mức phép, default payroll profile | Phát ID tự động, selectors (`getShiftBySystemId`, `getLeaveTypes`) được Payroll & Leaves tiêu thụ | UI mới tuân thủ chuẩn; cần thêm cảnh báo khi thiếu `systemId` ở dữ liệu seed cũ | Dễ chuyển sang DB vì đã tách store cấu hình riêng |
| **Leaves** (`features/leaves/*`) | Xin nghỉ, duyệt, quota, đồng bộ Setting | `leaveAttendanceSync` + `leaveQuotaSync` cập nhật Attendance + `Employee.leaveTaken` (xem `docs/integrated-hr-review.md`) | Form đọc Setting, hiển thị metadata paid/unpaid; UI đã theo guideline | Logic đã module hóa, chỉ cần thay layer persist & API |
| **Attendance** (`features/attendance/*`) | Lưới chấm công, import/export Excel, dialog chỉnh sửa, khoá tháng | Khóa tháng liên kết Payroll; dialog kiểm tra đơn nghỉ trước khi sửa | UI responsive, badge lỗi đúng chuẩn; cần test dark mode khi chuyển Next.js routing | Snapshot service (`attendanceSnapshotService`) tách sẵn → dễ gắn API |
| **Payroll** (`features/payroll/*`) | List/run/detail/template, engine tính lương, audit log, export CSV | Liên thông Attendance, Leaves, Employee Settings, lock tháng khi batch lock (xem `docs/payroll-roadmap.md`, `docs/payroll-operations-guide.md`) | Wizard, detail page, AlertDialog đều đạt guideline (badge dưới title, button `h-9`) | Engine + stores thuần TypeScript, tách logics ⇒ chỉ cần map store sang service layer |
| **Duty schedule/KPI/Penalties** | Lên lịch trực, KPI, penalty detail | Liên kết Employees qua `systemId` (ID config `DUTY`, `KPI`, `PENALTY`) | Chưa có review mới; cần audit UI trước khi migrate | Schema đơn giản, có thể chuyển cùng Employees |
| **Tasks & Approvals** (`features/tasks/*`) | Kanban, detail, `/my-tasks` checklist, evidence upload, approval dialog, history (xem `docs/task-evidence-approval-system.md`) | Store ghi `approvalHistory`, `completionEvidence`; activity log dùng cho audit | UI dùng nhiều dialog/badge chuẩn; convert ảnh Base64 cần giám sát dung lượng | Khi có DB, nên chuyển evidence sang object storage thay vì localStorage |

### 3.2 Khách hàng & bán hàng
| Module | Chức năng hiện có | Liên kết & logic | Ghi chú UI/Guideline | Sẵn sàng Next.js & DB |
| --- | --- | --- | --- | --- |
| **Customers** (`features/customers/*`) | Danh sách, chi tiết, form, phân loại | Liên kết Orders, Complaints qua `customerSystemId` | Legacy UI cần rà soát `h-9`, breadcrumb; chưa có báo cáo mới | Store cần chuẩn hóa audit metadata trước khi đẩy DB |
| **Products** (`features/products/*`) | CRUD sản phẩm, variants, kho tham chiếu | Dùng `productSystemId` ở orders, inventory | Kiểm tra lại color picker (đã fix `components/ui/color-picker.tsx`) | Sẵn sàng sau khi xác nhận toàn bộ FK dùng `systemId` |
| **Orders & Sales Returns** | Đơn hàng, trả hàng, forms, detail | Cross-link payments, shipments, complaints | UI theo router guide, nhưng cần audit button height | Schema phức tạp; ưu tiên mapping order/payments đầu tiên khi có DB |
| **Dashboard & Reports (Sales)** | Cards, KPIs, báo cáo doanh thu | Đọc aggregated data từ stores | UI theo shadcn; logic mock → cần service layer khi gắn DB | Cần chuẩn bị selectors thuần để dùng API |
| **Packaging / Shipments / Other targets** | Quản lý đóng gói, vận chuyển, chỉ tiêu | Liên kết orders & inventory; sẵn `systemId` (DVVC, VC, MT) | Chưa có doc mới; check UI theo guideline | Schema sẵn, DB mapping straightforward |

### 3.3 Cung ứng & kho
| Module | Chức năng hiện có | Liên kết & logic | Ghi chú UI/Guideline | Sẵn sàng Next.js & DB |
| --- | --- | --- | --- | --- |
| **Suppliers** (`features/suppliers/*`) | CRUD nhà cung cấp, detail, form | Dùng trong purchase orders/inventory receipts | Cần kiểm tra form height + breadcrumb | Dual ID `NCC`/`SUPPLIER`; sẵn cho DB |
| **Purchase Orders & Returns** | Danh sách, detail, tạo mới | Liên kết Inventory Receipts/Stock - all `systemId` | UI theo router; verify guidelines | DB mapping: ensure line items tách bảng |
| **Inventory Receipts / Checks / Stock history** | Nhập kho, kiểm kê, log | Liên kết products + stock locations | UI phức tạp (data grid) → review dark mode responsive | Schema sẵn, convert to DB tables |
| **Stock locations / Shipping partners** | Settings cho kho/đối tác | Tiêu thụ bởi receipts, shipments | UI mới, theo guideline | Dễ migrate do data nhỏ |

### 3.4 Tài chính & kế toán
| Module | Chức năng | Liên kết | Ghi chú UI | Readiness |
| --- | --- | --- | --- | --- |
| **Receipts/Payments** (`features/receipts`, `features/payments`) | Phiếu thu/chi, form, detail | Liên kết cashbook, orders, warranty tickets | Cần xác nhận alert/dialog dùng shadcn | Schema phức tạp do linking; cần id mapping table |
| **Cashbook & Reconciliation** | Sổ quỹ, đối chiếu | Đọc từ receipts/payments, bank accounts | UI card + table; review button height | Bổ sung audit log trước khi DB |
| **Pricing & Payment settings** | Thiết lập giá, phương thức thanh toán | Cung cấp metadata cho Sales & Finance forms | Theo guideline | Light data, migrate early |
| **Reports (Finance)** | Tổng hợp doanh thu, tồn quỹ | Đọc store aggregated data | Ensure consistent typography | Khi có DB, thay logic aggregate bằng API |

### 3.5 Dịch vụ sau bán, bảo hành, khiếu nại
| Module | Chức năng | Liên kết | Ghi chú UI | Readiness |
| --- | --- | --- | --- | --- |
| **Complaints** (`features/complaints/*`) | Chi tiết xử lý khiếu nại, timeline, voucher/stock actions | Liên kết orders, warranty, inventory adjustments | File detail 2.5k dòng cần tách theo `docs/complaint-detail-refactor-plan.md` để đảm bảo maintainable & Next.js RSC friendly | Refactor handlers & components trước khi migrate |
| **Warranty** (`features/warranty/*`) | Ticket, thanh toán bảo hành, dialog voucher | Shared types chuẩn hóa theo `docs/warranty-shared-types-guide.md` | UI card/dialog dùng barrel types; cần review dialog `className="h-9"` | Schema sẵn; ensure store re-export cho API |
| **Tasks & Custom Fields** | Evidence workflow + hệ thống custom field (xem `docs/custom-fields-implementation.md`) | Custom field definitions (`FIELD` prefix) dùng chung cho tasks hiện tại, tương lai cho entity khác | UI theo chuẩn, validation tiếng Việt | Khi có DB, tạo bảng `custom_field_definitions` + `custom_field_values`; evidence sang object storage |
| **Audit-log, penalties, duty schedule** | Theo dõi vi phạm, nhật ký | Liên kết Employees & tasks | UI status unknown; plan audit | Light data, DB ready |

### 3.6 Settings, shared & nền tảng
| Thành phần | Vai trò | Tình trạng |
| --- | --- | --- |
| **Global Settings** (`features/settings/*`) | Appearance, store info, payment settings, sales config, import/export history | Tuân thủ guideline, page header actions memoized |
| **Auth** (`features/auth`, `components/protected-route.tsx`, `components/login-form.tsx`) | Form đăng nhập, bảo vệ route | Sử dụng context + local store, text tiếng Việt |
| **Contexts** (`contexts/*`) | Page header, modal, breakpoint, auth | Hoạt động ổn định; Next.js cần thay bằng server/store bridging |
| **Components/shared/UI** (`components/ui/*`, `components/shared/*`) | shadcn derivatives, data-table responsive, color picker (đã fix) | Tuân thủ guideline, export sẵn |
| **Router/Breadcrumb** | Quản lý 87 routes, breadcrumb auto, no lazy load | Sẵn sàng mapping sang Next.js route segments; documentation rõ ràng |

## 4. Đánh giá liên kết nghiệp vụ & luồng dữ liệu
- Chuỗi **Employees → Leaves → Attendance → Payroll** đã hoàn chỉnh (xem `docs/integrated-hr-review.md`). Leaves đồng bộ attendance/quota, Payroll chặn chạy khi snapshot chưa khóa.
- **Employee Settings** làm nguồn sự thật cho shift, leave type, salary component nên mọi module chỉ cần đọc selectors thay vì embed literal.
- **Tasks** bổ sung approval/evidence, sẵn sàng liên kết sang Complaints, Warranty hoặc Projects nhờ `customFields` linh hoạt.
- **Complaints/Warranty** chia sẻ voucher dialogs và inventory adjustments; cần refactor để giảm rủi ro khi gắn API đa bước.
- **Router** và `usePageHeader` tạo trải nghiệm thống nhất; khi chuyển Next.js cần tái hiện `breadcrumb-system` hoặc tận dụng metadata server component.

## 5. Mức độ tuân thủ UI/UX (so với `docs/DEVELOPMENT-GUIDELINES-V2.md`)
- **Đạt tiêu chuẩn:** Payroll, Leaves, Attendance, Task approvals, Custom field UI, Settings pages, Warranty dialogs.
- **Cần cải thiện:** Employees (button height, breadcrumb, validation mismatch), các module legacy (Customers, Orders, Finance forms) chưa có bằng chứng cập nhật → cần audit `className="h-9"`, text tiếng Việt, badge position.
- **Thành phần dùng chung:** `components/ui/color-picker.tsx` đã được sửa logic parse (tránh `undefined`), cần propagate tới mọi form dùng color hex.

## 6. Ưu tiên trước khi chuyển Next.js + Database thật
1. **Hoàn tất cleanup Employees module** (height, breadcrumb, validation schema) để tránh mang nợ kỹ thuật sang kiến trúc mới.
2. **Refactor Complaints detail** theo kế hoạch trong `docs/complaint-detail-refactor-plan.md` giúp tách logic/handlers trước khi chia nhỏ route Next.js.
3. **Chuẩn hóa schema store**: đảm bảo tất cả entity trong mock store có `createdAt/createdBy/updatedAt`, `systemId` và `id` hợp lệ theo `docs/ID-GOVERNANCE.md` → thuận lợi khi map sang Prisma/Drizzle.
4. **Tách persistence layer** *(đã triển khai 23/11)*: bổ sung thư mục `repositories/*` (interface chung + adapter in-memory) và expose `useEmployeeStore.persistence` để mọi mutation Employees đều chảy qua service. Các store còn lại sẽ lần lượt chuyển sang layer mới trước khi gắn API thật.
5. **Chuẩn bị kế hoạch routing Next.js** *(đã có draft 23/11, xem `docs/nextjs-routing-plan.md`)*: phân nhóm segment `(hrm)`, `(sales)`, `(procurement)`, `(finance)`, `(operations)`, `(settings)`, `(reports)`, `(public)`; định tuyến metadata/breadcrumb qua `generateMetadata` + segment layout; giữ `PageHeaderProvider` cho client override.
6. **Đánh giá storage lớn (Tasks evidence, attachments)**: quyết định chiến lược upload (S3/Blob) trước khi gắn backend thật.
7. **Thiết lập script CI**: gom các lệnh lint/verify-id/tsc/test thành `npm run ci:local` để nhất quán trước khi bật pipeline mới.

## 7. Ghi chú hành động nhanh
- Gắn checklist UI (`docs/DEVELOPMENT-GUIDELINES-V2.md` §6) vào PR template để tránh tái diễn lỗi `h-9`.
- Khi thêm entity mới, luôn cập nhật `docs/ID-GOVERNANCE.md` để tài liệu này đồng bộ với code và tránh collision prefix.
- Lưu log hoặc kết quả `seedPayrollDemoData()` kèm QA evidence trong `docs/payroll-operations-guide.md` mỗi lần regression test payroll.
- Đính kèm `--check-metadata` khi chạy `npx tsx scripts/verify-branded-ids.ts --skip-json` để cảnh báo seed thiếu `createdAt/By`.
- Kết quả mới nhất (24/11, sau khi bổ sung metadata cho toàn bộ Settings, Warranty và Wiki + tinh chỉnh script nhận diện helper): `npx tsx scripts/verify-branded-ids.ts --skip-json --check-metadata` đã **0 lỗi**. Đợt 23/11 trước đó vẫn còn 55 file (Inventory, Leaves, Orders, Settings) cần xử lý và đã được khép lại trong lần kiểm tra này.

## 8. TODO ngắn hạn (Tuần 48/2025)
| # | Hạng mục | Nội dung | Liên quan | Trạng thái |
| --- | --- | --- | --- | --- |
| 1 | Dọn Employees module | Áp dụng `className="h-9"` cho header actions, chuẩn hóa breadcrumb và đồng bộ `employeeFormSchema` với `types.ts`. | `features/employees/*`, `docs/employee-feature-review.md`, `docs/employee-logic-review.md` | Chưa làm |
| 2 | Refactor Complaints detail | Tách handlers/components theo `docs/complaint-detail-refactor-plan.md` để giảm 2.5k dòng trước khi migrate Next.js. | `features/complaints/*` | Chưa làm |
| 3 | Chuẩn hóa schema store | `createCrudStore` tự chuẩn hóa seed (`createdAt/By`, `updatedAt/By`, `deletedAt`) và bổ sung flag `--check-metadata` cho `scripts/verify-branded-ids.ts` để quét thiếu sót. Đợt 23/11 đã bổ sung Attendance, Employees, Cashbook và Payment settings → số file thiếu metadata giảm còn 55 (Inventory, Leaves, Orders, Settings). Đợt 24/11 tiếp tục dọn Settings/Warranty/Wiki và xác nhận 0 vi phạm. | `lib/store-factory.ts`, `scripts/verify-branded-ids.ts` | Đã hoàn thành (23/11, rerun 24/11 sạch lỗi) |
| 4 | Adapter persistence | Đã tạo `repositories/types.ts` + `repositories/in-memory-repository.ts`, expose `useEmployeeStore.persistence`/`employeeRepository` và chuyển Employee form sang gọi repository async. | Toàn bộ stores, kế hoạch Next.js | Hoàn thành (23/11) |
| 5 | Kế hoạch routing Next.js | Đã lập draft segment `(hrm)/(sales)/(procurement)/(finance)/(operations)/(settings)/(reports)/(public)`, xác định metadata/breadcrumb chuyển sang Next.js (`docs/nextjs-routing-plan.md`). | `docs/nextjs-routing-plan.md`, `lib/route-definitions.tsx` | Hoàn thành (23/11) |
| 6 | Chiến lược lưu evidence | Chốt dùng VPS (giống Employees) với thư mục `uploads/permanent/*` và API server chung cho TipTap comment, Task evidence, Complaint comments; Warranty attachments sẽ bám pipeline này khi gắn backend thật. | `features/tasks/*`, `features/warranty/*` | Hoàn thành (23/11) |
| 7 | Script `ci:local` | Gom `npm run lint`, `npx tsx scripts/verify-branded-ids.ts --skip-json`, `npx tsc --noEmit`, `npm run test` để chuẩn hóa trước pipeline mới. | `package.json`, CI workflow | Chưa làm |

---
**Trạng thái tổng:** Hệ thống đã bao phủ đầy đủ module HRM, bán hàng, cung ứng, tài chính, dịch vụ; các luồng quan trọng (Employees ↔ Leaves ↔ Attendance ↔ Payroll, Tasks evidence approval, Warranty voucher) đã tuân thủ Dual ID và guideline UI. Việc migrate lên Next.js + database thật khả thi sau khi xử lý backlog UI/validation ở Employees và tách logic Complaints.
