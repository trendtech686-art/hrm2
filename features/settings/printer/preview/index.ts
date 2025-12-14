import { TemplateType } from '../types';

// Import từng file preview - 16 loại chính
import { ORDER_PREVIEW_DATA } from './order.preview';
import { RECEIPT_PREVIEW_DATA } from './receipt.preview';
import { PAYMENT_PREVIEW_DATA } from './payment.preview';
import { WARRANTY_PREVIEW_DATA } from './warranty.preview';
import { INVENTORY_CHECK_PREVIEW_DATA } from './inventory-check.preview';
import { STOCK_TRANSFER_PREVIEW_DATA } from './stock-transfer.preview';
import { STOCK_IN_PREVIEW_DATA } from './stock-in.preview';
import { SALES_RETURN_PREVIEW_DATA } from './sales-return.preview';
import { PURCHASE_ORDER_PREVIEW_DATA } from './purchase-order.preview';
import { PACKING_PREVIEW_DATA } from './packing.preview';
import { QUOTE_PREVIEW_DATA } from './quote.preview';
import { DELIVERY_PREVIEW_DATA } from './delivery.preview';
import { SHIPPING_LABEL_PREVIEW_DATA } from './shipping-label.preview';
import { PRODUCT_LABEL_PREVIEW_DATA } from './product-label.preview';
import { SUPPLIER_RETURN_PREVIEW_DATA } from './supplier-return.preview';
import { COMPLAINT_PREVIEW_DATA } from './complaint.preview';
import { PENALTY_PREVIEW_DATA } from './penalty.preview';
import { COST_ADJUSTMENT_PREVIEW_DATA } from './cost-adjustment.preview';
import { PAYROLL_PREVIEW_DATA } from './payroll.preview';
import { ATTENDANCE_PREVIEW_DATA } from './attendance.preview';

// Import 8 loại mở rộng (extended templates)
import { DON_NHAP_HANG_PREVIEW } from './don-nhap-hang.preview';
import { DON_TRA_HANG_PREVIEW } from './don-tra-hang.preview';
import { PHIEU_BAN_GIAO_PREVIEW } from './phieu-ban-giao.preview';
import { PHIEU_XAC_NHAN_HOAN_PREVIEW } from './phieu-xac-nhan-hoan.preview';
import { PHIEU_TONG_KET_BAN_HANG_PREVIEW } from './phieu-tong-ket-ban-hang.preview';
import { PHIEU_HUONG_DAN_DONG_GOI_PREVIEW } from './phieu-huong-dan-dong-goi.preview';
import { PHIEU_YEU_CAU_DONG_GOI_PREVIEW } from './phieu-yeu-cau-dong-goi.preview';
import { PHIEU_YEU_CAU_BAO_HANH_PREVIEW } from './phieu-yeu-cau-bao-hanh.preview';

/**
 * PREVIEW_DATA - Dữ liệu mẫu cho tất cả loại mẫu in
 * Dùng để hiển thị preview trong Settings > Tùy chỉnh mẫu in
 * 
 * @description
 * - Mỗi loại mẫu in có 1 file preview riêng trong thư mục này
 * - Dữ liệu dùng chung (store, location) nằm trong _shared.preview.ts
 * - Đảm bảo đồng bộ với các file variables tương ứng
 */
export const PREVIEW_DATA: Record<TemplateType, Record<string, string>> = {
  'order': ORDER_PREVIEW_DATA,
  'receipt': RECEIPT_PREVIEW_DATA,
  'payment': PAYMENT_PREVIEW_DATA,
  'warranty': WARRANTY_PREVIEW_DATA,
  'inventory-check': INVENTORY_CHECK_PREVIEW_DATA,
  'stock-transfer': STOCK_TRANSFER_PREVIEW_DATA,
  'stock-in': STOCK_IN_PREVIEW_DATA,
  'sales-return': SALES_RETURN_PREVIEW_DATA,
  'purchase-order': PURCHASE_ORDER_PREVIEW_DATA,
  'packing': PACKING_PREVIEW_DATA,
  'quote': QUOTE_PREVIEW_DATA,
  'delivery': DELIVERY_PREVIEW_DATA,
  'shipping-label': SHIPPING_LABEL_PREVIEW_DATA,
  'product-label': PRODUCT_LABEL_PREVIEW_DATA,
  'supplier-return': SUPPLIER_RETURN_PREVIEW_DATA,
  'complaint': COMPLAINT_PREVIEW_DATA,
  'penalty': PENALTY_PREVIEW_DATA,
  'leave': PENALTY_PREVIEW_DATA, // TODO: Create dedicated LEAVE_PREVIEW_DATA
  'cost-adjustment': COST_ADJUSTMENT_PREVIEW_DATA,
  'handover': PHIEU_BAN_GIAO_PREVIEW,
  'payroll': PAYROLL_PREVIEW_DATA,
  'payslip': PAYROLL_PREVIEW_DATA,
  'attendance': ATTENDANCE_PREVIEW_DATA,
};

// Re-export shared data for external use
export { SHARED_PREVIEW_DATA } from './_shared.preview';

// Re-export 16 loại chính
export {
  ORDER_PREVIEW_DATA,
  RECEIPT_PREVIEW_DATA,
  PAYMENT_PREVIEW_DATA,
  WARRANTY_PREVIEW_DATA,
  INVENTORY_CHECK_PREVIEW_DATA,
  STOCK_TRANSFER_PREVIEW_DATA,
  STOCK_IN_PREVIEW_DATA,
  SALES_RETURN_PREVIEW_DATA,
  PURCHASE_ORDER_PREVIEW_DATA,
  PACKING_PREVIEW_DATA,
  QUOTE_PREVIEW_DATA,
  DELIVERY_PREVIEW_DATA,
  SHIPPING_LABEL_PREVIEW_DATA,
  PRODUCT_LABEL_PREVIEW_DATA,
  SUPPLIER_RETURN_PREVIEW_DATA,
  COMPLAINT_PREVIEW_DATA,
  PENALTY_PREVIEW_DATA,
  PAYROLL_PREVIEW_DATA,
  ATTENDANCE_PREVIEW_DATA,
};

// Re-export 8 loại mở rộng
export {
  DON_NHAP_HANG_PREVIEW,
  DON_TRA_HANG_PREVIEW,
  PHIEU_BAN_GIAO_PREVIEW,
  PHIEU_XAC_NHAN_HOAN_PREVIEW,
  PHIEU_TONG_KET_BAN_HANG_PREVIEW,
  PHIEU_HUONG_DAN_DONG_GOI_PREVIEW,
  PHIEU_YEU_CAU_DONG_GOI_PREVIEW,
  PHIEU_YEU_CAU_BAO_HANH_PREVIEW,
};

/**
 * EXTENDED_PREVIEW_DATA - Dữ liệu mẫu cho các loại mẫu in mở rộng
 * Tương ứng với EXTENDED_TEMPLATE_VARIABLES trong variables/index.ts
 */
export const EXTENDED_PREVIEW_DATA = {
  'don-nhap-hang': DON_NHAP_HANG_PREVIEW,
  'don-tra-hang': DON_TRA_HANG_PREVIEW,
  'phieu-ban-giao': PHIEU_BAN_GIAO_PREVIEW,
  'phieu-xac-nhan-hoan': PHIEU_XAC_NHAN_HOAN_PREVIEW,
  'phieu-tong-ket-ban-hang': PHIEU_TONG_KET_BAN_HANG_PREVIEW,
  'phieu-huong-dan-dong-goi': PHIEU_HUONG_DAN_DONG_GOI_PREVIEW,
  'phieu-yeu-cau-dong-goi': PHIEU_YEU_CAU_DONG_GOI_PREVIEW,
  'phieu-yeu-cau-bao-hanh': PHIEU_YEU_CAU_BAO_HANH_PREVIEW,
};
