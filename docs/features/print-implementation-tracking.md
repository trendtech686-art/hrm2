# Theo dõi Triển khai Tích hợp In ấn

Tài liệu này dùng để theo dõi tiến độ tích hợp nút in và kiểm tra dữ liệu cho các chức năng trong hệ thống.

**Trạng thái:**
- [x] : Đã hoàn thành
- [ ] : Chưa thực hiện

---

## 1. Đơn Bán Hàng (Order)
- **Template:** `order`
- **File:** `features/orders/order-detail-page.tsx`
- **Trạng thái:**
  - [x] Nút in đơn hàng (Header)
  - [x] Nút in phiếu thu/chi (Payment Info) `features/orders/components/payment-info.tsx`
  - [x] Mapping dữ liệu đơn hàng
  - [x] Mapping dữ liệu phiếu thu/chi

## 2. Đơn Đổi Trả (Sales Return)
- **Template:** `sales-return`
- **File:** `features/sales-returns/detail-page.tsx`
- **Trạng thái:**
  - [x] Nút in phiếu trả hàng (Header)
  - [x] Nút in phiếu thu/chi (Financial Summary)
  - [x] Mapping dữ liệu trả hàng
  - [x] Mapping dữ liệu phiếu thu/chi

## 3. Phiếu Bảo Hành (Warranty)
- **Template:** `warranty`
- **File:** `features/warranty/warranty-detail-page.tsx`
- **Trạng thái:**
  - [x] Nút in phiếu bảo hành
  - [x] Mapping dữ liệu

## 4. Phiếu Chuyển Kho (Stock Transfer)
- **Template:** `stock-transfer`
- **File:** `features/stock-transfers/detail-page.tsx`
- **Trạng thái:**
  - [x] Nút in phiếu chuyển kho
  - [x] Mapping dữ liệu

## 5. Đơn Đặt Hàng Nhập (Purchase Order)
- **Template:** `purchase-order`
- **File:** `features/purchase-orders/detail-page.tsx`
- **Trạng thái:**
  - [x] Nút in đơn đặt hàng
  - [x] Mapping dữ liệu

## 6. Phiếu Nhập Kho (Stock In / Inventory Receipt)
- **Template:** `stock-in`
- **File:** `features/inventory-receipts/detail-page.tsx`
- **Trạng thái:**
  - [x] Nút in phiếu nhập kho
  - [x] Mapping dữ liệu

## 7. Phiếu Trả Hàng NCC (Supplier Return)
- **Template:** `supplier-return`
- **File:** `features/purchase-returns/detail-page.tsx`
- **Trạng thái:**
  - [x] Nút in phiếu trả hàng NCC
  - [x] Mapping dữ liệu

## 8. Phiếu Kiểm Kho (Inventory Check)
- **Template:** `inventory-check`
- **File:** `features/inventory-checks/detail-page.tsx`
- **Trạng thái:**
  - [x] Nút in phiếu kiểm kho
  - [x] Mapping dữ liệu

## 9. Phiếu Đóng Gói (Packing)
- **Template:** `packing`
- **File:** `features/packaging/detail-page.tsx`
- **Trạng thái:**
  - [x] Nút in phiếu đóng gói
  - [x] Mapping dữ liệu

## 10. Phiếu Giao Hàng (Delivery)
- **Template:** `delivery`
- **File:** `features/shipments/detail-page.tsx`
- **Trạng thái:**
  - [x] Nút in phiếu giao hàng
  - [x] Mapping dữ liệu

## 11. Báo Giá (Quote)
- **Template:** `quote`
- **File:** `features/quotes/detail-page.tsx` (Không tìm thấy file này trong source code)
- **Trạng thái:**
  - [ ] Nút in báo giá
  - [ ] Mapping dữ liệu

## 12. Khiếu Nại (Complaint)
- **Template:** `complaint`
- **File:** `features/complaints/detail-page.tsx`
- **Trạng thái:**
  - [x] Nút in phiếu khiếu nại
  - [x] Mapping dữ liệu

---

## Checklist Kiểm Tra Cho Mỗi Chức Năng

Khi tích hợp nút in cho một chức năng mới, cần thực hiện các bước sau:

1.  **Xác định vị trí đặt nút in:** Thường là ở Header hoặc góc phải của Card thông tin chính.
2.  **Import Hook & Mappers:**
    ```typescript
    import { usePrint } from '@/lib/use-print';
    import { StoreSettings, numberToWords, formatTime } from '@/lib/print-service';
    import { map[Type]ToPrintData, map[Type]LineItems } from '@/lib/print-mappers/[type].mapper';
    import { useBranchStore } from '@/features/settings/branches/store';
    import { useStoreInfoStore } from '@/features/settings/store-info/store-info-store';
    ```
3.  **Chuẩn bị dữ liệu (Store Settings):**
    ```typescript
    const { info: storeInfo } = useStoreInfoStore();
    // ...
    const storeSettings: StoreSettings = {
        name: storeInfo.brandName || storeInfo.companyName,
        address: storeInfo.headquartersAddress,
        phone: storeInfo.hotline,
        email: storeInfo.email,
        province: storeInfo.province,
    };
    ```
4.  **Mapping dữ liệu:** Sử dụng mapper có sẵn, và **inject thêm** các trường đặc thù nếu template yêu cầu (như `amount_text`, `reason_return`, `note`...).
5.  **Gọi hàm in:**
    ```typescript
    print('template-type', {
        data: mappedData,
        lineItems: lineItems
    });
    ```
6.  **Kiểm tra Preview:** Đảm bảo các biến `{variable}` được thay thế bằng dữ liệu thực.
