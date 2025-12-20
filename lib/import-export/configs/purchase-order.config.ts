/**
 * Purchase Order Import/Export Configuration
 * 
 * Nhập/Xuất đơn nhập hàng
 * 
 * FORMAT:
 * - Multi-line: 1 đơn nhập hàng có thể có nhiều dòng sản phẩm
 * - Các dòng cùng Mã đơn sẽ được nhóm thành 1 đơn nhập hàng
 */

import type { PurchaseOrder, PurchaseOrderLineItem, PurchaseOrderStatus, DeliveryStatus, PaymentStatus } from '@/features/purchase-orders/types';
import type { ImportExportConfig, FieldConfig } from '../types';
import { useSupplierStore } from '@/features/suppliers/store';
import { useProductStore } from '@/features/products/store';
import { useBranchStore } from '@/features/settings/branches/store';
import { useEmployeeStore } from '@/features/employees/store';
import { asBusinessId, asSystemId } from '@/lib/id-types';

// ============================================
// HELPER FUNCTIONS
// ============================================

const getSupplierStore = () => useSupplierStore.getState();
const getProductStore = () => useProductStore.getState();
const getBranchStore = () => useBranchStore.getState();
const getEmployeeStore = () => useEmployeeStore.getState();

const findSupplier = (identifier: string) => {
  if (!identifier) return undefined;
  const store = getSupplierStore();
  const normalized = identifier.trim().toUpperCase();
  
  const byId = store.data.find(s => s.id.toUpperCase() === normalized);
  if (byId) return byId;
  
  const byName = store.data.find(s => s.name.toUpperCase() === normalized);
  return byName;
};

const findProduct = (identifier: string) => {
  if (!identifier) return undefined;
  const store = getProductStore();
  const normalized = identifier.trim().toUpperCase();
  
  const byId = store.data.find(p => p.id.toUpperCase() === normalized);
  if (byId) return byId;
  
  const bySku = store.data.find(p => p.sku?.toUpperCase() === normalized);
  return bySku;
};

const findBranch = (identifier: string) => {
  if (!identifier) return undefined;
  const store = getBranchStore();
  const normalized = identifier.trim().toLowerCase();
  
  const byId = store.data.find(b => b.id.toLowerCase() === normalized);
  if (byId) return byId;
  
  return store.data.find(b => b.name.toLowerCase().includes(normalized));
};

const findEmployee = (name: string) => {
  if (!name) return undefined;
  const store = getEmployeeStore();
  const normalized = name.trim().toLowerCase();
  return store.data.find(e => e.fullName?.toLowerCase().includes(normalized));
};

const getDefaultBranch = () => {
  const store = getBranchStore();
  return store.data.find(b => b.isDefault) || store.data[0];
};

// ============================================
// IMPORT ROW TYPE
// ============================================

interface PurchaseOrderImportRow {
  purchaseOrderId: string;
  supplierIdOrName: string;
  branchIdOrName?: string;
  orderDate?: string;
  deliveryDate?: string;
  buyerName?: string;
  status?: string;
  notes?: string;
  // Line item
  productIdOrSku: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  discountType?: string;
  taxRate?: number;
  lineNote?: string;
  // Totals
  shippingFee?: number;
  orderDiscount?: number;
  orderDiscountType?: string;
}

// ============================================
// FIELD CONFIGURATION
// ============================================

export const purchaseOrderFields: FieldConfig<PurchaseOrderImportRow>[] = [
  // Đơn hàng
  {
    key: 'purchaseOrderId',
    label: 'Mã đơn nhập (*)',
    type: 'string',
    required: true,
    example: 'PO001',
    group: 'Đơn nhập hàng',
    defaultSelected: true,
  },
  {
    key: 'supplierIdOrName',
    label: 'NCC (Mã/Tên) (*)',
    type: 'string',
    required: true,
    example: 'NCC001',
    group: 'Đơn nhập hàng',
    defaultSelected: true,
  },
  {
    key: 'branchIdOrName',
    label: 'Chi nhánh',
    type: 'string',
    required: false,
    example: 'Chi nhánh chính',
    group: 'Đơn nhập hàng',
    defaultSelected: true,
  },
  {
    key: 'orderDate',
    label: 'Ngày đặt hàng',
    type: 'string',
    required: false,
    example: '2024-01-15',
    group: 'Đơn nhập hàng',
    defaultSelected: true,
  },
  {
    key: 'buyerName',
    label: 'Người mua',
    type: 'string',
    required: false,
    example: 'Nguyễn Văn A',
    group: 'Đơn nhập hàng',
  },
  {
    key: 'status',
    label: 'Trạng thái',
    type: 'string',
    required: false,
    example: 'Đặt hàng',
    group: 'Đơn nhập hàng',
  },
  {
    key: 'notes',
    label: 'Ghi chú',
    type: 'string',
    required: false,
    example: 'Ghi chú đơn hàng',
    group: 'Đơn nhập hàng',
  },
  
  // Sản phẩm
  {
    key: 'productIdOrSku',
    label: 'Mã SP/SKU (*)',
    type: 'string',
    required: true,
    example: 'SP001',
    group: 'Sản phẩm',
    defaultSelected: true,
  },
  {
    key: 'quantity',
    label: 'Số lượng (*)',
    type: 'number',
    required: true,
    example: '10',
    group: 'Sản phẩm',
    defaultSelected: true,
  },
  {
    key: 'unitPrice',
    label: 'Đơn giá nhập (*)',
    type: 'number',
    required: true,
    example: '100000',
    group: 'Sản phẩm',
    defaultSelected: true,
  },
  {
    key: 'discount',
    label: 'Chiết khấu SP',
    type: 'number',
    required: false,
    example: '5000',
    group: 'Sản phẩm',
  },
  {
    key: 'taxRate',
    label: 'Thuế (%)',
    type: 'number',
    required: false,
    example: '8',
    group: 'Sản phẩm',
  },
  
  // Tổng
  {
    key: 'shippingFee',
    label: 'Phí vận chuyển',
    type: 'number',
    required: false,
    example: '50000',
    group: 'Tổng đơn',
  },
  {
    key: 'orderDiscount',
    label: 'CK toàn đơn',
    type: 'number',
    required: false,
    example: '10000',
    group: 'Tổng đơn',
  },
];

// ============================================
// STATUS MAPPING
// ============================================

const STATUS_MAP: Record<string, PurchaseOrderStatus> = {
  'Đặt hàng': 'Đặt hàng',
  'Đang giao dịch': 'Đang giao dịch',
  'Hoàn thành': 'Hoàn thành',
  'Đã hủy': 'Đã hủy',
  'Kết thúc': 'Kết thúc',
};

// ============================================
// MAIN CONFIG
// ============================================

export const purchaseOrderImportExportConfig: ImportExportConfig<PurchaseOrder> = {
  entityType: 'purchase-orders',
  entityDisplayName: 'Đơn nhập hàng',
  
  fields: purchaseOrderFields as unknown as FieldConfig<PurchaseOrder>[],
  
  templateFileName: 'Mau_Don_Nhap_Hang.xlsx',
  sheetName: 'DonNhapHang',
  
  // Import settings
  upsertKey: 'id',
  allowUpdate: false,
  allowInsert: true,
  
  requirePreview: true,
  maxRows: 2000,
  maxErrorsAllowed: 0,
  
  // Fill-down for multi-line
  preProcessRows: (rows) => {
    let lastOrderId = '';
    let lastSupplier = '';
    let lastBranch = '';
    let lastOrderDate = '';
    let lastBuyer = '';
    
    return rows.map((row: Record<string, unknown>) => {
      if (row.purchaseOrderId) {
        lastOrderId = String(row.purchaseOrderId);
        lastSupplier = String(row.supplierIdOrName || '');
        lastBranch = String(row.branchIdOrName || '');
        lastOrderDate = String(row.orderDate || '');
        lastBuyer = String(row.buyerName || '');
      }
      
      return {
        ...row,
        purchaseOrderId: row.purchaseOrderId || lastOrderId,
        supplierIdOrName: row.supplierIdOrName || lastSupplier,
        branchIdOrName: row.branchIdOrName || lastBranch,
        orderDate: row.orderDate || lastOrderDate,
        buyerName: row.buyerName || lastBuyer,
      };
    });
  },
  
  // Validate each row
  validateRow: (row, _index, existingData, mode) => {
    const errors: Array<{ field?: string; message: string }> = [];
    const importRow = row as unknown as PurchaseOrderImportRow;
    
    if (!importRow.purchaseOrderId) {
      errors.push({ field: 'purchaseOrderId', message: 'Mã đơn nhập không được để trống' });
    }
    
    if (!importRow.supplierIdOrName) {
      errors.push({ field: 'supplierIdOrName', message: 'NCC không được để trống' });
    }
    
    if (!importRow.productIdOrSku) {
      errors.push({ field: 'productIdOrSku', message: 'Mã SP không được để trống' });
    }
    
    if (!importRow.quantity || importRow.quantity <= 0) {
      errors.push({ field: 'quantity', message: 'Số lượng phải lớn hơn 0' });
    }
    
    if (!importRow.unitPrice || importRow.unitPrice < 0) {
      errors.push({ field: 'unitPrice', message: 'Đơn giá không hợp lệ' });
    }
    
    // Check duplicate
    if (mode === 'insert-only' && importRow.purchaseOrderId) {
      const duplicate = existingData.find(po => 
        po.id.toUpperCase() === importRow.purchaseOrderId.toUpperCase()
      );
      if (duplicate) {
        // Warning only - same PO can have multiple lines
      }
    }
    
    return errors;
  },
  
  // Transform: Group rows by purchaseOrderId and build PurchaseOrder objects
  beforeImport: async (data: PurchaseOrder[]) => {
    const importRows = data as unknown as PurchaseOrderImportRow[];
    
    // Group rows by purchaseOrderId
    const orderMap = new Map<string, PurchaseOrderImportRow[]>();
    
    for (const row of importRows) {
      const orderId = row.purchaseOrderId?.trim();
      if (!orderId) continue;
      
      if (!orderMap.has(orderId)) {
        orderMap.set(orderId, []);
      }
      orderMap.get(orderId)!.push(row);
    }
    
    // Build PurchaseOrder objects
    const orders: PurchaseOrder[] = [];
    const now = new Date().toISOString();
    const defaultBranch = getDefaultBranch();
    
    for (const [orderId, rows] of orderMap.entries()) {
      if (rows.length === 0) continue;
      
      const firstRow = rows[0];
      
      // Lookup supplier
      const supplier = findSupplier(firstRow.supplierIdOrName || '');
      if (!supplier) continue;
      
      // Lookup branch
      const branch = findBranch(firstRow.branchIdOrName || '') || defaultBranch;
      
      // Lookup buyer
      const buyer = findEmployee(firstRow.buyerName || '');
      
      // Build line items
      const lineItems: PurchaseOrderLineItem[] = [];
      for (const row of rows) {
        if (!row.productIdOrSku) continue;
        
        const product = findProduct(row.productIdOrSku || '');
        
        const quantity = Math.max(1, Math.floor(Number(row.quantity) || 1));
        const unitPrice = Number(row.unitPrice) || 0;
        const discount = Number(row.discount) || 0;
        const taxRate = Number(row.taxRate) || 0;
        
        lineItems.push({
          productSystemId: product?.systemId || '',
          productId: product?.id || row.productIdOrSku || '',
          productName: product?.name || row.productName || '',
          sku: product?.sku,
          unit: product?.unit,
          quantity,
          unitPrice,
          discount,
          discountType: 'fixed',
          taxRate,
          note: row.lineNote,
        });
      }
      
      if (lineItems.length === 0) continue;
      
      // Calculate totals
      const subtotal = lineItems.reduce((sum, item) => {
        const lineTotal = (item.unitPrice * item.quantity) - item.discount;
        return sum + lineTotal;
      }, 0);
      
      const shippingFee = Number(firstRow.shippingFee) || 0;
      const orderDiscount = Number(firstRow.orderDiscount) || 0;
      const tax = lineItems.reduce((sum, item) => {
        const lineTotal = (item.unitPrice * item.quantity) - item.discount;
        return sum + (lineTotal * item.taxRate / 100);
      }, 0);
      const grandTotal = subtotal + shippingFee + tax - orderDiscount;
      
      // Map status
      const status = STATUS_MAP[firstRow.status || ''] || 'Đặt hàng';
      
      // Build PurchaseOrder object
      const order: PurchaseOrder = {
        systemId: '', // Will be generated
        id: orderId,
        
        supplierSystemId: supplier.systemId,
        supplierName: supplier.name,
        
        branchSystemId: branch?.systemId || '',
        branchName: branch?.name || '',
        
        orderDate: firstRow.orderDate || now.split('T')[0],
        deliveryDate: firstRow.deliveryDate,
        
        buyerSystemId: buyer?.systemId || '',
        buyer: buyer?.fullName || firstRow.buyerName || '',
        creatorSystemId: '',
        creatorName: '',
        
        status,
        deliveryStatus: 'Chưa nhập' as DeliveryStatus,
        paymentStatus: 'Chưa thanh toán' as PaymentStatus,
        
        lineItems,
        subtotal,
        discount: orderDiscount,
        discountType: 'fixed',
        shippingFee,
        tax,
        grandTotal,
        payments: [],
        
        notes: firstRow.notes,
        createdAt: now,
        updatedAt: now,
      };
      
      orders.push(order);
    }
    
    return orders;
  },
};

// Flatten orders for export (multi-line per product)
export function flattenPurchaseOrdersForExport(orders: PurchaseOrder[]): PurchaseOrderImportRow[] {
  const rows: PurchaseOrderImportRow[] = [];
  
  for (const order of orders) {
    for (let i = 0; i < order.lineItems.length; i++) {
      const item = order.lineItems[i];
      rows.push({
        purchaseOrderId: i === 0 ? order.id : '',
        supplierIdOrName: i === 0 ? order.supplierName : '',
        branchIdOrName: i === 0 ? order.branchName : '',
        orderDate: i === 0 ? order.orderDate : '',
        deliveryDate: i === 0 ? order.deliveryDate : '',
        buyerName: i === 0 ? order.buyer : '',
        status: i === 0 ? order.status : '',
        notes: i === 0 ? order.notes : '',
        productIdOrSku: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        discountType: item.discountType,
        taxRate: item.taxRate,
        lineNote: item.note,
        shippingFee: i === 0 ? order.shippingFee : undefined,
        orderDiscount: i === 0 ? order.discount : undefined,
      });
    }
  }
  
  return rows;
}
