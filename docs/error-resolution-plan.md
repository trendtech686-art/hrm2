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
- [ ] Sau mỗi cụm, chạy lại `npx tsx scripts/verify-branded-ids.ts --skip-json` và `npx tsc --noEmit` để xác nhận tiến độ.

---

## Bước tiếp theo sau khi hoàn tất

1. Chạy full pipeline cục bộ: `npx tsx scripts/verify-branded-ids.ts --skip-json`, `npx tsc --noEmit`, `npm run test` (nếu có) để chắc chắn không còn cảnh báo.
2. Commit theo từng cụm hoặc một commit tổng kết (ví dụ: `chore: fix ci ts errors batch`), push lên `origin/main` và theo dõi GitHub Actions `pre-commit-checks` cho đến khi xanh.
3. Khi CI đã pass, cập nhật tài liệu liên quan (wiki/README) nếu có thay đổi API/luồng công việc, rồi thông báo cho team QA để họ smoke-test các màn hình bị ảnh hưởng (customers, orders, warranty...).
4. Cuối cùng đóng kế hoạch này bằng cách tick hết TODO ở trên và ghi chú ngày/commit hoàn thành để làm mốc cho các batch fix sau.

## Lộ trình dài hạn sau khi CI ổn định

### Giai đoạn 1 – Ổn định hoá (tuần 1-2)
- Thiết lập báo cáo tự động: thêm badge CI, cấu hình Slack/GitHub notifications khi workflow fail.
- Khoá schema ID: viết doc “ID governance” mô tả cách thêm entity mới, checklist cho mỗi PR liên quan ID.
- Dọn nợ kỹ thuật còn sót: xóa dứt điểm module deprecated (provinces cũ, route-prefetch legacy) để tránh tái phát lỗi import.

### Giai đoạn 2 – Ngăn ngừa tái phát (tuần 3-4)
- Viết test smoke TypeScript cho mỗi domain bằng `tsd` hoặc `vitest` unit đơn giản để bảo vệ contract `Receipt`, `Payment`, `ComplaintStatus`...
- Bật lại strictness dần dần: `exactOptionalPropertyTypes`, `noImplicitOverride`, giảm `skipLibCheck` nếu có thể.
- Tự động hoá seed branded IDs: chuẩn hoá script `scripts/verify-branded-ids.ts` để chạy ở pre-commit + nightly, xuất báo cáo JSON cho BI.

### Giai đoạn 3 – Tối ưu quy trình (tháng kế tiếp)
- Modular hoá store/data: di chuyển mock data ra `fixtures/` và tạo factory sinh hệ thống ID để reuse trong test/storybook.
- Bổ sung theo dõi hiệu năng CI: cache `node_modules`, phân tách job `lint`, `verify ids`, `tsc`, `test` để rút runtime < 5 phút.
- Triển khai tài liệu “Release checklist” trên wiki: mô tả tuần tự các bước từ local → staging → production kèm owner từng bước.

### Giai đoạn 4 – Nâng cấp sản phẩm (liên tục)
- Audit UX sau refactor: QA + PO review các màn hình bị động (customers/orders/warranty) nhằm tìm regression.
- Lên backlog refactor tiếp theo (ví dụ: migrate province store sang API mới, tách complaints/warranty thành package riêng) và ước lượng effort.
- Định kỳ (mỗi sprint) rà lại file này, cập nhật trạng thái TODO + roadmap để đảm bảo team luôn nắm cùng một kế hoạch.

> **Ghi chú kiểm thử:** Nhiều chức năng hiện tại vẫn thiếu và chưa được test kỹ. Vì vậy song song với roadmap trên cần triển khai một chương trình QA tối thiểu:
> - Ưu tiên high-risk flows (complaints, warranty, orders, inventory) để viết checklist smoke-test thủ công ngay khi fix xong từng cụm.
> - Lập bảng coverage: liệt kê chức năng đã hoàn thiện, đang thiếu, chưa test; assign owner + deadline cho từng mục.
> - Với chức năng còn dang dở, chốt phạm vi MVP rõ ràng rồi mới lên kế hoạch migrate hoặc deploy, tránh mang mã thử nghiệm lên production.

### Tầm nhìn kế tiếp – Hoàn thiện sản phẩm & triển khai thực tế
1. **Hoàn thiện nốt chức năng hiện có**: chốt backlog còn lại (phần complaints/warranty, inventory), gắn owner và deadline rõ ràng.
2. **Migrate sang Next.js** *(sau khi nền cũ ổn định)*: chỉ bắt đầu rollout chính thức khi CI Vite đã xanh liên tục và các chức năng MVP đã test xong. Có thể chạy POC Next.js song song (branch riêng) để chuẩn bị script migrate route/layout, nhưng tuyệt đối không tắt nền cũ trước khi QA xác nhận.
3. **Kết nối database thật**: chọn stack (PostgreSQL/MySQL), chuẩn hóa schema bằng Prisma hoặc Drizzle, viết migration, thay mock stores bằng API layer thật.
4. **Triển khai lên VPS**: chuẩn bị infra (Dockerfile, nginx, PM2), thiết lập pipeline build → deploy, cấu hình giám sát (uptime, logs) và backup database định kỳ.
5. **Chuyển giao vận hành**: cập nhật README/Wiki hướng dẫn setup Next.js + DB + deploy, phân công người trực phiên khi có sự cố.

> **Lưu ý về thứ tự:** Hãy hoàn thành giai đoạn ổn định (CI xanh, test smoke đầy đủ, chức năng còn thiếu được chốt phạm vi) trước khi migrate Next.js hoặc bật database thật. Việc này giúp tránh “double work” và giảm rủi ro khi phải duy trì hai pipeline song song.
