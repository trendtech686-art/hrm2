/**
 * Return Order Mapper - Đơn trả hàng (don-tra-hang)
 * Đồng bộ với variables/don-tra-hang.ts
 */

import { 
  PrintData, 
  PrintLineItem,
  formatCurrency,
  formatDate,
  formatTime,
  getStoreData,
  StoreSettings
} from '@/lib/print-service';

export interface ReturnOrderForPrint {
  // Thông tin cơ bản
  code: string;
  orderCode?: string;
  createdAt: string | Date;
  modifiedAt?: string | Date;
  receivedOn?: string | Date;
  reference?: string;
  createdBy?: string;
  
  // Trạng thái
  status?: string;
  refundStatus?: string;
  
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
  customerEmail?: string;
  customerGroup?: string;
  billingAddress?: string;
  
  // Lý do
  reasonReturn?: string;
  
  // Danh sách sản phẩm
  items: Array<{
    variantCode?: string;
    productName: string;
    variantName?: string;
    variantOptions?: string;
    barcode?: string;
    unit?: string;
    quantity: number;
    price: number;
    amount: number;
    brand?: string;
    serial?: string;
    note?: string;
  }>;
  
  // Tổng giá trị
  totalQuantity: number;
  totalAmount: number;
  totalText?: string;
  
  note?: string;
}

export function mapReturnOrderToPrintData(order: ReturnOrderForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': order.location?.name || storeSettings.name || '',
    '{location_address}': order.location?.address || storeSettings.address || '',
    '{store_province}': storeSettings.province || '',
    '{location_province}': order.location?.province || '',
    
    // === THÔNG TIN ĐƠN TRẢ ===
    '{order_return_code}': order.code,
    '{return_code}': order.code,
    '{order_code}': order.orderCode || '',
    '{created_on}': formatDate(order.createdAt),
    '{created_on_time}': formatTime(order.createdAt),
    '{modified_on}': formatDate(order.modifiedAt),
    '{received_on}': formatDate(order.receivedOn),
    '{reference}': order.reference || '',
    '{account_name}': order.createdBy || '',
    
    // === TRẠNG THÁI ===
    '{status}': order.status || '',
    '{refund_status}': order.refundStatus || '',
    
    // === THÔNG TIN KHÁCH HÀNG ===
    '{customer_name}': order.customerName || '',
    '{customer_code}': order.customerCode || '',
    '{customer_phone_number}': order.customerPhone || '',
    '{customer_email}': order.customerEmail || '',
    '{customer_group}': order.customerGroup || '',
    '{billing_address}': order.billingAddress || '',
    
    // === LÝ DO ===
    '{reason_return}': order.reasonReturn || '',
    '{reason}': order.reasonReturn || '',
    
    // === TỔNG GIÁ TRỊ ===
    '{total_quantity}': order.totalQuantity.toString(),
    '{total_amount}': formatCurrency(order.totalAmount),
    '{total_text}': order.totalText || '',
    
    '{note}': order.note || '',
  };
}

export function mapReturnOrderLineItems(items: ReturnOrderForPrint['items']): PrintLineItem[] {
  return items.map((item, index) => ({
    '{line_stt}': (index + 1).toString(),
    '{line_variant_code}': item.variantCode || '',
    '{line_product_name}': item.productName,
    '{line_variant}': item.variantName || '',
    '{line_variant_options}': item.variantOptions || '',
    '{line_unit}': item.unit || 'Cái',
    '{line_quantity}': item.quantity.toString(),
    '{line_price}': formatCurrency(item.price),
    '{line_amount}': formatCurrency(item.amount),
    '{line_brand}': item.brand || '',
    '{serials}': item.serial || '',
    '{line_note}': item.note || '',
  }));
}
