import type { Branch } from '../settings/branches/types.ts';
import type { SystemId, BusinessId } from '../../lib/id-types.ts';
import type { HistoryEntry } from '../../lib/activity-history-helper.ts';

// New types for statuses
export type OrderMainStatus = 'Đặt hàng' | 'Đang giao dịch' | 'Hoàn thành' | 'Đã hủy';
export type OrderPaymentStatus = 'Chưa thanh toán' | 'Thanh toán 1 phần' | 'Thanh toán toàn bộ';
export type PackagingStatus = 'Chờ đóng gói' | 'Đã đóng gói' | 'Hủy đóng gói';
export type OrderDeliveryStatus = 'Chờ đóng gói' | 'Đã đóng gói' | 'Chờ lấy hàng' | 'Đang giao hàng' | 'Đã giao hàng' | 'Chờ giao lại' | 'Đã hủy';
export type OrderPrintStatus = 'Đã in' | 'Chưa in';
export type OrderDeliveryMethod = 'Nhận tại cửa hàng' | 'Dịch vụ giao hàng';
export type OrderStockOutStatus = 'Chưa xuất kho' | 'Xuất kho toàn bộ';
export type OrderReturnStatus = 'Chưa trả hàng' | 'Trả hàng một phần' | 'Trả hàng toàn bộ';

export type OrderAddress = {
  street?: string;
  ward?: string;
  district?: string;
  province?: string;
  contactName?: string;
  phone?: string;
  company?: string;
  note?: string;
  label?: string;
  provinceId?: string;
  districtId?: number | string;
  wardId?: string;
  formattedAddress?: string;
  contactPhone?: string;
  id?: string;
};

export type OrderCancellationMetadata = {
  restockItems: boolean;
  notifyCustomer: boolean;
  emailNotifiedAt?: string | undefined;
};

export type LineItem = {
  productSystemId: SystemId;
  productId: BusinessId; // SKU
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  tax?: number; // Tax rate (%)
  taxId?: string; // Tax systemId for reference
  note?: string; // Ghi chú cho từng sản phẩm
};

export type OrderPayment = {
  systemId: SystemId; // systemId of the voucher
  id: BusinessId; // id of the voucher (e.g., PT000001)
  date: string; // YYYY-MM-DD HH:mm
  method: string;
  amount: number;
  createdBy: SystemId;
  description: string;
  linkedWarrantySystemId?: SystemId | undefined; // ✅ Link to warranty (chỉ dùng systemId)
};

export type Packaging = {
  systemId: SystemId;
  id: BusinessId; // Mã đóng gói, e.g., FUN07302
  
  // Dates
  requestDate: string; // ngày yêu cầu đóng gói
  confirmDate?: string | undefined; // ngày xác nhận đóng gói
  cancelDate?: string | undefined; // ngày hủy đóng gói
  deliveredDate?: string | undefined; // ngày đã giao hàng

  // Employees
  requestingEmployeeId: SystemId;
  requestingEmployeeName: string;
  confirmingEmployeeId?: SystemId | undefined;
  confirmingEmployeeName?: string | undefined;
  cancelingEmployeeId?: SystemId | undefined;
  cancelingEmployeeName?: string | undefined;
  assignedEmployeeId?: SystemId | undefined;
  assignedEmployeeName?: string | undefined;
  
  // Statuses & Details
  status: PackagingStatus; // 'Chờ đóng gói', 'Đã đóng gói', 'Hủy đóng gói'
  printStatus: OrderPrintStatus; // 'Đã in', 'Chưa in'
  cancelReason?: string | undefined;
  notes?: string | undefined;
  
  // New Shipment Fields
  deliveryMethod?: OrderDeliveryMethod | undefined;
  deliveryStatus?: OrderDeliveryStatus | undefined;
  
  // Carrier Shipment Details
  carrier?: string | undefined; // Tên hãng vận chuyển
  service?: string | undefined; // Tên dịch vụ
  trackingCode?: string | undefined; // Mã vận đơn
  partnerStatus?: string | undefined; // Trạng thái đối tác
  shippingFeeToPartner?: number | undefined; // Phí trả ĐTVC
  codAmount?: number | undefined; // Tổng tiền thu hộ COD
  payer?: 'Người gửi' | 'Người nhận' | undefined; // Người trả phí
  reconciliationStatus?: 'Chưa đối soát' | 'Đã đối soát' | undefined;
  
  // General Shipment Details
  weight?: number | undefined; // in grams
  dimensions?: string | undefined; // e.g., "10cm x 10cm x 10cm"
  noteToShipper?: string | undefined; // Ghi chú giao hàng
  
  // GHTK Specific Fields
  ghtkStatusId?: number | undefined; // Raw GHTK status code (-1, 1-21, 123, etc.)
  ghtkReasonCode?: string | undefined; // GHTK reason code (100-144)
  ghtkReasonText?: string | undefined; // Chi tiết lý do từ GHTK
  ghtkTrackingId?: string | undefined; // GHTK tracking_id (internal ID)
  estimatedPickTime?: string | undefined; // Thời gian dự kiến lấy hàng
  estimatedDeliverTime?: string | undefined; // Thời gian dự kiến giao hàng
  lastSyncedAt?: string | undefined; // Lần cuối sync với GHTK (ISO datetime)
  actualWeight?: number | undefined; // Khối lượng thực tế từ GHTK (kg)
  actualFee?: number | undefined; // Phí thực tế từ GHTK (VND)
  ghtkWebhookHistory?: Array<{ // Lịch sử webhook từ GHTK
    status_id: number;
    status_text?: string;
    action_time: string;
    reason_code?: string;
    reason_text?: string;
  }> | undefined;
};

export type GHTKWebhookPayload = {
  label_id: string; // GHTK tracking code
  partner_id: string; // Our order ID
  status_id: number; // Status code
  action_time: string; // ISO timestamp
  reason_code?: string | undefined; // Reason code (100-144)
  reason?: string | undefined; // Reason text
  weight?: number | undefined; // Actual weight (kg)
  fee?: number | undefined; // Actual shipping fee (VND)
  pick_money?: number | undefined; // COD amount
  return_part_package?: number | undefined; // 0 or 1
};

export type Order = {
  systemId: SystemId;
  id: BusinessId; // DH0001
  customerSystemId: SystemId;
  customerName: string;
  
  // Customer addresses (snapshot at order time)
  shippingAddress?: string | OrderAddress | undefined;
  billingAddress?: string | OrderAddress | undefined;
  
  branchSystemId: SystemId; // ✅ Branch systemId only
  branchName: string;
  salespersonSystemId: SystemId;
  salesperson: string;
  assignedPackerSystemId?: SystemId | undefined;
  assignedPackerName?: string | undefined;
  orderDate: string; // YYYY-MM-DD HH:mm
  sourceSalesReturnId?: BusinessId | undefined;
  
  // ✅ For exchange orders: link to sales return (chỉ dùng systemId)
  linkedSalesReturnSystemId?: SystemId | undefined; // SystemId of sales return
  linkedSalesReturnValue?: number | undefined; // Value of returned items (to subtract from grandTotal display)
  
  // Expected info
  expectedDeliveryDate?: string | undefined; // YYYY-MM-DD
  expectedPaymentMethod?: string | undefined; // Tiền mặt, Chuyển khoản, etc.
  
  // External references
  referenceUrl?: string | undefined; // Link đơn hàng bên ngoài
  externalReference?: string | undefined; // Mã tham chiếu bên ngoài
  
  // Service fees
  serviceFees?: Array<{ id: string; name: string; amount: number }> | undefined; // Phí dịch vụ khác (lắp đặt, bảo hành...)

  // Status fields
  status: OrderMainStatus;
  paymentStatus: OrderPaymentStatus;
  deliveryStatus: OrderDeliveryStatus;
  printStatus: OrderPrintStatus;
  stockOutStatus: OrderStockOutStatus;
  returnStatus: OrderReturnStatus;

  // Other fields
  deliveryMethod: OrderDeliveryMethod;
  cancellationReason?: string | undefined;
  cancellationMetadata?: OrderCancellationMetadata | undefined;
  approvedDate?: string | undefined; // Ngày duyệt đơn
  completedDate?: string | undefined; // Ngày hoàn thành
  cancelledDate?: string | undefined; // Ngày hủy đơn
  dispatchedDate?: string | undefined; // Ngày xuất kho
  dispatchedByEmployeeId?: SystemId | undefined;
  dispatchedByEmployeeName?: string | undefined;
  codAmount: number; // Thu hộ COD

  lineItems: LineItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  
  // Discount & Promotions
  orderDiscount?: number | undefined; // Chiết khấu toàn đơn
  orderDiscountType?: 'percentage' | 'fixed' | undefined;
  orderDiscountReason?: string | undefined; // Lý do chiết khấu
  voucherCode?: string | undefined; // Mã giảm giá
  voucherAmount?: number | undefined; // Số tiền giảm từ voucher
  
  grandTotal: number;
  paidAmount: number; // ✅ Số tiền đã thanh toán (cho tracking warranty deduction)
  payments: OrderPayment[];
  notes?: string | undefined;
  tags?: string[] | undefined; // Tags phân loại đơn hàng
  
  // New packaging history
  packagings: Packaging[];

  shippingInfo?: {
    carrier: string;
    service: string;
    trackingCode: string;
  } | undefined;
  source?: string | undefined;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;

  // Workflow subtasks
  subtasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
    order: number;
    createdAt: Date;
    completedAt?: Date | undefined;
    assigneeId?: string | undefined;
    assigneeName?: string | undefined;
    parentId?: string | undefined;
    metadata?: any | undefined;
    dueDate?: string | undefined;
  }> | undefined;

  // Activity History
  activityHistory?: HistoryEntry[];
};
