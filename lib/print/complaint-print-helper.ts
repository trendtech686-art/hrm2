/**
 * Complaint Print Helper
 * Helpers để chuẩn bị dữ liệu in cho phiếu khiếu nại
 */

import type { Branch } from '../../features/settings/branches/types';
import type { Customer } from '../../features/customers/types';
import type { Employee } from '../../features/employees/types';
import { 
  ComplaintForPrint, 
  mapComplaintToPrintData,
  mapComplaintLineItems,
} from '../print-mappers/complaint.mapper';
import { StoreSettings, getStoreLogo, getGeneralSettings } from '../print-service';

// Affected Product interface for complaint
interface AffectedProduct {
  productSystemId?: string;
  productId?: string;
  productName: string;
  quantityMissing?: number;
  quantityDefective?: number;
  quantityExcess?: number;
  issueType?: string;
  resolutionType?: string;
}

// Flexible interface for Complaint entities
// Accepts both Complaint from store and generic complaint data
interface ComplaintLike {
  // Core identifiers
  systemId?: string;
  id?: string;  // BusinessId (KN-XXXXXX) for Complaint
  code?: string; // For legacy compatibility
  
  // Customer info - flexible naming
  customerSystemId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  
  // Order info
  orderSystemId?: string;
  orderId?: string;
  orderCode?: string;
  
  // Branch info
  branchSystemId?: string;
  branchName?: string;
  
  // Complaint details
  type?: string;
  category?: string;
  priority?: string;
  status?: string;
  subject?: string;
  description?: string;
  resolution?: string;
  resolutionNote?: string;
  proposedSolution?: string;
  investigationNote?: string;
  
  // Assignment
  assigneeSystemId?: string;
  assigneeName?: string;
  assignedTo?: string;
  
  // Dates - accept both string and Date
  createdAt?: string | Date;
  createdBy?: string;
  createdByName?: string;
  resolvedAt?: string | Date;
  resolvedBy?: string;
  resolvedByName?: string;
  updatedAt?: string | Date;
  
  // Additional
  note?: string;
  
  // Affected products (for complaint-specific)
  affectedProducts?: AffectedProduct[];
}

/**
 * Chuyển đổi ComplaintLike entity sang ComplaintForPrint
 * Accepts both Complaint from store and generic complaint data
 */
export function convertComplaintForPrint(
  complaint: ComplaintLike,
  options: {
    branch?: Branch | null;
    customer?: Customer | null;
    creator?: Employee | null;
    assignee?: Employee | null;
    resolver?: Employee | null;
  } = {}
): ComplaintForPrint {
  const { branch, customer, creator, assignee, resolver } = options;

  // Map trạng thái sang tiếng Việt
  const statusMap: Record<string, string> = {
    'open': 'Mở',
    'new': 'Mới',
    'in_progress': 'Đang xử lý',
    'investigating': 'Đang xác minh',
    'resolved': 'Đã giải quyết',
    'closed': 'Đã đóng',
    'cancelled': 'Đã hủy',
  };

  const priorityMap: Record<string, string> = {
    'low': 'Thấp',
    'medium': 'Trung bình',
    'high': 'Cao',
    'urgent': 'Khẩn cấp',
  };

  const typeMap: Record<string, string> = {
    'product': 'Sản phẩm',
    'service': 'Dịch vụ',
    'delivery': 'Giao hàng',
    'payment': 'Thanh toán',
    'missing-items': 'Thiếu hàng',
    'damaged-items': 'Hàng hư hỏng',
    'wrong-items': 'Sai hàng',
    'late-delivery': 'Giao hàng chậm',
    'service-quality': 'Chất lượng dịch vụ',
    'other': 'Khác',
  };

  // Format địa chỉ khách hàng
  const customerFirstAddress = customer?.addresses?.[0];
  const customerAddressString = customerFirstAddress 
    ? [customerFirstAddress.street, customerFirstAddress.ward, customerFirstAddress.district, customerFirstAddress.province].filter(Boolean).join(', ')
    : complaint.customerAddress || '';

  // Determine code - can be id or code field
  const codeValue = complaint.id || complaint.code || '';

  // Determine subject
  const subjectValue = complaint.subject || `Khiếu nại đơn hàng ${complaint.orderCode || complaint.orderId || ''}`;

  // Determine order code
  const orderCodeValue = complaint.orderCode || complaint.orderId;

  // Convert affected products to items array
  const items = complaint.affectedProducts ? complaint.affectedProducts.map(item => ({
    productName: item.productName,
    variantCode: item.productId,
    quantity: (item.quantityMissing || 0) + (item.quantityDefective || 0) + (item.quantityExcess || 0),
    issue: item.issueType,
    resolution: item.resolutionType,
  })) : undefined;

  return {
    // Thông tin cơ bản
    code: codeValue,
    createdAt: complaint.createdAt || '',
    modifiedAt: complaint.updatedAt,
    createdBy: creator?.fullName || complaint.createdByName,
    resolvedAt: complaint.resolvedAt,
    
    // Trạng thái
    status: complaint.status ? (statusMap[complaint.status] || complaint.status) : undefined,
    priority: complaint.priority ? (priorityMap[complaint.priority] || complaint.priority) : undefined,
    complaintType: complaint.type ? (typeMap[complaint.type] || complaint.type) : undefined,
    category: complaint.category,
    
    // Phụ trách - không fallback về ID
    assignedTo: assignee?.fullName || complaint.assigneeName || '',
    
    // Chi nhánh
    location: branch ? {
      name: branch.name,
      address: branch.address,
      province: branch.province,
    } : complaint.branchName ? {
      name: complaint.branchName,
    } : undefined,
    
    // Thông tin đơn hàng gốc
    orderCode: orderCodeValue,
    
    // Khách hàng
    customerName: customer?.name || complaint.customerName || '',
    customerCode: customer?.id,
    customerPhone: customer?.phone || complaint.customerPhone,
    customerEmail: customer?.email || complaint.customerEmail,
    customerAddress: customerAddressString,
    
    // Nội dung khiếu nại
    subject: subjectValue,
    description: complaint.description || '',
    resolution: complaint.resolution || complaint.proposedSolution,
    resolutionNote: complaint.resolutionNote,
    note: complaint.investigationNote || complaint.note,
    
    // Danh sách sản phẩm
    items,
  };
}

/**
 * Tạo StoreSettings từ storeInfo
 */
export function createStoreSettings(storeInfo?: {
  companyName?: string;
  brandName?: string;
  hotline?: string;
  email?: string;
  website?: string;
  taxCode?: string;
  headquartersAddress?: string;
  province?: string;
  logo?: string;
}): StoreSettings {
  // Fallback lấy từ general-settings nếu storeInfo trống
  const generalSettings = getGeneralSettings();
  return {
    name: storeInfo?.companyName || storeInfo?.brandName || generalSettings?.companyName || '',
    address: storeInfo?.headquartersAddress || generalSettings?.companyAddress || '',
    phone: storeInfo?.hotline || generalSettings?.phoneNumber || '',
    email: storeInfo?.email || generalSettings?.email || '',
    website: storeInfo?.website,
    taxCode: storeInfo?.taxCode,
    province: storeInfo?.province,
    logo: getStoreLogo(storeInfo?.logo),
  };
}

// Re-export mappers
export {
  mapComplaintToPrintData,
  mapComplaintLineItems,
};
