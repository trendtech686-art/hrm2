# Rà soát & Đánh giá Tích hợp Hệ thống HRM

## 1. Tổng quan
Hệ thống HRM hiện tại bao gồm các module chính: **Nhân viên (Employees)**, **Nghỉ phép (Leaves)**, **Chấm công (Attendance)**, **Lương (Payroll)** và **Cài đặt (Settings)**. Việc tích hợp các module này quyết định tính chính xác của dòng dữ liệu từ lúc nhân viên xin nghỉ cho đến lúc trả lương cuối cùng.

## 2. Đánh giá chi tiết

### ✅ Điểm mạnh (Đã hoạt động tốt)

1.  **Luồng dữ liệu Nhân viên (Employees -> All)**
    *   Dữ liệu nhân viên (`systemId`, `id`) được sử dụng nhất quán ở Leaves, Attendance, Payroll; tất cả truy cập qua `EmployeeStore` nên khó xảy ra sai lệch khóa ngoại.
    *   Các trang như `/employees`, `/payroll/run` và `/attendance` đều đọc đúng hồ sơ nhân viên cho cả desktop/mobile view.

2.  **Tích hợp Chấm công -> Lương (Attendance -> Payroll)**
    *   `payroll-engine.ts` gọi `attendanceSnapshotService` để lấy `workDays`, `leaveDays`, `otHours`,... rồi inject vào biến công thức (`[CONG_THUC_TE]`, `[OT_GIO]`, …).
    *   Khi khóa batch lương (`updateBatchStatus(..., 'locked')`), hệ thống tự động khóa các tháng chấm công tham chiếu nhằm tránh thay đổi dữ liệu sau khi chi lương.

3.  **Tích hợp Cài đặt -> Lương (Settings -> Payroll)**
    *   Các thành phần lương (`SalaryComponent`) và ca làm (`WorkShift`) được định nghĩa trong Settings, sau đó dùng lại ở Employee form và Payroll engine (qua `EmployeeCompStore`).
    *   Công thức động được chuẩn hóa theo token `[TEN_BIEN]`, giúp người dùng cấu hình mà không cần sửa code.

### ⚠️ Điểm thiếu sót (Cần khắc phục)

1.  **Leaves -> Attendance (đang thiếu hoàn toàn)** — *ĐÃ KHẮC PHỤC 22/11/2025*
    *   `features/leaves/store.ts` nay bọc CRUD để gọi `leaveAttendanceSync.apply/clear`, tự động cập nhật bảng chấm công khi đơn chuyển trạng thái "Đã duyệt" hoặc bị hủy.
    *   HR không còn phải chỉnh tay từng ngày; payroll nhận đúng `leaveDays` vì attendance đã đồng bộ theo đơn.

2.  **Leaves không sử dụng định nghĩa từ Settings** — *ĐÃ KHẮC PHỤC 22/11/2025*
    *   Form xin nghỉ (`leave-form.tsx`) hiện đọc trực tiếp danh sách từ `useEmployeeSettingsStore().settings.leaveTypes`, cho phép HR sửa loại phép ở module Settings và thấy ngay trong UI Nghỉ phép.
    *   Khi người dùng chọn loại phép, hệ thống lưu luôn metadata (`leaveTypeSystemId`, `leaveTypeId`, `isPaid`, `requiresAttachment`) để Payroll và các báo cáo quota có thể sử dụng.

3.  **Không ghi nhận quota nghỉ phép cho từng nhân viên** — *ĐÃ KHẮC PHỤC 22/11/2025*
    *   `leaveQuotaSync` giờ tính paid/unpaid dựa trên metadata `LeaveType`, cập nhật thêm `paidLeaveTaken`, `unpaidLeaveTaken`, `annualLeaveTaken` và tự động suy ra `annualLeaveBalance` theo `EmployeeSettings`.
    *   Dữ liệu được đồng bộ hai chiều nên HR luôn nhìn thấy hạn mức còn lại khi phê duyệt từng đơn.

4.  **Attendance không kiểm tra đơn nghỉ** — *ĐÃ KHẮC PHỤC 22/11/2025*
    *   Dialog sửa chấm công hiển thị ngay danh sách đơn nghỉ đã duyệt, ngăn không cho set trạng thái `leave` nếu chưa có đơn và cảnh báo khi cố ghi đè ngày đã duyệt.
    *   Các điểm nhập tay khác (như import) cũng tái sử dụng cùng dialog, nên mọi luồng đều phải tham chiếu Leaves.

5.  **Chạy lương khi tháng chấm công chưa khóa** — *ĐÃ KHẮC PHỤC 23/11/2025*
    *   `/payroll/run` bị khóa cứng khi tháng tham chiếu chưa lock, khi còn đơn nghỉ pending hoặc khi snapshot attendance chưa ở trạng thái `locked`.
    *   Các action button chuyển hướng nhanh sang Attendance/Leaves để HR xử lý dứt điểm trước khi quay lại chạy lương.

6.  **Tự động hóa chấm công mới dừng ở mức thủ công** — *ĐÃ KHẮC PHỤC 22/11/2025*
    *   Mỗi khi mở tháng mới, hệ thống tự sinh dữ liệu theo work shift chuẩn, đánh dấu ngày tương lai/weekend đúng quy tắc và ngay sau đó “replay” toàn bộ đơn nghỉ đã duyệt để bảo đảm khớp dữ liệu.
    *   Không còn dữ liệu ngẫu nhiên, việc kiểm tra nhanh/tổng hợp payroll dựa trên attendance gốc trở nên ổn định hơn.

## 3. Giải pháp đề xuất

> Ưu tiên triển khai theo thứ tự ảnh hưởng đến lương: (1) Đồng bộ Leaves -> Attendance, (2) Liên thông Leaves với Settings & quota, (3) Siết chặt điều kiện chạy Payroll, (4) Các cải tiến tự động hóa khác.

### 3.1 Đồng bộ Nghỉ phép sang Chấm công (cao nhất) — **ĐÃ HOÀN THÀNH 22/11/2025**

**Mục tiêu**: Khi đơn nghỉ được duyệt, mọi ngày nằm trong `startDate`–`endDate` sẽ tự động chuyển trạng thái `leave` ở Attendance, kèm ghi chú loại phép.

**Kết quả triển khai**

1.  Tạo `features/leaves/leave-sync-service.ts` để tính ngày làm việc theo `EmployeeSettings.workingDays`, ghi chú `[LEAVE:ID]` kèm lý do và tự động cập nhật lại tổng kết tháng qua `recalculateSummary`.
2.  `useLeaveStore` đã được bọc lại: mọi thao tác `add/update/remove/restore/hardDelete` sẽ `apply` hoặc `clear` dữ liệu chấm công khi trạng thái là "Đã duyệt".
3.  Khi đơn bị hạ cấp hoặc xóa, attendance revert về `absent`/`future` tùy ngày quá khứ hay tương lai nên không còn dữ liệu dư.

> Cần tiếp tục triển khai các mục 3.2 trở đi để hoàn tất toàn bộ roadmap.

### 3.2 Liên thông định nghĩa loại phép với Settings — **ĐÃ HOÀN THÀNH 22/11/2025**

**Kết quả triển khai**

*   `LeaveRequest` mở rộng các trường `leaveTypeSystemId`, `leaveTypeId`, `leaveTypeIsPaid`, `leaveTypeRequiresAttachment` để lưu dấu nguồn gốc từ Settings.
*   `LeaveForm` đọc dữ liệu từ `useEmployeeSettingsStore`, auto chọn mặc định phù hợp (kể cả khi mở đơn cũ) và hiển thị mô tả paid/unpaid, yêu cầu đính kèm.
*   Khi người dùng sửa loại phép ở Settings, form phản ánh ngay mà không cần sửa code. Legacy/fallback vẫn hoạt động thông qua danh sách dự phòng nhưng được đánh dấu rõ.

> Bước tiếp theo của roadmap là mục 3.3 (quota) vì 3.1 & 3.2 đã hoàn tất.

### 3.3 Theo dõi quota & cập nhật `leaveTaken` — **ĐÃ HOÀN THÀNH 22/11/2025**

**Kết quả triển khai**

*   `leave-quota-service.ts` đọc metadata `LeaveType` (paid/unpaid) để cập nhật `leaveTaken`, `paidLeaveTaken`, `unpaidLeaveTaken` và `annualLeaveTaken`, sau đó tự động suy ra `annualLeaveBalance` dựa trên `baseAnnualLeaveDays` + thâm niên.
*   `useLeaveStore` gọi `leaveQuotaSync.apply/clear` giống như attendance sync nên mọi thao tác CRUD đều hồi tiếp quota chính xác và không bị âm.
*   Việc phân tách paid/unpaid giúp payroll & báo cáo nhận được đúng ngữ cảnh từng đơn (ví dụ nghỉ không lương nhưng vẫn xuất hiện trong danh sách).

### 3.4 Kiểm tra chéo giữa Attendance và Leaves — **ĐÃ HOÀN THÀNH 22/11/2025**

**Kết quả triển khai**

*   `AttendanceEditDialog` (kể cả khi bật từ trang import) luôn nhận được `monthDate`, từ đó lọc chính xác các đơn nghỉ đã duyệt theo ngày và hiển thị badge đối chiếu.
*   Nếu người chấm công cố ghi đè dữ liệu nghỉ đã duyệt, hệ thống đưa cảnh báo rõ ràng; ngược lại trạng thái `leave` sẽ bị chặn nếu không tìm thấy đơn hợp lệ.

### 3.5 Khóa chặt quy trình chạy lương — **ĐÃ HOÀN THÀNH 23/11/2025**

**Kết quả triển khai**

*   `/payroll/run` hiển thị cảnh báo đỏ và vô hiệu nút "Tạo bảng lương" khi tháng chưa khóa, khi còn đơn nghỉ "Chờ duyệt" hoặc khi snapshot chấm công chưa được `locked`.
*   Nút hành động chỉ bật lại khi tất cả snapshot trả về `locked: true` (thông qua `attendanceSnapshotService`) và không còn đơn pending trong tháng; người dùng có thể bấm nhanh các nút "Khóa chấm công"/"Xem đơn nghỉ" để xử lý.
*   Khi vẫn cố gắng tạo batch, hệ thống chặn ở tầng dịch vụ, hiển thị toast lỗi và điều hướng sang module phù hợp (Attendance hoặc Leaves) để hoàn tất trước.

### 3.6 Tự động hóa dữ liệu chấm công — **ĐÃ HOÀN THÀNH 22/11/2025**

**Kết quả triển khai**

*   `generateMockAttendance` được thay bằng auto-fill dựa trên `workingDays`, `workStartTime`, `workEndTime` nên tháng mới luôn có dữ liệu chuẩn, không còn trạng thái random.
*   Sau khi seed tháng đầu tiên, hệ thống tự “replay” toàn bộ đơn nghỉ đã duyệt (qua `leaveAttendanceSync`) để bảo đảm grid khớp hoàn toàn với Leaves trước khi HR chỉnh sửa thủ công.
*   Combo auto-fill + quick fill sẵn có giúp người dùng chỉ cần tập trung vào ngoại lệ (đi muộn, OT, import máy chấm công) thay vì dựng lại toàn bộ bảng.


Nếu được thống nhất theo roadmap trên, bước đầu tiên là triển khai **LeaveSyncService** và hook vào `useLeaveStore`. Các hạng mục còn lại có thể triển khai lần lượt sau khi đã có dữ liệu đồng bộ nền tảng.

## 4. Kiểm thử & bước tiếp theo

*   Khi toàn bộ lỗi `npm run typecheck` hiện hữu trong repo được xử lý xong, cần chạy lại cặp lệnh `npm run typecheck` và `npm run test` để bảo đảm những thay đổi mới không phát sinh regression.
*   Sau khi có môi trường sạch, hãy thực hiện luồng thực tế: **mở tháng mới → seed attendance tự động → duyệt/xóa đơn nghỉ → chạy payroll** để xác nhận cảnh báo khóa tháng, pending leaves và auto-fill hoạt động đúng như mô tả ở mục 3.4–3.6.
