/**
 * Complaint Mapper - Phiếu khiếu nại
 * Đồng bộ với variables/phieu-khieu-nai.ts
 */

import { 
  PrintData, 
  formatCurrency,
  formatDate,
  formatTime,
  numberToWords,
  hidePhoneMiddle,
  getStoreData,
  StoreSettings
} from '@/lib/print-service';

export interface ComplaintForPrint {
  // Thông tin cơ bản
  code: string;
  createdAt: string | Date;
  modifiedAt?: string | Date;
  createdBy?: string;
  
  // Thông tin chi nhánh
  location?: {
    name?: string;
    address?: string;
    province?: string;
    phone?: string;
  };
  
  // Thông tin khách hàng
  customerName: string;
  customerCode?: string;
  customerPhone?: string;
  customerPhoneHide?: boolean;
  customerEmail?: string;
  customerAddress?: string;
  customerGroup?: string;
  
  // Thông tin đơn hàng liên quan
  orderCode?: string;
  orderCreatedAt?: string | Date;
  orderTotal?: number;
  
  // Thông tin khiếu nại
  complaintType?: string;
  category?: string;
  priority?: string;
  source?: string;
  subject: string;
  description: string;
  customerRequest?: string;
  
  // Sản phẩm (Single - Legacy support)
  productName?: string;
  variantName?: string;
  variantCode?: string;

  // Danh sách sản phẩm (Multiple)
  items?: Array<{
    productName: string;
    variantCode?: string;
    quantity?: number;
    issue?: string;
    resolution?: string;
  }>;
  
  // Trạng thái & Xử lý
  status?: string;
  assignedTo?: string;
  assigneeId?: string;
  resolution?: string;
  resolutionNote?: string;
  resolvedAt?: string | Date;
  responseDeadline?: string | Date;
  
  // Chi phí bồi thường (nếu có)
  compensationAmount?: number;
  
  note?: string;
}

const COMPLAINT_STATUS_MAP: Record<string, string> = {
  'new': 'Mới',
  'investigating': 'Đang xử lý',
  'resolved': 'Đã giải quyết',
  'closed': 'Đã đóng',
  'cancelled': 'Đã hủy'
};

const COMPLAINT_TYPE_MAP: Record<string, string> = {
  'missing-items': 'Thiếu hàng',
  'damaged-items': 'Hàng hư hỏng',
  'wrong-items': 'Sai hàng',
  'late-delivery': 'Giao hàng chậm',
  'service-quality': 'Chất lượng dịch vụ',
  'other': 'Khác'
};

export function mapComplaintToPrintData(complaint: ComplaintForPrint, storeSettings: StoreSettings): PrintData {
  const phone = complaint.customerPhoneHide 
    ? hidePhoneMiddle(complaint.customerPhone || '')
    : (complaint.customerPhone || '');
  
  const statusVi = COMPLAINT_STATUS_MAP[complaint.status || ''] || complaint.status || '';
  const typeVi = COMPLAINT_TYPE_MAP[complaint.complaintType || ''] || complaint.complaintType || '';
  
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': complaint.location?.name || storeSettings.name || '',
    '{location_address}': complaint.location?.address || storeSettings.address || '',
    '{location_province}': complaint.location?.province || '',
    '{location_phone}': complaint.location?.phone || storeSettings.phone || '',
    '{store_province}': storeSettings.province || '',
    
    // === THÔNG TIN PHIẾU KHIẾU NẠI ===
    '{complaint_code}': complaint.code,
    '{created_on}': formatDate(complaint.createdAt),
    '{created_on_time}': formatTime(complaint.createdAt),
    '{modified_on}': formatDate(complaint.modifiedAt),
    '{account_name}': complaint.createdBy || '',
    
    // === THÔNG TIN KHÁCH HÀNG ===
    '{customer_name}': complaint.customerName,
    '{customer_code}': complaint.customerCode || '',
    '{customer_phone}': phone,
    '{customer_phone_number}': phone,
    '{customer_phone_hide}': hidePhoneMiddle(complaint.customerPhone || ''),
    '{customer_email}': complaint.customerEmail || '',
    '{customer_address}': complaint.customerAddress || '',
    '{customer_group}': complaint.customerGroup || '',
    
    // === THÔNG TIN ĐƠN HÀNG LIÊN QUAN ===
    '{order_code}': complaint.orderCode || '',
    '{order_date}': formatDate(complaint.orderCreatedAt),
    '{order_created_on}': formatDate(complaint.orderCreatedAt),
    '{order_total}': formatCurrency(complaint.orderTotal),
    
    // === THÔNG TIN KHIẾU NẠI ===
    '{complaint_type}': typeVi,
    '{complaint_category}': complaint.category || '',
    '{complaint_priority}': complaint.priority || '',
    '{complaint_source}': complaint.source || '',
    '{complaint_subject}': complaint.subject,
    '{complaint_description}': complaint.description,
    '{customer_request}': complaint.customerRequest || '',
    
    // === SẢN PHẨM LIÊN QUAN ===
    '{line_product_name}': complaint.productName || '',
    '{line_variant}': complaint.variantName || '',
    '{line_variant_code}': complaint.variantCode || '',
    
    // === TRẠNG THÁI & XỬ LÝ ===
    '{complaint_status}': statusVi,
    '{status}': statusVi,
    '{assigned_to}': complaint.assignedTo || '',
    '{assignee_name}': complaint.assignedTo || '',
    '{resolution}': complaint.resolution || '',
    '{resolution_note}': complaint.resolutionNote || '',
    '{resolved_on}': formatDate(complaint.resolvedAt),
    '{resolved_on_time}': formatTime(complaint.resolvedAt),
    '{response_deadline}': formatDate(complaint.responseDeadline),
    
    // === CHI PHÍ BỒI THƯỜNG ===
    '{compensation_amount}': formatCurrency(complaint.compensationAmount),
    '{compensation_amount_text}': numberToWords(complaint.compensationAmount || 0),
    
    '{note}': complaint.note || '',
    '{complaint_note}': complaint.note || '',
  };
}

export function mapComplaintLineItems(items: ComplaintForPrint['items']): import('./types').PrintLineItem[] {
  if (!items) return [];
  
  return items.map((item, index) => ({
    '{line_stt}': (index + 1).toString(),
    '{line_product_name}': item.productName,
    '{line_variant_code}': item.variantCode || '',
    '{line_quantity}': item.quantity?.toString() || '',
    '{line_issue}': item.issue || '',
    '{line_resolution}': item.resolution || '',
  }));
}
