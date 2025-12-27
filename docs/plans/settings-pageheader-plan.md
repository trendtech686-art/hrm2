# Settings PageHeader & Vertical Tabs Plan

This document tracks the pending work to unify every Settings page under the new UX rules:

- **Navigation:** use vertical tabs (Sidebar-style) for every multi-section Settings screen.
- **Primary actions:** live exclusively in the PageHeader (`useSettingsPageHeader`).
- **Contextual actions:** stay inside the relevant card/table (e.g., row-level edits, filters).
- **Tab-aware actions:** PageHeader updates whenever the active tab changes so users always find Add/Import/Save/Reset buttons in a single place.

## Global TODO Checklist

- [x] Update shared tab component (or each page) to render vertical tabs with sticky sidebar behavior.
  - [x] Introduce reusable `SettingsVerticalTabs` wrapper (`components/settings/SettingsVerticalTabs.tsx`).
  - [x] Adopt the shared wrapper across remaining Settings pages.
    - [x] Sales Config
    - [x] Payment Settings
    - [x] Inventory
    - [x] Complaints
    - [x] Warranty
    - [x] Customers
    - [x] Tasks
    - [x] Shipping
- [x] Audit PageHeader usage to ensure every Settings screen passes both `title/subtitle` and `actions`.
- [x] Create a small helper (if needed) that lets child tabs register actions with the parent page (pattern already prototyped in `sales/sales-config-page.tsx`). ✅ Implemented via `useTabActionRegistry` (`features/settings/use-tab-action-registry.ts`) and already wired into every multi-tab Settings page.
- [x] Verify responsive behavior (mobile collapses tabs into dropdown but still shows actions in header). ✅ Checked via `SettingsVerticalTabs` responsive classes (`md:flex` layout + horizontal scroll on <md) and confirmed PageHeader actions remain visible because `useSettingsPageHeader` is independent of tab layout.

## Page-by-Page Tasks

### Employees (`features/settings/employees/employee-settings-page.tsx`)
- [x] Move Save/Hủy actions to PageHeader (done in earlier refactor).
- [ ] Convert the form layout to use vertical tabs if we split future sections (currently single form; confirm no tab work needed).

### Sales Config (`features/settings/sales/sales-config-page.tsx`)
- [x] Introduce tab-aware PageHeader actions (prototype implemented).
- [x] Switch `TabsList` to vertical layout for desktop, horizontal fallback on mobile (now shared via `SettingsVerticalTabs`).
- [x] Ensure `SalesChannelsPageContent` no longer renders inline “Thêm nguồn” buttons (already removed) and extend same pattern to other sub-components if we add more tabs later.

### Inventory Settings (`features/settings/inventory/page.tsx`)
- [x] Replace horizontal tab strip with vertical tabs (Units, Product Types, Categories, Storage Locations).
- [x] Expose per-tab primary actions via PageHeader:
  - Units: `Thêm đơn vị`, `Khôi phục mặc định` (if applicable).
  - Product Types: `Thêm loại sản phẩm`.
  - Categories: `Thêm danh mục gốc`.
  - Storage Locations: `Thêm điểm lưu kho`.
- Khôi phục mặc định for Units chưa có store helper, sẽ bổ sung khi có API.
- [x] Keep table-specific actions (edit/delete) inside cards.

### Payment Settings (`features/settings/payment-settings-page.tsx`)
- [x] Convert to vertical tabs covering: Receipt Types, Payment Types, Payment Methods, Cash Accounts, Target Groups.
- [x] For each tab, register PageHeader actions (`Thêm mới`, `Nhập/Xuất`, etc.) instead of keeping buttons inside card headers.
- [ ] Ensure import/export dialogs remain accessible from header buttons (đang chờ yêu cầu nghiệp vụ cho luồng import/export).

### Shipping Settings (`features/settings/shipping/page.tsx`)
- [x] Render tabs vertically (Connections, Global Config, Fees).
- [x] Surface header actions:
  - Connections: `Kết nối đối tác` / `Quản lý` (may open modal or navigate) – confirm best CTA.
  - Global Config: `Lưu cấu hình` / `Khôi phục mặc định`.
  - Fees: `Thêm biểu phí` / `Nhập bảng phí` (if available).
- [x] Leave partner-specific quick actions (e.g., buttons inside cards) in place.

### Tasks Settings (`features/settings/tasks/tasks-settings-page.tsx`)
- [x] Add vertical sidebar navigation for SLA, Notifications, Reminders, Card Colors, Templates, Evidence, etc.
- [x] Move section-level primary actions (Save/Reset per tab) into PageHeader; e.g., when viewing Card Colors tab, header shows `Lưu` + `Khôi phục`.
- [x] Preserve inline micro actions (drag handles, row-level edits) within the content area.

### Complaints Settings (`features/settings/complaints/complaints-settings-page.tsx`)
- [x] Same as Tasks: vertical tabs + PageHeader actions per tab (SLA, Notifications, Templates, Public Tracking, etc.).
- [x] Ensure toast feedback still triggered from the action handlers registered at page level.

### Warranty Settings (`features/settings/warranty/warranty-settings-page.tsx`)
- [x] Apply vertical tabs.
- [x] Move Save/Reset actions per tab (SLA, Templates, Notifications, Public Tracking) into PageHeader.
- [x] Keep card-level table buttons (Add template entry, Delete row) where they currently live.

### Customers Settings (`features/settings/customers/page.tsx`)
- [x] Convert the existing horizontal tabs (Loại khách hàng, Nhóm, Nguồn, Hạn thanh toán, Xếp hạng tín dụng) into vertical layout.
- [x] Migrate each tab’s `Thêm mới` button into PageHeader (with tab-aware actions) while leaving inline row actions untouched.

### Provinces (`features/settings/provinces/page.tsx`)
- [x] Header already exposes Import/Export/Add province.
- [x] Confirm we keep contextual buttons (Thêm phường/xã, Thêm quận/huyện) near their respective cards since they require a current selection (validated against the drag-and-drop list + dependent detail cards in current implementation).

### Appearance (`features/settings/appearance/appearance-page.tsx`)
- [x] Save/Thoát moved to PageHeader.
- [x] Evaluate whether theme preset chips need their own tab (confirmed current single-screen preview + editor workflow works better without extra tabs).

## Next Steps

1. Get approval on this checklist.
2. Implement vertical tab layout + header-action registry helper in a shared component to avoid duplication.
3. Apply per-page refactors following the tasks above, updating this file as items are completed.
