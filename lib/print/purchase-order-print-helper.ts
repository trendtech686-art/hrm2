/**
 * Purchase Order Print Helper
 * Helpers để chuẩn bị dữ liệu in cho đơn đặt hàng nhập
 */

import type { Branch } from '@/lib/types/prisma-extended';
import type { Employee } from '@/lib/types/prisma-extended';
import { 
  PurchaseOrderForPrint, 
  mapPurchaseOrderToPrintData, 
  mapPurchaseOrderLineItems,
} from '../print-mappers/purchase-order.mapper';
import { StoreSettings, getStoreLogo, getGeneralSettings } from '../print-service';

// Interface cho purchase order item - flexible để nhận nhiều loại
interface PurchaseOrderItemLike {
  productSystemId?: string;
  productId?: string;
  productName: string;
  quantity?: number;
  orderedQuantity?: number;
  receivedQuantity?: number;
  unitPrice: number;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  tax?: number;
  taxRate?: number;
  taxType?: 'included' | 'excluded';
  amount?: number;
  unit?: string;
  note?: string;
}

// Interface cho purchase order - flexible để nhận nhiều loại (PurchaseOrder từ page hoặc từ API)
interface PurchaseOrderLike {
  systemId: string;
  id: string;
  supplierSystemId?: string;
  supplierName: string;
  supplierPhone?: string;
  supplierEmail?: string;
  supplierAddress?: string;
  branchSystemId?: string;
  branchName?: string;
  status?: string;
  receivedStatus?: string;
  financialStatus?: string;
  deliveryStatus?: string;
  paymentStatus?: string;
  items?: PurchaseOrderItemLike[];
  lineItems?: PurchaseOrderItemLike[];
  totalQuantity?: number;
  subtotal?: number;
  totalDiscount?: number;
  discount?: number;
  totalTax?: number;
  tax?: number;
  grandTotal?: number;
  paidAmount?: number;
  remainingAmount?: number;
  dueDate?: string;
  deliveryDate?: string;
  receivedDate?: string;
  completedDate?: string;
  cancelledDate?: string;
  createdAt?: string;
  orderDate?: string;
  createdBy?: string;
  createdByName?: string;
  buyer?: string;
  creatorName?: string;
  assigneeSystemId?: string;
  assigneeName?: string;
  note?: string;
  notes?: string;
  reference?: string;
  tags?: string[];
}

interface SupplierLike {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
}

/**
 * Chuyển đổi PurchaseOrder entity sang PurchaseOrderForPrint
 */
export function convertPurchaseOrderForPrint(
  order: PurchaseOrderLike,
  options: {
    branch?: { name?: string; address?: string; phone?: string; province?: string } | null;
    supplier?: SupplierLike | null;
    creator?: Employee | null;
    assignee?: Employee | null;
  } = {}
): PurchaseOrderForPrint {
  const { branch, supplier, creator, assignee } = options;

  // Map trạng thái sang tiếng Việt
  const statusMap: Record<string, string> = {
    'draft': 'Nháp',
    'pending': 'Chờ xử lý',
    'confirmed': 'Đã xác nhận',
    'partial': 'Nhập một phần',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy',
  };

  const receivedStatusMap: Record<string, string> = {
    'not_received': 'Chưa nhập',
    'partial': 'Nhập một phần',
    'received': 'Đã nhập đủ',
  };

  const financialStatusMap: Record<string, string> = {
    'unpaid': 'Chưa thanh toán',
    'partial': 'Thanh toán một phần',
    'paid': 'Đã thanh toán',
  };

  // Get items from either items or lineItems field
  const orderItems = order.items || order.lineItems || [];
  
  // Get status (may be Vietnamese or English)
  const statusValue = order.status ? (statusMap[order.status] || order.status) : undefined;
  
  // Get received/delivery status
  const receivedValue = order.receivedStatus || order.deliveryStatus;
  const receivedStatusValue = receivedValue ? (receivedStatusMap[receivedValue] || receivedValue) : undefined;
  
  // Get financial/payment status
  const financialValue = order.financialStatus || order.paymentStatus;
  const financialStatusValue = financialValue ? (financialStatusMap[financialValue] || financialValue) : undefined;

  return {
    // Thông tin cơ bản
    code: order.id,
    createdAt: order.createdAt || order.orderDate,
    modifiedAt: order.createdAt || order.orderDate,
    receivedOn: order.receivedDate,
    completedOn: order.completedDate,
    cancelledOn: order.cancelledDate,
    dueOn: order.dueDate || order.deliveryDate,
    createdBy: creator?.fullName || order.createdByName || order.buyer || order.creatorName,
    assigneeName: assignee?.fullName || order.assigneeName,
    
    // Trạng thái
    status: statusValue,
    receivedStatus: receivedStatusValue,
    financialStatus: financialStatusValue,
    
    // Thông tin chi nhánh
    location: branch ? {
      name: branch.name,
      address: branch.address,
      province: branch.province,
    } : {
      name: order.branchName,
    },
    
    // Thông tin NCC
    supplierName: supplier?.name || order.supplierName,
    supplierPhone: supplier?.phone || order.supplierPhone,
    supplierEmail: supplier?.email || order.supplierEmail,
    supplierAddress: supplier?.address || order.supplierAddress,
    
    // Tags
    tags: order.tags,
    reference: order.reference,
    
    // Danh sách sản phẩm
    items: orderItems.map(item => {
      const qty = item.quantity ?? item.orderedQuantity ?? 0;
      const taxRate = item.tax ?? item.taxRate ?? 0;
      const discountAmount = item.discountType === 'percentage' 
        ? item.unitPrice * qty * (item.discount || 0) / 100
        : (item.discount || 0) * qty;
      const amountBeforeTax = item.unitPrice * qty - discountAmount;
      const taxAmount = taxRate ? amountBeforeTax * taxRate / 100 : 0;
      
      return {
        variantCode: item.productId || item.productSystemId,
        productName: item.productName,
        unit: item.unit || 'Cái',
        quantity: qty,
        receivedQuantity: item.receivedQuantity,
        price: item.unitPrice,
        discountRate: item.discountType === 'percentage' ? item.discount : undefined,
        discountAmount,
        taxRate,
        taxAmount,
        taxType: item.taxType,
        amount: item.amount,
        note: item.note,
      };
    }),
    
    // Tổng giá trị
    totalQuantity: order.totalQuantity ?? orderItems.reduce((sum, i) => sum + (i.quantity ?? i.orderedQuantity ?? 0), 0),
    total: order.grandTotal,
    totalPrice: order.subtotal,
    totalDiscounts: order.totalDiscount ?? order.discount,
    totalTax: order.totalTax ?? order.tax,
    totalTransactionAmount: order.paidAmount,
    totalRemain: order.remainingAmount,
    
    note: order.note || order.notes,
  };
}

/**
 * Tạo StoreSettings từ storeInfo hoặc Branch
 */
export function createStoreSettings(storeInfo?: {
  // StoreInfo fields
  companyName?: string;
  brandName?: string;
  hotline?: string;
  email?: string;
  website?: string;
  taxCode?: string;
  headquartersAddress?: string;
  province?: string;
  logo?: string;
  // Branch fields (alternative)
  name?: string;
  address?: string;
  phone?: string;
} | null): StoreSettings {
  // Fallback lấy từ general-settings nếu storeInfo trống
  const generalSettings = getGeneralSettings();
  return {
    name: storeInfo?.companyName || storeInfo?.brandName || storeInfo?.name || generalSettings?.companyName || '',
    address: storeInfo?.headquartersAddress || storeInfo?.address || generalSettings?.companyAddress || '',
    phone: storeInfo?.hotline || storeInfo?.phone || generalSettings?.phoneNumber || '',
    email: storeInfo?.email || generalSettings?.email || '',
    website: storeInfo?.website,
    taxCode: storeInfo?.taxCode,
    province: storeInfo?.province,
    logo: getStoreLogo(storeInfo?.logo),
  };
}

// Re-export mappers
export {
  mapPurchaseOrderToPrintData,
  mapPurchaseOrderLineItems,
};
