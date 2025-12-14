# Rà soát module Reports (29/11/2025)

## 1. Kiến trúc & hiện trạng
- **Toàn bộ báo cáo chạy trên client, đọc dữ liệu từ các store localStorage**: `SalesReportPage` (`features/reports/sales-report/page.tsx`) dùng `useOrderStore` + `useProductStore`; `InventoryReportPage` dùng `useProductStore` + `useBranchStore`; `ProductSlaReportPage` dùng `useProductStore` + `useSupplierStore`; `CustomerSlaReportPage` dùng `useCustomerSlaEvaluation` (vẫn dựa trên dữ liệu khách hàng ở client). Không có API, không query backend nên số liệu phụ thuộc vào máy đang mở.
- **Không có data warehouse hay job tổng hợp**: mọi chỉ số (doanh thu, lợi nhuận, tồn kho, SLA) được tính bằng `filter/reduce` tại browser mỗi lần render, với dữ liệu raw từ store. Khi dataset > vài nghìn bản ghi sẽ treo UI.
- **Export/integration sơ sài**: mọi trang chỉ có nút “Xuất báo cáo” gọi `window.print()`. Không export CSV/XLSX, không gửi email, không lịch chạy tự động.
- **Không có phân quyền/role-based view**: ai vào `/reports/*` cũng xem toàn bộ dữ liệu nhạy cảm như công nợ khách hàng, giá vốn, đề xuất nhập hàng.
- **Thiếu tham số/bộ lọc server**: người dùng không thể chọn khoảng thời gian, chi nhánh, kênh bán, nhóm sản phẩm; chỉ có ô search cục bộ (Fuse.js). Các tabs (combo vs single, alert types) vẫn xử lý client-side.
- **Không có scheduling/notification**: báo cáo SLA chỉ hiện số liệu tĩnh; không có cảnh báo tự động hay gửi summary cho account manager.
- **Testing gần như bằng 0**: không có unit test / e2e cho bất kỳ trang report nào.

## 2. Đối chiếu checklist
| Hạng mục | Trạng thái | Ghi chú |
| --- | --- | --- |
| Report generation | ⚠️ Một phần | Generate ngay trên client từ store. Không có backend pipeline, không đảm bảo dữ liệu chuẩn. |
| Filters & parameters | ⚠️ Rất hạn chế | Chỉ có search text + vài tab; không chọn khoảng thời gian, chi nhánh, nhân viên. |
| Export formats | ❌ | Duy nhất `window.print()`. Không CSV/XLSX/PDF, không API download. |
| Scheduling | ❌ | Không có scheduler, không gửi email, không webhook. |
| Data accuracy | ❌ | Phụ thuộc localStorage, không kết nối DB thực. |
| Performance | ⚠️ | Toàn bộ dataset load vào RAM, sort/filter trên client. Không pagination server. |

## 3. Logic đáng chú ý theo từng báo cáo
1. **Sales report** (`sales-report/page.tsx`)
   - Lọc `orders.filter(o => o.status === 'Hoàn thành')` rồi tính `costOfGoods` bằng cách lấy `product.costPrice`. Không kiểm tra currency, chi nhánh, thuế, chi phí ship.
   - `profit = order.subtotal - costOfGoods` nhưng `subtotal` có thể đã trừ discount, code không mô tả rõ → sai số.
   - Sorting/pagination thuần client, export = print.

2. **Inventory report** (`inventory-report/page.tsx`)
   - Lặp qua `products x branches` để tạo dòng: `inventoryByBranch`, `committedByBranch`, `inTransitByBranch`. Dữ liệu này đến từ store Products (Zustand) → không đồng bộ state backend.
   - Với combo, `calculateComboStock` tính tồn ảo theo branch, hiển thị `comboAvailable`. Tuy nhiên logic fetch component product từ cùng store, không bảo đảm chính xác.
   - Chỉ hiển thị khi `onHand > 0 || committed > 0 || inTransit > 0`, nên không thấy sản phẩm 0 tồn → khó theo dõi.

3. **Product SLA report** (`product-sla-report/page.tsx`)
   - Gọi `getProductStockAlerts` (features/products/stock-alert-utils.ts) trên client để tạo alert `out_of_stock/low_stock/below_safety/over_stock`.
   - `suggestedOrder` tính bằng `getSuggestedOrderQuantity` (client). Không liên kết với nhu cầu, PO, lead time.
   - Tabs filter, summary card, table đều dựa dữ liệu RAM.

4. **Customer SLA report** (`customer-sla-report/page.tsx` + `sla-utils.ts`)
   - `useCustomerSlaEvaluation` có `index.followUpAlerts/reEngagement/debt/health`. Toàn bộ logic `calculateAlertLevel`, `getPreEngagementAlerts`, `getDebtAlerts` chạy trong `sla-utils.ts` bằng `differenceInDays` trên fields của customer store.
   - Công nợ lấy từ `customer.currentDebt`, `customer.debtTransactions` (nếu có). Không tham chiếu Cashbook/GL nên sai lệch.
   - Việc refresh chỉ reset state; không trigger re-evaluate từ backend.

5. **Chung**: Tất cả report table dùng `ResponsiveDataTable`, `DataTableToolbar` với prop `search`. Không có virtualization, không track `isLoading`, `isError`. Khi store chưa load, report hiển thị 0.

## 4. Rủi ro & issues chính
| Mức độ | Mô tả | Bằng chứng |
| --- | --- | --- |
| 🔴 Cao | **Báo cáo không đại diện dữ liệu thật**: mỗi user có dataset riêng trong localStorage. Không thể dùng cho quyết định tài chính. | Tất cả page dùng `use*Store` (Zustand persist) thay vì API. |
| 🔴 Cao | **Không tuân thủ chuẩn BI**: không có dữ liệu lịch sử, không scheduling, export = print, không audit -> không đạt yêu cầu quản trị. | `handleExport = window.print()` ở mọi trang. |
| 🔴 Cao | **Lộ dữ liệu nhạy cảm**: không phân quyền; bất kỳ user đăng nhập xem công nợ, tồn kho, giá vốn. | Không có guard/role check. |
| 🟠 Trung bình | **Hiệu năng kém**: filter/sort/paginate client, `Fuse.js` trên mảng lớn => treo. | `new Fuse(reportData, ...)` mỗi render; `sortedData` recreate. |
| 🟠 Trung bình | **Không nhất quán logic kế toán/kho**: profit, tồn kho, công nợ, SLA đều tính cục bộ; khi backend triển khai, kết quả sẽ khác → mất niềm tin. | `profit = order.subtotal - costOfGoods`, `getDebtAlerts` dựa `customer.debtTransactions`. |
| 🟡 Thấp | **Thiếu unit test, monitoring**: không kiểm soát regressions. | Không có test files trong `features/reports`. |

## 5. Đề xuất nâng cấp
1. **Thiết kế kiến trúc BI chuẩn**:
   - Dùng PostgreSQL + Prisma: tạo bảng fact/dimension (fact_orders, fact_order_items, fact_inventory_snapshots, fact_customer_health, fact_debt_transactions...).
   - Thiết lập job ETL hoặc CDC (Debezium + worker) để đồng bộ dữ liệu từ hệ thống giao dịch sang warehouse nhẹ.

2. **Xây Reports API & React Query**:
   - `GET /api/reports/sales?from=&to=&branch=` trả aggregated metrics + bảng.
   - `GET /api/reports/inventory?branch=&productType=`...
   - `GET /api/reports/customer-alerts?type=` kèm pagination server.
   - FE dùng React Query với `isLoading`, `isError`, skeleton.

3. **Bổ sung tham số lọc chuẩn**:
   - Date range picker (quick ranges, custom) + timezone.
   - Branch, channel, salesperson, customer segment, product category.
   - Save filter presets per user.

4. **Chuẩn hóa export & scheduling**:
   - Backend tạo file CSV/XLSX/PDF (ví dụ `@react-pdf/renderer`, `exceljs`) lưu vào S3, trả link.
   - Cho phép scheduling (daily, weekly) + gửi email/slack, kèm role-based recipients.

5. **Role-based report portal**:
   - RBAC: HR xem Attendance/Payroll, Sales xem Orders/Customers, Inventory xem Stock.
   - Mask dữ liệu nhạy cảm (VD: profit, cost) nếu user không có quyền.

6. **Realtime & alert pipeline**:
   - Dùng Notification service (Redis streams, Kafka) để push alert (công nợ, tồn kho) thay vì render tĩnh. Lưu `alerts` table, assign owner, status.
   - Kết nối với Notification Center/UI badges.

7. **Hiệu năng UI**:
   - Server pagination + infinite scrolling.
   - Virtualized table (`tanstack/react-table` + virtualization) cho dataset lớn.
   - Tách components/hook (summary card, chart) để memo hóa.

8. **Testing & validation**:
   - Unit test cho core calculation (profit, combo stock, SLA). Snapshot test cho export payload.
   - Contract test giữa FE report query và backend API schema.

## 6. Việc cần làm ngay
- **Ẩn hoặc cảnh báo “Demo only” trên menu Reports** cho đến khi có backend.
- **Chuẩn bị tài liệu yêu cầu BI**: danh sách KPI, công thức, nguồn dữ liệu, tần suất cập nhật.
- **Ưu tiên xây Sales & Inventory report backend** (quan trọng nhất), sau đó Customer SLA.
- **Chuẩn hóa dữ liệu công nợ**: phải lấy từ Cashbook/GL, không dùng `customer.currentDebt` thủ công.
- **Thiết lập kế hoạch export & scheduling**: chọn thư viện tạo file, định nghĩa format chung (CSV/Excel/PDF) và cơ chế thông báo.
