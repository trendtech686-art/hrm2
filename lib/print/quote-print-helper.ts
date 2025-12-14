/**
 * Quote Print Helper
 * Helpers để chuẩn bị dữ liệu in cho phiếu báo giá / đơn tạm tính
 */

import type { Branch } from '../../features/settings/branches/types';
import type { Customer } from '../../features/customers/types';
import type { Employee } from '../../features/employees/types';
import { 
  QuoteForPrint, 
  mapQuoteToPrintData, 
  mapQuoteLineItems,
} from '../print-mappers/quote.mapper';
import { StoreSettings, getStoreLogo, getGeneralSettings } from '../print-service';

// Interface cho quote item
interface QuoteItem {
  productSystemId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  tax?: number;
  amount: number;
  unit?: string;
  note?: string;
}

// Interface cho quote
interface Quote {
  systemId: string;
  id: string;
  customerSystemId?: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  branchSystemId: string;
  branchName: string;
  status: string;
  items: QuoteItem[];
  totalQuantity: number;
  subtotal: number;
  totalDiscount?: number;
  totalTax?: number;
  grandTotal: number;
  shippingFee?: number;
  validUntil?: string;
  createdAt: string;
  createdBy?: string;
  createdByName?: string;
  assigneeSystemId?: string;
  assigneeName?: string;
  note?: string;
  reference?: string;
  tags?: string[];
  shippingAddress?: string;
  billingAddress?: string;
}

/**
 * Chuyển đổi Quote entity sang QuoteForPrint
 */
export function convertQuoteForPrint(
  quote: Quote,
  options: {
    branch?: Branch | null;
    customer?: Customer | null;
    creator?: Employee | null;
    assignee?: Employee | null;
  } = {}
): QuoteForPrint {
  const { branch, customer, creator, assignee } = options;

  // Map trạng thái sang tiếng Việt
  const statusMap: Record<string, string> = {
    'draft': 'Nháp',
    'pending': 'Chờ xác nhận',
    'confirmed': 'Đã xác nhận',
    'converted': 'Đã chuyển đơn',
    'cancelled': 'Đã hủy',
    'expired': 'Hết hạn',
  };

  // Format địa chỉ khách hàng
  const customerFirstAddress = customer?.addresses?.[0];
  const customerAddressString = customerFirstAddress 
    ? [customerFirstAddress.street, customerFirstAddress.ward, customerFirstAddress.district, customerFirstAddress.province].filter(Boolean).join(', ')
    : '';

  return {
    // Thông tin cơ bản
    code: quote.id,
    createdAt: quote.createdAt,
    createdBy: creator?.fullName || quote.createdByName,
    
    // Trạng thái
    status: statusMap[quote.status] || quote.status,
    
    // Nguồn / Kênh
    reference: quote.reference,
    tags: quote.tags,
    
    // Phụ trách
    assigneeName: assignee?.fullName || quote.assigneeName,
    
    // Chi nhánh
    location: branch ? {
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      province: branch.province,
    } : {
      name: quote.branchName,
    },
    
    // Khách hàng
    customer: {
      name: customer?.name || quote.customerName,
      code: customer?.id,
      phone: customer?.phone || quote.customerPhone,
      email: customer?.email || quote.customerEmail,
      group: customer?.customerGroup,
      address: customerAddressString,
      currentDebt: customer?.currentDebt,
    },
    
    // Địa chỉ
    billingAddress: quote.billingAddress,
    shippingAddress: quote.shippingAddress,
    
    // Danh sách sản phẩm
    items: quote.items.map(item => {
      const discountAmount = item.discountType === 'percentage' 
        ? item.unitPrice * item.quantity * (item.discount || 0) / 100
        : (item.discount || 0) * item.quantity;
      const amountBeforeTax = item.unitPrice * item.quantity - discountAmount;
      const taxAmount = item.tax ? amountBeforeTax * item.tax / 100 : 0;
      
      return {
        variantCode: item.productId,
        productName: item.productName,
        unit: item.unit || 'Cái',
        quantity: item.quantity,
        price: item.unitPrice,
        priceAfterDiscount: item.unitPrice - (item.discountType === 'percentage' ? item.unitPrice * (item.discount || 0) / 100 : (item.discount || 0)),
        discountRate: item.discountType === 'percentage' ? item.discount : undefined,
        discountAmount,
        taxRate: item.tax,
        taxAmount,
        amount: item.amount,
        note: item.note,
      };
    }),
    
    // Tổng giá trị
    totalQuantity: quote.totalQuantity,
    subtotal: quote.subtotal,
    totalDiscount: quote.totalDiscount,
    totalTax: quote.totalTax,
    deliveryFee: quote.shippingFee,
    total: quote.grandTotal,
    
    note: quote.note,
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
  mapQuoteToPrintData,
  mapQuoteLineItems,
};
