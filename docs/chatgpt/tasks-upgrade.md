# Rà soát module Tasks (29/11/2025)

## 1. Kiến trúc & hiện trạng
- **Zustand + localStorage cho toàn bộ vòng đời công việc**: `features/tasks/store.ts` khởi tạo `createCrudStore` với khóa `internal-tasks`, tự migrate dữ liệu cũ sang nhiều người nhận, đồng thời xử lý activity log, auto start/stop timer, lưu timer đang chạy vào `localStorage` (`active-timer`). Không có API, không có backend nên mọi CRUD/assign/progress đều là state trong trình duyệt.
- **Các tiện ích (custom fields, templates, recurring) cũng chỉ là store cục bộ**: `custom-fields-store.ts`, `template-store.ts`, `recurring-store.ts` đều dùng `createCrudStore` và seed dữ liệu từ file tĩnh (`template-data.ts`). Việc tạo task từ template, sinh task định kỳ hay lưu custom field chỉ diễn ra trên FE, không có bảng/cron/service layer.
- **UI đa chế độ nhưng file rất nặng**: `page.tsx` (~500 dòng) nhúng bảng phản hồi, Kanban, quick filter, mobile infinite scroll, role filter, toast, column persistence. `kanban-view.tsx`, `calendar-view.tsx`, `dashboard-page.tsx`, `user-tasks-page.tsx` đều load toàn bộ dataset vào bộ nhớ và thao tác trực tiếp → bundle lớn, khó tách unit test.
- **Chi tiết công việc chứa mọi thứ**: `detail-page.tsx` nhập cùng lúc `Comments`, `SubtaskList`, `TimeTracker`, `ActivityTimeline`, `EvidenceViewer`, SLA Timer (`loadSLASettings` từ Settings). Tất cả dữ liệu (comment, subtask, evidence, attachment, approval history) nằm ngay trong object `Task`, không có bảng riêng hay file storage.
- **Logic phân quyền/SLA/nhắc việc thuần FE**: `page.tsx` chỉ kiểm tra `isAdmin` để bật nút tạo task, `types-filter.ts` đọc `localStorage.currentUser/employee` để lọc “công việc của tôi”, `kanban-view.tsx` & `detail-page.tsx` tự tính SLA bằng config từ Settings, `recurring-store.ts` yêu cầu gọi `processRecurringTasks` thủ công mới sinh job.

## 2. Đối chiếu checklist
| Hạng mục | Trạng thái | Ghi chú |
| --- | --- | --- |
| Types & Validation | ⚠️ Một phần | `features/tasks/types.ts` mô tả khá đầy đủ (priority, activity, evidence) nhưng không có schema Zod/Prisma; `task-form-page.tsx` chỉ kiểm tra thủ công trước khi mutate store. |
| UI/UX | ⚠️ Một phần | Có bảng + Kanban + Calendar + Dashboard, responsive tương đối; tuy nhiên mỗi page >400 dòng, thiếu loading/error boundary thực, data mất ngay khi refresh. |
| Performance | ⚠️ Một phần | Dùng Fuse.js/virtual scroll nhưng mọi filter/sort/drag-drop/stat đều chạy trên tập dữ liệu lớn tại client (`page.tsx`, `kanban-view.tsx`, `dashboard-page.tsx`). Không có pagination server hay memo hóa theo user. |
| Database Ready | ❌ | Chưa có bảng `tasks`, `task_assignees`, `task_subtasks`, `task_comments`, `task_custom_fields`, `task_timers`, `task_recurring_templates`… Toàn bộ data nằm trong `localStorage`. |
| API Ready | ❌ | Không có route `/api/tasks` hoặc webhook/time-tracking; recurring/template/custom-field cũng không có API. FE gọi thẳng các store. |
| Liên kết module | ⚠️ Thiếu | Task chỉ biết `useEmployeeStore`/`useAuth`; không có FK thật tới Employees/Settings. SLA load từ `features/settings/tasks/tasks-settings-page.tsx`, timer viết vào `localStorage` chung nên không an toàn đa người dùng. |

## 3. Logic & liên kết đáng chú ý
1. **Auto timer & activity chạy ngay trong store** (`features/tasks/store.ts`): hàm `autoManageTimer` tự đổi trạng thái, ghi activity, bật/tắt `timerRunning`, ghi `active-timer` vào `localStorage`. Nếu user mở nhiều tab hoặc nhiều người cùng chỉnh, state sẽ ghi đè lẫn nhau và không đồng bộ với báo cáo thời gian.
2. **Quick filter & role filter phụ thuộc localStorage** (`features/tasks/types-filter.ts`, `components/QuickFilters.tsx`): preset “Công việc của tôi”, “Tôi tạo” đọc `localStorage.currentUser`/`employee`. Nếu chưa set hai key này (đa số môi trường thật) sẽ bị `undefined`, filter sai hoặc crash.
3. **Recurring task chỉ là convenience function** (`features/tasks/recurring-store.ts`): `processRecurringTasks` phải được gọi thủ công (không cron). Nó tự tạo task mới qua `taskStore.add` và cập nhật `nextOccurrenceDate` nhưng không khóa transaction, không idempotent → refresh/nhấn lại dễ nhân bản công việc.
4. **Calendar/Kanban drag-drop cập nhật thẳng state** (`features/tasks/calendar-view.tsx`, `kanban-view.tsx`): kéo event là gọi `update()` để đổi ngày/trạng thái mà không kiểm tra quyền, không ghi log server; Timer/SLA hiển thị theo estimatedHours (client) nên chỉ mang tính minh họa.
5. **Dashboard & User-self-service đọc entire store** (`dashboard-page.tsx`, `user-tasks-page.tsx`): thống kê, gửi bằng chứng hoàn thành, phê duyệt đều là thao tác trực tiếp trên client store. Không có upload service cho `CompletionEvidence.images` nên giá trị chỉ là URL text, không đảm bảo tồn tại.

## 4. Rủi ro & issue chính
| Mức độ | Mô tả | Bằng chứng |
| --- | --- | --- |
| 🔴 Cao | Toàn bộ dữ liệu nhiệm vụ, comment, evidence, custom field, template, recurring đều nằm trong `localStorage`; refresh/mở trình duyệt khác là mất hoặc sai lệch, không thể triển khai thật. | `features/tasks/store.ts`, `custom-fields-store.ts`, `template-store.ts`, `recurring-store.ts` |
| 🔴 Cao | Phân quyền/approval thuần FE: bất kỳ ai mở DevTools có thể gọi `useTaskStore().add/update/remove`, gửi “bằng chứng”, tự phê duyệt vì không có API hay server control. | `features/tasks/page.tsx`, `detail-page.tsx`, `user-tasks-page.tsx` |
| 🟠 Trung bình | Timer & SLA dựa trên `localStorage.active-timer` và config FE => mỗi tab tính khác nhau, không thể audit thời gian làm việc hoặc SLA thật. | `features/tasks/store.ts`, `detail-page.tsx`, `kanban-view.tsx` |
| 🟠 Trung bình | Recurring task và drag-drop calendar không có transactional guard → dễ tạo trùng, đổi hạn nhầm, không rollback được. | `features/tasks/recurring-store.ts`, `calendar-view.tsx` |
| 🟡 Thấp | Quick filter/“Công việc của tôi” dựa vào `localStorage.currentUser/employee`; khi chạy trong môi trường mới hoặc user xoá localStorage sẽ lỗi và đếm sai. | `features/tasks/types-filter.ts`, `components/QuickFilters.tsx` |

## 5. Đề xuất nâng cấp
1. **Thiết kế schema & Prisma**: Dựng các bảng `Tasks`, `TaskAssignees`, `TaskSubtasks`, `TaskComments`, `TaskAttachments`, `TaskActivities`, `TaskTimers`, `TaskRecurring`, `TaskTemplates`, `TaskCustomFields`. Chuẩn hóa dual-ID (systemId/businessId), audit, indexes (assignee, status, dueDate, priority).
2. **Xây dịch vụ & API Next.js**: Route handler `/api/tasks` (list/filter/pagination/search/export) + sub-route `/api/tasks/:id/activities`, `/subtasks`, `/comments`, `/evidence`, `/timer`. Dùng React Query cho FE, giữ Zustand chỉ cho UI state (filter, column config).
3. **Timer & SLA service phía server**: Khi user start/stop timer, gọi API ghi `task_timer` (start_at, stop_at). SLA engine dùng job worker (BullMQ/Temporal) dựa trên priority config từ Settings, push notification thật thay vì `SlaTimer` cục bộ.
4. **Recurring & template engine chuẩn hóa**: Lưu recurrence pattern + next trigger trong DB, chạy scheduler (cron/job queue) để tạo task idempotent. Template gallery cần API để quản lý version, assign role placeholders. FE chỉ gọi mutate.
5. **Custom field & automation**: Move `custom-fields-store` -> bảng `task_custom_field_definitions/values`, expose API, enforce validation server (Zod/Prisma). Cho phép định nghĩa automation (ví dụ auto assign reviewer) dựa trên rule server-side.
6. **Attachment/evidence & bảo mật**: Tách upload sang service (S3/Supabase) với signed URL, metadata reference. Approval action phải là API có RBAC (admin/lead). Log mọi phê duyệt trong `task_activities` + audit log.
7. **Tối ưu UI**: Chia nhỏ `page.tsx`, `detail-page.tsx`, `kanban-view.tsx` thành component con, lazy-load Calendar/Dashboard. Dùng server pagination, search trên backend, skeleton + error boundary rõ ràng.
8. **Quan sát & test**: Viết unit test cho service (status machine, timer, recurring), integration test cho API, e2e cho luồng nhân viên gửi bằng chứng → admin duyệt. Thêm metrics (tasks overdue, on-time rate) để Dashboard đọc từ API thay vì tính lại mỗi lần render.

## 6. Việc cần làm ngay
- **Đóng module Tasks khỏi dữ liệu thật và backup localStorage** (`internal-tasks`, `task-templates`, `custom-fields`, `task-recurring`) trước khi dev backend.
- **Soạn đặc tả Prisma + API contract** (Task, Assignee, Subtask, Timer, Evidence, Recurring) và đồng bộ với nhóm Employees/Settings để đảm bảo FK/permission đúng.
- **Thiết kế state machine & phân quyền** (owner vs contributor vs reviewer, approval step) rồi chuyển logic này vào service, FE chỉ dispatch action.
- **Chuẩn bị hạ tầng job** cho recurring & SLA (BullMQ/Temporal) và storage cho attachment (S3/Supabase) để khi migrate có sẵn nền tảng.
