/**
 * Warranty Print Helper
 * Helpers để chuẩn bị dữ liệu in cho phiếu bảo hành và yêu cầu bảo hành
 */

import type { Branch } from '@/lib/types/prisma-extended';
import type { Customer } from '@/lib/types/prisma-extended';
import type { Employee } from '@/lib/types/prisma-extended';
import { 
  WarrantyForPrint, 
  mapWarrantyToPrintData, 
  mapWarrantyLineItems,
} from '../print-mappers/warranty.mapper';
import {
  WarrantyRequestForPrint,
  mapWarrantyRequestToPrintData,
  mapWarrantyRequestLineItems,
} from '../print-mappers/warranty-request.mapper';
import { StoreSettings, getStoreLogo, getGeneralSettings } from '../print-service';

// Interface cho warranty item - flexible to accept both Warranty and WarrantyTicket
interface WarrantyItemLike {
  productSystemId?: string;
  productId?: string;
  productName: string;
  serialNumber?: string;
  sku?: string;
  quantity?: number;
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  issue?: string;
  issueDescription?: string;
  resolution?: string;
  cost?: number;
  note?: string;
}

// Interface cho warranty - flexible to accept both Warranty and WarrantyTicket
interface WarrantyLike {
  systemId: string;
  id: string;
  customerSystemId?: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  orderSystemId?: string;
  orderId?: string;
  linkedOrderSystemId?: string;
  branchSystemId?: string;
  branchName?: string;
  type?: 'warranty' | 'repair';
  status: string;
  items?: WarrantyItemLike[];
  products?: WarrantyItemLike[];
  receivedDate?: string;
  expectedReturnDate?: string;
  returnedDate?: string;
  totalCost?: number;
  paidAmount?: number;
  createdAt?: string;
  createdBy?: string;
  createdByName?: string;
  employeeName?: string;
  technicianSystemId?: string;
  technicianName?: string;
  note?: string;
  notes?: string;
  updatedAt?: string;
}

// Interface cho warranty request - flexible
interface WarrantyRequestLike {
  systemId: string;
  id: string;
  customerSystemId?: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  orderSystemId?: string;
  orderId?: string;
  branchSystemId?: string;
  branchName?: string;
  status: string;
  items?: WarrantyItemLike[];
  products?: WarrantyItemLike[];
  requestDate?: string;
  issue?: string;
  createdAt?: string;
  createdBy?: string;
  createdByName?: string;
  note?: string;
  notes?: string;
}

/**
 * Chuyển đổi Warranty/WarrantyTicket entity sang WarrantyForPrint
 */
export function convertWarrantyForPrint(
  warranty: WarrantyLike,
  options: {
    branch?: Branch | null;
    customer?: Customer | null;
    creator?: Employee | null;
    technician?: Employee | null;
    linkedOrderId?: string;
  } = {}
): WarrantyForPrint {
  const { branch, customer, creator, technician, linkedOrderId } = options;

  // Map trạng thái sang tiếng Việt
  const statusMap: Record<string, string> = {
    'received': 'Đã nhận',
    'diagnosing': 'Đang kiểm tra',
    'repairing': 'Đang sửa chữa',
    'waiting_parts': 'Chờ linh kiện',
    'completed': 'Hoàn thành',
    'returned': 'Đã trả khách',
    'cancelled': 'Đã hủy',
  };

  const typeMap: Record<string, string> = {
    'warranty': 'Bảo hành',
    'repair': 'Sửa chữa',
  };

  // Format địa chỉ khách hàng
  const customerFirstAddress = customer?.addresses?.[0];
  const customerAddressString = customerFirstAddress 
    ? [customerFirstAddress.street, customerFirstAddress.ward, customerFirstAddress.district, customerFirstAddress.province].filter(Boolean).join(', ')
    : warranty.customerAddress || '';

  // Get items from either items or products field
  const warrantyItems = warranty.items || warranty.products || [];

  return {
    // Thông tin cơ bản
    code: warranty.id,
    createdAt: warranty.createdAt,
    modifiedAt: warranty.updatedAt,
    createdBy: creator?.fullName || warranty.createdByName || warranty.employeeName,
    
    // Trạng thái
    status: statusMap[warranty.status] || warranty.status,
    
    // Chi nhánh
    location: branch ? {
      name: branch.name,
      address: branch.address,
      province: branch.province,
    } : {
      name: warranty.branchName,
    },
    
    // Đơn hàng gốc
    orderCode: linkedOrderId || warranty.orderId,
    
    // Khách hàng
    customerName: customer?.name || warranty.customerName,
    customerPhone: customer?.phone || warranty.customerPhone,
    customerAddress: customerAddressString,
    
    // Danh sách sản phẩm
    items: warrantyItems.map(item => ({
      variantCode: item.productId || item.productSystemId,
      variantSku: item.sku,
      productName: item.productName,
      serialNumber: item.serialNumber,
      quantity: item.quantity,
      warrantyStartDate: item.warrantyStartDate,
      warrantyEndDate: item.warrantyEndDate,
      issue: item.issue || item.issueDescription,
      issueDescription: item.issueDescription || item.issue,
      resolution: item.resolution,
      cost: item.cost,
      note: item.note,
    })),
    
    // Mô tả lỗi chung
    issueDescription: warrantyItems.map(p => p.issueDescription || p.issue).filter(Boolean).join(', '),
    
    note: warranty.note || warranty.notes,
  };
}

/**
 * Chuyển đổi WarrantyRequest entity sang WarrantyRequestForPrint
 */
export function convertWarrantyRequestForPrint(
  request: WarrantyRequestLike,
  options: {
    branch?: Branch | null;
    customer?: Customer | null;
    creator?: Employee | null;
  } = {}
): WarrantyRequestForPrint {
  const { branch, customer, creator } = options;

  // Map trạng thái sang tiếng Việt
  const statusMap: Record<string, string> = {
    'pending': 'Chờ xử lý',
    'approved': 'Đã duyệt',
    'rejected': 'Từ chối',
    'processing': 'Đang xử lý',
    'completed': 'Hoàn thành',
  };

  // Format địa chỉ khách hàng
  const customerFirstAddress = customer?.addresses?.[0];
  const customerAddressString = customerFirstAddress 
    ? [customerFirstAddress.street, customerFirstAddress.ward, customerFirstAddress.district, customerFirstAddress.province].filter(Boolean).join(', ')
    : request.customerAddress || '';

  return {
    // Thông tin cơ bản
    code: request.id,
    createdAt: request.createdAt,
    createdBy: creator?.fullName || request.createdByName,
    
    // Chi nhánh
    location: branch ? {
      name: branch.name,
      address: branch.address,
      province: branch.province,
    } : {
      name: request.branchName,
    },
    
    // Khách hàng
    customerName: customer?.name || request.customerName,
    customerPhone: customer?.phone || request.customerPhone,
    customerAddress: customerAddressString,
    
    // Danh sách sản phẩm
    items: (request.items || request.products || []).map(item => ({
      productName: item.productName,
      quantity: item.quantity ?? 1,
    })),
    
    totalQuantity: (request.items || request.products || []).reduce((sum, item) => sum + (item.quantity ?? 1), 0),
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
  mapWarrantyToPrintData,
  mapWarrantyLineItems,
  mapWarrantyRequestToPrintData,
  mapWarrantyRequestLineItems,
};
