# Rà soát module Attendance (29/11/2025)

## 1. Kiến trúc & hiện trạng
- **Zustand + localStorage cho toàn bộ timesheet**: `features/attendance/store.ts` lưu `attendanceData` và `lockedMonths` với `persistKey: "hrm-attendance-storage"`. Mọi thao tác (import, edit, bulk update, lock/unlock) chỉ ảnh hưởng tới state trên trình duyệt hiện tại; không có API, không đồng bộ đa người dùng.
- **Dữ liệu được seed giả lập**: nếu tháng chưa có dữ liệu, `page.tsx` gọi `generateMockAttendance` để điền sẵn giờ vào/ra theo `settings.workStartTime`/`workEndTime`. Vì vậy số liệu thực tế (máy chấm công, app mobile) hoàn toàn không tồn tại.
- **UI đơn trang khổng lồ (~600 dòng)**: `AttendancePage` gộp picker tháng, bộ lọc, bảng responsive, import/export Excel, bulk edit, thống kê, dialog chỉnh sửa từng cell. Không có phân tách component hay route riêng, khó test và khó chuyển sang React Query.
- **Lock tháng chỉ là flag FE**: `lockMonth/toggleLock` chỉ đánh dấu trong localStorage. Người khác mở tab khác vẫn chỉnh sửa được cùng tháng, không có cơ chế closing period chính thức hay chữ ký số.
- **Tích hợp Leaves/Settings thiếu backend**: `replayApprovedLeavesForMonth` duyệt qua `useLeaveStore` rồi gọi `leaveAttendanceSync.apply` để đánh dấu ngày nghỉ trực tiếp trên Attendance store. Logic này chỉ chạy trên máy hiện tại, lệ thuộc vào việc load Leave store trước và không ghi log/audit.
- **Import/Export thủ công**: Import dùng `xlsx`, chuyển serial giờ sang text, rồi ghi đè từng cell. Export tạo workbook phức tạp ngay trên FE; thao tác nặng dễ treo trình duyệt khi dữ liệu lớn.

## 2. Đối chiếu checklist
| Hạng mục | Trạng thái | Ghi chú |
| --- | --- | --- |
| Types & Validation | ⚠️ Một phần | `types.ts` mô tả DailyRecord và summary, nhưng không có schema chung với backend, không validate input từ import/bulk edit. |
| UI/UX | ⚠️ Một phần | Có bảng responsive, bulk edit, dashboard; tuy nhiên file quá dài, không có loading/error states thật, mobile khó dùng. |
| Performance | ⚠️ Một phần | Dữ liệu giữ toàn bộ tháng trong memory, search dùng Fuse, export tạo workbook lớn tại client. Không phù hợp khi có >500 nhân viên. |
| Database Ready | ❌ | Không có bảng `attendance_logs`, `attendance_summary`, `attendance_lock`, `device_readings`. Thông tin ca làm lấy từ Settings nhưng không lưu trong DB. |
| API Ready | ❌ | Không có route `/api/attendance`, không webhook từ máy chấm công, không API lock kỳ lương. |
| Liên kết module | ⚠️ Thiếu | Attendance chỉ biết Employees/Settings/Leaves qua store cục bộ; không có event bus hay transaction, Payroll không thể đọc dữ liệu chuẩn. |

## 3. Logic & liên kết đáng chú ý
1. **Seed dữ liệu giả lập** (`generateMockAttendance`, `AttendancePage`): mỗi tháng tự tạo bản ghi "present" theo giờ chuẩn. Khi import/bulk edit sẽ ghi đè; nếu người dùng khác không import, họ vẫn thấy dữ liệu giả tưởng → số liệu không thống nhất.
2. **Replay đơn nghỉ** (`replayApprovedLeavesForMonth`): khi mở tháng mới, FE quét toàn bộ Leave status "Đã duyệt" và áp dụng `leaveAttendanceSync`. Nếu người dùng đổi tháng/vào lại, logic có thể áp dụng trùng, hoặc bỏ sót nếu Leave store chưa load.
3. **Bulk edit & selection mode**: `cellSelection` lưu bằng `employeeSystemId-day` trong state page; không có giới hạn quyền, không track người chỉnh. Khi lưu bulk, code tính summary hai lần (state và local copy) nhưng không đồng bộ chính xác nếu state thay đổi giữa chừng.
4. **Import Excel**: `handleConfirmImport` chuyển dữ liệu nhập thành `importedData` rồi reset row thành `absent/weekend` trước khi set record. Không có validation ca làm, không kiểm tra overlap, không map employee bằng ID server → dễ lệch khi Excel chứa mã sai.
5. **Lock tháng không ràng buộc**: `lockedMonths` chỉ là boolean dictionary; `handleQuickFill`, `handleBulkSave`, `AttendanceEditDialog` chỉ check `isLocked` trong page. Người dùng khác có thể bỏ qua bằng DevTools, không có cơ chế audit/log hay chữ ký.

## 4. Rủi ro & issue chính
| Mức độ | Mô tả | Bằng chứng |
| --- | --- | --- |
| 🔴 Cao | Toàn bộ chấm công chỉ sống trong localStorage; khi đổi thiết bị hoặc nhiều người cùng thao tác sẽ tạo dữ liệu khác nhau, không thể tính lương thật. | `features/attendance/store.ts`, `page.tsx` load/save từ `localStorage` |
| 🔴 Cao | Lock tháng và chữ ký kỳ công chỉ là flag client, không bảo vệ khỏi chỉnh sửa sau khi khóa, không audit. | `lockedMonths` state trong store, không có backend |
| 🔴 Cao | Không tích hợp máy chấm công/GPS/app mobile → dữ liệu "present" được giả lập, không có bằng chứng check-in/out, sai lệch nghiêm trọng khi triển khai thực tế. | `generateMockAttendance`, không có API nhập log |
| 🟠 Trung bình | Đồng bộ với Leaves diễn ra ở FE; nếu user không mở Attendance page sẽ không cập nhật leave vào timesheet, Payroll sẽ đọc sai. | `replayApprovedLeavesForMonth`, `leaveAttendanceSync.apply` |
| 🟠 Trung bình | Import Excel ghi đè cả tháng mà không kiểm tra file, không log người nhập, dễ gây mất dữ liệu; không có rollback/history. | `handleConfirmImport` trong `page.tsx` |
| 🟡 Thấp | File `page.tsx` >600 dòng, khó bảo trì, thiếu test; mọi hook logic nằm chung một file. | `features/attendance/page.tsx` |

## 5. Đề xuất nâng cấp
1. **Thiết kế schema chuẩn**: Bảng `attendance_logs` (raw check-in/out, nguồn thiết bị), `attendance_daily_summary`, `attendance_month_lock`, `attendance_devices`, `attendance_shift_assignments`. Lưu dual-ID, timezone, nguồn dữ liệu, audit fields.
2. **Service & API layer**: Route `/api/attendance/logs`, `/summaries`, `/locks`, `/imports`. Import nên chạy server-side (validate file, preview, transaction). Lock tháng phải yêu cầu quyền HR, lưu chữ ký số và ghi log.
3. **Tích hợp thiết bị & mobile**: Kết nối máy chấm công (SDK/webhook), app mobile GPS/QR, camera AI… Lưu nguồn (device/mobile/manual) để audit. FE chỉ hiển thị dữ liệu đã xử lý từ backend.
4. **Workflow đồng bộ Leaves/Payroll**: Khi Leave được duyệt, backend bắn event cập nhật attendance + payroll; không phụ thuộc vào FE. Attendance service phải tự đọc `leave_requests` và update summary.
5. **UI tách module, dùng React Query**: Chia trang thành: Bảng theo tháng, Chi tiết nhân viên, Dialog import, Dashboard. State bảng (filter/selection) dùng Zustand, còn dữ liệu dùng React Query + pagination server. Hạn chế xlsx logic ở FE, chuyển sang API export.
6. **Audit & phân quyền**: Mọi chỉnh sửa thủ công phải thông qua API có comment + lý do, lưu `attendance_adjustments`. Cho phép so sánh log gốc vs chỉnh sửa, undo, notify quản lý.
7. **Hiệu năng & trải nghiệm**: Áp dụng virtualization server-side, lazy load cột ngày, summary card độc lập. Bổ sung mobile view (check-in/out, lịch), widget realtime.

## 6. Việc cần làm ngay
- **Ngưng nhập liệu thật trên module Attendance** và backup `localStorage` (`hrm-attendance-storage`).
- **Soạn đặc tả schema + API** cho Attendance (logs, summary, lock, import) và thống nhất với đội Thiết bị/Payroll/Leaves.
- **Xác định nguồn dữ liệu check-in** (máy chấm công, app mobile) và lên kế hoạch tích hợp trước khi refactor FE.
- **Chuẩn bị quy trình lock kỳ** (vai trò phê duyệt, audit log, rollback) để backend triển khai song song với Payroll.
