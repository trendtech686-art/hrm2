# Rà soát module Customers (30/11/2025)

## 1. Kiến trúc & hiện trạng
- Tất cả dữ liệu khách hàng nằm trong Zustand store `useCustomerStore` (`features/customers/store.ts`) với seed `features/customers/data.ts` và `persistKey: "hrm-customers"`. CRUD, công nợ, intelligence, SLA acknowledgement… đều chỉ được lưu trong `localStorage`, không có API hay đồng bộ đa người dùng.
- Danh sách khách hàng (`features/customers/page.tsx`) dựng trên `ResponsiveDataTable`, bộ lọc/table state lưu vào `localStorage`. Hàm `useCustomersQuery` vẫn gọi `fetchCustomersPage` (cũng đọc store) nên toàn bộ phân trang/tìm kiếm thực chất chạy client, lặp lại cùng một dataset.
- Form nhập (`features/customers/customer-form.tsx`, ~1.5k dòng) gom mọi nghiệp vụ: chọn settings, quản lý nhiều địa chỉ 2 cấp/3 cấp, upload hồ sơ & hợp đồng thông qua `FileUploadAPI` giả lập, autofill hạn mức từ settings. Không có server validation; mọi tính toán chạy trực tiếp trong component.
- Bộ engine SLA khách hàng (`features/customers/sla/*`) xây index, summary và acknowledgement dưới dạng JSON cache trong `localStorage`. Các cảnh báo liên quan Orders/Complaints chỉ xuất hiện trong phiên trình duyệt hiện tại.
- Khối phân tích hành vi (`features/customers/intelligence-utils.ts`, `hooks/use-customer-intelligence.ts`) tính RFM, health score, churn risk bằng cách quét toàn bộ store mỗi lần render. Công nợ nâng cao nằm ở `credit-utils.ts` + `debt-tracking-utils.ts`, nhưng vẫn chỉ dựa vào dữ liệu nhúng trong `Customer`.
- Logic chuyển đổi địa chỉ 2⇄3 cấp (`components/address-*` + `utils/address-conversion-helper.ts`) truy cập trực tiếp `useProvinceStore.getState()` và thao tác song song với schema Zod, chưa có cơ chế đồng bộ xuống backend hay API vận chuyển.

## 2. Đối chiếu checklist
| Hạng mục | Trạng thái | Nhận xét |
| --- | --- | --- |
| Types & Validation | ⚠️ Một phần | `Customer` type khá chi tiết (debt, intelligence, addresses) nhưng `validation.ts` chỉ áp dụng phía client. Không có kiểm tra quan hệ (type/group/source) hay ràng buộc ít nhất một địa chỉ, một liên hệ. Công nợ/số hợp đồng vẫn nhận giá trị âm nếu gửi trực tiếp qua API tương lai vì chưa có server schema. |
| UI/UX | ⚠️ Một phần | Data table responsive và có mobile list, nhưng `customer-form.tsx` quá dài, phụ thuộc nhiều toast/side-effect, thiếu autosave và khả năng tách nhỏ cho mobile. Dialog chuyển đổi địa chỉ phức tạp, chưa có fallback khi kho dữ liệu hành chính đổi. |
| Performance | ⚠️ Một phần | `CustomersPage` chạy Fuse search + sort trên toàn bộ dataset mỗi render, song song với `fetchCustomersPage`. Các hook intelligence/debt recalculates cho từng khách hàng ở client → khó mở rộng khi dữ liệu lớn. |
| Database Ready | ❌ | Chưa có Prisma schema cho `Customer`, `CustomerAddress`, `CustomerContact`, `CustomerDebtTransaction`, `CustomerDebtReminder`, `CustomerSlaAcknowledgement`... Toàn bộ dữ liệu lưu trong JSON client, không thể audit, không có khóa ngoại tới Employees, Orders, Cashbook. |
| API Ready | ❌ | Không tồn tại route Next.js/Express nào. `customer-service.ts` chỉ giả lập latency 120ms. Không thể đồng bộ với Orders/Complaints/Warranty/Cashbook. |
| Liên kết module | ⚠️ Thiếu | Các helper `incrementOrderStats`, `addDebtTransaction`… chỉ định nghĩa nhưng chưa được Orders/Purchase Orders/Cashbook gọi. SLA cảnh báo không bắn event sang Complaints/Task module, cash activity không cập nhật công nợ. |

## 3. Logic & liên kết đáng chú ý
1. **Zustand store mở rộng** (`features/customers/store.ts`): kế thừa `createCrudStore`, bổ sung hàm tìm kiếm Fuse, cập nhật công nợ, các counters đơn hàng, batch intelligence (`updateCustomerIntelligence`). Tuy nhiên mọi thao tác đều mutate trực tiếp dữ liệu đang persist client.
2. **Quy trình công nợ** (`credit-utils.ts`, `debt-tracking-utils.ts`, `hooks/use-customer-debt.ts`): tính hạn mức, nhắc nợ, phân loại quá hạn và expose hook `useHighRiskDebtCustomers`. Không có ledger thực sự; việc cộng/trừ công nợ tách rời Cashbook và Orders.
3. **Customer Intelligence** (`intelligence-utils.ts`, `hooks/use-customer-intelligence.ts`): RFM/Health/Churn được tính bằng cách duyệt toàn bộ store mỗi lần render. Kết quả chỉ lưu trong cùng bản ghi `Customer`, không có bảng/timeline để làm báo cáo.
4. **SLA Engine** (`features/customers/sla/*`): `buildSlaIndex` chạy client, cache trong `localStorage` và acknowledgement cũng lưu local qua `ack-storage.ts`. Không có cơ chế phân quyền/đẩy thông báo đến CRM Tasks hay Notifications.
5. **Địa chỉ 2⇄3 cấp** (`components/address-bidirectional-converter.tsx`, `address-conversion-helper.ts`, `types/enhanced-address.ts`): hỗ trợ convert bằng dữ liệu tỉnh/huyện từ Settings. Tuy nhiên kết quả chỉ sống trong form và bị ép qua schema yêu cầu đủ district, chưa có API để dùng shipping thực tế.
6. **Trang List & Trash** (`features/customers/page.tsx`, `trash-page.tsx`): filter + bulk action, export/import CSV, widget `debt-overview`. Nhưng do tất cả ở client nên thao tác chỉ ảnh hưởng dữ liệu cục bộ.

## 4. Rủi ro & issue chính
| Mức độ | Mô tả | Bằng chứng |
| --- | --- | --- |
| 🔴 Cao | Module Customers hoàn toàn client-side; công nợ, hồ sơ hợp đồng, SLA acknowledgement đều lưu `localStorage` (`persistKey "hrm-customers"`). Không thể dùng thật, không có audit trail, dễ mất dữ liệu khi đổi trình duyệt. | `features/customers/store.ts`, `features/customers/sla/store.ts` |
| 🔴 Cao | Công nợ và nhắc nợ chỉ là mảng trong `Customer`. Không sync với Cashbook/Orders nên số dư có thể lệch, không có ledger, không khóa khi thu tiền. | `credit-utils.ts`, `debt-tracking-utils.ts`, `store.ts` (`updateDebt`, `addDebtTransaction`) |
| 🔴 Cao | SLA cảnh báo & acknowledgement lưu per-browser (`window.localStorage.setItem(SLA_EVALUATION_KEY, ...)`) → người khác không thấy, không có job theo dõi. | `features/customers/sla/store.ts` |
| 🟠 Trung bình | `CustomersPage` tự lọc + phân trang song song với `customer-service.ts`, trong khi React Query cũng fetch cùng dữ liệu ⇒ tính toán thừa, dễ sai khi chuyển sang API thật (vì UI đang bỏ qua kết quả query). | `features/customers/page.tsx`, `features/customers/customer-service.ts` |
| 🟠 Trung bình | `AddressBidirectionalConverter` cho phép tạo bản ghi chỉ có 2 cấp nhưng `addressSchema` vẫn bắt buộc `district`/`districtId` nên form có thể bị kẹt hoặc ghi dữ liệu giả để qua validation. | `components/address-bidirectional-converter.tsx`, `validation.ts` |
| 🟠 Trung bình | `customer-form.tsx` quá lớn, chứa logic upload, watchers settings & default, truy cập trực tiếp nhiều store → khó tái sử dụng, không có unit test, khó chuyển sang server actions. | `features/customers/customer-form.tsx` |
| 🟡 Thấp | Hooks intelligence/debt chạy `calculateRFMScores`/`Fuse` mỗi render → thành bottleneck khi data vài nghìn bản ghi. | `hooks/use-customer-intelligence.ts`, `hooks/use-customer-debt.ts`, `page.tsx` |
| 🟡 Thấp | Thư mục `features/customers/__tests__` trống, chưa có test cho debt utils, SLA, address converter hay form logic. | `features/customers/__tests__` |

## 5. Đề xuất nâng cấp
1. **Thiết kế lại mô hình dữ liệu (Tuần 1-2)**
   - Prisma schema cho `Customer`, `CustomerAddress`, `CustomerContact`, `CustomerTag`, `CustomerDebtLedger`, `CustomerDebtReminder`, `CustomerSlaLog`, kèm FK tới Employees/Orders/Complaints/Warranty/Cashbook.
   - Chuẩn hóa bảng `CustomerAnalytics` để lưu RFM/Health snapshot theo ngày thay vì embed vào JSON.
2. **API & service layer (Tuần 2)**
   - Xây Next.js API `/api/customers` (CRUD, search, import/export). Endpoints phụ: `/api/customers/{id}/debt`, `/api/customers/{id}/sla`, `/api/customers/{id}/attachments`.
   - Viết service kết nối Orders: khi tạo đơn hàng gọi mutation cập nhật `CustomerLedger` và `CustomerStats`; khi hạch toán Cashbook phải trừ công nợ qua API thay vì `updateDebt` client.
3. **Refactor state & hook (Tuần 2-3)**
   - Thu gọn `useCustomerStore` chỉ giữ UI state (filter draft). Dữ liệu bảng sử dụng React Query + server pagination. Tách `fetchCustomersPage` thành real API.
   - Di chuyển `calculateRFMScores`, `calculateDebtTrackingInfo` sang job server (Cron) hoặc trigger khi dữ liệu thay đổi; hooks chỉ đọc kết quả.
4. **Địa chỉ & vận chuyển (Tuần 3)**
   - Chuẩn hóa API chuyển đổi 2⇄3 cấp trên server, đồng bộ với bảng provinces/districts. Bổ sung validation server-side cho `enhancedAddress`. Cho phép lưu cả bản 2 cấp & 3 cấp, mapping sang provider giao hàng khi cần.
5. **SLA & cảnh báo (Tuần 3)**
   - Di chuyển SLA engine vào background worker, lưu `CustomerSlaAlert` trong DB, ack qua API có audit (user/time). Tích hợp Notification/Tasks module để giao việc follow-up.
6. **Form & file handling (Tuần 3-4)**
   - Chia `customer-form.tsx` thành hooks: `useCustomerFiles`, `useCustomerDefaults`, `useCustomerAddressSection`. Upload chuyển sang server route (S3/Blob). Thực hiện server validation với Zod + Prisma trước khi commit.
7. **Testing & QA (Tuần 4)**
   - Vitest cho `credit-utils`, `debt-tracking-utils`, `intelligence-utils`, `address-conversion-helper`. Playwright flow: tạo KH mới → tạo đơn nợ → thu tiền → kiểm tra dashboard/SLA.
8. **Liên kết module khác**
   - Orders: mỗi đơn tạo/huỷ gọi API cập nhật stats & ledger.
   - Complaints/Warranty: ghi nhận `lastContactDate`, `failedDeliveries`, SLA follow-up.
   - Cashbook: phiếu thu công nợ phải cập nhật ledger và history nhắc nợ.
   - Task/Notification: dùng SLA alert để tạo việc follow-up tự động.

## 6. Việc cần làm ngay
- Ngừng rely `localStorage` cho dữ liệu thật; export JSON backup trước khi viết migration.
- Soạn bảng mapping settings (customer-type/group/source/payment-term/credit-rating/pricing) để làm khóa ngoại khi dựng Prisma.
- Xác định contract với Orders/Cashbook/SLA trước khi refactor (luồng tạo đơn, thu tiền, cảnh báo). Sau Customers sẽ chuyển sang Suppliers/Orders theo danh sách ưu tiên.
