# Rà soát module Stock Transfers (29/11/2025)

## 1. Kiến trúc & hiện trạng
- Store trung tâm `useStockTransferStore` (`features/stock-transfers/store.ts`) dùng `zustand` + `persist` (`hrm-stock-transfers`) nên toàn bộ dữ liệu/logic chỉ nằm trên client. Store tự sinh ID, giữ `counter` trong bộ nhớ, và trực tiếp can thiệp tồn kho thông qua `useProductStore`, `useStockHistoryStore`, `useEmployeeStore` mà không có bất kỳ API hay giao dịch backend nào.
- Luồng chuyển kho gồm ba hành động (`confirmTransfer`, `confirmReceive`, `cancelTransfer`) nhưng tất cả đều mutate thẳng `Product` store. `confirmTransfer` gọi `dispatchStock` để trừ kho chi nhánh gốc; `confirmReceive` định giảm `inTransit` và tăng tồn kho chi nhánh nhận nhưng lại chỉ gọi `completeDelivery` (không tăng inventory) nên dữ liệu kho lệch.
- Giao diện danh sách (`features/stock-transfers/page.tsx`) dựng trên `ResponsiveDataTable`, filter/search/pagination chạy client-side (Fuse.js). Bố cục cột lưu vào `localStorage`, không có pagination server hoặc streaming dữ liệu lớn.
- Form tạo/chỉnh sửa (`form-page.tsx`, `edit-page.tsx`) dùng `react-hook-form + zod` nhưng validation chỉ chạy ở client. Product picker (`features/shared/product-selection-dialog.tsx`) đọc trực tiếp Product store để lọc tồn kho, không khóa lượng hàng đã đặt cho các phiếu khác.
- `StockTransferWorkflowCard` (`components/stock-transfer-workflow-card.tsx`) lấy template từ `localStorage` thông qua `getWorkflowTemplate` nhưng kết quả chỉ lưu trong state của form/detail component; `StockTransfer` type không có field nào để persist checklist hoặc tiến độ quy trình → mỗi lần reload là mất sạch.
- Không có API/permission: bất kỳ ai đăng nhập và có bản ghi nhân viên trên client đều có thể chuyển trạng thái, vì store chỉ check `currentEmployee` từ `useAuth` và không kiểm soát quyền theo chi nhánh.

## 2. Đối chiếu checklist
| Hạng mục | Trạng thái | Nhận xét |
| --- | --- | --- |
| Types & Validation | ⚠️ Một phần | `StockTransfer` type mô tả cơ bản nhưng thiếu cost/unitPrice, chứng từ, checklist, attachment. Form dùng zod nhưng chỉ valid tại client, không sync với backend/Prisma. |
| UI/UX | ⚠️ Một phần | Desktop table + mobile card đầy đủ filter nhưng workflows, subtasks, in-transit badges đều là giả lập; không có cảnh báo khi tồn kho thực thay đổi sau khi tạo phiếu. |
| Performance | ⚠️ Một phần | Tất cả thao tác lọc/sort/export đều chạy trên mảng trong trình duyệt, không phù hợp khi dữ liệu lớn. Không có batching khi cập nhật hàng trăm dòng. |
| Database Ready | ❌ | Chưa có schema cho `stock_transfer`, `stock_transfer_item`, `stock_transfer_activity`, `stock_ledger`. Không có khóa ngoại tới `Branch`, `Product`, `Employee`. |
| API Ready | ❌ | Không có route `/api/stock-transfers`, không có service xác nhận chuyển/nhận kho, không có webhook/integration với Inventory module khác. |
| Liên kết module | ⚠️ Thiếu | Tồn kho cập nhật bằng cách gọi trực tiếp `useProductStore`. Không có giao thức chung với Inventory Checks, Purchase Orders, hay sự kiện để Cashbook theo dõi chi phí vận chuyển. |

## 3. Luồng & logic đáng chú ý
1. **Sinh mã & lưu trữ**: ID dạng `PCK000001` sinh từ biến `counter` trong store (`generateNextId`). Không đảm bảo tính duy nhất khi multi-user hoặc khi reload mất state.
2. **Xử lý tồn kho**: `confirmTransfer` gọi `dispatchStock` trên từng item → giảm `inventoryByBranch`, giảm `committedByBranch`, tăng `inTransitByBranch` tại chi nhánh chuyển. `confirmReceive` dự kiến giảm `inTransit` + tăng tồn kho chi nhánh nhận, nhưng chỉ gọi `completeDelivery` (chỉ trừ `inTransit` mà không cộng tồn), đồng thời truyền `toBranchSystemId` nên không hề clearn in-transit của chi nhánh gốc.
3. **Ghi lịch sử**: Sau mỗi thao tác, module ghi log vào `useStockHistoryStore` với action "Xuất chuyển kho" / "Nhập chuyển kho" / "Hủy chuyển kho" và `newStockLevel` lấy từ Product store (`features/stock-transfers/store.ts`), nhưng vì số liệu tồn kho thực bị sai nên history cũng sai theo.
4. **UI Workflow**: `StockTransferWorkflowCard` render checklist từ template settings nhưng không binding vào phiếu. Khi xem lại detail, component phải tạo state mới, nên toàn bộ trạng thái hoàn thành chỉ là demo.
5. **Giá trị phiếu**: `columns.tsx` tính `totalValue` bằng cách đọc `product.costPrice` tại thời điểm render. Nếu giá vốn thay đổi sau này thì số liệu trong lịch sử phiếu cũng đổi theo, không phản ánh thực tế.

## 4. Rủi ro & issue chính
| Mức độ | Mô tả | Bằng chứng |
| --- | --- | --- |
| 🔴 Cao | Nhận hàng không cộng tồn kho chi nhánh nhận và cũng không giải phóng `inTransit` của chi nhánh chuyển. `confirmReceive` chỉ gọi `completeDelivery` với `toBranchSystemId`, trong khi `dispatchStock` đã cộng in-transit cho `fromBranchSystemId`. Kết quả: hàng bị trừ khỏi kho gốc nhưng không tăng ở kho đích, tồn kho thực âm và `inTransit` treo vĩnh viễn. | `features/stock-transfers/store.ts` – hàm `confirmReceive` không dùng `updateInventory`, truyền sai branch vào `completeDelivery`. |
| 🔴 Cao | Toàn bộ nghiệp vụ (tạo phiếu, xác nhận, hủy, cập nhật stock history) diễn ra trên client/localStorage, không có backend transaction, không có khóa dữ liệu hoặc audit trail thật. Refresh tab là mất state counter, song song nhiều user sẽ sinh mã trùng và ghi đè dữ liệu nhau. | `features/stock-transfers/store.ts` với `persist(createJSONStorage(() => localStorage))`. |
| 🟠 Trung bình | Workflow/subtask không được persist, nên người dùng đánh dấu quy trình xong nhưng reload là mất. `StockTransfer` type không có trường checklist, `StockTransferWorkflowCard` chỉ giữ state cục bộ. | `features/stock-transfers/components/stock-transfer-workflow-card.tsx` và `features/stock-transfers/types.ts`. |
| 🟠 Trung bình | Giá trị chuyển kho lấy giá vốn hiện tại của sản phẩm tại thời điểm render -> mọi báo cáo/đối chiếu lịch sử sẽ sai khi điều chỉnh cost sau này. Không lưu `unitCost`/`lineTotal` trong `StockTransferItem`. | `features/stock-transfers/columns.tsx` cột `totalValue`. |
| 🟠 Trung bình | Không có kiểm tra tồn kho thời điểm xác nhận chuyển. Một phiếu có thể tạo khi kho đủ hàng, nhưng trước khi ấn "Chuyển" số lượng có thể đã dùng cho phiếu khác → `dispatchStock` vẫn trừ và biến kho âm. | `confirmTransfer` không revalidate với Product store trước khi gọi `dispatchStock`. |
| 🟡 Thấp | `ProductSelectionDialog` không khóa lượng hàng đang được chọn bởi phiếu khác, không ghi nhận hàng đang trên đường (theo chi nhánh nhận). Không có cơ chế partial reception hay báo cáo thất thoát. | `features/stock-transfers/form-page.tsx` & `store.ts`. |

## 5. Đề xuất nâng cấp
1. **Thiết kế dữ liệu & Prisma**
   - Bổ sung bảng `stock_transfers`, `stock_transfer_items`, `stock_transfer_activities`, `stock_transfer_checklists`, `stock_transfer_attachments` với khóa ngoại đến `branch`, `product`, `employee`. Lưu `unitCost`, `lineCost`, `requestedQty`, `receivedQty`, `lossQty`, `lossReason`.
   - Tạo bảng `stock_ledgers` hoặc mở rộng `inventory_movements` để ghi lại mỗi bước (reserve, dispatch, receive, cancel) với reference tới chứng từ.
2. **Service/API chuẩn**
   - Route handler Next.js: `POST /api/stock-transfers`, `PATCH /api/stock-transfers/:id/confirm-transfer`, `.../confirm-receive`, `.../cancel`. Mỗi mutation chạy trong transaction: lock tồn kho chi nhánh gốc, ghi ledger, cập nhật `in_transit` của cả hai chi nhánh.
   - Expose endpoint cho workflow/checklist (`/api/stock-transfers/:id/checklist`) và activity feed để FE không phải ghép thủ công.
3. **Refactor FE theo React Query**
   - `useStockTransferStore` chỉ còn giữ UI state (filter, column layout). Data fetch qua React Query với infinite scroll / server pagination. Mutation hook (`useConfirmTransfer`) gọi API và optimistic update.
   - Form chia nhỏ hook: `useTransferItems`, `useBranchInventory`, `useTransferWorkflow`. Checklist state đồng bộ với server.
4. **Chuẩn hóa luồng tồn kho**
   - Áp dụng chung service `StockReservationService`: khi tạo phiếu chỉ reserve (tăng `inTransit` hai phía). Khi `confirmTransfer` trừ kho gốc + chuyển `inTransit` sang trạng thái "đang về". Khi nhận hàng, giảm `inTransit` gốc, tăng tồn kho đích, ghi nhận sai lệch (loss/damage) và tự tạo chứng từ Inventory Adjustment nếu cần.
5. **Bổ sung nghiệp vụ mở rộng**
   - Approval workflow (dual approval cho phiếu giá trị cao) + phân quyền theo chi nhánh.
   - Field vận chuyển (driver, biển số, chi phí, chứng từ). Hỗ trợ nhiều đợt nhận (partial receive) với lịch sử từng lần.
6. **Testing & giám sát**
   - Vitest cho service điều chỉnh tồn kho, đặc biệt các edge case partial receive/hủy khi đang chuyển.
   - Playwright flow: tạo phiếu → confirm transfer → partial receive → cancel phần còn lại.

## 6. Việc cần làm ngay
- Ghi nhận bug tồn kho: sửa tạm `confirmReceive` để gọi `returnStockFromTransit`/`updateInventory` đúng chi nhánh trước khi có backend, tránh mất hàng trong môi trường demo.
- Export/backup dữ liệu `localStorage` (`hrm-stock-transfers`, `hrm-products`) trước khi refactor để tránh mất trạng thái testing.
- Chốt schema & hợp đồng API với nhóm Inventory để đồng bộ `stock_history`, `inventory_checks`, `purchase_orders` (tất cả đang chia sẻ `useProductStore`).
- Xác định checklist template chuẩn và bổ sung field `subtasks`/`workflowTemplateId` vào `StockTransfer` để người dùng không mất tiến độ khi reload.

## 7. Next step
Tiếp tục khảo sát module ưu tiên kế tiếp trong bảng `feature-review-prompts.md`: **Inventory-Checks** (#10) để bảo đảm luồng điều chỉnh tồn kho ăn khớp với chuyển kho sau khi refactor.
