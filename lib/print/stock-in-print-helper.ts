/**
 * Stock In Print Helper
 * Helpers để chuẩn bị dữ liệu in cho phiếu nhập kho
 */

import type { Branch } from '../../features/settings/branches/types';
import type { Employee } from '../../features/employees/types';
import { 
  StockInForPrint, 
  mapStockInToPrintData, 
  mapStockInLineItems,
} from '../print-mappers/stock-in.mapper';
import { StoreSettings, getStoreLogo, getGeneralSettings } from '../print-service';

// Import types từ feature nếu có
interface StockInItem {
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
  taxType?: 'included' | 'excluded';
  amount?: number;
  unit?: string;
  note?: string;
}

// Flexible interface that accepts both StockIn and InventoryReceipt
interface StockInLike {
  systemId: string;
  id: string;
  purchaseOrderId?: string;
  supplierSystemId?: string;
  supplierName?: string;
  supplierPhone?: string;
  supplierEmail?: string;
  branchSystemId?: string;
  branchName?: string;
  warehouseName?: string;
  status?: string;
  items: StockInItem[];
  totalQuantity?: number;
  subtotal?: number;
  totalDiscount?: number;
  totalTax?: number;
  grandTotal?: number;
  paidAmount?: number;
  remainingAmount?: number;
  receivedDate?: string;
  createdAt?: string;
  createdBy?: string;
  createdByName?: string;
  receiverName?: string;
  note?: string;
  notes?: string;
  reference?: string;
}

interface Supplier {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
}

interface PurchaseOrderRef {
  id?: string;
  code?: string;
}

/**
 * Chuyển đổi StockIn/InventoryReceipt entity sang StockInForPrint
 */
export function convertStockInForPrint(
  stockIn: StockInLike,
  options: {
    branch?: Branch | null;
    supplier?: Supplier | null;
    creator?: Employee | null;
    purchaseOrder?: PurchaseOrderRef | null;
  } = {}
): StockInForPrint {
  const { branch, supplier, creator, purchaseOrder } = options;

  // Map trạng thái sang tiếng Việt
  const statusMap: Record<string, string> = {
    'draft': 'Nháp',
    'pending': 'Chờ xử lý',
    'partial': 'Nhập một phần',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy',
  };

  // Calculate totals from items if not provided
  const calculatedTotalQuantity = stockIn.totalQuantity ?? stockIn.items.reduce((sum, item) => {
    const qty = item.receivedQuantity ?? item.quantity ?? item.orderedQuantity ?? 0;
    return sum + Number(qty);
  }, 0);
  
  const calculatedTotal = stockIn.grandTotal ?? stockIn.items.reduce((sum, item) => {
    const qty = item.receivedQuantity ?? item.quantity ?? item.orderedQuantity ?? 0;
    return sum + (Number(qty) * Number(item.unitPrice));
  }, 0);

  return {
    // Thông tin cơ bản
    code: stockIn.id,
    createdAt: stockIn.createdAt || stockIn.receivedDate,
    receivedOn: stockIn.receivedDate,
    createdBy: creator?.fullName || stockIn.receiverName || stockIn.createdByName,
    purchaseOrderCode: purchaseOrder?.id || purchaseOrder?.code || stockIn.purchaseOrderId,
    reference: stockIn.reference,
    status: statusMap[stockIn.status || ''] || stockIn.status,
    
    // Thông tin chi nhánh
    location: branch ? {
      name: branch.name,
      address: branch.address,
      province: branch.province,
    } : stockIn.branchName ? {
      name: stockIn.branchName,
    } : undefined,
    
    // Thông tin NCC
    supplierName: stockIn.supplierName,
    supplierCode: supplier?.id,
    supplierPhone: supplier?.phone || stockIn.supplierPhone,
    supplierEmail: supplier?.email || stockIn.supplierEmail,
    
    // Danh sách sản phẩm
    items: stockIn.items.map(item => {
      const qty = item.receivedQuantity ?? item.quantity ?? item.orderedQuantity ?? 0;
      const discountAmount = item.discountType === 'percentage' 
        ? item.unitPrice * Number(qty) * (item.discount || 0) / 100
        : (item.discount || 0) * Number(qty);
      const amountBeforeTax = item.unitPrice * Number(qty) - discountAmount;
      const taxAmount = item.tax ? amountBeforeTax * item.tax / 100 : 0;
      const lineAmount = item.amount ?? (item.unitPrice * Number(qty));
      
      return {
        variantCode: item.productId || item.productSystemId,
        productName: item.productName,
        unit: item.unit || 'Cái',
        quantity: Number(qty),
        receivedQuantity: item.receivedQuantity ? Number(item.receivedQuantity) : undefined,
        price: item.unitPrice,
        discountRate: item.discountType === 'percentage' ? item.discount : undefined,
        discountAmount,
        taxRate: item.tax,
        taxAmount,
        taxType: item.taxType,
        amount: lineAmount,
      };
    }),
    
    // Tổng giá trị
    totalQuantity: calculatedTotalQuantity,
    total: calculatedTotal,
    totalPrice: stockIn.subtotal || calculatedTotal,
    totalDiscounts: stockIn.totalDiscount,
    totalTax: stockIn.totalTax,
    paid: stockIn.paidAmount,
    remaining: stockIn.remainingAmount,
    
    note: stockIn.note || stockIn.notes,
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
  mapStockInToPrintData,
  mapStockInLineItems,
};
