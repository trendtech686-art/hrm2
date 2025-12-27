# Kế hoạch routing khi chuyển lên Next.js (Draft 23/11/2025)

## 1. Mục tiêu
- Duy trì 87 routes hiện tại khi chuyển qua `app/` router của Next.js 15.
- Tận dụng `layout.tsx` theo segment để tái sử dụng header, breadcrumb, guard.
- Chuẩn hóa metadata (title, description, breadcrumb) bằng `generateMetadata()` thay cho `routeDefinitions`.
- Chuẩn bị đường đi cho việc chia sẻ Zustand store thông qua server actions/service layer mới.

## 2. Phân đoạn (segment) đề xuất
| Segment | Nội dung chính | Thư mục gợi ý | Ghi chú |
| --- | --- | --- | --- |
| `(hrm)` | Nhân sự, chấm công, nghỉ phép, payroll, KPI | `app/(hrm)/employees`, `app/(hrm)/attendance`, ... | Chia thêm cấp `employees/(detail)/[systemId]` để áp dụng `generateStaticParams` nếu cần prefetch server-side.
| `(sales)` | Customers, products, orders, sales returns, packaging, shipments | `app/(sales)/customers`, `.../orders`, `.../returns` | Packaging/shipments giữ trong sales vì phụ thuộc order context; detail pages dùng dynamic segment `[systemId]`.
| `(procurement)` | Suppliers, purchase orders/returns, inventory receipts/checks | `app/(procurement)/suppliers`, `.../purchase-orders`, `.../inventory-receipts` | Cho phép chia sẻ layout hiển thị trạng thái nhập hàng.
| `(finance)` | Cashbook, receipts, payments, reconciliation | `app/(finance)/cashbook`, `.../receipts`, `.../payments`, `.../reconciliation` | Layout riêng để hiển thị bộ lọc kỳ kế toán.
| `(operations)` | Tasks, warranty, complaints, duty schedule, penalties | `app/(operations)/tasks`, `.../warranty`, `.../complaints` | Segment này sử dụng context evidence/upload chung, nên giữ layout riêng cho attachments guard.
| `(settings)` | Tất cả trang Settings, ID counter, system logs, inventory config | `app/(settings)/settings/...` (ví dụ `app/(settings)/settings/employees`) | Layout kế thừa sidebar/phân nhóm.
| `(reports)` | Sales report, inventory report, dashboards phụ | `app/(reports)/sales-report` | Dễ áp dụng streaming data.
| `(public)` | Đăng nhập, signup, complaint tracking | `app/(public)/auth/login`, `app/(public)/complaint-tracking/[complaintId]` | Không dùng layout chính để loại bỏ guard.

**Routing top-level**: `app/layout.tsx` chứa ThemeProvider + PageHeaderProvider dùng cho mọi segment. Mỗi segment sẽ có `layout.tsx` riêng để treo sidebar/menu tương ứng.

## 3. Metadata & breadcrumb
- Mapping từ `lib/route-definitions.tsx`:
  - `meta.description` → `generateMetadata().description`.
  - `meta.breadcrumb` → util `buildBreadcrumbFromSegments()` (dựa trên `docs/router-breadcrumb-system-guide.md`).
  - `meta.preload` → `export const preferredRegion` hoặc `generateStaticParams` (tùy trang). Với Next.js, prefetch handled automatically nên chỉ cần đánh dấu trang quan trọng (Employees, Products).
- Tạo helper `lib/next-metadata.ts`:
  ```ts
  export function buildMetadata(config: RouteMetaConfig): Metadata {
    return {
      title: config.dynamicTitle ?? config.title,
      description: config.description,
    };
  }
  ```
- Breadcrumb: chuyển logic `MODULES` + `PATH_PATTERNS` vào `lib/breadcrumb-system.ts` nhưng expose hàm dùng trong Server Component (`generateBreadcrumbForPath(pathname, context)`). Layout mỗi segment sẽ đọc `useSelectedLayoutSegment()` để dựng breadcrumb mặc định, còn trang detail có thể override bằng client component thông qua Context như hiện nay.

## 4. Chiến lược chuyển đổi
1. **Phase 1 – Khung Next.js**
   - Tạo app/ + segment layout (không di chuyển page code). 
   - Tạo file bridge `app/(hrm)/employees/page.tsx` chỉ cần `export { EmployeesPage as default } from '@/features/employees/page'` để đảm bảo route mapping đúng.
   - Thêm `next.config.js` với `experimental.serverActions` (chuẩn bị cho persistence layer).

2. **Phase 2 – Metadata/Breadcrumb**
   - Di trú dữ liệu trong `lib/route-definitions.tsx` sang `lib/route-meta.ts` (đơn vị metadata thuần JSON). 
   - Mỗi page Next sẽ import meta tương ứng và gọi `export const metadata = buildMetadata(meta.employees.list)`.
   - Giữ `contexts/page-header-context.tsx` cho client component, nhưng layout server sẽ truyền breadcrumb mặc định qua props để tránh FOUC.

3. **Phase 3 – Route grouping nâng cao**
   - Sử dụng Parallel Routes nếu cần cho các trang multi-view (ví dụ Tasks list vs dashboard). 
   - Áp dụng `generateStaticParams` cho các trang public (complaint tracking) để prebuild sample? (Optional).

4. **Phase 4 – Loại bỏ `route-definitions.tsx`**
   - Khi toàn bộ trang đã chạy trong Next `app/`, giữ lại file này chỉ làm mapping tạm (hoặc xóa hẳn).
   - Sidebar/navigation sẽ đọc từ một nguồn chung (`lib/navigation.ts`) để tránh trùng lặp.

## 5. Metadata cần chuyển
| Thuộc tính hiện tại | Nơi mới | Ghi chú |
| --- | --- | --- |
| `title` | `export const metadata = { title }` + `generateMetadata` cho dynamic detail | Dùng `titleTemplate` ở layout segment để auto thêm hậu tố (vd. "Nhân sự · HRM2"). |
| `description` | `metadata.description` | Giữ nguyên nội dung tiếng Việt. |
| `breadcrumb` | `SegmentLayout` + `pageHeaderContext` | Layout tạo breadcrumb mặc định theo segment, detail pages override qua context (client). |
| `requiresAuth` | Middleware (`middleware.ts`) + server `auth()` | `app/(public)` bỏ auth, các segment khác dùng middleware redirect. |
| `preload` | Next.js prefetch (link default), optional `loading.tsx` để skeleton | Không cần tuỳ biến gì thêm. |

## 6. Việc tồn đọng khi chuyển
- Tách component `PageHeaderProvider` thành Client Component riêng vì Next layout mặc định là server.
- Chuẩn hóa đường dẫn import tuyệt đối (`@/features/...`) để dùng được trong app router.
- Viết script kiểm tra route map: so sánh `route-definitions.tsx` và cấu trúc `app/` (có thể tái sử dụng script `scripts/find-self-contained-components.ts`).
- Cập nhật docs/sidebar navigation khi segment thay đổi.

## 7. Timeline đề xuất
1. **Tuần 48/2025**: Tạo segment layout, viết bridge pages (không đổi logic).
2. **Tuần 49/2025**: Di trú metadata + breadcrumb helpers, cập nhật sidebar để dùng config chung.
3. **Tuần 50/2025**: Thử nghiệm module HRM & Sales trên Next.js dev branch, chạy CI, tối ưu context.
4. **Tuần 51/2025**: Hoàn tất migration toàn bộ, xoá `route-definitions.tsx`, cập nhật tài liệu và checklist QA.

---
**Trạng thái:** Draft ✅ – cần review với team FE trước khi tạo branch Next.js.
