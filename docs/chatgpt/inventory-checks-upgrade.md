# Rà soát module Inventory-Checks (29/11/2025)

## 1. Kiến trúc & hiện trạng
- **Store & persistence**: `useInventoryCheckStore` (`features/inventory-checks/store.ts`) kế thừa `createCrudStore` với `persistKey: "inventory-checks"`, nên toàn bộ phiếu kiểm kho + activity history sống trong `localStorage`. Hai action đặc biệt `balanceCheck` và `cancelCheck` chạy trực tiếp trên client; khi cân bằng, store import động `useProductStore` và `useStockHistoryStore` để cập nhật tồn và ghi log ngay trong trình duyệt, không có API/backend/double-entry.
- **Trang danh sách**: `InventoryChecksPage` (`page.tsx`) render `ResponsiveDataTable`, filter/search bằng Fuse.js trên mảng tại client, pagination giả. Các hành động quan trọng (cân bằng, xóa hàng loạt) gọi thẳng `balanceCheck` và `remove` mà không cần quyền hay xác thực server.
- **Trang chi tiết**: `detail-page.tsx` hiển thị thống kê (matched/different), bảng item, lịch sử hoạt động. Người dùng vẫn có thể xóa phiếu (kể cả đã cân bằng) hoặc tự kích hoạt cân bằng; không có audit/approval, không khóa phiếu khi đã cân bằng hay khi có dòng lịch sử.
- **Form tạo/sửa**: `form-page.tsx` (~700 dòng) điều khiển toàn bộ nghiệp vụ (chọn sản phẩm, tính chênh lệch, workflow checklist, tags, confirm balance). Validation thuần client; branch và danh sách sản phẩm lấy trực tiếp từ store Products. Ở chế độ sửa thì các trường quantity bị disable → không thể chỉnh sửa kết quả kiểm kê sau khi lưu.
- **Workflow & tags**: `InventoryCheckWorkflowCard` đọc template từ `localStorage` thông qua `getWorkflowTemplate`, còn `tags` chỉ sống trong state `InventoryCheckFormPage`. `InventoryCheck` type không hề có trường `tags` hoặc `subtasks`, nên mọi tiến độ/quy trình/tags mất ngay khi reload.
- **Liên kết module khác**: `complaints` gọi `useInventoryCheckStore.add` để tự tạo phiếu điều chỉnh từ khiếu nại (`features/complaints/hooks/use-inventory-handlers.ts`). Products, Stock History, Complaints đều trông chờ cùng một store client nên không có ranh giới giao dịch.

## 2. Đối chiếu checklist
| Hạng mục | Trạng thái | Nhận xét |
| --- | --- | --- |
| Types & Validation | ⚠️ Một phần | `InventoryCheck` type đủ trường cơ bản nhưng thiếu `tags`, `workflowTemplateId`, `attachments`, `approvals`. Không có schema Prisma/Zod chung; form tự gán `asBusinessId('')` khi bỏ trống mã, dễ tạo ID rỗng. |
| UI/UX | ⚠️ Một phần | UI có bảng responsive, workflow card, bulk selector. Tuy nhiên mọi thao tác critical (cân bằng, xóa) chỉ cần 1 click, không có quyền, không có audit. Edit mode khóa toàn bộ dữ liệu nên thực tế không thể chỉnh sửa phiếu nháp sau khi rời trang. |
| Performance | ⚠️ Một phần | Tất cả dữ liệu load vào bộ nhớ, Fuse search/sort client, export chạy trên mảng -> nghẽn khi > vài nghìn dòng. `bulkProductSelector` cũng phải duyệt toàn bộ product store trên client. |
| Database Ready | ❌ | Chưa có `inventory_checks`, `inventory_check_items`, `inventory_check_workflows`, `inventory_adjustments`. Không có snapshot tồn, không có khóa ngoại tới `branches`, `employees`, `products`. |
| API Ready | ❌ | Không có `/api/inventory-checks`, `/api/inventory-adjustments`. Các module khác gọi thẳng store => không thể chạy đa người dùng hoặc đồng bộ với ERP. |
| Liên kết module | ⚠️ Thiếu | Khi cân bằng chỉ update `Product` store + ghi entry ở `stock-history` client. Không có ledger chung, không thông báo cho Purchase Orders / Stock Transfers, không phát sinh chứng từ điều chỉnh. |

## 3. Luồng & liên kết đáng chú ý
1. **Balance flow**: `balanceCheck` → duyệt từng item → `productStore.updateInventory(branch, difference)` rồi `stockHistoryStore.addEntry` với `newStockLevel = actualQuantity`. Không có khóa, không có transaction, không sync lên server.
2. **Delete/xóa**: Danh sách (`page.tsx`) và chi tiết (`detail-page.tsx`) gọi `remove` để xóa hẳn bản ghi khỏi local store, kể cả phiếu đã cân bằng. Không ghi audit log, không soft-delete, không check quyền.
3. **Complaints integration**: `useInventoryHandlers` trong module Khiếu nại tự động thêm phiếu kiểm kho nháp mỗi khi xử lý tồn, vẫn lưu trong cùng store client rồi kỳ vọng người dùng vào cân bằng thủ công.
4. **Form logic**: Mặc định `actualQuantity = 0` nên mọi item mới đều có `difference = -systemQuantity`; nếu người dùng bấm cân bằng trước khi nhập số thực, store sẽ trừ toàn bộ tồn khỏi kho. Không có chốt chéo với thực tế (chữ ký, ảnh, file import).
5. **Workflow/Tags**: UI cho phép thêm subtasks/tags nhưng vì type không lưu, mỗi lần reload là mất → người dùng tưởng đã đánh dấu nhưng không có dữ liệu để truy vết.

## 4. Rủi ro & issue chính
| Mức | Mô tả | Bằng chứng |
| --- | --- | --- |
| 🔴 Cao | `balanceCheck` thao tác trực tiếp trên `useProductStore` và `useStockHistoryStore` tại client (localStorage). Chỉ cần một người bấm cân bằng là tồn kho toàn hệ thống thay đổi mà không qua backend, không có double-entry, không khóa kỳ, không quyền hạn. | `features/inventory-checks/store.ts` (hàm `balanceCheck`) |
| 🔴 Cao | Có thể **xóa hẳn** phiếu (kể cả đã cân bằng) từ danh sách hoặc chi tiết; dữ liệu kiểm kê biến mất, không audit trail → không đáp ứng yêu cầu kế toán/ISO. | `features/inventory-checks/page.tsx` (`remove`/`handleConfirmAction`), `detail-page.tsx` (`handleDelete`) |
| 🟠 Trung bình | Workflow checklist & Tags chỉ tồn tại trong state component, không lưu vào `InventoryCheck`. Người dùng thấy UI nhưng dữ liệu không bao giờ được persist → mất dấu tiến độ, gây hiểu nhầm. | `features/inventory-checks/form-page.tsx` (state `tags`, `subtasks`), `features/inventory-checks/types.ts` (thiếu field tương ứng) |
| 🟠 Trung bình | Edit mode khóa toàn bộ số liệu (actual quantity, reason, items). Sau khi tạo phiếu nháp rồi rời trang sẽ không thể cập nhật lại, dễ dẫn đến tạo thêm phiếu mới hoặc cân bằng nhầm. | `form-page.tsx` (các input `disabled={isEditMode}`) |
| 🟠 Trung bình | `balanceCheck` không xác thực dữ liệu trước khi viết tồn: nếu item có `actualQuantity` âm, null hoặc khác branch, hàm vẫn ghi vào kho → có thể khiến tồn âm, mismatch với các module khác. | `store.ts` – không có guard khi gọi `updateInventory` |
| 🟡 Thấp | ID sinh client bằng `asBusinessId(customId || '')` nên nếu bỏ trống sẽ tạo Business ID rỗng/không chuẩn; `createCrudStore` tự tăng `_counters` trong bộ nhớ ⇒ reload tab có thể sinh ID trùng. | `form-page.tsx` (`handleSaveDraft`, `confirmBalance`) |

## 5. Đề xuất nâng cấp
1. **Backend & Prisma**
   - Thiết kế bảng `inventory_checks`, `inventory_check_items`, `inventory_check_workflows`, `inventory_check_attachments`, `inventory_adjustment_ledgers`. Lưu snapshot tồn hệ thống tại thời điểm kiểm (systemQty), người kiểm, trạng thái, checklist, tags, chứng từ.
   - Bổ sung `inventory_ledger` dùng chung với Stock Transfers / Purchase Orders để mọi điều chỉnh đều ghi sự kiện.
2. **API & service layer**
   - Route handlers: `GET/POST /api/inventory-checks`, `PATCH /api/inventory-checks/:id`, `POST /api/inventory-checks/:id/balance`, `POST /api/inventory-checks/:id/cancel`. Balance chạy transaction: lock tồn chi nhánh, ghi ledger, lưu audit.
   - Webhook/job cho phép import file kiểm kê (CSV, thiết bị cầm tay) và upload ảnh bằng chứng.
3. **Refactor frontend**
   - `useInventoryCheckStore` chỉ giữ UI state (filters, column settings). Data dùng React Query với server pagination, infinite scroll, export server-side.
   - Form chia nhỏ hook (`useInventoryItems`, `useInventoryCheckWorkflow`, `useBalancePreview`). Cho phép resume draft, autosave, và edit lại toàn bộ item trước khi lock.
   - Checklist/tags map vào API (`workflowTemplateId`, `subtasks`, `labels`).
4. **Quy trình & quyền hạn**
   - Thêm vai trò: tạo phiếu, kiểm đếm, phê duyệt cân bằng, khóa kỳ. Hủy/cân bằng phải ghi lý do + audit log, có thể yêu cầu dual-approval với phiếu > ngưỡng chênh lệch.
   - Không cho xóa cứng; dùng soft-delete + audit log. Phiếu balanced chỉ có thể create reversal.
5. **Liên kết module**
   - Khiếu nại, Warranty, Stock Transfers chỉ tạo "inventory adjustment request" → backend tự tạo inventory check draft qua API, không truy cập trực tiếp store. Các điều chỉnh từ complaints phải tham chiếu phiếu inventory check chính thức.
   - Đồng bộ với Stock History, Dashboard: dùng cùng nguồn ledger để hiển thị.
6. **Trải nghiệm người dùng**
   - Cho phép import/export danh sách kiểm, hỗ trợ barcode/QR scan, highlight chênh lệch lớn, đính kèm ảnh, hiển thị progress real-time.
   - Cho phép partial balance (chỉ cân bằng những dòng đã xác nhận) và ghi nhận lý do chuẩn hóa (damaged, transfer...).

## 6. Việc cần làm ngay
- Cảnh báo đội vận hành không sử dụng chức năng cân bằng thật trong môi trường production cho đến khi có backend; xuất backup `localStorage` (`inventory-checks`, `hrm-products`) trước khi thử nghiệm.
- Ngăn việc xoá phiếu đã cân bằng (tạm thời disable nút xoá, hoặc chuyển thành `cancelCheck` để giữ lại dữ liệu) cho đến khi refactor.
- Chuẩn bị đặc tả Prisma/API cho Inventory Checks & Inventory Ledger, đồng bộ cùng kế hoạch Cashbook/Stock Transfers để đảm bảo chuỗi nghiệp vụ kho thống nhất.
- Ghi nhận yêu cầu checklist/tags chính thức để thêm vào schema mới, tránh việc UI "giả" không lưu dữ liệu.

## 7. Next step
Theo bảng ưu tiên, module tiếp theo cần rà soát là **Sales-Returns** (#11) để đảm bảo luồng trả hàng bán phối hợp được với kiểm kê và điều chỉnh tồn kho sau refactor.
