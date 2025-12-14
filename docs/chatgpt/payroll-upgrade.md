# Rà soát module Payroll (29/11/2025)

## 1. Kiến trúc & hiện trạng
- **State quản trị batch/payroll templates thuần FE**: `features/payroll/payroll-batch-store.ts` và `features/payroll/payroll-template-store.ts` dùng Zustand + `localStorage` (`hrm-payroll-batch-storage`, `hrm-payroll-template-store`). Mọi batch, payslip, audit log hay template biến mất khi đổi thiết bị và không đồng bộ đa người dùng.
- **Chạy lương bằng wizard 3 bước nhưng không kết nối backend**: `run-page.tsx` đọc employees, leaves, attendance, settings trực tiếp từ các store cục bộ; logic khóa tháng, kiểm tra đơn nghỉ hay snapshot chỉ dựa trên dữ liệu đã mở trong trình duyệt.
- **Tính lương toàn bộ ở client**: `lib/payroll-engine.ts` thu thập snapshot chấm công thông qua `attendanceSnapshotService` (cũng đọc từ localStorage) và execute công thức bằng `new Function`. Không có sandbox, không lưu version công thức, không có rounding chuẩn.
- **Chi tiết batch vẫn là client app**: `detail-page.tsx` render tất cả summary, table, audit log và xuất CSV trên trình duyệt. Việc chuyển trạng thái `draft → reviewed → locked` chỉ gọi `usePayrollBatchStore.updateBatchStatus` và khi khóa chỉ gọi `useAttendanceStore.lockMonth` (cùng localStorage), không có API, không có chữ ký số hay cơ chế mở khóa được kiểm soát.
- **Template phụ thuộc Employee Settings**: `payroll-template-store.ts` đọc danh sách `salaryComponents` từ `useEmployeeSettingsStore`; nếu chưa có dữ liệu settings thì template cũng trống. Việc sync component ID xảy ra trong FE, không enforce schema DB.
- **Seed/mocks phục vụ demo**: `features/payroll/__mocks__/seed.ts` có thể reset toàn bộ store, seed attendance và tạo batch demo. Code này có thể bị dùng nhầm ở môi trường thật và xóa sạch dữ liệu người dùng.
- **Kiểm thử hạn chế**: chỉ có `run-page.test.tsx` kiểm tra render wizard, không cover business flow, permission hay payroll engine.

## 2. Đối chiếu checklist
| Hạng mục | Trạng thái | Ghi chú |
| --- | --- | --- |
| Types & Validation | ⚠️ Một phần | `lib/payroll-types.ts` mô tả Batch/Payslip/Template nhưng không có schema runtime, không validate input từ wizard/import, không enforce dual-ID duy nhất giữa người dùng. |
| UI/UX | ⚠️ Một phần | Wizard 3 bước và detail page khá đầy đủ nhưng mọi thao tác blocking đều chỉ hiển thị Alert; không có loading/error thực, thiếu phân quyền và mobile. |
| Performance | ⚠️ Một phần | Tính toán toàn bộ payslip tại client, CSV export tạo blob lớn trên trình duyệt; khi >200 nhân viên sẽ treo tab. Không có pagination hoặc lazy load ở `detail-page.tsx`. |
| Database Ready | ❌ | Chưa có bảng `payroll_batches`, `payslips`, `payroll_templates`, `payroll_components`, `payroll_audit_logs`, `payroll_period_locks`. Không có migration, không có mapping tới Prisma/PostgreSQL. |
| API Ready | ❌ | Không có service `/api/payroll/*`. `payrollEngine` và `updateBatchStatus` chỉ chạy trong browser; không thể tích hợp với kế toán, ngân hàng, hoặc SSO. |
| Liên kết module | ⚠️ Thiếu | Payroll đọc Attendance/Leaves/Employee Settings qua store cục bộ; locking attendance khi khóa payroll chỉ toggle local flag, không notify các module khác hoặc backend. |

## 3. Luồng & logic đáng chú ý
1. **Tạo batch và payslip local** (`payroll-batch-store.ts`): `createBatchWithResults` gọi `createBatch`, sau đó `addPayslips` để push `Payslip` vào state và tính `totalGross/totalNet`. Dual-ID sinh từ `generateSystemId` và `findNextAvailableBusinessId` nhưng không kiểm tra trùng với dữ liệu đã sync từ server.
2. **Khóa batch đồng thời khóa chấm công** (`updateBatchStatus`): khi status `locked`, code thu `referenceAttendanceMonthKeys` và gọi `useAttendanceStore.lockMonth`. Vì Attendance store cũng là localStorage nên user khác vẫn có thể mở khóa hoặc sửa timesheet.
3. **Payroll engine và công thức** (`lib/payroll-engine.ts`): engine build variable map từ Attendance snapshot, sau đó `evaluateFormula` dùng `new Function` để thực thi chuỗi `[LUONG_CO_BAN] * 0.2`. Không sanitize ngoài regex ký tự, dễ bị chèn mã độc nếu ai đó sửa localStorage hoặc trong tương lai nhập công thức từ backend.
4. **Snapshot attendance không đảm bảo** (`lib/attendance-snapshot-service.ts`): snapshot chỉ đọc từ `useAttendanceStore.attendanceData`. Nếu user chưa mở Attendance page để load dữ liệu, payroll engine coi như không có snapshot và thêm warning, nhưng vẫn cho phép tạo batch.
5. **CSV export và audit log** (`detail-page.tsx`): Export department report/payslip list hoàn toàn client-side, sau đó gọi `usePayrollBatchStore.logAction` để thêm `auditLogs`. Không có checksum, không lưu file server-side.
6. **Seed script phá dữ liệu** (`__mocks__/seed.ts`): option `resetExisting` gọi trực tiếp `usePayrollBatchStore.setState` để xóa batches/payslips/auditLogs và `attendanceStore.saveAttendanceData(monthKey, [])`. Nếu nhập script vào production bundle sẽ nguy hiểm.

## 4. Rủi ro & issue chính
| Mức độ | Mô tả | Bằng chứng |
| --- | --- | --- |
| 🔴 Cao | **Payroll chỉ sống trong localStorage** → mất dữ liệu khi đổi máy, không thể làm việc đa người dùng, không có backup/audit thật. | `persist` trong `payroll-batch-store.ts`, `payroll-template-store.ts` |
| 🔴 Cao | **Khóa kỳ công/lương không thực sự khóa**: status và lock month chỉ đổi flag FE, không bảo vệ payroll sau khi chi tiền, không log người duyệt. | `updateBatchStatus` gọi `useAttendanceStore.lockMonth` (cũng là local) |
| 🔴 Cao | **Thực thi công thức bằng `new Function` trên client**: mọi công thức có thể chạy JS tùy ý trong browser, mở cửa cho RCE/xss khi dữ liệu đồng bộ từ backend trong tương lai. | `evaluateFormula` trong `lib/payroll-engine.ts` |
| 🟠 Trung bình | **Không có chuẩn dữ liệu payslip**: totals tính bằng `reduce` không kiểm soát rounding/đơn vị, contributions áp dụng tỷ lệ cứng trong FE. Khi backend thật khác logic sẽ lệch số. | `buildTotals` trong `lib/payroll-engine.ts` |
| 🟠 Trung bình | **Seed script có thể xóa sạch dữ liệu thật** nếu chạy ở môi trường người dùng (vì gọi thẳng `resetStores`). Không có guard. | `features/payroll/__mocks__/seed.ts` |
| 🟠 Trung bình | **Audit log giả lập**: `auditLogs` lưu cùng localStorage với batch nên có thể bị sửa/xóa, không tuân SOC/ISO yêu cầu traceability. | `payroll-batch-store.ts` |
| 🟡 Thấp | **Thiếu test/business validation**: chỉ có 1 test render UI, không cover payroll engine, locking, hay navigation. | `__tests__/run-page.test.tsx` |

## 5. Đề xuất nâng cấp
1. **Thiết kế schema & service layer chuẩn**: tạo bảng `payroll_batches`, `payslips`, `payroll_templates`, `payroll_components`, `payroll_audit_logs`, `payroll_period_locks`. Dùng dual-ID (systemId/businessId), lưu actor/timezone, liên kết `employees`, `departments`, `attendance_snapshot` (immutable JSON).
2. **Chuyển toàn bộ state sang backend**: thay Zustand persist bằng React Query + API (`GET /payroll/batches`, `POST /payroll/run`, `PATCH /payroll/:id/status`, `POST /payroll/templates`). Stores FE chỉ giữ filter/UI state.
3. **Payroll engine server-side**: viết service tính lương trên server (Node/Go) với sandbox formula (VD: `expr-eval`, `mathjs` với whitelist) hoặc DSL an toàn. Kết quả được lưu DB, FE chỉ đọc. Cho phép attach audit snapshot attendance.
4. **Chuẩn hóa quy trình khóa**: Status chuyển đổi cần API yêu cầu quyền HR + OTP/chữ ký số. Khi khóa payroll phải tạo record `attendance_month_locks` server-side, chặn mọi chỉnh sửa timesheet và leaves trong kỳ tương ứng. Log actions vào `payroll_audit_logs` không thể chỉnh sửa.
5. **Tách wizard/chi tiết thành các hook nhỏ + loading state thật**: refactor `run-page.tsx` (700+ dòng) thành hooks/service (fetch employees/leaves paginated, search server), hiển thị trạng thái khi chờ API. Detail page cần pagination/virtualization cho bảng payslip.
6. **Bảo vệ seed/mocks**: di chuyển `__mocks__/seed.ts` ra khỏi bundle prod hoặc bao bằng flag `if (import.meta.env.DEV)`. Viết script seed backend thay vì chỉnh localStorage.
7. **Testing & monitoring**: thêm unit test cho payroll engine, e2e cho flow run → review → lock, test formula injection, test permission. Thiết lập logging/tracing khi export hoặc thay đổi trạng thái.

## 6. Việc cần làm ngay
- **Đóng băng sử dụng module Payroll hiện tại** cho dữ liệu thật; thông báo người dùng export ra ngoài trước khi refactor.
- **Phê duyệt thiết kế dữ liệu/payroll service** (schema, API, quy trình khóa) cùng đội Kế toán/HR để triển khai backend song song.
- **Ưu tiên loại bỏ `new Function`**: chuyển tạm sang thư viện expression an toàn hoặc disable nhập công thức tùy chỉnh cho tới khi backend xử lý.
- **Tạo backlog migrate**: import dữ liệu Attendance/Leaves thật, triển khai snapshot service ở server, sau đó mới bật lại wizard chạy lương.
- **Tách seed script khỏi sản phẩm** và cung cấp công cụ seed thông qua backend CLI để QA dùng an toàn.
