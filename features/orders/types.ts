import type { Branch } from '../settings/branches/types.ts';
import type { SystemId, BusinessId } from '../../lib/id-types.ts';

// New types for statuses
export type OrderMainStatus = 'Đặt hàng' | 'Đang giao dịch' | 'Hoàn thành' | 'Đã hủy';
export type OrderPaymentStatus = 'Chưa thanh toán' | 'Thanh toán 1 phần' | 'Thanh toán toàn bộ';
export type PackagingStatus = 'Chờ đóng gói' | 'Đã đóng gói' | 'Hủy đóng gói';
export type OrderDeliveryStatus = 'Chờ đóng gói' | 'Đã đóng gói' | 'Chờ lấy hàng' | 'Đang giao hàng' | 'Đã giao hàng' | 'Chờ giao lại' | 'Đã hủy';
export type OrderPrintStatus = 'Đã in' | 'Chưa in';
export type OrderDeliveryMethod = 'Nhận tại cửa hàng' | 'Dịch vụ giao hàng';
export type OrderStockOutStatus = 'Chưa xuất kho' | 'Xuất kho toàn bộ';
export type OrderReturnStatus = 'Chưa trả hàng' | 'Trả hàng một phần' | 'Trả hàng toàn bộ';

export type LineItem = {
  productSystemId: SystemId;
  productId: BusinessId; // SKU
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
};

export type OrderPayment = {
  systemId: SystemId; // systemId of the voucher
  id: BusinessId; // id of the voucher (e.g., PT000001)
  date: string; // YYYY-MM-DD HH:mm
  method: string;
  amount: number;
  createdBy: SystemId;
  description: string;
  linkedWarrantySystemId?: SystemId; // ✅ Link to warranty (chỉ dùng systemId)
};

export type Packaging = {
  systemId: SystemId;
  id: BusinessId; // Mã đóng gói, e.g., FUN07302
  
  // Dates
  requestDate: string; // ngày yêu cầu đóng gói
  confirmDate?: string; // ngày xác nhận đóng gói
  cancelDate?: string; // ngày hủy đóng gói
  deliveredDate?: string; // ngày đã giao hàng

  // Employees
  requestingEmployeeId: SystemId;
  requestingEmployeeName: string;
  confirmingEmployeeId?: SystemId;
  confirmingEmployeeName?: string;
  cancelingEmployeeId?: SystemId;
  cancelingEmployeeName?: string;
  assignedEmployeeId?: SystemId;
  assignedEmployeeName?: string;
  
  // Statuses & Details
  status: PackagingStatus; // 'Chờ đóng gói', 'Đã đóng gói', 'Hủy đóng gói'
  printStatus: OrderPrintStatus; // 'Đã in', 'Chưa in'
  cancelReason?: string;
  notes?: string;
  
  // New Shipment Fields
  deliveryMethod?: OrderDeliveryMethod;
  deliveryStatus?: OrderDeliveryStatus;
  
  // Carrier Shipment Details
  carrier?: string; // Tên hãng vận chuyển
  service?: string; // Tên dịch vụ
  trackingCode?: string; // Mã vận đơn
  partnerStatus?: string; // Trạng thái đối tác
  shippingFeeToPartner?: number; // Phí trả ĐTVC
  codAmount?: number; // Tổng tiền thu hộ COD
  payer?: 'Người gửi' | 'Người nhận'; // Người trả phí
  reconciliationStatus?: 'Chưa đối soát' | 'Đã đối soát';
  
  // General Shipment Details
  weight?: number; // in grams
  dimensions?: string; // e.g., "10cm x 10cm x 10cm"
  noteToShipper?: string; // Ghi chú giao hàng
  
  // GHTK Specific Fields
  ghtkStatusId?: number; // Raw GHTK status code (-1, 1-21, 123, etc.)
  ghtkReasonCode?: string; // GHTK reason code (100-144)
  ghtkReasonText?: string; // Chi tiết lý do từ GHTK
  ghtkTrackingId?: string; // GHTK tracking_id (internal ID)
  estimatedPickTime?: string; // Thời gian dự kiến lấy hàng
  estimatedDeliverTime?: string; // Thời gian dự kiến giao hàng
  lastSyncedAt?: string; // Lần cuối sync với GHTK (ISO datetime)
  actualWeight?: number; // Khối lượng thực tế từ GHTK (kg)
  actualFee?: number; // Phí thực tế từ GHTK (VND)
  ghtkWebhookHistory?: Array<{ // Lịch sử webhook từ GHTK
    status_id: number;
    status_text?: string;
    action_time: string;
    reason_code?: string;
    reason_text?: string;
  }>;
};

export type GHTKWebhookPayload = {
  label_id: string; // GHTK tracking code
  partner_id: string; // Our order ID
  status_id: number; // Status code
  action_time: string; // ISO timestamp
  reason_code?: string; // Reason code (100-144)
  reason?: string; // Reason text
  weight?: number; // Actual weight (kg)
  fee?: number; // Actual shipping fee (VND)
  pick_money?: number; // COD amount
  return_part_package?: number; // 0 or 1
};

export type Order = {
  systemId: SystemId;
  id: BusinessId; // DH0001
  customerSystemId: SystemId;
  customerName: string;
  
  // Customer addresses
  shippingAddress?: string; // Địa chỉ giao hàng đã chọn
  billingAddress?: string; // Địa chỉ nhận hóa đơn đã chọn
  
  branchSystemId: SystemId; // ✅ Branch systemId only
  branchName: string;
  salespersonSystemId: SystemId;
  salesperson: string;
  orderDate: string; // YYYY-MM-DD HH:mm
  sourceSalesReturnId?: BusinessId;
  
  // ✅ For exchange orders: link to sales return (chỉ dùng systemId)
  linkedSalesReturnSystemId?: SystemId; // SystemId of sales return
  linkedSalesReturnValue?: number; // Value of returned items (to subtract from grandTotal display)
  
  // Expected info
  expectedDeliveryDate?: string; // YYYY-MM-DD
  expectedPaymentMethod?: string; // Tiền mặt, Chuyển khoản, etc.
  
  // External references
  referenceUrl?: string; // Link đơn hàng bên ngoài
  externalReference?: string; // Mã tham chiếu bên ngoài
  
  // Service fees
  serviceFees?: Array<{ id: string; name: string; amount: number }>; // Phí dịch vụ khác (lắp đặt, bảo hành...)

  // Status fields
  status: OrderMainStatus;
  paymentStatus: OrderPaymentStatus;
  deliveryStatus: OrderDeliveryStatus;
  printStatus: OrderPrintStatus;
  stockOutStatus: OrderStockOutStatus;
  returnStatus: OrderReturnStatus;

  // Other fields
  deliveryMethod: OrderDeliveryMethod;
  cancellationReason?: string;
  approvedDate?: string; // Ngày duyệt đơn
  completedDate?: string; // Ngày hoàn thành
  cancelledDate?: string; // Ngày hủy đơn
  dispatchedDate?: string; // Ngày xuất kho
  dispatchedByEmployeeId?: SystemId;
  dispatchedByEmployeeName?: string;
  codAmount: number; // Thu hộ COD

  lineItems: LineItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  
  // Discount & Promotions
  orderDiscount?: number; // Chiết khấu toàn đơn
  orderDiscountType?: 'percentage' | 'fixed';
  orderDiscountReason?: string; // Lý do chiết khấu
  voucherCode?: string; // Mã giảm giá
  voucherAmount?: number; // Số tiền giảm từ voucher
  
  grandTotal: number;
  paidAmount: number; // ✅ Số tiền đã thanh toán (cho tracking warranty deduction)
  payments: OrderPayment[];
  notes?: string;
  tags?: string[]; // Tags phân loại đơn hàng
  
  // New packaging history
  packagings: Packaging[];

  shippingInfo?: {
    carrier: string;
    service: string;
    trackingCode: string;
  }
  source?: string;
};
