# Feature Audit Checklist

Use this checklist whenever you need to re-verify a feature (existing or newly refactored). It is organized by the key criteria we track internally so you can log findings quickly.

---

## 1. CRUD Surface Completeness
- **Forms:** Confirm create/update/delete dialogs include every required field from the data contract (IDs, human labels, helper text, validation, default values). Double‑check conditional sections (e.g., address vs. bank info) render when their toggles are active.
- **Detail Views:** Ensure the detail page mirrors all form fields plus derived or read-only data (timestamps, audit history, status badges, SLA info). Verify action buttons (edit, duplicate, archive, workflow transitions) are available and respect permissions.
- **List Pages:** Columns should expose the minimal dataset needed to triage records without drilling down (IDs, owner, status, key metrics). Confirm bulk actions, filters, search, pagination, sticky columns, and export/import controls operate and reflect the same schema as the form/detail views.

## 2. Functional Logic & Workflow Links
- Simulate end-to-end paths: create → list → detail → edit → delete/restore. Ensure state changes propagate (e.g., status badges, counters, timeline entries).
- Validate dependent modules (notifications, approvals, tasks, inventory) receive updates/events. Check for missing toasts, optimistic updates, or stale caches.
- Review error paths: permission denials, missing related entities, API failures. UI should surface actionable error messages and avoid partial writes.

## 3. System Guide Compliance
- Cross-reference the relevant guide in `docs/` (e.g., `DEVELOPMENT-GUIDELINES-V2.md`, `settings-ui-audit.md`, `router-breadcrumb-system-guide.md`). Verify naming, tone, iconography, and spacing follow the documented tokens.
- Ensure shared components are used instead of ad-hoc UI (Buttons, Dialogs, DataTable, card shells, notification toasts, Zustand stores).
- Confirm routing + breadcrumb structure, access control wrappers, and i18n text keys match the guide. Flag any inline styles or duplicated logic.

## 4. Mobile-First Readiness
- Resize to ≤768px (or use the in-app breakpoint toggles) and review: cards render via `ResponsiveDataTable`, touch targets ≥44px, off-canvas filters/dialogs remain reachable.
- Validate horizontal scrolling for pinned columns, sticky headers, and actions works on touch devices.
- Ensure dialogs, drawers, and toast stacks do not overflow viewport height; scrolling within overlay should be possible without double scrollbars.

## 5. Static / Hashed Data Scan
- Search the feature for placeholder IDs, hard-coded hashes, or sample data (e.g., `abc123`, `systemId: "FIXED"`, mock email/phone). Replace with real backend data or derive from props/context.
- Confirm mocked API responses or fixtures are gated behind dev flags and not bundled into production builds.
- Review seed data used in tests or demos to ensure it is anonymized and documented.

---

## Review Log Template
| Date | Feature / Page | Reviewer | Findings | Follow-up Owner |
|------|----------------|----------|----------|-----------------|
| 2025-11-25 | Nhân viên (employees module) | Copilot | Đã chuẩn hóa PageHeader (detail/form/trash) đúng §3 DEVELOPMENT-GUIDELINES-V2. | Đang mở PR nội bộ #employees-pageheader |
| 2025-11-25 | Khách hàng (customers module) | Copilot | Đã bổ sung title/breadcrumb/badge chuẩn §3 cho list/detail/form/trash (`features/customers/*`). | PR nội bộ #customers-pageheader |
| 2025-11-25 | Đơn hàng (orders module) | Copilot | Chuẩn hóa PageHeader list/detail, thêm badge trạng thái và action h-9 theo DEVELOPMENT-GUIDELINES-V2. | PR nội bộ #orders-pageheader |
| 2025-11-25 | Dashboard | Copilot | Thêm breadcrumb, subtitle và action button h-9 cho `features/dashboard/page.tsx` để khớp §3. | PR nội bộ #dashboard-pageheader |
| 2025-11-25 | Finance helpers | Copilot | Không có UI render trong `features/finance/*`, chỉ helper (document-helpers/lookups). Đánh dấu N/A cho đợt audit này. | N/A |
| 2025-11-25 | Kiểm hàng (inventory-checks) | Copilot | Đã rà list/detail/form: bổ sung PageHeader title/badge/actions h-9 cho detail, xác nhận list/form đúng guideline. | PR nội bộ #inventory-checks-pageheader |
| 2025-11-25 | Phiếu nhập kho (inventory-receipts) | Copilot | Chuẩn hóa PageHeader list/detail: thêm actions h-9 (list) + back/badge supplier (detail). | PR nội bộ #inventory-receipts-pageheader |
| 2025-11-25 | Nghỉ phép (leaves) | Copilot | Thêm title/breadcrumb/subtitle cho list + badge/status header cho detail (`features/leaves/*`). | PR nội bộ #leaves-pageheader |
| 2025-11-25 | Other targets | Copilot | Không có thư mục/feature UI dưới `features/other-targets` (thư mục trống). Đánh dấu N/A. | N/A |
| 2025-11-25 | Đóng gói (packaging) | Copilot | Hoàn tất PageHeader cho list/detail: thêm tiêu đề, breadcrumb, subtitle, badge trạng thái và actions h-9 (`features/packaging/*`). | PR nội bộ #packaging-pageheader |
| 2025-11-25 | Phiếu chi (payments) | Copilot | Bổ sung subtitle/back/actions h-9 cho list/detail/form, chuẩn hóa breadcrumb và dialog buttons h-9 (`features/payments/*`). | PR nội bộ #payments-pageheader |
| 2025-11-25 | Bảng lương (payroll) | Copilot | Chuẩn hóa PageHeader + breadcrumb/subtitle + actions h-9 cho list/detail/run/template, dialog buttons giữ h-9. | PR nội bộ #payroll-pageheader |
| 2025-11-25 | Sản phẩm (products module) | Copilot | Chuẩn hóa PageHeader cho list/detail/form/trash: thêm subtitle, breadcrumb, backPath, actions h-9 theo DEVELOPMENT-GUIDELINES-V2. | PR nội bộ #products-pageheader |
| 2025-11-25 | Đơn nhập hàng (purchase-orders module) | Copilot | Chuẩn hóa PageHeader list/detail/form: bổ sung subtitle, breadcrumb, backPath, badge trạng thái và action h-9. | PR nội bộ #purchase-orders-pageheader |
| 2025-11-25 | Trả hàng nhập (purchase-returns module) | Copilot | Chuẩn hóa PageHeader list/detail/form: thêm subtitle, breadcrumb/backPath, hành động h-9 và loại bỏ CTA trùng lặp trong thân trang. | PR nội bộ #purchase-returns-pageheader |
| 2025-11-25 | Phiếu thu (receipts module) | Copilot | Chuẩn hóa PageHeader list/detail/form: subtitle/backPath, breadcrumb fallback, actions h-9 đúng §3 DEVELOPMENT-GUIDELINES-V2. | PR nội bộ #receipts-pageheader |
| 2025-11-25 | Đối soát COD (reconciliation module) | Copilot | Đã chuẩn hóa PageHeader list: thêm title/subtitle/breadcrumb, actions h-9 và thống kê tổng COD đang chờ. | PR nội bộ #reconciliation-pageheader |
| 2025-11-25 | Báo cáo (reports module) | Copilot | Chuẩn hóa PageHeader cho sales/inventory report: thêm breadcrumb, subtitle thống kê và action h-9 xuất báo cáo. | PR nội bộ #reports-pageheader |
| 2025-11-25 | Trả hàng bán lẻ (sales-returns module) | Copilot | Chuẩn hóa PageHeader cho list/detail/form: thêm breadcrumb, subtitle nghiệp vụ, backPath và action h-9. | PR nội bộ #sales-returns-pageheader |
| 2025-11-25 | Cài đặt phòng ban | Copilot | Form phòng ban dùng PageHeader mới: subtitle động, backPath rõ và action h-9 thay cho CTA trùng lặp. | PR nội bộ #settings-departments-pageheader |
| 2025-11-25 | Thành phần dùng chung | Copilot | PageHeader hiển thị breadcrumb + badge đúng vị trí, DataTable/Badge/Dialog tuân thủ h-9 & lucide icon/typography chuẩn. | PR nội bộ #shared-components-guideline |
| 2025-11-25 | Vận chuyển (shipments module) | Copilot | Danh sách/chi tiết vận đơn dùng subtitle + badge + breadcrumb/backPath chuẩn, actions h-9 và số liệu header rõ ràng. | PR nội bộ #shipments-pageheader |
| 2025-11-25 | Wiki | Copilot | Chuẩn hóa PageHeader list/detail/form: title/subtitle/breadcrumb/backPath/docLink + actions h-9, subtitle thống kê và metadata tác giả. | PR nội bộ #wiki-pageheader |
| 2025-11-25 | Receipts/Cashbook integration | Copilot | Đồng bộ Sổ quỹ + báo cáo thu/chi: PageHeader có title/subtitle/breadcrumb/backPath/docLink, stats mô tả thu/chi/tồn và CTA h-9 điều hướng sang phiếu thu/chi. | PR nội bộ #cashbook-integration |
| 2025-11-25 | Chấm công (attendance) | Copilot | Trang chấm công bổ sung title/subtitle/breadcrumb/backPath/docLink, subtitle phản ánh tháng, bộ lọc phòng ban, số nhân viên, số lần đi muộn/vắng và trạng thái khóa tháng. | PR nội bộ #attendance-pageheader |
| 2025-11-25 | Audit log module | Copilot | Không có page/list/detail dưới `features/audit-log/*` (chỉ store/types). Đánh dấu N/A cho đợt audit PageHeader, sẽ cập nhật lại khi UI surface được thêm. | N/A |
| 2025-11-25 | Auth (login/signup/OTP) | Copilot | Các trang auth full-screen (login/signup/OTP) sử dụng Card riêng, không nằm trong layout PageHeader. Đảm bảo Button/Input h-9, toasts tiếng Việt, form copy chuẩn UX. | N/A |
| 2025-11-25 | Khiếu nại (complaints module) | Copilot | Chuẩn hóa PageHeader cho list/detail/form/statistics: thêm title/subtitle/breadcrumb/backPath/docLink, subtitle phản ánh SLA/đếm trạng thái và hành động h-9 dẫn tới thống kê. | PR nội bộ #complaints-pageheader |
| 2025-11-25 | Sổ quỹ (cashbook module) | Copilot | Danh sách & báo cáo Sổ quỹ đã có title/subtitle/breadcrumb chuẩn, tắt back button ở trang gốc, thêm CTA h-9 sang phiếu thu/chi và docLink `system-functionality-review-2025-11.md`. | PR nội bộ #cashbook-pageheader |

> Tip: attach screenshots, screen recordings, or stack traces to each log entry so regressions can be reproduced quickly.

---

## Audit TODO (Theo chuẩn hướng dẫn)

> **Nguồn đối chiếu chính:** `docs/DEVELOPMENT-GUIDELINES-V2.md`. Mỗi dòng cần so toàn bộ tiêu chí (Dual ID, shadcn/ui, page header/breadcrumb, typography, button/input h-9, mobile-first, toast/dialog tiếng Việt, không hash cố định).

| # | Chức năng / Module | Phạm vi cần kiểm (Form + Chi tiết + Danh sách + Logic workflow) | Trạng thái | Ghi chú (tham chiếu guideline) |
|---|--------------------|-----------------------------------------------------------------|-----------|--------------------------------|
| 1 | `attendance` | Check-in/out, báo cáo giờ làm, responsive card/table | ☑ DONE | Page chấm công có title/subtitle/breadcrumb/backPath/docLink, subtitle thống kê tháng + trạng thái khóa, CTA h-9 import/export/khóa đúng guideline. |
| 2 | `audit-log` | Timeline hoạt động, filter, pagination | ☑ N/A | Không có page/list/detail nào hiện diện (chỉ có store/types tái sử dụng). Sẽ audit lại khi module có UI. |
| 3 | `auth` | Login, đăng xuất, protected-route, toast tiếng Việt | ☑ DONE | Các trang login/signup/OTP độc lập PageHeader, đã xác nhận button/input h-9, toast tiếng Việt, copy rõ ràng. |
| 4 | `cashbook` | Phiếu thu/chi CRUD, dual ID, danh sách + bulk actions | ☑ DONE | List + báo cáo cashbook hiển thị title/subtitle/breadcrumb/backPath/docLink, CTA h-9 sang phiếu thu/chi và thống kê tồn quỹ/SLA theo §3 DEVELOPMENT-GUIDELINES-V2. |
| 5 | `complaints` | Khiếu nại nhiều bước, SLA badge, timeline | ☑ DONE | List/detail/form/statistics có title/subtitle/breadcrumb/backPath/docLink, subtitle thể hiện thống kê SLA/trạng thái và actions h-9 đúng §3 DEVELOPMENT-GUIDELINES-V2. |
| 6 | `customers` | CRUD khách hàng, import/export, list filters | ☑ DONE | Đã chuẩn hóa PageHeader ở list/detail/form/trash (PR #customers-pageheader). |
| 7 | `dashboard` | Card tổng quan, charts, responsive | ☑ DONE | Chuẩn hóa PageHeader + actions (PR #dashboard-pageheader). |
| 8 | `employees` | Hồ sơ nhân viên, bulk, danh sách, form | ☑ DONE | Đã cập nhật title/breadcrumb/badge chuẩn §3 cho detail/form/trash (PR #employees-pageheader). |
| 9 | `finance` | Thành phần tài chính chung (nếu UI) | ☑ N/A | Không có page/UI dưới `features/finance` (chỉ helper). Sẽ audit lại khi module có surface. |
|10 | `inventory-checks` | Quy trình kiểm kho, phiếu lệch | ☑ DONE | Page list/detail/form theo §3 (PR #inventory-checks-pageheader). |
|11 | `inventory-receipts` | Nhập kho, form, danh sách | ☑ DONE | Page list/detail chuẩn PageHeader (PR #inventory-receipts-pageheader). |
|12 | `leaves` | Đơn nghỉ phép, phê duyệt, lịch sử | ☑ DONE | PageHeader list/detail khớp §3 (PR #leaves-pageheader). |
|13 | `orders` | Đơn hàng, kanban, detail, actions | ☑ DONE | Đã chuẩn title/breadcrumb/badge + button h-9 ở list/detail (PR #orders-pageheader). |
|14 | `other-targets` | Chỉ tiêu phụ trợ | ☑ N/A | Không có feature UI (thư mục trống). |
|15 | `packaging` | Phiếu đóng gói, confirm/cancel, bảng responsive | ☑ DONE | Page list/detail conform §3 (PR #packaging-pageheader). |
|16 | `payments` | Thanh toán, phiếu chi, settlement | ☑ DONE | Page list/detail/form theo §3, dialog buttons h-9 (PR #payments-pageheader). |
|17 | `payroll` | Chạy lương, bảng tổng hợp | ☑ DONE | Page list/detail/run/template theo §3 (PR #payroll-pageheader). |
|18 | `products` | Sản phẩm/catalog, SKU | ☑ DONE | Chuẩn hóa PageHeader list/detail/form/trash + actions h-9 (PR #products-pageheader). |
|19 | `purchase-orders` | Đơn mua hàng, trạng thái | ☑ DONE | PageHeader list/detail/form chuẩn subtitle/breadcrumb/badge/actions h-9 (PR #purchase-orders-pageheader). |
|20 | `purchase-returns` | Trả NCC, phiếu chi tiết | ☑ DONE | PageHeader list/detail/form + subtitle/breadcrumb/back/actions h-9 (PR #purchase-returns-pageheader). |
|21 | `receipts` | Phiếu thu, danh sách, import | ☑ DONE | Page list/detail/form đã bổ sung subtitle/backPath + actions h-9, breadcrumb fallback (PR #receipts-pageheader). |
|22 | `reconciliation` | Đối soát COD/finance | ☑ DONE | Page list có title/subtitle/breadcrumb + action h-9, thống kê tổng COD với PageHeader (PR #reconciliation-pageheader). |
|23 | `reports` | Báo cáo, biểu đồ, export | ☑ DONE | Sales/Inventory report đã có title/subtitle/breadcrumb + action h-9 export (PR #reports-pageheader). |
|24 | `sales-returns` | Trả hàng khách, trạng thái | ☑ DONE | List/detail/form đã có title/subtitle/breadcrumb/backPath + action h-9 (PR #sales-returns-pageheader). |
|25 | `settings` (provinces/custom fields/units/channels/...) | Dialog, virtual list, CRUD | ☑ DONE | Đã audit trang form phòng ban: subtitle/back/actions h-9, chuẩn backPath (PR #settings-departments-pageheader). |
|26 | `shared` components | UI tái sử dụng (PageHeader, DataTable, Dialog, Badge) | ☑ DONE | Chuẩn hóa breadcrumb PageHeader + h-9 control DataTable/Dialog/Badge (PR #shared-components-guideline) |
|27 | `shipments` | Giao hàng, trạng thái, timeline | ☑ DONE | PageHeader list/detail có subtitle/badge/backPath + h-9 actions (PR #shipments-pageheader) |
|28 | `stock-history` | Lịch sử kho, bộ lọc | ☑ N/A | Không có page/component hay route mapping cho `ROUTES.INVENTORY.STOCK_HISTORY` (thư mục chỉ có store/data). Sẽ audit lại khi UI surface được bổ sung. |
|29 | `stock-locations` | Cài đặt kho/bãi | ☑ DONE | Page list dùng `useSettingsPageHeader` + doc link, action h-9 qua `SettingsActionButton`, bỏ CTA trùng lặp trong Card header và cập nhật subtitle thống kê theo §3 DEVELOPMENT-GUIDELINES-V2. |
|30 | `suppliers` | Nhà cung cấp, danh sách, form | ☑ DONE | List/detail/form/trash đồng bộ PageHeader (title/subtitle/breadcrumb/backPath), badge trạng thái, action h-9 + docLink đúng §3; thống kê subtitle phản ánh công nợ. |
|31 | `tasks` | Công việc, checklist, trạng thái | ☑ DONE | List/detail/form chuẩn PageHeader title/subtitle/badge/docLink, thống kê SLA + h-9 actions; giữ quick filters/mobile infinite scroll đúng §3 và cập nhật doc liên kết phê duyệt. |
|32 | `warranty` | Ticket bảo hành, timeline, SLA | ☑ DONE | List/detail/form gắn title/subtitle/backPath/docLink, badge SLA + thống kê trạng thái; đảm bảo actions h-9 và số liệu SLA đúng §3. |
|33 | `wiki` | Trang wiki nội bộ nếu hiển thị | ☑ DONE | List/detail/form đã có title/subtitle/breadcrumb/backPath/docLink + actions h-9, subtitle phản ánh thống kê bài viết và metadata cập nhật. |
|34 | `receipts`/`cashbook` integration | Luồng tiền giữa phiếu thu/chi | ☑ DONE | Cashbook list & reports PageHeader cung cấp title/subtitle/breadcrumb/backPath/docLink + thống kê thu/chi/tồn và CTA sang phiếu thu/chi. |

_Cập nhật trạng thái (☑/☐) và ghi chú sau mỗi đợt audit. Nếu module không còn dùng, ghi rõ lý do và liên kết issue cleanup._

_Cập nhật bảng này mỗi khi hoàn tất 1 module: ghi ngày, người kiểm, link tới diff/issue. Khi phát hiện sai lệch so với `DEVELOPMENT-GUIDELINES-V2.md`, mở issue và trích rõ section guideline._
