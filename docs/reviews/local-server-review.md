# Báo cáo Rà Soát Local Server (Thu mua → Payroll)

_Ngày: 19/11/2025 · Reviewer: GitHub Copilot_

## Phạm Vi & Phương Pháp
- Bám `docs/DEVELOPMENT-GUIDELINES-V2.md`: dual ID, shadcn UI, context chuẩn theo chi nhánh + tài khoản.
- Re-audit toàn bộ các module user yêu cầu (sản phẩm, nhà cung cấp, PO/PR, phiếu nhập & kiểm kho, phiếu thu/chi + sổ quỹ, nhân sự, payroll, settings inventory/pricing/sales/store-info/customers).
- Đọc trực tiếp React/TS trong `features/**` + store ở `lib/` để kiểm tra luồng, filter, bulk action, dữ liệu persist.
- Đặc biệt soi: (1) sai phạm dual ID/foreign key, (2) thao tác bulk chưa an toàn, (3) UI còn giữ logic đã loại bỏ.

## Điểm Nhấn Chính
- **PO ↔ Kho đang lệch ID**: `processInventoryReceipt` tìm PO bằng business ID (`features/purchase-orders/store.ts`) trong khi mọi caller truyền `systemId`, nên bulk receive nhìn thì thành công nhưng không hề đổi `deliveryStatus`/`stock`.
- **Thanh toán PO + sổ quỹ vẫn bám vào tên NCC**: cả `confirmCancel`, `confirmBulkPay` và đồng bộ trạng thái chỉ group theo `recipientName` (file `features/purchase-orders/page.tsx`). Chỉ cần trùng tên NCC là công nợ bị cộng sai.
- **Toàn bộ finance vẫn giữ workflow "Duyệt" cũ**: `features/receipts/page.tsx`, `features/payments/page.tsx`, `features/cashbook/page.tsx` trưng badge `pending_approval` và gọi `handleApprove` chỉ hiển thị toast; data store mặc định `completed` → giao diện gây hiểu nhầm.
- **Context người dùng không đúng**: thay vì đọc `auth-context.tsx`, nhiều nơi lấy thẳng `useEmployeeStore().data[0]` (ví dụ `features/products/page.tsx`, `features/purchase-orders/page.tsx`), khiến audit log và chứng từ luôn ghi "nhân viên đầu tiên".
- **Settings quan trọng vẫn chỉ lưu local**: pricing ID sinh kiểu `PP_${Date.now()}`, sales channel ID `SC00000001` (không theo dual ID), sales management toggles (`features/settings/sales/sales-management-settings.tsx`) chỉ là `useState` nên refresh là mất.
- **Địa giới hành chính nhập tay vượt chuẩn**: `features/settings/provinces/page.tsx` dùng `alert` + `setData` để ghi đè cả store bằng IDs tạm `IMP_*`, `WARD_${Date.now()}`, không qua `createCrudStore` nên dual ID/counter vỡ khi migrate.

## Quan Sát Theo Module

### Thu mua & danh mục
- `features/purchase-orders/store.ts`: `processInventoryReceipt` so sánh `p.id === purchaseOrderId` nhưng caller truyền `systemId` (`handleReceiveGoods`, `confirmBulkReceive`). Kết quả: trạng thái giao hàng, `deliveryDate` không bao giờ cập nhật sau khi nhận hàng.
- `features/purchase-orders/page.tsx`: `confirmBulkReceive` auto tạo phiếu nhập với **toàn bộ** số lượng còn lại và `receiver` = nhân viên đầu tiên; không cho người dùng chỉnh số lượng/kho/lô → rất dễ nhập sai khi có thiếu hụt.
- Cùng file, `confirmBulkPay`, `handleCancelRequest` và `store.syncAllPurchaseOrderStatuses` cộng tiền chỉ theo `payment.recipientName === po.supplierName`. Hai PO cùng NCC sẽ chia sẻ công nợ.
- `features/purchase-returns/page.tsx`: có nút "Tạo phiếu trả" nhưng bulk/row action vẫn dùng `alert('In ...')`, không có view chi tiết nên chưa thể kiểm chứng dữ liệu trước khi in.
- `features/products/page.tsx`: importer set `inventoryByBranch` = 0 cho mọi chi nhánh và ép `createdBy/updatedBy = employees[0]?.systemId`. Không đọc user thật nên audit sai và không sync tồn kho từng chi nhánh ngay khi import.
- ✅ 26/11: `features/products/page.tsx` đã chuẩn hóa importer để match cột tồn kho theo mã chi nhánh (systemId/id/tên) với các tiền tố `inventory_/stock/Tồn kho`, gán dữ liệu đúng vào `inventoryByBranch`, tự động fallback về chi nhánh mặc định khi file chỉ có tổng tồn và báo lỗi qua toast nếu dòng thiếu tên sản phẩm.
- ✅ 26/11: `features/purchase-orders/detail-page.tsx` bỏ toàn bộ `alert()` khi nhận hàng/ghi nhận thanh toán, thay bằng toast tiếng Việt + guard chi nhánh rõ ràng để bám DEVELOPMENT-GUIDELINES-V2, đồng thời báo thành công/ lỗi chuẩn qua shadcn ecosystem.
- ✅ 24/11: `features/products/page.tsx` bổ sung page header "Danh sách sản phẩm", breadcrumb `Trang chủ > Sản phẩm` và đồng bộ toàn bộ nút chính với `className="h-9"`, đảm bảo list sản phẩm tuân thủ DEVELOPMENT-GUIDELINES-V2 về cấu trúc header + chiều cao button.

### Kho
- ⚠️ `processInventoryReceipt` đang so khớp phiếu nhập bằng `systemId` (`features/purchase-orders/store.ts`) trong khi dữ liệu seed của `useInventoryReceiptStore` vẫn lưu `purchaseOrderId` dạng business ID (`PO0001`). Kết quả: các PO khởi tạo sẵn luôn ở trạng thái `Chưa nhập` dù đã có phiếu nhập mẫu, báo cáo nhập kho lệch hoàn toàn.
- ⚠️ `InventoryReceipt` không có trường riêng cho `purchaseOrderSystemId`; từ flow nhận hàng mới (`features/purchase-orders/page.tsx`) ta đang nhét thẳng `po.systemId` vào field `purchaseOrderId`, khiến bảng phiếu nhập hiển thị mã nội bộ `PO00000001` thay vì mã nghiệp vụ `PO0001` và mọi filter/callback khác vẫn nghĩ đây là business ID → nguy cơ lệch cả hai phía sau khi migrate DB.
- ⚠️ Seed `features/inventory-receipts/data.ts` dùng `productSystemId` = SKU (`DV-WEB-01`, `DV-MKT-01`) thay vì `Product.systemId` thật (`PRODUCT000001`). Khi `processInventoryReceipt` hoặc lịch sử kho cần đối chiếu hệ thống, toàn bộ phiếu nhập mẫu không tìm được sản phẩm để cộng tồn.
- ⚠️ Các phiếu nhập mẫu không hề lưu `branchSystemId/branchName`, nhưng trang `InventoryReceiptsPage` bắt người dùng filter theo chi nhánh → filter trả về rỗng và người dùng tưởng dữ liệu mất.
- ✅ 21/11: `features/inventory-receipts/page.tsx` đã dùng `supplierSystemId` cho filter/bulk action, bổ sung filter chi nhánh (theo `branchSystemId`), lưu option theo dual ID và chuyển `handleRowClick` sang điều hướng `ROUTES.INVENTORY.INVENTORY_RECEIPT_VIEW`. Bulk print + action In từng dòng đều dùng toast shadcn thay vì `alert`, giữ icon lucide và bỏ hẳn `console.log`.
- ✅ 21/11: `features/inventory-checks/page.tsx` bỏ toàn bộ `window.confirm`, dùng `AlertDialog` + toast shadcn cho xóa/cân bằng/bulk delete, đồng thời `balanceCheck` chuyển sang async và mọi caller (`page.tsx`, `form-page.tsx`, `detail-page.tsx`) đều `await` trước khi báo thành công. Người dùng thấy trạng thái loading rõ ràng, không còn trường hợp cập nhật tồn kho chưa xong mà UI báo thành công.
- ✅ 24/11: `features/inventory-receipts/detail-page.tsx` hiển thị đầy đủ dual ID (PO, chi nhánh, NCC) và các quan hệ liên kết bằng `systemId`, dùng `usePageHeader` đúng guide, card/grid shadcn + badge nằm dưới title và mọi nút điều hướng đều lấy `systemId` từ router constants. Tất cả action (in, copy link, điều hướng) dùng toast/dialog tiếng Việt thay cho `alert`.
- ✅ 24/11: Flow nhập hàng từ PO (`features/purchase-orders/page.tsx`, `features/purchase-orders/detail-page.tsx`, `features/purchase-orders/form-page.tsx`) và các phép tính hoàn trả (`features/purchase-returns/store.ts`, `features/purchase-returns/form-page.tsx`, `features/products/detail-page.tsx`) đã chuyển sang đọc/ghi `purchaseOrderSystemId`. Phiếu nhập mới lưu đồng thời `purchaseOrderSystemId`, `purchaseOrderId`, `branchSystemId` nên filter vẫn hiển thị business ID nhưng mọi foreign key + trạng thái kho/hoàn trả đều so khớp theo `systemId`.
- ✅ 24/11 (bổ sung): `features/inventory-receipts/store.ts` thêm pipeline `syncInventoryReceiptsWithPurchaseOrders` để backfill `purchaseOrderSystemId`, `branchSystemId`, `supplierSystemId` và toàn bộ line-item `productSystemId/productId` từ PO + Product store; seed `features/inventory-receipts/data.ts` đã có `systemId` chuẩn. `features/products/store.ts` expose `subscribe` để `features/purchase-orders/store.ts` tự động gọi lại migration sau khi store hydrate, đảm bảo mọi phiếu nhập cũ được đồng bộ dual ID ngay cả khi dữ liệu đến từ localStorage.

### Tài chính (phiếu thu/chi & sổ quỹ)
- `features/receipts/page.tsx` & `features/receipts/columns.tsx`: badge `pending_approval`, menu "Duyệt phiếu" và modal bulk approve vẫn render dù `useReceiptStore` luôn set `status: 'completed'`. Người dùng tưởng còn workflow duyệt.
- `features/payments/page.tsx` y hệt, còn `usePaymentStore` cũng mặc định `completed`. Không có nơi nào có thể đưa phiếu về trạng thái pending → UI đang hiển thị tính năng không tồn tại.
- `features/cashbook/page.tsx`: `handleApprove` chỉ `toast.success`, `runningBalance`/`openingBalance` cộng tất cả account trong `accountIdsToConsider` ngay cả khi người dùng filter branch (vì `accountIdsToConsider` lấy trước khi lọc branch). Số dư đóng/mở vì vậy sai khi chọn 1 tài khoản/chi nhánh cụ thể.
- Các bảng tài chính vẫn tính số dư dựa trên toàn bộ dataset (không theo tài khoản) và không trừ `openingBalance` ban đầu của tài khoản từ `useCashbookStore`.

### Nhân sự & context đăng nhập
- `features/purchase-orders/page.tsx`, `features/purchase-orders/store.ts`, `features/products/page.tsx`, `features/purchase-returns/page.tsx`… đều đọc `useEmployeeStore().data[0]` để ghi nhận người thao tác. Khi QA đăng nhập user khác trong `auth-context.tsx` thì log/audit vẫn hiển thị nhân viên mặc định.
- ✅ 20/11: `features/sales-returns/form-page.tsx`, `features/reconciliation/page.tsx`, `features/orders/page.tsx` và `features/orders/order-form-page.tsx` đã bỏ `useEmployeeStore().data[0]`, đồng bộ `creatorId`, `salespersonSystemId` và log COD bằng `auth-context`.
- `useInventoryCheckStore` và nhiều store khác lấy `getCurrentUserSystemId` từ `contexts/user-context.tsx` (manual select) thay vì `auth-context`. Hai nguồn user song song khiến audit khó tin cậy.
- ✅ 24/11: `features/products/form-page.tsx` và `components/layout/sidebar.tsx` chuyển sang `useAuth`, mọi trường `createdBy/updatedBy/employeeName` + avatar/sidebar role đều bám đúng user đăng nhập, không còn fallback `employees[0]`.
- ✅ 24/11: `features/receipts/form-page.tsx`, `features/payments/form-page.tsx` và `features/purchase-orders/form-page.tsx` bỏ hoàn toàn fallback `employees[0]`, mặc định lấy buyer/createdBy từ `auth-context` nên audit phiếu thu/chi/đơn mua bám đúng nhân viên đăng nhập.
- ✅ 24/11: `features/inventory-checks/form-page.tsx` hiển thị nhân viên kiểm từ `useAuth`, lưu `createdBy`/`balance` theo `auth-context` và loại bỏ hoàn toàn `contexts/user-context` khỏi flow tạo phiếu kiểm.
- ✅ 24/11: `components/layout/header.tsx`, `features/auth/login-page.tsx` và `features/settings/store-info/store-info-page.tsx` ngừng phụ thuộc `UserContext`, toàn bộ thao tác đăng nhập/đăng xuất và cập nhật thông tin cửa hàng đều lấy người dùng thật từ `auth-context`.
- ✅ 24/11: Dialog hoàn tiền bảo hành (`features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx`) ghi `createdBy` theo nhân viên đăng nhập, không còn tìm `useCurrentUser` thủ công.
- `features/employees/page.tsx` vi phạm guideline `Button & Input Height`: toàn bộ Button/Select chủ đạo đều thiếu `className="h-9"`, dẫn tới toolbar/filter khác kích thước với shadcn chuẩn.
- Cùng trang EmployeesPage còn đặt page header title = `"Nhân viên"` thay vì `"Danh sách nhân viên"` như rule ở guide, nên breadcrumb/title không nhất quán giữa các trang danh sách.

### Cài đặt & cấu hình
- `features/settings/pricing/store.ts`: `systemId` = `PP_${Date.now()}`, không dùng `ID_CONFIG`. Khi migrate sang DB sẽ không đồng bộ counter, và không có dual ID (business ID). Cần chuyển qua `createCrudStore` hoặc ít nhất gọi `generateSystemId`/`findNextAvailableBusinessId`.
- `features/settings/sales-channels/store.ts`: tương tự với prefix `SC00000000`, không có dual ID, không persist user context.
- `features/settings/sales/sales-management-settings.tsx`: mọi toggle (`allowNegative*`, `printCopies`) chỉ là state cục bộ. Refresh trang là reset → không dùng được để cấu hình bán hàng.
- ✅ 23/11: `features/settings/customers/page.tsx` đã thêm AlertDialog xác nhận xoá theo từng tab, chuẩn hóa button `h-9` và copy cảnh báo tiếng Việt (không còn xoá ngay khi click).
- ✅ 23/11: `features/settings/store-info/store-info-page.tsx` + `features/settings/store-info/store-info-store.ts` đã có form pháp nhân/thuế/địa chỉ, validation `react-hook-form` + `zod`, lưu persist qua store riêng và toast tiếng Việt khi lưu/khôi phục.
- `features/settings/provinces/page.tsx` + store: import Excel dùng `alert`/`setData` để ghi đè toàn bộ dataset, sinh `systemId` kiểu `IMP_P_*`, `WARD_${Date.now()}` nên không thể sync dual ID, cũng không có audit/log nào khi sửa địa giới.

## Rủi Ro Xuyên Suốt
1. **Sai lệch dual ID**: lọc/ghép dữ liệu bằng display name (`supplierName`, `recipientName`) khiến rename là mất liên kết.
2. **Audit không đáng tin**: toà bộ thao tác quan trọng log "nhân viên đầu tiên" thay vì user đăng nhập.
3. **UI hiển thị tính năng không tồn tại**: workflow duyệt phiếu, bulk approve, print alert… gây hiểu sai quy trình thật.
4. **Thiếu persistence chuẩn**: nhiều settings (pricing, sales config) chỉ lưu localStorage và không dùng ID chuẩn → không thể migrate lên DB/VPS.

## Backlog Hành Động (Ưu Tiên)
| Ưu tiên | Khu vực | Mô tả | File |
| --- | --- | --- | --- |
| Cao | PO ↔ Kho | Cho `processInventoryReceipt` nhận `systemId`, đồng bộ `deliveryStatus` và hiển thị modal nhận hàng (chọn số lượng, kho, chứng từ) thay vì auto nhập toàn bộ. | `features/purchase-orders/store.ts`, `features/purchase-orders/page.tsx` |
| Cao | Công nợ PO | Ngừng cộng tiền theo `recipientName`, lưu `purchaseOrderSystemId` trên phiếu chi/thu hồi và đối chiếu đúng PO. | `features/purchase-orders/page.tsx`, `features/purchase-orders/store.ts`, `features/payments/store.ts` |
| Cao | Gỡ workflow duyệt giả | Xóa badge/Dropdown "Duyệt" + logic liên quan ở phiếu thu/chi và sổ quỹ; status chỉ nên có `completed/cancelled`. | `features/receipts/page.tsx`, `features/receipts/columns.tsx`, `features/payments/page.tsx`, `features/cashbook/page.tsx`, `features/cashbook/columns.tsx` |
| Trung bình | Sổ quỹ theo tài khoản | Viết lại tính `openingBalance`, `runningBalance` dựa trên account filter + branch filter, tách số dư từng tài khoản rồi mới tổng hợp. | `features/cashbook/page.tsx` |
| Trung bình | Chuẩn hoá user context | Bơm `auth-context` vào tất cả module thay vì lấy `useEmployeeStore().data[0]`, đồng thời thống nhất `getCurrentUserSystemId`. | `features/products/page.tsx`, `features/purchase-orders/page.tsx`, `features/purchase-orders/store.ts`, `features/purchase-returns/page.tsx`, `features/inventory-checks/store.ts` |
| Trung bình | Kho dùng dual ID | Filter phiếu nhập/PR phải lưu & so sánh `supplierSystemId`, thêm trang detail + thay `alert` bằng dialog/print preview. | `features/inventory-receipts/page.tsx`, `features/purchase-returns/page.tsx` |
| Trung bình | Settings persist | Chuyển Pricing/Sales channel sang `createCrudStore` (ID chuẩn), lưu sales-management toggles vào store + persist. | `features/settings/pricing/store.ts`, `features/settings/sales-channels/store.ts`, `features/settings/sales/sales-management-settings.tsx` |
| Trung bình | Settings an toàn | Thêm confirm trước khi xóa loại khách hàng + triển khai form "Thông tin chung" ở store-info; tránh placeholder ở môi trường demo. | `features/settings/customers/page.tsx`, `features/settings/store-info/store-info-page.tsx` |
| Trung bình | Tỉnh/Thành | Chuẩn hoá store và import/export: dùng `createCrudStore` + dual ID cho province/district/ward, thay `alert` bằng dialog và tránh `setData` ghi đè cứng. | `features/settings/provinces/page.tsx`, `features/settings/provinces/store.ts` |
| Trung bình | Nhân sự UI chuẩn | Bổ sung `className="h-9"` cho toàn bộ Button/Select ở EmployeesPage để khớp guideline UI height. | `features/employees/page.tsx` |
| Trung bình | Page header nhân sự | Đặt lại `usePageHeader` ở EmployeesPage thành "Danh sách nhân viên" đúng format list page trong guide + kiểm tra breadcrumb labels. | `features/employees/page.tsx` |
| Trung bình | Inventory receipt dual ID | Tách rõ `purchaseOrderSystemId` vs `purchaseOrderId`, migrate toàn bộ dữ liệu seed và flow nhận hàng để filter/trạng thái không còn lệch; đồng thời bổ sung `branchSystemId` và map lại `productSystemId` đúng chuẩn. ✅ 24/11: Trang detail + các flow nhập/trả đã chuyển sang dual ID; ✅ 24/11 (bổ sung): seed `features/inventory-receipts/data.ts` đã có `systemId` và `syncInventoryReceiptsWithPurchaseOrders` tự backfill `purchaseOrderSystemId/branch/supplier/product` mỗi khi PO/Product hydrate (`features/purchase-orders/store.ts` subscribe `features/products/store.ts`). | `features/inventory-receipts/types.ts`, `features/inventory-receipts/data.ts`, `features/purchase-orders/page.tsx`, `features/purchase-orders/store.ts`, `features/inventory-receipts/page.tsx`, `features/inventory-receipts/detail-page.tsx`, `features/inventory-receipts/store.ts`, `features/products/store.ts` |

### TODO chi tiết bám DEVELOPMENT-GUIDELINES-V2

1. **PO ↔ Kho**  
	- Chuẩn hoá `processInventoryReceipt` và mọi caller (`handleReceiveGoods`, `confirmBulkReceive`) nhận/ghi `purchaseOrderSystemId` đúng quy tắc Dual ID (mục 1 của guide); chặn hoàn toàn việc tìm theo business `id`.  
	- Sau khi nhận hàng phải cập nhật `deliveryStatus`, `deliveryDate` và tồn kho, đồng thời hiển thị modal nhận hàng dùng shadcn/ui (`Dialog`, `FormField`, `Button className="h-9"`) để người dùng chọn số lượng, kho, chứng từ; toàn bộ label/action phải tiếng Việt, icon từ lucide-react và badge nằm dưới title.  
	- Lưu `receiverSystemId` lấy từ `auth-context` để audit đúng người thao tác, tránh `useEmployeeStore().data[0]`.
	- ✅ 17/11: `features/purchase-orders/store.ts` đã query bằng `systemId` và ưu tiên `receiverSystemId`; `features/purchase-orders/page.tsx` đã chuyển sang modal nhập hàng (shadcn Dialog, chọn kho, chứng từ, `className="h-9"`) và bắt buộc lấy user từ `auth-context`.  

2. **Công nợ PO**  
	- Thêm trường `purchaseOrderSystemId` cho phiếu chi/thu hồi và mọi phép tính công nợ; tất cả foreign key phải lưu `systemId` đúng hướng dẫn.  
	- Refactor `confirmBulkPay`, `confirmCancel`, `syncAllPurchaseOrderStatuses` để group/tính toán bằng `purchaseOrderSystemId`, tuyệt đối không dựa vào `recipientName`.  
	- Cập nhật UI filter & breadcrumb hiển thị business `id` (`po.id`) nhưng URL/query phải truyền `systemId`.
	- ✅ 17/11: `features/payments/types.ts`, `features/receipts/types.ts`, `features/payments/store.ts`, `features/purchase-orders/payment-utils.ts`, `features/purchase-orders/store.ts`, `features/purchase-orders/page.tsx`, `features/purchase-orders/detail-page.tsx`, `features/purchase-orders/form-page.tsx` đã lưu `purchaseOrderSystemId` vào phiếu chi/phiếu thu, refactor toàn bộ phép tính công nợ & bulk pay để dựa trên `systemId`, đồng thời hiển thị `po.id` khi mô tả chứng từ.

3. **Gỡ workflow duyệt giả**  
	- Xóa badge `pending_approval`, dropdown "Duyệt" và hàm `handleApprove` ở receipts/payments/cashbook; trạng thái hợp lệ chỉ còn `completed` hoặc `cancelled` theo checklist 6.  
	- Làm sạch store mặc định để không còn logic duyệt cũ, các toast/dialog phải mô tả đúng hành động thực sự diễn ra.
	- ✅ 19/11: `features/receipts/**`, `features/payments/**`, `features/cashbook/**` đã giới hạn status `completed/cancelled`, normalize dữ liệu ngay từ store và xoá toàn bộ menu/Toast/Badge liên quan tới duyệt; `warranty-payment-history-card` cũng dùng badge mới nên không còn hiển thị trạng thái giả.

4. **Sổ quỹ theo tài khoản**  
	- Viết lại `openingBalance` và `runningBalance` để tính theo tài khoản + chi nhánh đang filter; chỉ cộng dồn giao dịch thuộc account được chọn.  
	- Tách số dư từng tài khoản, sau đó tổng hợp hiển thị; format số liệu giữ typography `text-sm`/`text-base` như guide.  
	- Khi render filter, đảm bảo Button/Select có `className="h-9"` và tất cả text tiếng Việt.
	- ✅ 19/11: `features/cashbook/page.tsx` đã tái cấu trúc bộ lọc -> chỉ tính số dư mở/đóng và running balance dựa trên tài khoản + chi nhánh đang chọn, mỗi giao dịch mang `runningBalance` đúng tài khoản khi lọc 1 tài khoản hoặc tổng hợp khi xem “Tất cả”; toàn bộ button filter/header/AlertDialog cũng áp dụng `className="h-9"` theo guide.

5. **Chuẩn hoá user context**  
	- Thay mọi chỗ dùng `useEmployeeStore().data[0]` bằng `auth-context` để lấy user thực tế, đồng bộ helper `getCurrentUserSystemId`.  
	- Đảm bảo mọi log/audit và chứng từ lưu `systemId` người thao tác, display bằng business `id`/tên theo guideline Naming.
	- ✅ 20/11: Import sản phẩm (`features/products/page.tsx`) và phiếu trả NCC (`features/purchase-returns/form-page.tsx`) đã lấy user từ `useAuth`, fallback 'SYSTEM' khi chưa map employee để không còn ghi nhận “nhân viên đầu tiên”.
	- ✅ 20/11: `features/purchase-orders/detail-page.tsx`, `features/purchase-orders/form-page.tsx` và `features/inventory-checks/store.ts` đều đọc employee từ `auth-context` (hoặc helper cùng file) để gắn `receiver/balancedBy` đúng systemId, đồng thời gỡ hoàn toàn `contexts/user-context` khỏi flow kiểm kho.
	- ✅ 20/11: `features/sales-returns/form-page.tsx`, `features/reconciliation/page.tsx`, `features/orders/page.tsx` và `features/orders/order-form-page.tsx` đã thống nhất `creatorId`, `receiverSystemId`, `salespersonSystemId` và thao tác hủy/xác nhận dựa trên `useAuth`, đảm bảo audit log khớp nhân viên đăng nhập.
	- ✅ 17/11: `features/tasks/task-form-page.tsx` dùng `useAuth` để ghi `assignerId/assignerName`, bỏ hẳn `employees[0]` nên audit người giao việc luôn đúng.
	- ✅ 24/11: `features/receipts/form-page.tsx`, `features/payments/form-page.tsx` và `features/purchase-orders/form-page.tsx` không còn fallback `employees[0]`; thao tác tạo phiếu thu/chi và đơn mua mới mặc định gán `createdBy/buyer` theo nhân viên từ `auth-context`, đảm bảo chứng từ, audit và đối chiếu công nợ hiển thị đúng người thao tác.
	- ✅ 24/11: `features/inventory-checks/form-page.tsx` lấy tên + systemId nhân viên đang đăng nhập từ `useAuth`, dùng cho trường hiển thị và `createdBy`/`balance`, đồng thời bỏ hẳn `contexts/user-context` khỏi luồng tạo phiếu kiểm.
	- ✅ 24/11: `components/layout/header.tsx`, `features/auth/login-page.tsx`, `features/settings/store-info/store-info-page.tsx` và toàn bộ dialog tạo phiếu chi bảo hành đều sử dụng `auth-context`, không còn gọi `useCurrentUser`/`setCurrentUser` nên audit logout và chứng từ bảo hành bám đúng user thật.
	- ✅ 24/11: Toàn bộ store CRUD (`features/customers/store.ts`, `features/employees/store.ts`, `features/employees/employee-comp-store.ts`, `features/employees/store-localStorage-backup.ts`, `features/products/store.ts`, `features/suppliers/store.ts`, `features/payroll/payroll-batch-store.ts`, `features/payroll/payroll-template-store.ts`, `features/settings/employees/employee-settings-store.ts`) đã chuyển `getCurrentUserSystemId` sang `contexts/auth-context.tsx`; `index.tsx` gỡ `UserProvider` và xóa `contexts/user-context.tsx` nên audit chỉ còn một nguồn user duy nhất.
	- ✅ 24/11: `contexts/auth-context.tsx` bổ sung helper `getCurrentUserInfo` (systemId + tên) và toàn bộ entry points còn lại (`lib/router-provider.tsx`, `components/protected-route.tsx`, `features/tasks/store.ts`, `features/warranty/store/**/*.ts`) đã chuyển sang dùng helper này; hệ thống không còn module nào tự đọc `localStorage.getItem('user')` thủ công.
	- ✅ 25/11: `features/packaging/page.tsx`, `features/packaging/detail-page.tsx`, `features/shipments/detail-page.tsx` và `features/orders/order-detail-page.tsx` đều lấy người thao tác từ `useAuth`, không còn fallback `useEmployeeStore().data[0]`, nên mọi hành động xác nhận/hủy đóng gói, xuất kho, giao hàng và hủy đơn đều log đúng `systemId` nhân viên đăng nhập.

6. **Kho dùng dual ID**  
	- Lưu cả `supplierSystemId` trên phiếu nhập/phiếu trả và dùng field này cho filter, bulk action, navigation; label vẫn hiển thị business `id` hoặc tên NCC.  
	- Bổ sung trang chi tiết phiếu nhập với `usePageHeader` đúng format (title auto + badge dưới title) và thay toàn bộ `alert`/`console.log` bằng dialog shadcn + toast tiếng Việt.  
	- Modal in/print phải dùng lucide icons, tailwind chuẩn, không dùng emoji.
	- ✅ 21/11: List phiếu nhập (`features/inventory-receipts/page.tsx`) đã lọc theo `supplierSystemId`/`branchSystemId`, thêm filter chi nhánh, chuyển click sang `navigate` detail và thay bulk print + action In từng dòng bằng toast shadcn (không còn `alert`/emoji). Tiếp theo: củng cố print preview/dialog và refactor phiếu trả NCC.
	- ✅ 21/11: Danh sách phiếu kiểm (`features/inventory-checks/page.tsx`) dùng AlertDialog + toast cho toàn bộ hành động, `balanceCheck` được refactor async và các trang tạo/chi tiết đều `await` trước khi báo thành công, đảm bảo tồn kho thực sự cập nhật xong.
	- ✅ 24/11: Trang chi tiết phiếu nhập (`features/inventory-receipts/detail-page.tsx`) đã nối toàn bộ liên kết qua `systemId`, dựng lại header/breadcrumb chuẩn, card supplier/PO/nhân viên với link tới trang tương ứng và bảng line-item hiển thị tooltip/currency đúng chuẩn shadcn.
	- ✅ 24/11: Các flow nhập hàng/auto nhận (PO list/detail/form) và tính toán trả hàng (purchase-returns store/form, products detail) đều lưu `purchaseOrderSystemId` cho foreign key và cache `purchaseOrderId` + `branchSystemId` để filter/trạng thái chỉ so theo `systemId`.
	- ✅ 22/11: Phiếu trả NCC (`features/purchase-returns/page.tsx`, `features/purchase-returns/detail-page.tsx`, `features/purchase-returns/form-page.tsx`, `features/purchase-returns/store.ts`, `features/purchase-returns/types.ts`, `features/purchase-returns/data.ts`, `features/purchase-orders/page.tsx`, `features/purchase-orders/detail-page.tsx`) đã lưu cả `purchaseOrderSystemId`/`purchaseOrderId`, chuẩn hóa header + Dialog in preview, thay toàn bộ `alert` bằng shadcn Dialog/toast và auto tạo phiếu trả khi hủy PO cũng ghi đủ dual ID.

7. **Settings persist**  
	- Chuyển pricing/sales channel store sang `createCrudStore`, gọi `generateSystemId` + `findNextAvailableBusinessId` theo ID_CONFIG để có dual ID.  
	- Sales management toggles (`allowNegative*`, `printCopies`) phải lưu vào store (hoặc persist layer) thay vì `useState`, đồng thời form control sử dụng component shadcn với `className="h-9"`.
	- ✅ 22/11: `features/settings/pricing/store.ts` và `features/settings/sales-channels/store.ts` đã chuyển sang `createCrudStore` kèm dual ID/persist chuẩn, list/form cập nhật hiển thị mã KÊNH + button `h-9`; `features/settings/sales/sales-management-settings.tsx` dùng store `sales-management-store.ts` nên toàn bộ toggle/printCopies được lưu và có nút khôi phục mặc định.

8. **Settings an toàn**  
	- `features/settings/customers/page.tsx`: thêm `AlertDialog` xác nhận xoá, button "Xóa" dạng destructive với icon lucide và height 9.  
	- `features/settings/store-info/store-info-page.tsx`: triển khai form nhập pháp nhân/thuế/địa chỉ với typography `text-sm` cho label, `text-base` cho nội dung, đảm bảo toàn bộ text tiếng Việt và validation rõ ràng.
	- ✅ 23/11: Đã bổ sung AlertDialog xác nhận xoá theo từng tab customer settings (copy động, button `h-9`) và dựng form "Thông tin chung" đầy đủ (schema `zod`, persist qua `store-info-store.ts`, toast báo lưu/khôi phục).

9. **Tỉnh/Thành**  
	- Xây store provinces/districts/wards dựa trên `createCrudStore`, ID sinh theo Dual ID (không `Date.now`).  
	- Thay `alert` + `setData` bằng quy trình import có dialog xác nhận, preview dữ liệu, và toast tiếng Việt; mọi foreign key giữa tỉnh/huyện/xã dùng `systemId`.  
	- Bổ sung log thao tác lấy user từ `auth-context` để audit chuẩn.
	- ✅ 17/11: `features/settings/provinces/store.ts` dùng `createCrudStore` cho tỉnh/quận/phường, normalize seed + helper `importAdministrativeUnits` để reset tỉnh & phường 2 cấp, giữ nguyên dữ liệu 3 cấp và audit dựa trên `auth-context`.
	- ✅ 17/11: `features/settings/provinces/page.tsx` thêm luồng import an toàn: parse Excel sinh dual ID, hiển thị dialog preview với thống kê + mẫu dữ liệu, xác nhận ghi đè bằng shadcn Dialog và toast tiếng Việt, thay hoàn toàn cho `alert`/`setData` cũ.

**Kho - Dual ID cho phiếu nhập (ĐÃ XỬ LÝ)**

- Seed `features/inventory-receipts/data.ts` đã bổ sung `systemId` chuẩn (`INVRECEIPT000001`...), giữ đồng thời `purchaseOrderSystemId`, `branchSystemId`, `supplierSystemId` ngay từ dữ liệu mặc định để tránh trạng thái “Chưa nhập” giả khi mới cài.
- Hàm `syncInventoryReceiptsWithPurchaseOrders` trong `features/inventory-receipts/store.ts` dựng bảng băm theo `systemId/id/sku/name`, tự động chuẩn hóa `purchaseOrderSystemId`, `purchaseOrderId`, `branchSystemId`, `supplierSystemId` và từng line-item `productSystemId/productId/productName` kể cả khi legacy data chỉ lưu SKU. Hàm được đăng ký trong `features/purchase-orders/store.ts` và lắng nghe `features/products/store.ts.subscribe`, nên cứ mỗi lần PO/Product hydrate hoặc cập nhật là toàn bộ phiếu nhập cũ được đồng bộ dual ID.
- Nhờ pipeline này, `processInventoryReceipt` và các report tồn kho luôn so khớp `systemId`, UI vẫn hiển thị mã nghiệp vụ (`purchaseOrderId`), không còn tình trạng PO mẫu báo “Chưa nhập” hoặc thống kê tồn kho bỏ sót do sai foreign key. Việc cần theo dõi tiếp theo chỉ là import dữ liệu thực tế (nếu có) phải dùng đúng schema mới.

10. **Nhân sự UI chuẩn**  
	 - Rà lại tất cả Button, Select, Input ở `features/employees/page.tsx` đảm bảo `className="h-9"`, sử dụng shadcn components, icon lucide kích thước `h-4 w-4`.  
	 - Các filter/action phải dùng tiếng Việt và spacing theo Tailwind (`space-x-2`, `gap-4`).
	 - ✅ 17/11: `features/employees/page.tsx` đã chuẩn hóa toolbar/filter theo guide: mọi Button/Select chính thêm `className="h-9"`, giữ shadcn component & copy tiếng Việt nhất quán.

11. **Page header nhân sự**  
	 - Cập nhật `usePageHeader` danh sách nhân viên: `title: 'Danh sách nhân viên'`, breadcrumb `Trang chủ > Nhân viên` theo mục Page Structure; để badge (nếu có) xuống dưới title.  
	 - Memoize `headerActions`, giữ URL dùng `systemId` khi điều hướng sang detail/edit.
	 - ✅ 17/11: EmployeesPage đổi title header thành "Danh sách nhân viên", breadcrumb giữ đúng format và actions vẫn memoize, đáp ứng hướng dẫn Page Structure.

> Cập nhật lại file này sau mỗi lần hoàn thành backlog hoặc phát hiện issue mới để team dễ theo dõi trước khi deploy DB/VPS.
