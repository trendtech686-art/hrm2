# Rà soát module Dashboard (29/11/2025)

## 1. Kiến trúc & hiện trạng
- **Dashboard chỉ đọc dữ liệu từ các client store**: `features/dashboard/page.tsx` lấy orders, customers, employees qua `useOrderStore`, `useCustomerStore`, `useEmployeeStore`. Các store này đều là Zustand + `localStorage`, nghĩa là số liệu chỉ đúng trên máy hiện tại, không đại diện dữ liệu thật, không hỗ trợ đa người dùng.
- **Không có backend analytics/API**: tất cả KPI (doanh thu ngày, đơn giao, hợp đồng sắp hết hạn, biểu đồ 7 ngày, phân bổ phòng ban) được tính tại client bằng cách `filter/reduce` mảng orders/employees. Khi dữ liệu lớn (vài nghìn đơn), việc tính toán mỗi lần render sẽ chậm và tốn RAM.
- **Biểu đồ và widget tĩnh**: `ChartLine`, `ChartBar`, `ChartPie` chỉ render dữ liệu snapshot, không có pagination, không có tải thêm hoặc chế độ real-time. Không có WebSocket/SSE để phản ánh đơn hàng mới.
- **Widget cảnh báo công nợ**: `debt-alert-widget.tsx` gọi `useCustomerStore.getOverdueDebtCustomers()` và `calculateDebtTrackingInfo`. Các hàm này dựa vào dữ liệu công nợ giả lập trong store, không truy vấn Cashbook thực nên rủi ro sai lệch lớn. Card cũng fetch `useMediaQuery` cho từng khách hàng.
- **Không có phân quyền/role-based view**: Dashboard hiển thị toàn bộ KPI cho mọi user truy cập, không xét quyền (sales chỉ xem sales KPI, HR xem nhân sự...).
- **Không có fallback/loading/error**: nếu store chưa load dữ liệu, Dashboard render 0 hoặc crash (vì assumption mảng sẵn có). Không có skeleton hoặc empty state.

## 2. Đối chiếu checklist
| Hạng mục | Trạng thái | Ghi chú |
| --- | --- | --- |
| KPI Widgets | ⚠️ Một phần | Có vài KPI cố định nhưng dữ liệu giả lập và không linh hoạt (không filter theo chi nhánh/khoảng thời gian/người dùng). |
| Charts & Graphs | ⚠️ Một phần | Render biểu đồ line/bar/pie nhưng chỉ dựa vào 7 ngày và dữ liệu cục bộ; thiếu drill-down, thiếu so sánh năm trước. |
| Real-time data | ❌ | Không có polling hay socket. Người dùng phải refresh trang mới thấy đơn mới. |
| Role-based views | ❌ | Không kiểm soát quyền; mọi người thấy dữ liệu nhạy cảm (công nợ, nhân sự). |
| Mobile | ⚠️ Có cải tiến | Có `MobileGrid`, `MobileOrderCard`, nhưng vẫn phụ thuộc dataset lớn tải về client và không tối ưu cho mạng yếu. |

## 3. Logic & luồng đáng chú ý
1. **Tính KPI tại client** (`stats` trong `page.tsx`): lặp qua toàn bộ orders/employees/customers mỗi render để tính revenue, pending packaging, shipping, new customers, active employees, contract expiry 30/60/90 ngày. Không cache, không query server → load nặng và sai lệch.
2. **Biểu đồ 7 ngày** (`revenueChartData`): tạo mảng 7 phần tử bằng `subtractDays` và filter orders theo ngày. Không kiểm tra timezone, không dùng API aggregator, không scale được >7 ngày.
3. **Pie charts** (`employeeStatusData`, `departmentData`): dùng `reduce` trên employees. Không gắn với settings department list, không xử lý employees chưa có department.
4. **Recent Orders**: sort toàn bộ orders mảng rồi slice 5. Việc sort client-side cho danh sách lớn là tốn kém; đáng ra server trả top 5.
5. **DebtAlertWidget**: gọi `getOverdueDebtCustomers` + `getDueSoonCustomers`, gộp, remove duplicate, sort theo `maxDaysOverdue`. Toàn bộ logic công nợ, due date chỉ dựa vào store `customers`, không cross-check Cashbook/Cashflow module nên công nợ hiển thị sai.
6. **Responsive/mobile logic**: `useMediaQuery` được gọi nhiều nơi (DashboardPage + mỗi CustomerDebtCard). Trên mobile, widget hiển thị grid 1 cột; tuy nhiên khi có hàng trăm khách nợ, tất cả card render một lúc (không virtualize hoặc paginate).

## 4. Rủi ro & issue chính
| Mức độ | Mô tả | Bằng chứng |
| --- | --- | --- |
| 🔴 Cao | **Dashboard không phản ánh dữ liệu thật** vì đọc từ localStorage và phụ thuộc người dùng đã mở các module khác để seed dữ liệu. Không thể dùng cho quyết định kinh doanh. | `useOrderStore`, `useCustomerStore`, `useEmployeeStore` trong `page.tsx` |
| 🔴 Cao | **Không có backend analytics/logging**: KPI/doanh thu tính tại client, không có lịch sử, không thể audit/đối chiếu với kế toán. | `stats` và `revenueChartData` chỉ filter dữ liệu trên trình duyệt |
| 🔴 Cao | **Tiết lộ dữ liệu nhạy cảm cho tất cả người dùng**: Dashboard hiển thị công nợ, hợp đồng sắp hết hạn mà không xét quyền. | Không có guard theo role trong `DashboardPage` |
| 🟠 Trung bình | **Hiệu năng kém khi dataset lớn**: Mỗi render filter/sort toàn bộ orders/customers/employees, render hàng loạt card nợ. | `recentOrders`, `departmentData`, `DebtAlertWidget` |
| 🟠 Trung bình | **Debt alert không chính xác**: Dựa vào trường `currentDebt` giả lập và `calculateDebtTrackingInfo` client; không kết nối Cashbook/Payments. | `DebtAlertWidget` + `calculateDebtTrackingInfo` (customers) |
| 🟡 Thấp | **Thiếu loading/error state**: khi store null/undefined có thể gây crash, và người dùng không biết dashboard đang sync. | Không có React Query hay state cho `isLoading/isError` |

## 5. Đề xuất nâng cấp
1. **Thiết kế Data Warehouse nhẹ**: tạo bảng tổng hợp (vd `fact_orders`, `fact_payments`, `fact_attendance`) hoặc materialized views trong PostgreSQL. Có job ETL/CDC để cập nhật KPI real-time hoặc theo schedule.
2. **API / Analytics service**: xây `GET /api/dashboard/overview?from=&to=&branch=` trả KPI, chart data, debt alerts từ backend. FE dùng React Query để fetch, có caching, auto-refetch.
3. **Role-based dashboard**: xác định widget theo vai trò (CEO, Sales Lead, HR). Backend áp dụng RBAC và mask dữ liệu (ví dụ nhân viên chỉ xem công nợ khách phụ trách).
4. **Widget library có cấu hình**: mỗi widget là component độc lập (KPI, chart, table) với metadata (title, permissions, data source). Cho phép bật/tắt hoặc kéo thả, sắp xếp, pin widget.
5. **Realtime & notification**: dùng WebSocket/SSE hoặc Pusher để đẩy khi có đơn mới, công nợ quá hạn, hợp đồng hết hạn. Dashboard subscribe theo role.
6. **Debt analytics chuẩn**: di chuyển logic tính nợ sang Cashbook service (tính aging bucket, due date, limit). API trả danh sách top debt + breakdown, kèm action (gọi, gửi email). FE chỉ render.
7. **Hiệu năng & UX**: áp dụng pagination/virtualization cho danh sách dài, skeleton cho chart/card, lazy load widget ngoài viewport. Tách `CustomerDebtCard` khỏi hook `useMediaQuery` hoặc hoist boolean lên parent.
8. **Observability**: log KPI query thời gian, track widget usage để tối ưu. Lưu snapshot KPI hằng ngày để so sánh.

## 6. Việc cần làm ngay
- **Khoá Dashboard hiện tại** khỏi môi trường thật (ẩn menu hoặc cảnh báo "Demo only").
- **Soạn đặc tả API dashboard** (KPI definitions, nguồn dữ liệu, bộ lọc) và schema bảng tổng hợp.
- **Ưu tiên xây pipeline công nợ chuẩn** đồng bộ với Cashbook, sau đó thay thế `DebtAlertWidget` bằng dữ liệu backend.
- **Thiết kế role matrix** cho Dashboard và cập nhật middleware kiểm soát truy cập.
- **Refactor FE** sang kiến trúc widget-based + React Query khi backend sẵn sàng.
