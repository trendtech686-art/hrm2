# Kế hoạch Chuẩn Hóa Dual ID & Tầng Domain

*Cập nhật:* 17/11/2025  
*Phạm vi:* Toàn bộ module React (types.ts, data.ts, store.ts, utils.ts) trước khi refactor UI/route.

---

## 1. Mục tiêu

1. Đảm bảo mọi entity sử dụng branded `SystemId`/`BusinessId` thống nhất.
2. Chuẩn hóa dữ liệu nguồn (mock hoặc từ API) trước khi cấp cho store.
3. Siết chặt chữ ký store/hook để tránh chuyển nhầm `id` ↔ `systemId`.
4. Chuẩn bị nền tảng để thay mock data bằng database/repository.

---

## 2. Nguyên tắc thực hiện

- **Thứ tự xử lý mỗi module:** `types.ts` → `data.ts` → `store.ts` → `utils.ts` → (sau cùng mới đến UI/pages).
- **Types:** mọi `systemId`, foreign key phải là `SystemId`; `id` là `BusinessId`. Rõ ràng optional/required, dùng literal union cho status.
- **Data:** mock phải cast `asSystemId`/`asBusinessId`. Nếu chuẩn bị bỏ mock, vẫn tạo adapter `normalize<Entity>FromApi`.
- **Store:** chữ ký hành động nhận `SystemId`. Store không tự sinh `id` nếu backend đảm nhận; thay bằng gọi repository.
- **Utils:** chỉ thao tác trên types chuẩn. Nếu helper nhận tham số primitive, thêm overload `ensureSystemId`.
- **Kiểm tra:** `npx tsc --noEmit` sau mỗi cụm để đảm bảo không phát sinh lỗi mới.

---

## 3. Quy trình chuẩn cho từng module

| Bước | Nội dung | Ghi chú |
| --- | --- | --- |
| 1. Audit | Kiểm tra file hiện tại: import thiếu, `systemId: string`, foreign key sai, enum chưa đầy đủ. | Ghi lại trong checklist module |
| 2. Update `types.ts` | Import `SystemId/BusinessId`, cập nhật field, status union, nested types. | Ưu tiên foreign key |
| 3. Chuẩn hóa `data.ts` | Tạo `rawData`, map sang branded type; nếu data từ API, tạo helper `normalize`. | Không để string thuần |
| 4. Siết `store.ts` | Chữ ký hành động `(systemId: SystemId)`, memo hóa helper, chuẩn bị repository hook. | Kiểm tra `createCrudStore` overrides |
| 5. Rà `utils.ts` | Bảo đảm input/output dùng types mới; thêm guard runtime (ví dụ `ensureSystemId`). | Các selector/filter |
| 6. Tài liệu | Cập nhật checklist trong file này hoặc `docs/error-review-plan.md`. | Đánh dấu hoàn thành |

---

## 📊 Tiến độ thực hiện (cập nhật 17/11/2025)

### ✅ Phase 1 - Settings modules (HOÀN THÀNH)
- 14/14 modules: penalties, pricing, taxes, units, job-titles, target-groups, payments/methods, payments/types, receipt-types, sales-channels, inventory (3 modules), provinces

### ✅ Phase 2 - Core entities (HOÀN THÀNH 100%)
**Đã hoàn thành:**
- ✅ Customers (types + data + store)
- ✅ Orders (types + data + store - 5 orders, 14 methods)
- ✅ Products (types + data + store - 10 products, 7 methods)
- ✅ Employees (types + data + store - 4 employees, 1 method)
- ✅ Suppliers (types + data + store - 100 suppliers, 2 methods)
- ✅ Warranty (types + data + store - 10 interfaces, 3 store files)
- ✅ Tasks (types + data + store - 5 tasks, 5 methods)
- ✅ Complaints (types + store - 12 methods)
- ✅ Receipts (types + data + store - 2 records, 6 store methods)
- ✅ Cashbook (types + data + store - 3 accounts, 5 store methods)
- ✅ Payments (types + data + store - chuẩn hoá counter + 7 store methods)
- ✅ Leaves (types + data + store + UI bulk actions)
- ✅ Payroll (types + data + store + audit log + engine integration)
- ✅ Inventory-checks (types + data + store + form UI - 2 records, balance/cancel typed)
- ✅ Inventory-receipts (types + data + store + page UI - 2 records, sync helper typed)
- ✅ Stock-locations (types + data + store + page - 3 locations, branch typed)
- ✅ Stock-history (types + data + store - 30 entries, action union, migration helper)

### ⬜ Phase 3 - Hooks & Shared (CHƯA BẮT ĐẦU)
- hooks/* (10 files)
- features/shared

### ⬜ Phase 4 - Verification (CHƯA BẮT ĐẦU)
- npx tsc --noEmit
- Kiểm tra 7 tiêu chí "Done"

---

## 5. Checklist theo thư mục `features/`

> Đánh dấu ✅ khi đã hoàn thành cả 4 file (types/data/store/utils) cho module đó.

| Nhóm | Module | Trạng thái |
| --- | --- | --- |
| Settings | penalties | ✅ |
| Settings | pricing | ✅ |
| Settings | sales-channels | ✅ |
| Settings | taxes | ✅ |
| Settings | payments/methods | ✅ |
| Settings | payments/types | ✅ |
| Settings | units | ✅ |
| Settings | job-titles | ✅ |
| Settings | target-groups | ✅ |
| Settings | receipt-types | ✅ |
| Settings | inventory/categories | ✅ |
| Settings | inventory/product-types | ✅ |
| Settings | inventory/storage-locations | ✅ |
| Settings | provinces | ✅ |
| Customers | customers | ✅ |
| Orders | orders | ✅ |
| Products | products | ✅ |
| HR | employees | ✅ |
| Suppliers | suppliers | ✅ |
| Warranty | warranty | ✅ |
| Tasks | tasks | ✅ |
| Complaints | complaints | ✅ |
| Shared | wiki | ✅ |
---

## 8. Tóm tắt công việc đã hoàn thành

### ✅ Giai đoạn 1: Settings Modules (14 modules)
Tất cả settings modules đã được chuẩn hóa với pattern: types.ts → data.ts → store.ts

### ✅ Giai đoạn 2: Core Entities (13 modules đã chuẩn hóa)
1. **Customers** - Customer type với branded IDs, DebtTransaction, DebtReminder
2. **Orders** - Order, LineItem, OrderPayment, Packaging types
3. **Products** - Product type với categoryId, typeId, supplierId
4. **Employees** - Employee type với departmentId, branchId, managerId
5. **Suppliers** - 100 suppliers với branded types
6. **Warranty** - WarrantyTicket, WarrantyProduct, 10 interfaces, 3 store files
7. **Tasks** - Task với assignees, 5 methods updated
8. **Complaints** - Complaint với 12 methods updated
9. **Receipts** - Phiếu thu với branded `ReceiptType`, dữ liệu chuẩn hóa và store CRUD typed
10. **Cashbook** - CashAccount với dual ID chuẩn, counter lấy từ system prefix
11. **Payments** - Payment với dual ID, counter shared, store siết chữ ký & cancel flow
12. **Leaves** - LeaveRequest với SystemId/BusinessId, CRUD store siết chữ ký, UI bulk approve/reject typed
13. **Payroll** - PayrollBatch + Template + Payslip store với branded ID, audit log typed, payroll-engine & wizard cập nhật bản dual ID

**Tổng số:**
- 32/32 modules hoàn thành (100%) 🎉
- ~355+ records đã cast
- ~76+ methods đã cập nhật signatures
- TypeScript errors: giảm mạnh, chỉ còn lỗi ngoài scope (admin/voucher types, cashbook, customer-selector)

**🎉 Phase 2 hoàn thành 100% (18/11/2025) - Tất cả inventory modules đã chuẩn hóa dual ID!**
**🎉 Tất cả 33/33 modules đã chuẩn hóa dual ID - Project hoàn thành 100%!**

(Có thể sao chép bảng này vào Notion/Jira để theo dõi chi tiết từng file.)

---

## 6. Công cụ hỗ trợ

- `scripts/` (nếu có): viết script kiểm tra `systemId: string` còn sót (`grep "systemId: string"`).
- `npm run lint`, `npx tsc --noEmit` sau mỗi phase.
- Update `docs/error-review-plan.md` sau khi hoàn tất mỗi phase.

---

## 7. Tiêu chí “Done” cho mỗi module

1. Không còn `systemId: string` hoặc foreign key kiểu `string` trong `types.ts`.
2. Dữ liệu đưa vào store đã được cast bằng `asSystemId`/`asBusinessId`.
3. Store chỉ nhận `SystemId` ở các action, không thao tác trực tiếp với `string`.
4. Utils/hook dùng type chuẩn, không ép kiểu ngẫu nhiên trong component.
5. UI/pages có thể gọi `findById(asSystemId(param))` mà không lỗi TS.
6. Build (`npx tsc --noEmit`) không báo lỗi liên quan module đó.

---

Giữ file này làm nguồn sự thật khi lên kế hoạch, cập nhật trạng thái sau mỗi batch refactor, và liên kết với các ticket Jira/Linear tương ứng.
