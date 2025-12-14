# Đánh giá & nâng cấp module Stock-Transfers (29/11/2025)

## 1. Phạm vi rà soát
- `features/stock-transfers/types.ts`: định nghĩa dual-ID, trạng thái và item payload.
- `features/stock-transfers/store.ts`: trung tâm CRUD + luồng trạng thái, tương tác tồn kho/in-transit.
- `features/stock-transfers/{columns,page,detail-page,form-page,edit-page}.tsx`, `stock-transfer-card.tsx`: danh sách, chi tiết, tạo/sửa, mobile card.
- `features/stock-transfers/components/stock-transfer-workflow-card.tsx`: checklist quy trình nội bộ.

## 2. Đánh giá theo yêu cầu logic (Mục B)
### 1) Transfer CRUD với dual-ID
- Mô hình đang sinh `systemId` (TRANSFERxxxxxx) và `id` (PCKxxxxxx) trong `store.ts`. Form tạo (`form-page.tsx`) có kiểm tra trùng mã qua `isBusinessIdExists`, nhưng store không chặn ở tầng dữ liệu → nguy cơ tạo trùng nếu bypass UI hoặc submit song song.
- Hàm `update` chỉ merge thẳng phần tử, không xác thực trạng thái hoặc tái chuẩn hóa dữ liệu. Vì vậy bất kỳ caller nào cũng có thể thay đổi `status`, `items`… mà không qua rule (rủi ro khi mở API thật).
- Hàm `remove`/`findBy*` hoạt động đúng nhưng chưa ghi log audit.
**Kiến nghị**: thêm validation ở store (hoặc service layer) cho uniqueness `id`, lock các field nhạy cảm theo trạng thái, và bổ sung tracking `updatedByName` phục vụ audit.

### 2) Status flow (pending → transferring → completed/cancelled)
- Flow được điều khiển bởi `confirmTransfer`, `confirmReceive`, `cancelTransfer` trong `store.ts` và được UI guard ở `detail-page.tsx`, `columns.tsx`.
- Thiếu tái kiểm tra tồn kho khi `confirmTransfer` chạy. Nếu tồn kho đã giảm sau khi phiếu tạo, `dispatchStock` vẫn chạy và có thể làm tồn âm vì không có validation.
- `confirmReceive` luôn chuyển thẳng sang `completed`, dù người dùng nhập SL nhận < SL chuyển. Không có trạng thái trung gian (`partially_received`) hay cơ chế tiếp tục nhận.
- `cancelTransfer` khi trạng thái `transferring` hoàn trả full số lượng về chi nhánh chuyển, không xét số lượng đã nhận thực tế (dù UI hiện chưa cho nhận từng phần). Khi mở partial receiving sẽ phát sinh sai lệch.
**Kiến nghị**: kiểm tra trước khi chuyển trạng thái (tồn kho, quyền, locking) và bổ sung state `partially_received` + workflow rõ để tránh chốt hoàn toàn khi chưa nhận đủ.

### 3) From/To branch management
- Form tạo/reset danh sách sản phẩm khi đổi chi nhánh chuyển, đảm bảo dữ liệu đồng nhất. Edit page cũng khóa chuyển chi nhánh khi trạng thái > pending.
- Tuy nhiên dữ liệu lưu chỉ bao gồm `fromBranchName`/`toBranchName` tại thời điểm tạo. Nếu tên chi nhánh đổi, lịch sử cũ không cập nhật → nên lưu cả `branchId` (đã có) và fetch tên khi render để đảm bảo cập nhật hoặc ghi thêm `branchCode` ổn định.
- Chưa có validation chéo cho kịch bản cùng một người vừa chuyển vừa nhận (quy định nội bộ?); chưa lưu metadata như kho phụ.

### 4) Item tracking (quantity vs. receivedQuantity)
- Schema hỗ trợ `receivedQuantity`, `detail-page.tsx` hiển thị và dialog `confirmReceive` cho phép nhập thủ công.
- Vấn đề: Sau khi nhấn xác nhận, `status` chuyển `completed` bất kể `receivedQuantity < quantity`. Không có flag nào để biết còn thiếu bao nhiêu, không có cơ chế reopen.
- Không lưu dấu vết theo item (ví dụ ai nhận, ngày nhận, lô vận chuyển). `StockTransferItem` chỉ có note chung.
**Kiến nghị**: lưu thêm `receivedBySystemId`/`receivedAt` trên từng item hoặc một bảng con; thêm bảng tạm cho lần nhận tiếp theo, và tạo báo cáo chênh lệch.

### 5) In-transit stock tracking (`inTransitByBranch`)
- `confirmTransfer` dùng `useProductStore.dispatchStock`: hàm này giảm tồn `inventoryByBranch[fromBranch]`, giảm `committed`, **và tăng `inTransitByBranch[fromBranch]`**.
- `confirmReceive` gọi `completeDelivery(productId, toBranch, qty)` nhưng hàm này chỉ giảm `inTransitByBranch[toBranch]` và **không tăng tồn kho chi nhánh nhận**. Hệ quả:
  1. `inTransitByBranch` bị lệch vì tăng ở chi nhánh chuyển nhưng giảm ở chi nhánh nhận ⇒ giá trị ở chi nhánh chuyển không bao giờ giảm.
  2. Tồn kho thực tế chi nhánh nhận không được cộng sau khi nhận hàng → số lượng "biến mất" khỏi hệ thống.
- `cancelTransfer` khi đang chuyển gọi `returnStockFromTransit(product, fromBranch, qty)` nên chỉ hoàn tồn ở chi nhánh chuyển; tổng thể vẫn thiếu nếu trước đó `completeDelivery` đã chạy sai.
**Kiến nghị khẩn cấp**:
  - Cập nhật `useProductStore.completeDelivery` để (a) giảm `inTransitByBranch[fromBranch]` hoặc lưu theo cặp, (b) tăng `inventoryByBranch[toBranch]`.
  - Khi dispatch nên ghi `inTransitByRoute[{from-to}]` để theo dõi chính xác. Tối thiểu phải đảm bảo cùng một branch key được tăng/giảm.

## 3. Liên kết Modules (Mục C)
- **Products**: `useProductStore` cung cấp tồn, committed, in-transit và giá vốn để tính giá trị phiếu. Sai lệch ở các hàm này ảnh hưởng trực tiếp tới báo cáo tồn kho.
- **Branches**: `useBranchStore` cung cấp danh sách chi nhánh cho filter, form; chỉ lưu tên tại thời điểm tạo nên cần chuẩn hoá thêm `branchCode`.
- **Employees**: `useEmployeeStore` và `useAuth` dùng để ghi nhận `createdBy`, `transferredBy`, `receivedBy`, hiển thị lịch sử tại `detail-page.tsx`. Chưa lưu vai trò hoặc phê duyệt nhiều cấp.
- **Stock history**: `useStockHistoryStore.addEntry` được gọi trong `confirmTransfer`, `confirmReceive`, `cancelTransfer` để sinh log "Xuất chuyển kho", "Nhập chuyển kho", "Hủy chuyển kho". Các bản ghi này hiện cũng bị sai vì tồn kho mới không được cập nhật đúng (xem mục 5).

## 4. Đề xuất mở rộng (Mục D)
1. **Transfer request workflow**
   - Lưu `subtasks`/workflow từ `StockTransferWorkflowCard` ngay trong `StockTransfer` (VD: `workflowTasks: Subtask[]`) thay vì chỉ giữ trong state cục bộ của form.
   - Thêm trạng thái `requested`, `approved`, `ready_to_dispatch`; hỗ trợ phân quyền phê duyệt (branch manager, inventory controller).
   - Kết nối với notification/task system để push tới người chịu trách nhiệm từng bước.

2. **Real-time tracking**
   - Kết nối socket hoặc polling `useStockTransferStore` với API backend để cập nhật trạng thái ngay khi bên nhận xác nhận.
   - Hiển thị tiến trình vận chuyển theo mốc thời gian (departed, arrived at hub, delivered) bằng cách thêm `trackingEvents` vào schema, có thể sync với hệ thống vận tải.
   - Trên mobile card (`stock-transfer-card.tsx`), bổ sung badge thời gian còn lại dựa trên SLA giữa chi nhánh.

3. **Partial receiving**
   - Cho phép nhiều lần `confirmReceive`: mỗi lần lưu record riêng với số lượng nhận, nhân viên nhận, thời gian. Khi tổng nhận < tổng chuyển thì status = `partially_received`, chỉ khi đủ mới `completed`.
   - Với từng item, lưu `receivedQuantity`, `pendingQuantity`, và danh sách đợt nhận (`receipts[]`). UI detail nên hiển thị bảng phân bổ.
   - Khi hủy trong trạng thái partial, chỉ hoàn trả phần còn đang in-transit thay vì toàn bộ.

4. **Transfer cost allocation**
   - Mở rộng schema: `shippingCost`, `handlingCost`, `insuranceCost`, `otherCosts` và cấu hình phương pháp phân bổ (theo trọng lượng, giá trị, số lượng).
   - Tự tính `landedCost` cho từng sản phẩm nhận được, cập nhật `product.costPrice` hoặc tạo journal vào GL.
   - Hiển thị tổng chi phí và chi phí phân bổ trên detail page, đồng thời đẩy sang module kế toán/purchase.

5. **Các bước tiếp theo đề xuất**
   - Sửa lỗi in-transit & nhập kho trong `useProductStore` + `store.ts` trước khi triển khai thêm tính năng.
   - Viết test (Vitest) cho `confirmTransfer`, `confirmReceive`, `cancelTransfer` để đảm bảo số liệu tồn, in-transit, lịch sử kho đúng.
   - Thiết kế lại schema backend (nếu có) để phản ánh workflow, partial receiving và chi phí vận chuyển.

## 5. TODO công việc cần làm

1. **Sửa nghiệp vụ tồn kho/in-transit (ưu tiên cao)**  
   - Cập nhật `useProductStore.completeDelivery` để giảm đúng `inTransitByBranch[fromBranch]` và cộng `inventoryByBranch[toBranch]`.  
   - Điều chỉnh `useProductStore.dispatchStock` + `returnStockFromTransit` để lưu cả cặp from/to nhằm tránh sai lệch khi nhiều luồng cùng chạy.  
   - Sau khi chỉnh, chạy lại các flow trong `store.ts` (`confirmTransfer`, `confirmReceive`, `cancelTransfer`) để bảo đảm hàm mới được gọi đúng.

2. **Gia cố validation & bảo vệ trạng thái**  
   - Thêm kiểm tra unique `id` ở `useStockTransferStore.add` (reject nếu đã tồn tại).  
   - Giới hạn `store.update` chỉ cho phép trường hợp hợp lệ dựa trên `transfer.status` (VD: chỉ pending mới sửa items/branches).  
   - Bổ sung xác thực tồn kho hiện tại trước khi chạy `confirmTransfer` để tránh tồn âm.

3. **Bổ sung partial receiving**  
   - Mở rộng `StockTransferStatus` với `partially_received`.  
   - Cho phép nhiều lần `confirmReceive` và lưu `receipts[]` trên từng item (số lượng, thời gian, nhân viên).  
   - Điều chỉnh UI (`detail-page.tsx`, `columns.tsx`) để hiển thị trạng thái mới và số lượng còn chờ.

4. **Lưu workflow/subtasks vào dữ liệu**  
   - Thêm field `workflowSubtasks` (hoặc tương tự) vào `StockTransfer` để `StockTransferWorkflowCard` đọc/ghi thay vì chỉ dùng state cục bộ ở form.  
   - Đồng bộ subtasks sang `detail-page.tsx` để người dùng theo dõi tiến độ sau khi tạo phiếu.

5. **Viết test tự động**  
   - Tạo file test trong `features/stock-transfers/__tests__/store.test.ts` (hoặc vị trí phù hợp) kiểm tra 3 hàm trạng thái cùng với cập nhật tồn kho.  
   - Mock `useProductStore`/`useStockHistoryStore` để assert rằng dispatch/receive ghi log đúng.

## 6. Đề xuất nâng cấp ưu tiên

1. **Transfer request workflow chuẩn**: thêm các trạng thái `requested`, `approved`, `ready_to_dispatch`, tích hợp thông báo (modal-context/task system) để đảm bảo phiếu chỉ rời kho khi đã được phê duyệt.
2. **Real-time tracking & SLA**: xây dựng `trackingEvents` + socket/polling, hiển thị tiến trình cùng đồng hồ SLA trên cả desktop/mobile card.
3. **Partial receiving/reporting**: sau khi hỗ trợ nhiều lần nhận, tạo dashboard thống kê số lượng còn treo, cảnh báo phiếu quá hạn nhận.
4. **Transfer cost allocation**: chuẩn hóa các trường chi phí, cấu hình phương pháp phân bổ và tự động cập nhật giá vốn/GL sau mỗi lần nhận.
5. **Branch metadata & audit**: lưu thêm `branchCode`, `updatedByName`, log chi tiết trong `ActivityHistory` để phục vụ truy vết và rename chi nhánh.
