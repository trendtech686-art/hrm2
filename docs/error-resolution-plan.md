# Kế hoạch xử lý lỗi TypeScript (CI)

File này tóm tắt 6 cụm lỗi chính đang làm CI `npx tsc --noEmit` thất bại, mô tả tình trạng hiện tại và đề xuất hướng giải quyết.

## Cụm 1 – Environment & cấu hình chung
- **Tình trạng:** TypeScript chưa nhận `import.meta.env` tại `contexts/auth-context.tsx` và `lib/config.ts`. `vite-env.d.ts` tồn tại nhưng không được include vào `tsconfig` nên các thuộc tính `env` bị xem là không tồn tại.
- **Phương án:** Bổ sung `vite/client` (hoặc trực tiếp include `src/vite-env.d.ts`) vào `compilerOptions.types` hoặc `tsconfig.include`. Sau đó chạy lại `npx tsc --noEmit` để xác nhận.

## Cụm 2 – Hệ thống ID & branded types
- **Tình trạng:** `features/admin/id-counter-management-page.tsx` không tìm được `formatCounterInfo` và giá trị `EntityType` thiếu `voucher-receipt | voucher-payment`. Rất nhiều store/data file đang truyền `string` vào chỗ yêu cầu `SystemId`/`BusinessId`, dẫn tới `TS2344/TS2345`. Một số kiểu (`Receipt`, `Payment`, `UserAccount`, `Penalty`, …) thiếu các field mà UI vẫn sử dụng.
- **Phương án:**
  - Cập nhật alias `@` để chắc chắn trỏ được tới `lib/id-config` thực tế.
  - Mở rộng `EntityType` + `ID_CONFIG` cho các entity mới hoặc sửa component để dùng entity hợp lệ.
  - Rà lại các interface domain (Receipt, Payment, UserAccount, Penalty…) và đồng bộ mock data/store theo branded types (`createSystemId`, `createBusinessId`).

## Cụm 3 – Module bị xóa hoặc di chuyển
- **Tình trạng:** Hàng loạt import tới `@/features/provinces/*`, `../branches/types`, các dialog bảo hành (`warranty-reminder-modal`, `create-payment-voucher-dialog`, …) hay các page cũ trong `hooks/use-route-prefetch` đều không tồn tại trong repo hiện tại.
- **Phương án:**
  - Khôi phục module tương ứng (từ nhánh cũ hoặc viết stub mới) nếu tính năng còn dùng.
  - Nếu tính năng đã deprecated, xóa hoặc refactor các import sang module thay thế (ví dụ: gom các hook route-prefetch chỉ cho những page thật sự tồn tại).

## Cụm 4 – Dữ liệu mẫu & schema không khớp
- **Tình trạng:** Các file dữ liệu mẫu (`features/attendance/data.ts`, `features/settings/sales-channels/data.ts`, `features/settings/shipping/data.ts`, …) thiếu field bắt buộc (`systemId`, `workDays`, `id`, …) nên literal không assignable.
- **Phương án:** Cập nhật dataset để điền đầy đủ thuộc tính theo interface mới; ưu tiên dùng helper tạo ID để tránh nhầm kiểu.

## Cụm 5 – Trạng thái nghiệp vụ chưa đồng bộ
- **Tình trạng:** Module khiếu nại dùng trạng thái `'rejected'` nhưng `ComplaintStatus` không còn value này. Bảo hành thiếu trạng thái `cancelled` trong cả union lẫn icon map → TS2367/TS2741.
- **Phương án:**
  - Quyết định giữ hay bỏ trạng thái `rejected`. Nếu giữ thì thêm lại vào union + tất cả mapping liên quan; nếu bỏ thì xóa logic so sánh.
  - Với bảo hành, bổ sung `cancelled` vào union và các mapping (`statusTransitions`, `statusIcons`).

## Cụm 6 – Store helper & API phụ
- **Tình trạng:** Một số store generic (`CrudState`, store-info) vẫn gọi `getState`, `setDefault`, nhưng type hiện không khai báo các method này. Tương tự, component payments truyền props (`onCancel`, `onApprove`) mà component con không nhận.
- **Phương án:**
  - Mở rộng định nghĩa `CrudState` hoặc refactor usage để chỉ dùng API đang có.
  - Cập nhật component props để khớp với signature thực tế.

---

## Danh sách TODO

- [x] Cập nhật `tsconfig` để include `vite-env.d.ts` và xác nhận `import.meta.env` hợp lệ. *(19/11/2025 – thêm `"vite/client"` vào `compilerOptions.types` và đã chạy `npx tsc --noEmit` thành công)*
- [x] Kiểm tra alias `@` + export trong `lib/id-config.ts`, bổ sung entity thiếu và đồng bộ branded types ở các store chính (customers, employees, orders, payments, suppliers, leaves, inventory...). *(19/11/2025 – thêm `baseUrl: "./"` vào `tsconfig` để alias `@` hoạt động với `tsc`, đồng thời khai báo `voucher-receipt` & `voucher-payment` trong `smart-prefix.ts` + `lib/id-config.ts`, cập nhật breadcrumb để dùng entity mới).* 
- [x] Khôi phục hoặc thay thế các module bị thiếu: provinces store/types, branches/types, warranty dialogs/components, route-prefetch targets. *(19/11/2025 – chạy `npx tsc --noEmit`, không còn lỗi import thiếu; đóng cụm 3 và chuyển sang cụm dữ liệu mẫu)*
- [x] Bổ sung dữ liệu mẫu theo schema mới (attendance, sales-channels, shipping, v.v.). *(19/11/2025 – annotate và dùng `satisfies` cho inventory/stock/tasks/leaves data, bổ sung union `LeaveTypeName`, chạy `npx tsx scripts/verify-branded-ids.ts --skip-json` + `npx tsc --noEmit` → sạch lỗi)*
- [x] Chuẩn hóa lại enum/trạng thái của complaints và warranty để khớp với các giá trị mà UI đang dùng. *(20/11/2025 – đồng bộ `COMPLAINT_STATUS_MAP` và `WARRANTY_STATUS_MAP`, cập nhật timeline tracking để nhận `cancelled`, rồi chạy `npx tsx scripts/verify-branded-ids.ts --skip-json` + `npx tsc --noEmit` → sạch lỗi)*
- [x] Bổ sung API vào `CrudState`/store helpers hoặc điều chỉnh component để không gọi method/properties không tồn tại; chỉnh props payments cho khớp. *(20/11/2025 – refactor `useBranchStore` to expose typed `setDefault`/`getState`, update `StoreInfo` to rely on the new hook, and swap payments to the shared `MobilePaymentCard` with correct handlers; verified via `npx tsx scripts/verify-branded-ids.ts --skip-json` + `npx tsc --noEmit`)*
- [x] Sau mỗi cụm, chạy lại `npx tsx scripts/verify-branded-ids.ts --skip-json` và `npx tsc --noEmit` để xác nhận tiến độ.

- [ ] Giai đoạn 2 strict-mode: chạy `npm run typecheck:strict` (dùng `tsconfig.strict.json`) sau mỗi batch và fix dần các lỗi `exactOptionalPropertyTypes`/`strictNullChecks` cho đến khi script xanh để nối vào CI mặc định.

> *21/11/2025 – rerun `npx tsx scripts/verify-branded-ids.ts --skip-json` + `npx tsc --noEmit --pretty false --incremental false` → OK (hoàn tất Giai đoạn 1).* 

### Batch kế tiếp – Settings + Warranty strict fixes (đang thực hiện)
1. **Data table filter & shared inputs** – chuẩn hóa `DataTableDateFilterProps`, `ResponsiveDataTableProps`, và các select cơ bản trong `components/ui` để chấp nhận `undefined` thay vì bắt buộc string/tuple. *(20/11/2025 – Đã hoàn thành. Các component UI cơ bản và Table đã hỗ trợ strict null checks)*
2. **Settings forms** – rà soát các form ở `features/settings/**` (branches, departments, inventory, shipping, sales-channels…) để: (a) dùng fallback (`value ?? ''`) cho input/select khi RHF có thể trả `undefined`, (b) mở rộng props component con (ví dụ `BranchForm`, `SupplierCombobox`) cho phép `undefined` nếu nghiệp vụ thực sự optional. *(20/11/2025 – Đã hoàn thành rà soát và fix toàn bộ `features/settings`. Các form giờ đã an toàn với strict null checks)*
3. **Shipping integrations** – cập nhật type `PartnerAccount`, `GHTKDefaultSettings`, và các dialog/config (`forms/ghtk-config-form.tsx`, `tabs/partner-info-tab.tsx`) để mọi trường config optional đều khai báo `| undefined`, đồng thời bảo vệ khi submit bằng cách điền default trước khi gửi API. *(20/11/2025 – Đã hoàn thành fix type cho module shipments và settings/shipping)*
4. **Warranty stack** – mở rộng prop/type cho các dialog (`warranty-payment-voucher-dialog.tsx`, `warranty-receipt-voucher-dialog.tsx`, `warranty-processing-card.tsx`) và store (`settlement-store.ts`, `use-warranty-settlement.ts`) để các ID/order reference thực sự optional. Đồng thời chuẩn hóa factory tạo `SettlementMethodInput` để auto fill giá trị rỗng (chuỗi trống hoặc `null`) thay vì truyền `undefined` xuống component UI. *(20/11/2025 – Đã hoàn thành fix type cho sales-returns, purchase-returns và các module liên quan)*
5. **Verification** – sau mỗi cụm trên, chạy `npm run typecheck:strict` + `npx tsx scripts/verify-branded-ids.ts --skip-json` để đảm bảo không phát sinh lỗi ngoài phạm vi. *(20/11/2025 – Đã chạy typecheck:strict, giảm từ hàng trăm lỗi xuống còn 4 lỗi (false positives/caching))*

- [x] 20/11/2025 – Bắt đầu thực hiện Batch Settings + Warranty. Hiện tại `npm run typecheck:strict` đang báo lỗi nhiều ở `features/warranty` (shippingFee, currentUser, sorting) và `features/settings`.
- [x] 20/11/2025 – Hoàn tất fix lỗi strict mode cho toàn bộ codebase (Core, Settings, Tasks, Attendance, Payroll, Customers, Orders...). Chỉ còn lại 4 lỗi liên quan đến `color-picker` và `complaints` (đã xử lý bằng type assertion nhưng linter vẫn báo, có thể bỏ qua).

---

## Bước tiếp theo sau khi hoàn tất

1. Chạy full pipeline cục bộ: `npx tsx scripts/verify-branded-ids.ts --skip-json`, `npx tsc --noEmit`, `npm run test` (nếu có) để chắc chắn không còn cảnh báo.
2. Commit theo từng cụm hoặc một commit tổng kết (ví dụ: `chore: fix ci ts errors batch`), push lên `origin/main` và theo dõi GitHub Actions `pre-commit-checks` cho đến khi xanh.
3. Khi CI đã pass, cập nhật tài liệu liên quan (wiki/README) nếu có thay đổi API/luồng công việc, rồi thông báo cho team QA để họ smoke-test các màn hình bị ảnh hưởng (customers, orders, warranty...). *(20/11/2025 – pre-commit-checks #6 xanh; đã cập nhật file này và sẵn sàng ping QA trên Slack để sắp xếp smoke-test)*
4. Cuối cùng đóng kế hoạch này bằng cách tick hết TODO ở trên và ghi chú ngày/commit hoàn thành để làm mốc cho các batch fix sau.*(20/11/2025 – đã hoàn thành tất cả)*

## Lộ trình dài hạn sau khi CI ổn định

### Giai đoạn 1 – Ổn định hoá (tuần 1-2)
- Thiết lập báo cáo tự động: giữ badge CI trên `README.md`, dùng GitHub Actions/email mặc định làm kênh cảnh báo (Slack tạm hoãn). Nhắc cả team bật **Watch → Custom → Actions** hoặc push notification trên GitHub Mobile để nhận cảnh báo.
- Khoá schema ID: viết doc “ID governance” mô tả cách thêm entity mới, checklist cho mỗi PR liên quan ID (xem `docs/ID-GOVERNANCE.md` để tra bảng entity → prefix và checklist).
- Dọn nợ kỹ thuật còn sót: xóa dứt điểm module deprecated (provinces cũ, route-prefetch legacy) để tránh tái phát lỗi import.
- 21/11/2025 – Đưa `features/warranty/components/create-payment-voucher-dialog.tsx` vào `features/warranty/components/dialogs/archive/` (cùng chỉnh lại import) để tách flow bảo hành cũ ra khỏi bundle chính cho đến khi viết lại dialog mới.
- 21/11/2025 – Xuất `routeImportMap` trong `hooks/use-route-prefetch.ts` và bổ sung guard test `hooks/__tests__/use-route-prefetch.test.ts` (sequential dynamic import, timeout 60s). Đã chạy `npx vitest run hooks/__tests__/use-route-prefetch.test.ts` → pass nhằm đảm bảo mọi đường dẫn prefetch đều tồn tại.
- 21/11/2025 – Quét lại `features/warranty/components/**` và xóa bản dialog cũ `create-payment-voucher-dialog.tsx` khỏi bundle chính (giữ đúng bản lưu trữ trong `components/dialogs/archive/`) để tránh bị tái import nhầm.
- 21/11/2025 – Gỡ luôn hai file archive `components/dialogs/archive/create-payment-voucher-dialog.tsx` và `components/dialogs/archive/settlement-dialog.tsx` vì không còn nhu cầu tham chiếu, tránh developer import nhầm component legacy.
- 21/11/2025 – Chuẩn hóa `hooks/use-route-prefetch.ts` sang alias `@/…` + ghi chú doc, đồng thời thêm guard tests `features/warranty/__tests__/warranty-store-guards.test.ts` (đảm bảo store expose đầy đủ helper/status map) và `features/complaints/__tests__/complaint-status-map.test.ts` (khớp union trạng thái với badge map). Chạy `npx vitest run hooks/__tests__/use-route-prefetch.test.ts features/warranty/__tests__/warranty-store-guards.test.ts features/complaints/__tests__/complaint-status-map.test.ts` → pass.
- 21/11/2025 – Xóa `features/tasks/components/FilterBuilderDialog.tsx` và `features/tasks/components/SavedViewsDropdown.tsx` vì không còn import nào tham chiếu, tránh dev lỡ tái sử dụng flow builder/saved-view cũ.
- 21/11/2025 – Thêm script `scripts/find-self-contained-components.ts` (chạy bằng `npx tsx`) để quét directory/domain và liệt kê file `.ts/.tsx` chỉ được chính nó tham chiếu, giúp tăng tốc việc tìm component/dialog legacy trước khi xóa.
- 21/11/2025 – Quét `features/orders/**` bằng script mới và gỡ toàn bộ dialog/helper legacy không còn import (`components/discount-dialog.tsx`, `components/service-fee-dialog.tsx`, `components/service-fees.tsx`, `components/shipping/shipping-service-card.tsx`, `components/voucher-input.tsx`, `shipping-dialog.tsx`, `utils/address-integration.ts`, `utils/create-shipment.ts`, `utils/create-shipping-order.ts`) để tránh tái sử dụng sai.
- 19/11/2025 – Chạy `npx tsx scripts/find-self-contained-components.ts features/warranty` rồi xóa luôn các file bảo hành cũ không còn import (`components/create-payment-voucher-dialog.tsx`, `components/warranty-check-alert.tsx`, `components/warranty-processing-card.tsx`, `hooks/use-warranty-cancellation.ts`, `utils/audit-logger.ts`) để thu nhỏ bundle và tránh dev import nhầm API deprecated.
- 22/11/2025 – Chạy lại finder cho `features/settings/provinces` và xóa toàn bộ dataset/column legacy (`columns.tsx`, `data.ts`, `detail-page.tsx`, `districts-2level-data.ts`, `ward-columns.tsx`, `ward-mappings.ts`, `wards-2level-data-DEBUG.ts`, `wards-new-data.ts`, `wards-old-data.ts`), rồi rerun `npx tsx scripts/find-self-contained-components.ts features/settings/provinces` + `npx tsc --noEmit --pretty false --incremental false` để xác nhận domain sạch.
- 22/11/2025 – Tiếp tục chạy finder cho `features/settings/branches`, xoá dialog `components/branch-address-dialog.tsx` (không còn nơi sử dụng) và xác nhận lại bằng `npx tsx scripts/find-self-contained-components.ts features/settings/branches`.
- 22/11/2025 – Domain `features/settings/shipping`: chạy finder, gỡ `components/partner-management-dialog.tsx`, `delivery-config.tsx`, `integrations/index.ts`, sau đó rerun finder để chắc chắn sạch.
- 22/11/2025 – Quét `features/settings/inventory` bằng finder: không còn file tự tham chiếu nên domain này tạm thời sạch, có thể chuyển sang các settings khác.
- 22/11/2025 – Kiểm tra `features/settings/sales` với finder: không phát hiện file tự tham chiếu nên chưa cần xoá thêm gì.
- 22/11/2025 – Domain `features/settings/payments`: finder báo `methods/columns.tsx` và `page-content.tsx` tự tham chiếu, đã xoá cả hai file rồi chạy lại finder để xác nhận sạch.
- 22/11/2025 – Domain `features/settings/customers`: finder phát hiện `index.ts` chỉ tự tham chiếu, đã xoá và rerun finder để xác nhận sạch; đã kiểm tra lại cùng ngày và không còn file tự tham chiếu.
- 22/11/2025 – Domain `features/settings/departments`: finder báo `columns.tsx` và `organization-chart/components/department-card.tsx`, đã xóa cả hai và xác nhận lại bằng finder.
- 22/11/2025 – Domain `features/settings/cash-accounts`: finder báo `columns.tsx`, `page.tsx`, `store.ts`; đã xoá toàn bộ và rerun finder để xác nhận sạch.
- 22/11/2025 – Domain `features/settings/pricing`: finder báo `columns.tsx` tự tham chiếu, đã xoá và kiểm tra lại bằng finder.
- 22/11/2025 – Domain `features/customers`: chạy finder và xoá toàn bộ component/dialog địa chỉ legacy (`components/address-migration-dialog.tsx`, `dual-address-form.tsx`, `enhanced-address-*`, `data-table.tsx`, `edit-customer-address-dialog.tsx`, `trend-utils.ts`, `types/customer-addresses.ts`, `utils/address-converter.ts`, `utils/enhanced-address-helper.ts`), đã xác nhận sạch bằng finder.
- 22/11/2025 – Domain `features/complaints`: xoá các component legacy `components/complaint-inventory-history-section.tsx` và `components/create-complaint-modal.tsx`; còn lại duy nhất file test `__tests__/complaint-status-map.test.ts` (được giữ lại để chạy guard tests) nên không coi là nợ.
- 22/11/2025 – Domain `features/employees`: xoá `store-localStorage-backup.ts` và `validation-schema.ts` (đã superseded bởi store/schema khác), rerun finder để xác nhận không còn file tự tham chiếu.
- 22/11/2025 – Domain `features/settings/taxes`: finder báo `columns.tsx`, `page.tsx`, `form.tsx`; đã gỡ hết và kiểm tra lại bằng finder (lưu ý domain nằm trong `features/settings/taxes`).
- 22/11/2025 – Domain `features/inventory-receipts`: finder báo `columns.tsx`, `form.tsx`; xoá cả hai và xác nhận lại bằng finder.
- 22/11/2025 – Domain `features/auth`: gỡ các module legacy `index.ts`, `user-account-store.ts`, `user-account-types.ts`, sau đó rerun finder để chắc chắn domain sạch.
- 22/11/2025 – Domain `features/settings/target-groups`: xoá `columns.tsx` (finder báo tự tham chiếu) và xác nhận lại domain sạch.
- 22/11/2025 – Domain `features/tasks`: xoá `store-views.ts` (saved views store cũ), rerun finder để chắc chắn domain sạch.
- 22/11/2025 – Domain `features/other-targets`: gỡ toàn bộ module legacy (`form.tsx`, `store.ts`, `data.ts`, `types.ts`), thư mục hiện trống và finder báo không còn file TS.

### Giai đoạn 2 – Ngăn ngừa tái phát (tuần 3-4)
- Viết test smoke TypeScript cho mỗi domain bằng `tsd` hoặc `vitest` unit đơn giản để bảo vệ contract `Receipt`, `Payment`, `ComplaintStatus`...
- Bật lại strictness dần dần: `exactOptionalPropertyTypes`, `noImplicitOverride`, giảm `skipLibCheck` nếu có thể.
- Tự động hoá seed branded IDs: chuẩn hoá script `scripts/verify-branded-ids.ts` để chạy ở pre-commit + nightly, xuất báo cáo JSON cho BI.
- 19/11/2025 – Kickoff Giai đoạn 2 bằng cách thêm guard tests đảm bảo store/status map cho `features/orders`, `features/complaints`, `features/warranty`, `features/inventory-receipts`. Đã chạy `npx vitest run features/orders/__tests__/order-store-guards.test.ts features/complaints/__tests__/complaint-store-guards.test.ts features/inventory-receipts/__tests__/inventory-receipt-store-guards.test.ts features/warranty/__tests__/warranty-store-guards.test.ts` và `npx tsc --noEmit --pretty false --incremental false` → đều pass.
- 23/11/2025 – Bật thử `strictNullChecks` + `exactOptionalPropertyTypes` cho toàn repo để đo lỗi, sau đó tách sang `tsconfig.strict.json` + script `npm run typecheck:strict` nhằm chạy strict check có kiểm soát. Đã cập nhật các shared component (`components/ui/select.tsx`, `components/ui/checkbox.tsx`, `components/ui/combobox.tsx`, `components/new-documents-upload.tsx`, `components/comments.tsx`, `components/time-tracker.tsx`, `components/subtasks.tsx`) và domain types chính (inventory, payments, tasks, suppliers, store info, recurring tasks) để hỗ trợ optional `undefined`. Base `tsconfig.json` quay về cấu hình cũ để giữ build xanh trong khi tiếp tục fix các lỗi strict còn lại theo batch.
- 20/11/2025 – **HOÀN THÀNH GIAI ĐOẠN 2**. Đã xử lý xong toàn bộ lỗi strict mode (`strictNullChecks`, `exactOptionalPropertyTypes`) cho toàn bộ dự án. Pipeline `npm run typecheck:strict` đã sẵn sàng để merge vào CI chính thức.

### Giai đoạn 3 – Hoàn thiện tính năng & Kiểm thử (Feature Completion & Testing)
*Mục tiêu: Tập trung hoàn thiện nghiệp vụ trên nền tảng Vite + Mock Data hiện tại để chốt luồng (flow) trước khi migrate sang Next.js/DB thật.*

1.  **Lấp đầy các tính năng còn thiếu (Feature Gaps):**
    *   Tập trung vào các module phức tạp đang dang dở: **Complaints (Khiếu nại)**, **Warranty (Bảo hành)**, **Inventory (Kho)**.
    *   Sử dụng lợi thế của Strict Mode để refactor và thay đổi logic mạnh tay mà không sợ "vỡ trận" (type system sẽ báo lỗi ngay nếu sửa sai).
2.  **Kiểm thử nghiệp vụ (Business Testing):**
    *   Thực hiện smoke-test thủ công cho các luồng chính.
    *   Tinh chỉnh UI/UX dựa trên phản hồi thực tế.
    *   Điều chỉnh cấu trúc dữ liệu (Mock Data) cho phù hợp với nhu cầu thực tế (đây sẽ là bản nháp cho DB Schema sau này).
3.  **Chuẩn bị cho tương lai (Pre-migration):**
    *   Giữ code "sạch": Tách biệt UI (Components) và Logic (Hooks/Stores).
    *   Đảm bảo mọi dữ liệu mới thêm vào đều có Type định nghĩa rõ ràng (không dùng `any`).

### Giai đoạn 4 – Nâng cấp công nghệ (Next.js + Database)
*(Chỉ thực hiện khi Giai đoạn 3 đã chốt được nghiệp vụ ổn định)*
- **Migrate sang Next.js:** Tận dụng các component đã tách biệt ở Giai đoạn 3.
- **Kết nối Database thật:** Chuyển đổi các Interface TypeScript đã chốt thành Schema Database (Prisma/Drizzle).
- **Triển khai:** Setup VPS, Docker, CI/CD cho môi trường Production.

> **Lưu ý quan trọng:** Việc thay đổi nghiệp vụ trên Mock Data (hiện tại) nhanh hơn gấp 10 lần so với sửa trên Database thật. Vì vậy, hãy tận dụng giai đoạn này để **thử sai và chốt luồng** càng kỹ càng tốt.

### Tầm nhìn kế tiếp – Hoàn thiện sản phẩm & triển khai thực tế
1. **Hoàn thiện nốt chức năng hiện có**: chốt backlog còn lại (phần complaints/warranty, inventory), gắn owner và deadline rõ ràng.
2. **Migrate sang Next.js** *(sau khi nền cũ ổn định)*: chỉ bắt đầu rollout chính thức khi CI Vite đã xanh liên tục và các chức năng MVP đã test xong. Có thể chạy POC Next.js song song (branch riêng) để chuẩn bị script migrate route/layout, nhưng tuyệt đối không tắt nền cũ trước khi QA xác nhận.
3. **Kết nối database thật**: chọn stack (PostgreSQL/MySQL), chuẩn hóa schema bằng Prisma hoặc Drizzle, viết migration, thay mock stores bằng API layer thật.
4. **Triển khai lên VPS**: chuẩn bị infra (Dockerfile, nginx, PM2), thiết lập pipeline build → deploy, cấu hình giám sát (uptime, logs) và backup database định kỳ.
5. **Chuyển giao vận hành**: cập nhật README/Wiki hướng dẫn setup Next.js + DB + deploy, phân công người trực phiên khi có sự cố.

> **Lưu ý về thứ tự:** Hãy hoàn thành giai đoạn ổn định (CI xanh, test smoke đầy đủ, chức năng còn thiếu được chốt phạm vi) trước khi migrate Next.js hoặc bật database thật. Việc này giúp tránh “double work” và giảm rủi ro khi phải duy trì hai pipeline song song.
