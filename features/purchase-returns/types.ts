/**
 * Thông tin chi tiết từng sản phẩm trong phiếu hoàn trả
 */
export type PurchaseReturnLineItem = {
  productSystemId: string;      // ID hệ thống của sản phẩm
  productId: string;             // Mã SKU sản phẩm (hiển thị)
  productName: string;           // Tên sản phẩm
  orderedQuantity: number;       // Số lượng đã đặt trong đơn nhập gốc
  returnQuantity: number;        // Số lượng thực tế hoàn trả lần này
  unitPrice: number;             // Đơn giá (lấy từ đơn nhập gốc)
  note?: string;                 // Ghi chú riêng cho sản phẩm này (lý do trả cụ thể)
};

/**
 * Phiếu hoàn trả hàng cho nhà cung cấp
 * 
 * Quy trình:
 * 1. Tạo từ đơn nhập hàng đã có phiếu nhập kho
 * 2. Số lượng có thể trả = Tổng đã nhận về kho - Tổng đã trả trước đó
 * 3. Có thể yêu cầu NCC hoàn tiền nếu đã thanh toán trước
 * 4. Tiền hoàn lại sẽ được ghi nhận vào sổ quỹ (nếu có)
 */
export type PurchaseReturn = {
  systemId: string;              // ID hệ thống tự động (TH00000001, TH00000002, ...) - 8 chữ số
  id: string;                    // Mã phiếu hiển thị do người dùng nhập hoặc tự động (TH000001 - 6 số)
  purchaseOrderId: string;       // Mã đơn nhập hàng gốc
  supplierSystemId: string;      // ID nhà cung cấp
  supplierName: string;          // Tên nhà cung cấp (snapshot)
  branchSystemId: string;        // ✅ Branch systemId only
  branchName: string;            // Tên chi nhánh (snapshot)
  returnDate: string;            // Ngày hoàn trả (YYYY-MM-DD)
  reason?: string;               // Lý do hoàn trả chung (tùy chọn)
  items: PurchaseReturnLineItem[];  // Danh sách sản phẩm hoàn trả
  totalReturnValue: number;      // Tổng giá trị hàng hoàn trả
  refundAmount: number;          // Số tiền thực tế nhận lại từ NCC (có thể = 0)
  refundMethod: string;          // Hình thức nhận tiền: "Tiền mặt" | "Chuyển khoản"
  accountSystemId?: string;      // ID tài khoản quỹ nhận tiền (nếu có hoàn tiền)
  creatorName: string;           // Tên người tạo phiếu hoàn trả
};
