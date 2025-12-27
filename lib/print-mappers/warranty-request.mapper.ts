/**
 * Warranty Request Mapper - Phiếu yêu cầu bảo hành (phieu-yeu-cau-bao-hanh)
 * Đồng bộ với variables/phieu-yeu-cau-bao-hanh.ts
 */

import { 
  PrintData, 
  PrintLineItem,
  formatCurrency,
  formatDate,
  getStoreData,
  StoreSettings
} from '@/lib/print-service';

export interface WarrantyRequestForPrint {
  // Thông tin cơ bản
  code: string;
  warrantyRequestCode?: string;
  orderCode?: string;
  createdAt: string | Date;
  createdAtTime?: string;
  modifiedAt?: string | Date;
  createdBy?: string;
  reference?: string;
  status?: string;
  priority?: string;
  
  // Thông tin chi nhánh
  location?: {
    name?: string;
    address?: string;
    province?: string;
  };
  
  // Thông tin khách hàng
  customerCode?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerEmail?: string;
  customerGroup?: string;
  
  // Thông tin sản phẩm
  productCode?: string;
  productName?: string;
  serialNumber?: string;
  purchaseDate?: string | Date;
  warrantyExpiredOn?: string | Date;
  warrantyDuration?: string;
  
  // Thông tin sự cố
  issueType?: string;
  issueDescription?: string;
  deviceCondition?: string;
  accessories?: string;
  
  // Xử lý
  receivedBy?: string;
  technicianName?: string;
  expectedCompletionDate?: string | Date;
  note?: string;
  
  // Tags
  tag?: string;
  
  // Danh sách sản phẩm
  items: Array<{
    productName: string;
    variantName?: string;
    variantSku?: string;
    variantBarcode?: string;
    serial?: string;
    warrantyCardCode?: string;
    quantity: number;
    requestType?: string;
    receivedOn?: string | Date;
    status?: string;
    expenseTitle?: string;
    expenseAmount?: number;
    expenseTotalAmount?: number;
  }>;
  
  // Tổng giá trị
  totalQuantity: number;
  totalAmount?: number;
}

export function mapWarrantyRequestToPrintData(request: WarrantyRequestForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': request.location?.name || storeSettings.name || '',
    '{location_address}': request.location?.address || storeSettings.address || '',
    '{store_province}': storeSettings.province || '',
    '{location_province}': request.location?.province || '',
    
    // === THÔNG TIN PHIẾU YÊU CẦU BẢO HÀNH ===
    '{warranty_claim_card_code}': request.code,
    '{warranty_request_code}': request.warrantyRequestCode || request.code,
    '{order_code}': request.orderCode || '',
    '{created_on}': formatDate(request.createdAt),
    '{created_on_time}': request.createdAtTime || '',
    '{modified_on}': formatDate(request.modifiedAt),
    '{account_name}': request.createdBy || '',
    '{reference}': request.reference || '',
    '{status}': request.status || '',
    '{priority}': request.priority || '',
    
    // === THÔNG TIN KHÁCH HÀNG ===
    '{customer_code}': request.customerCode || '',
    '{customer_name}': request.customerName || '',
    '{customer_phone_number}': request.customerPhone || '',
    '{customer_address1}': request.customerAddress || '',
    '{customer_address}': request.customerAddress || '',
    '{customer_email}': request.customerEmail || '',
    '{customer_group}': request.customerGroup || '',
    
    // === THÔNG TIN SẢN PHẨM ===
    '{product_code}': request.productCode || '',
    '{product_name}': request.productName || '',
    '{serial_number}': request.serialNumber || '',
    '{purchase_date}': formatDate(request.purchaseDate),
    '{warranty_expired_on}': formatDate(request.warrantyExpiredOn),
    '{warranty_duration}': request.warrantyDuration || '',
    
    // === THÔNG TIN SỰ CỐ ===
    '{issue_type}': request.issueType || '',
    '{issue_description}': request.issueDescription || '',
    '{device_condition}': request.deviceCondition || '',
    '{accessories}': request.accessories || '',
    
    // === XỬ LÝ ===
    '{received_by}': request.receivedBy || '',
    '{technician_name}': request.technicianName || '',
    '{expected_completion_date}': formatDate(request.expectedCompletionDate),
    '{note}': request.note || '',
    
    // === TAGS ===
    '{tag}': request.tag || '',
    
    // === TỔNG GIÁ TRỊ ===
    '{total_quantity}': request.totalQuantity.toString(),
    '{total_amount}': formatCurrency(request.totalAmount),
  };
}

export function mapWarrantyRequestLineItems(items: WarrantyRequestForPrint['items']): PrintLineItem[] {
  return items.map((item, index) => ({
    '{line_stt}': (index + 1).toString(),
    '{line_product_name}': item.productName,
    '{line_variant_name}': item.variantName || '',
    '{line_variant_sku}': item.variantSku || '',
    '{line_variant_barcode}': item.variantBarcode || '',
    '{serials}': item.serial || '',
    '{warranty_card_code}': item.warrantyCardCode || '',
    '{line_quantity}': item.quantity.toString(),
    '{line_type}': item.requestType || '',
    '{line_received_on}': formatDate(item.receivedOn),
    '{line_status}': item.status || '',
    '{line_expense_title}': item.expenseTitle || '',
    '{line_expense_amount}': formatCurrency(item.expenseAmount),
    '{line_expense_total_amount}': formatCurrency(item.expenseTotalAmount),
  }));
}
