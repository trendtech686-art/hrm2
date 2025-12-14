# Rà soát module Leaves (29/11/2025)

## 1. Kiến trúc & hiện trạng
- **Zustand + localStorage cho toàn bộ đơn nghỉ**: `features/leaves/store.ts` khởi tạo `createCrudStore` với `persistKey: "hrm-leaves"`, seed từ `data.ts`. Toàn bộ CRUD/approval/bulk action đều chạy trong trình duyệt, không có API hay backend nên multi-user không đồng bộ, refresh mất dữ liệu.
- **Đồng bộ Attendance/Employee thuần FE**: khi trạng thái chuyển sang "Đã duyệt", store gọi trực tiếp `leaveAttendanceSync` và `leaveQuotaSync` để chỉnh `useAttendanceStore` và `useEmployeeStore`. Việc ghi chéo state không có transaction, không ghi log/audit và chỉ có tác dụng trên máy đang mở.
- **Form/dialog nội tuyến**: `LeavesPage` chứa luôn `LeaveForm` trong `Dialog`, xử lý create/update ngay tại danh sách. Không có route riêng, không upload đính kèm dù loại phép có thể yêu cầu. Business ID được tự sinh bằng `ensureBusinessId` dựa trên mã nhân viên.
- **Validation chỉ ở Zod FE**: `leave-form-schema.ts` kiểm tra độ dài lý do, range ngày (<= 30 ngày trước), nhưng hoàn toàn chạy client; người dùng có thể bỏ qua dễ dàng trong DevTools.
- **Thiếu workflow/phân quyền**: bất kỳ người dùng nào truy cập trang đều có thể tạo/duyệt/từ chối vì không có RBAC. Không có log hoạt động, lịch sử phê duyệt, thông báo email/Slack, hay integration với Payroll để trừ lương.

## 2. Đối chiếu checklist
| Hạng mục | Trạng thái | Ghi chú |
| --- | --- | --- |
| Types & Validation | ⚠️ Một phần | `types.ts` và `leave-form-schema.ts` có định nghĩa cơ bản nhưng chỉ dùng tại FE, thiếu schema chung với backend, không cover quota/attachment. |
| UI/UX | ⚠️ Một phần | Danh sách có filter, bulk action, dialog tạo nhanh; tuy nhiên file ~350 dòng, không có loading/error states thực, không hỗ trợ mobile form tách biệt. |
| Performance | ⚠️ Một phần | Dữ liệu nhỏ nên OK, nhưng mọi filter/sort/search (Fuse.js) và column state đều trên client; không thể scale khi có hàng nghìn đơn hoặc nhiều năm dữ liệu. |
| Database Ready | ❌ | Chưa có bảng `leave_requests`, `leave_types`, `leave_quota_logs`, `leave_attachments`. Quota hiện lưu trực tiếp trong `useEmployeeStore`. |
| API Ready | ❌ | Không có route `/api/leaves`, không có webhook/approval API, không có endpoint đồng bộ Attendance/Payroll. |
| Liên kết module | ⚠️ Thiếu | Kết nối Attendance/Employees diễn ra bằng cách import thẳng store → không transaction, không event, không làm việc khi triển khai nhiều user. Không có liên kết tới Payroll để tính lương. |

## 3. Logic & liên kết đáng chú ý
1. **Đồng bộ Attendance** (`leave-sync-service.ts`): Thu thập ngày làm việc dựa trên `settings.workingDays`, rồi sửa trực tiếp daily record của Attendance, gắn `notes` dạng `[LEAVE:systemId]`. Khi cập nhật/hủy đơn, FE phải mở Attendance trước để dữ liệu tồn tại; vắng backend nên dễ lệch giữa các user.
2. **Cập nhật quota nhân viên** (`leave-quota-service.ts`): Lấy cấu hình phép năm, thâm niên từ `useEmployeeSettingsStore`, tính quota và điều chỉnh các field (`leaveTaken`, `annualLeaveBalance`, …) ngay trong `useEmployeeStore`. Không có log chi tiết hay bảng lịch sử, không hỗ trợ giai đoạn khóa sổ.
3. **Form xử lý fallback leave type** (`leave-form.tsx`): Nếu Settings chưa cấu hình, form tự tạo danh sách fallback (Phép năm, Nghỉ ốm…). Điều này khiến dữ liệu không thống nhất và khó migrate sang schema chính thức.
4. **Bulk approve/reject không giới hạn** (`page.tsx`): Người dùng chọn nhiều dòng rồi đổi `status`. Không có bước xác nhận, không có kiểm tra quota/đụng độ với ca làm, không ghi log người duyệt.
5. **Không có quản lý minh chứng**: Dù `leaveTypeRequiresAttachment` tồn tại, form không cho upload file hay liên kết tới tài liệu. Trạng thái "Đã duyệt" không đảm bảo nhân viên đã nộp giấy tờ.

## 4. Rủi ro & issue chính
| Mức độ | Mô tả | Bằng chứng |
| --- | --- | --- |
| 🔴 Cao | Module chỉ là state `localStorage`; triển khai thật sẽ mất dữ liệu khi đổi trình duyệt, không hỗ trợ nhiều người dùng đồng thời. | `features/leaves/store.ts` (persist `hrm-leaves`), `data.ts` seed giả lập |
| 🔴 Cao | Đồng bộ Attendance/Employee diễn ra hoàn toàn ở FE, không transaction → hai người thao tác cùng lúc sẽ gây lệch quota, attendance không thống nhất. | `leave-sync-service.ts`, `leave-quota-service.ts` import trực tiếp `useAttendanceStore` & `useEmployeeStore` |
| 🟠 Trung bình | Không có workflow/phân quyền: bất kỳ user nào cũng có thể tạo, duyệt, hủy; không lưu lịch sử phê duyệt hay lý do từ chối → thiếu audit. | `LeavesPage` bulk action `handleBulkApprove/Reject`, `LeaveDetailPage` không hiển thị lịch sử |
| 🟠 Trung bình | Không có attachment/upload dù loại phép có thể yêu cầu minh chứng → vi phạm quy trình nhân sự. | `LeaveForm` chỉ hiển thị message, không upload field |
| 🟡 Thấp | Form chỉ cho tạo đơn trong vòng 30 ngày quá khứ, không hỗ trợ nghỉ bù/quá khứ sâu hơn → không đáp ứng nghiệp vụ nhiều doanh nghiệp. | `leave-form-schema.ts` refine startDate >= today-30 |

## 5. Đề xuất nâng cấp
1. **Thiết kế schema & Prisma**: Các bảng chính `leave_requests`, `leave_types`, `leave_status_history`, `leave_attachments`, `leave_quota_snapshots`, `leave_balance_transactions`. Chuẩn hóa dual-ID, audit fields, index theo `employee_id`, `status`, `start_date`.
2. **API & workflow service**: Dựng Route Handler `/api/leaves` (list/filter/pagination/export), `/api/leaves/{id}/approve`, `/reject`, `/attachments`. Workflow cần hỗ trợ đa cấp (line manager → HR) với audit log, comment khi từ chối và webhook/notification.
3. **Quota engine server-side**: Tách logic tính phép năm, seniority bonus, rolling quota vào service chạy trong backend (có transaction). Mỗi lần duyệt đơn phải ghi `leave_balance_transactions` và emit event cho Payroll.
4. **Attendance integration đúng chuẩn**: Thay vì sửa trực tiếp store, phát event ("LeaveApproved") cho Attendance service để block ngày làm, sync với Timesheet chính. Hỗ trợ half-day, overtime offset, holiday calendar.
5. **Attachment & chứng từ**: Bổ sung upload (S3/Supabase) với metadata, enforce `requiresAttachment` trước khi cho phép duyệt. Cho phép manager xem ảnh/file trong detail page.
6. **UI refactor & React Query**: Tách `LeavesPage`, `LeaveFormPage`, `LeaveDetailPage` thành route riêng, dùng React Query gọi API, thêm skeleton/error state thực. Giữ Zustand cho filter/view state.
7. **Thông báo & tự phục vụ**: Gửi email/Slack khi có đơn mới, khi bị từ chối; hiển thị lịch nghỉ trên Calendar, tự động sync vào nhân viên (Employee Self-Service portal). Hỗ trợ import từ máy chấm công/log OT để đề xuất nghỉ bù.

## 6. Việc cần làm ngay
- **Đóng module khỏi dữ liệu thật và backup localStorage** (`hrm-leaves`) để tránh mất dấu đơn đã nhập.
- **Soạn đặc tả schema + workflow** (các trạng thái, vai trò, SLA duyệt) rồi thống nhất với đội Attendance/Payroll để chuẩn bị tích hợp.
- **Thiết kế dịch vụ quota**: xác định công thức tính phép năm, carry-over, seniority bonus và viết tài liệu API giữa Leaves ↔ Employees ↔ Payroll.
- **Chuẩn bị kế hoạch migration**: chuyển dữ liệu mock (Nếu cần) sang bảng mới, map leave type fallback về master data từ Settings trước khi go-live.
