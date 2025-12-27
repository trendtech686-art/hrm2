/**
 * Order Sapo Import Configuration
 * 
 * Import đơn hàng từ file export của Sapo POS
 * 
 * FORMAT FILE SAPO:
 * - Multi-line: 1 đơn hàng có thể có nhiều dòng sản phẩm
 * - Các dòng cùng Mã ĐH sẽ được nhóm thành 1 đơn hàng
 * - Dữ liệu phong phú: thông tin KH, sản phẩm, giao hàng, thanh toán, trả hàng
 * 
 * MAPPING SAPO → HRM:
 * - Mã ĐH → orderId
 * - Mã KH → Lookup customer by id
 * - Mã hàng → Lookup product by id/sku
 * - Trạng thái đơn hàng → status
 * - Trạng thái thanh toán → paymentStatus
 * - Trạng thái đóng gói → packagingStatus
 * - Trạng thái xuất kho → stockOutStatus
 */

import type { Order, LineItem, OrderAddress, OrderMainStatus, OrderPaymentStatus, OrderDeliveryStatus, OrderPrintStatus, OrderStockOutStatus, OrderReturnStatus, OrderDeliveryMethod, PackagingStatus } from '@/features/orders/store';
import type { ImportExportConfig, FieldConfig } from '@/lib/import-export/types';
import { useCustomerStore } from '@/features/customers/store';
import { useProductStore } from '@/features/products/store';
import { useBranchStore } from '@/features/settings/branches/store';
import { useEmployeeStore } from '@/features/employees/store';
import { asBusinessId, asSystemId } from '@/lib/id-types';

// ============================================
// SAPO COLUMN MAPPING
// ============================================

/**
 * Mapping cột Sapo → field key nội bộ
 */
export const SAPO_COLUMN_MAP: Record<string, string> = {
  // Thông tin đơn hàng
  'STT': 'stt',
  'Mã ĐH': 'orderId',
  'Ngày chứng từ': 'orderDate',
  'Ngày duyệt đơn': 'approvedDate',
  'Chi nhánh': 'branchName',
  'Nguồn': 'source',
  'Ngày hẹn giao': 'expectedDeliveryDate',
  'Ngày hoàn thành': 'completedDate',
  'Ngày hủy đơn': 'cancelDate',
  'Trạng thái đơn hàng': 'status',
  'Lý do hủy đơn': 'cancelReason',
  'Trạng thái xử lý': 'processStatus',
  'Trạng thái đóng gói': 'packagingStatus',
  'Trạng thái xuất kho': 'stockOutStatus',
  'Trạng thái thanh toán': 'paymentStatus',
  'Trạng thái trả hàng': 'returnStatus',
  
  // Thông tin khách hàng
  'Mã KH': 'customerId',
  'Tên khách hàng': 'customerName',
  'Điện thoại KH': 'customerPhone',
  'Email': 'customerEmail',
  'Địa chỉ KH': 'customerAddress',
  'Liên hệ': 'contactName',
  
  // Nhân viên
  'Nhân viên tạo đơn': 'createdByName',
  'Nhân viên gán cho đơn': 'salesperson',
  'Bảng giá': 'priceList',
  
  // Thông tin sản phẩm (line item)
  'Mã hàng': 'productId',
  'Mã barcode': 'barcode',
  'Tên hàng': 'productName',
  'Loại sản phẩm': 'productType',
  'Ghi chú sản phẩm': 'productNote',
  'Số lượng': 'quantity',
  'Serial': 'serial',
  'Mã lô date': 'batchCode',
  'Đơn vị tính': 'unit',
  'Đơn giá': 'unitPrice',
  'CK sản phẩm(VNĐ)': 'lineDiscountAmount',
  'CK sản phẩm(%)': 'lineDiscountPercent',
  'Tổng tiền hàng': 'lineTotal',
  'Thuế cho từng sản phẩm': 'lineTax',
  
  // Tổng đơn hàng
  'CK đơn hàng(VNĐ)': 'orderDiscountAmount',
  'CK đơn hàng(%)': 'orderDiscountPercent',
  'Phí vận chuyển': 'shippingFee',
  'Khách phải trả': 'grandTotal',
  'Khách đã trả': 'paidAmount',
  'Ghi chú': 'notes',
  'Tham chiếu': 'reference',
  'Tag': 'tags',
  'Đơn trên kênh': 'channelOrderId',
  
  // Gói hàng
  'Mã gói hàng': 'packageId',
  'Mã vận đơn': 'trackingCode',
  'Ngày đóng gói': 'packagingDate',
  'Nhân viên đóng gói': 'packagerName',
  'Ngày xuất kho': 'stockOutDate',
  'Nhân viên xuất kho': 'stockOutByName',
  
  // Giao hàng
  'Đối tác giao hàng': 'carrier',
  'Tình trạng gói hàng': 'packageStatus',
  'Lý do hủy giao hàng': 'deliveryCancelReason',
  'Trạng thái đối soát': 'reconciliationStatus',
  'Người nhận hàng': 'recipientName',
  'Số điện thoại': 'recipientPhone',
  'Địa chỉ giao hàng': 'shippingStreet',
  'Phường xã': 'shippingWard',
  'Quận huyện': 'shippingDistrict',
  'Tỉnh thành': 'shippingProvince',
  'Tiền thu hộ': 'codAmount',
  'Phí trả đối tác': 'carrierFee',
  
  // Thanh toán
  'Ngày thanh toán': 'paymentDate',
  'Mã phiếu': 'paymentId',
  'Nhân viên': 'paymentByName',
  'Số tiền thanh toán': 'paymentAmount',
  'Phương thức thanh toán': 'paymentMethod',
  'Loại phương thức thanh toán': 'paymentMethodType',
  'Tham chiếu thanh toán': 'paymentReference',
  
  // Trả hàng
  'Ngày trả hàng': 'returnDate',
  'Mã đơn trả': 'returnOrderId',
  'Trạng thái hoàn tiền': 'refundStatus',
  'Lý do trả hàng': 'returnReason',
  'Trạng thái nhận hàng': 'returnReceiveStatus',
  'Mã hàng trả': 'returnProductId',
  'Tên hàng trả': 'returnProductName',
  'Giá hàng trả': 'returnPrice',
  'Tổng tiền trả khách': 'returnTotal',
};

// ============================================
// SAPO STATUS MAPPING
// ============================================

const SAPO_ORDER_STATUS_MAP: Record<string, OrderMainStatus> = {
  'Đặt hàng': 'Đặt hàng',
  'Đang giao dịch': 'Đang giao dịch',
  'Hoàn thành': 'Hoàn thành',
  'Đã hủy': 'Đã hủy',
};

const SAPO_PAYMENT_STATUS_MAP: Record<string, OrderPaymentStatus> = {
  'Chưa thanh toán': 'Chưa thanh toán',
  'Thanh toán một phần': 'Thanh toán 1 phần',
  'Thanh toán toàn bộ': 'Thanh toán toàn bộ',
  'Đã thanh toán': 'Thanh toán toàn bộ',
};

const SAPO_PACKAGING_STATUS_MAP: Record<string, PackagingStatus> = {
  'Chưa đóng gói': 'Chờ đóng gói',
  'Đóng gói một phần': 'Chờ đóng gói',
  'Đóng gói toàn bộ': 'Đã đóng gói',
  'Đã đóng gói': 'Đã đóng gói',
};

const SAPO_STOCK_OUT_STATUS_MAP: Record<string, OrderStockOutStatus> = {
  'Chưa xuất kho': 'Chưa xuất kho',
  'Xuất kho một phần': 'Chưa xuất kho', // HRM chỉ có 2 trạng thái
  'Đã xuất kho': 'Xuất kho toàn bộ',
  'Xuất kho toàn bộ': 'Xuất kho toàn bộ',
};

const SAPO_DELIVERY_STATUS_MAP: Record<string, OrderDeliveryStatus> = {
  'Chờ đóng gói': 'Chờ đóng gói',
  'Đang giao hàng': 'Đang giao hàng',
  'Đã giao hàng': 'Đã giao hàng',
  'Giao hàng thất bại': 'Chờ giao lại', // Map thất bại sang chờ giao lại
};

const SAPO_RETURN_STATUS_MAP: Record<string, OrderReturnStatus> = {
  'Chưa trả hàng': 'Chưa trả hàng',
  'Trả một phần': 'Trả hàng một phần',
  'Đã trả hàng': 'Trả hàng toàn bộ',
  'Trả hàng toàn bộ': 'Trả hàng toàn bộ',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get stores (called at runtime)
const getCustomerStore = () => useCustomerStore.getState();
const getProductStore = () => useProductStore.getState();
const getBranchStore = () => useBranchStore.getState();
const getEmployeeStore = () => useEmployeeStore.getState();

// Lookup customer by id or name
const findCustomer = (identifier: string) => {
  if (!identifier) return undefined;
  const store = getCustomerStore();
  const normalized = identifier.trim().toUpperCase();
  
  // Find by id first
  const byId = store.data.find(c => c.id.toUpperCase() === normalized);
  if (byId) return byId;
  
  // Find by name
  const byName = store.data.find(c => c.name.toUpperCase() === normalized);
  return byName;
};

// Lookup product by id/sku/barcode
const findProduct = (identifier: string) => {
  if (!identifier) return undefined;
  const store = getProductStore();
  const normalized = identifier.trim().toUpperCase();
  
  // Find by id
  const byId = store.data.find(p => p.id.toUpperCase() === normalized);
  if (byId) return byId;
  
  // Find by sku
  const bySku = store.data.find(p => p.sku?.toUpperCase() === normalized);
  if (bySku) return bySku;
  
  // Find by barcode
  const byBarcode = store.data.find(p => p.barcode?.toUpperCase() === normalized);
  return byBarcode;
};

// Lookup branch by name
const findBranch = (name: string) => {
  if (!name) return undefined;
  const store = getBranchStore();
  const normalized = name.trim().toLowerCase();
  return store.data.find(b => b.name.toLowerCase().includes(normalized));
};

// Lookup employee by name
const findEmployee = (name: string) => {
  if (!name) return undefined;
  const store = getEmployeeStore();
  const normalized = name.trim().toLowerCase();
  return store.data.find(e => e.fullName?.toLowerCase().includes(normalized));
};

// Get default branch
const getDefaultBranch = () => {
  const store = getBranchStore();
  return store.data.find(b => b.isDefault) || store.data[0];
};

// Parse date from Sapo format (dd/MM/yyyy HH:mm:ss)
const parseSapoDate = (dateStr: string | undefined): string | undefined => {
  if (!dateStr) return undefined;
  
  // Format: 04/12/2025 16:22:43
  const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/);
  if (match) {
    const [, day, month, year, hour, minute, second] = match;
    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  }
  
  // Try standard format
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toISOString();
  }
  
  return undefined;
};

// ============================================
// SAPO IMPORT ROW TYPE
// ============================================

export interface SapoOrderImportRow {
  stt?: number;
  orderId: string;
  orderDate?: string;
  approvedDate?: string;
  branchName?: string;
  source?: string;
  expectedDeliveryDate?: string;
  completedDate?: string;
  cancelDate?: string;
  status?: string;
  cancelReason?: string;
  processStatus?: string;
  packagingStatus?: string;
  stockOutStatus?: string;
  paymentStatus?: string;
  returnStatus?: string;
  
  // Customer
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  contactName?: string;
  
  // Staff
  createdByName?: string;
  salesperson?: string;
  priceList?: string;
  
  // Product line item
  productId?: string;
  barcode?: string;
  productName?: string;
  productType?: string;
  productNote?: string;
  quantity?: number;
  serial?: string;
  batchCode?: string;
  unit?: string;
  unitPrice?: number;
  lineDiscountAmount?: number;
  lineDiscountPercent?: number;
  lineTotal?: number;
  lineTax?: number;
  
  // Order totals
  orderDiscountAmount?: number;
  orderDiscountPercent?: number;
  shippingFee?: number;
  grandTotal?: number;
  paidAmount?: number;
  notes?: string;
  reference?: string;
  tags?: string;
  channelOrderId?: string;
  
  // Package info
  packageId?: string;
  trackingCode?: string;
  packagingDate?: string;
  packagerName?: string;
  stockOutDate?: string;
  stockOutByName?: string;
  
  // Shipping
  carrier?: string;
  packageStatus?: string;
  deliveryCancelReason?: string;
  reconciliationStatus?: string;
  recipientName?: string;
  recipientPhone?: string;
  shippingStreet?: string;
  shippingWard?: string;
  shippingDistrict?: string;
  shippingProvince?: string;
  codAmount?: number;
  carrierFee?: number;
  
  // Payment
  paymentDate?: string;
  paymentId?: string;
  paymentByName?: string;
  paymentAmount?: number;
  paymentMethod?: string;
  paymentMethodType?: string;
  paymentReference?: string;
}

// ============================================
// FIELD CONFIGURATION (for preview/display)
// ============================================

export const sapoOrderFields: FieldConfig<SapoOrderImportRow>[] = [
  {
    key: 'orderId',
    label: 'Mã ĐH (*)',
    type: 'string',
    required: true,
    example: 'SON06712',
    group: 'Đơn hàng',
    defaultSelected: true,
  },
  {
    key: 'orderDate',
    label: 'Ngày chứng từ',
    type: 'string',
    required: false,
    example: '04/12/2025 16:22:43',
    group: 'Đơn hàng',
    defaultSelected: true,
  },
  {
    key: 'branchName',
    label: 'Chi nhánh',
    type: 'string',
    required: false,
    example: 'Chi nhánh mặc định',
    group: 'Đơn hàng',
    defaultSelected: true,
  },
  {
    key: 'source',
    label: 'Nguồn',
    type: 'string',
    required: false,
    example: 'Khác',
    group: 'Đơn hàng',
    defaultSelected: true,
  },
  {
    key: 'status',
    label: 'Trạng thái đơn hàng',
    type: 'string',
    required: false,
    example: 'Hoàn thành',
    group: 'Đơn hàng',
    defaultSelected: true,
  },
  {
    key: 'customerId',
    label: 'Mã KH',
    type: 'string',
    required: false,
    example: 'KH003818',
    group: 'Khách hàng',
    defaultSelected: true,
  },
  {
    key: 'customerName',
    label: 'Tên khách hàng',
    type: 'string',
    required: false,
    example: 'Nguyễn Văn A',
    group: 'Khách hàng',
    defaultSelected: true,
  },
  {
    key: 'customerPhone',
    label: 'Điện thoại KH',
    type: 'string',
    required: false,
    example: '0901234567',
    group: 'Khách hàng',
  },
  {
    key: 'productId',
    label: 'Mã hàng (*)',
    type: 'string',
    required: true,
    example: 'SP001',
    group: 'Sản phẩm',
    defaultSelected: true,
  },
  {
    key: 'productName',
    label: 'Tên hàng',
    type: 'string',
    required: false,
    example: 'Sản phẩm ABC',
    group: 'Sản phẩm',
    defaultSelected: true,
  },
  {
    key: 'quantity',
    label: 'Số lượng (*)',
    type: 'number',
    required: true,
    example: '2',
    group: 'Sản phẩm',
    defaultSelected: true,
  },
  {
    key: 'unitPrice',
    label: 'Đơn giá',
    type: 'number',
    required: false,
    example: '100000',
    group: 'Sản phẩm',
    defaultSelected: true,
  },
  {
    key: 'grandTotal',
    label: 'Khách phải trả',
    type: 'number',
    required: false,
    example: '500000',
    group: 'Thanh toán',
    defaultSelected: true,
  },
  {
    key: 'paidAmount',
    label: 'Khách đã trả',
    type: 'number',
    required: false,
    example: '500000',
    group: 'Thanh toán',
  },
  {
    key: 'salesperson',
    label: 'Nhân viên bán',
    type: 'string',
    required: false,
    example: 'Nguyễn Văn B',
    group: 'Nhân viên',
  },
  {
    key: 'trackingCode',
    label: 'Mã vận đơn',
    type: 'string',
    required: false,
    example: 'S22981905.MB19-05-F2.1209998216',
    group: 'Giao hàng',
  },
  {
    key: 'carrier',
    label: 'Đối tác giao hàng',
    type: 'string',
    required: false,
    example: 'Giao hàng tiết kiệm',
    group: 'Giao hàng',
  },
];

// ============================================
// MAIN CONFIG
// ============================================

export const sapoOrderImportConfig: ImportExportConfig<Order> = {
  entityType: 'orders-sapo',
  entityDisplayName: 'Đơn hàng (Sapo)',
  
  fields: sapoOrderFields as unknown as FieldConfig<Order>[],
  
  templateFileName: 'Mau_Sapo_Don_Hang.xlsx',
  sheetName: 'Sheet0',
  
  // Import settings
  upsertKey: 'id',
  allowUpdate: false,  // Chỉ thêm mới
  allowInsert: true,
  
  requirePreview: true,
  maxRows: 5000,  // Sapo export có thể lớn
  maxErrorsAllowed: 0,
  
  // Pre-transform: Map Sapo column names to internal keys
  preTransformRawRow: (rawRow) => {
    const result: Record<string, unknown> = {};
    
    for (const [sapoCol, value] of Object.entries(rawRow)) {
      const internalKey = SAPO_COLUMN_MAP[sapoCol];
      if (internalKey) {
        result[internalKey] = value;
      } else {
        // Keep original key if no mapping
        result[sapoCol] = value;
      }
    }
    
    return result;
  },
  
  // Validate each row
  validateRow: (row, _index, existingData, mode) => {
    const errors: Array<{ field?: string; message: string }> = [];
    const importRow = row as unknown as SapoOrderImportRow;
    
    // Mã đơn hàng bắt buộc
    if (!importRow.orderId) {
      errors.push({ field: 'orderId', message: 'Mã đơn hàng không được để trống' });
    }
    
    // Mã hàng bắt buộc (để tạo line item)
    if (!importRow.productId && !importRow.productName) {
      errors.push({ field: 'productId', message: 'Mã hàng hoặc tên hàng không được để trống' });
    }
    
    // Số lượng phải > 0
    if (importRow.quantity !== undefined && importRow.quantity <= 0) {
      errors.push({ field: 'quantity', message: 'Số lượng phải lớn hơn 0' });
    }
    
    // Check duplicate orderId in existing data (warning only)
    if (mode === 'insert-only' && importRow.orderId) {
      const duplicate = existingData.find(o => 
        o.id.toUpperCase() === importRow.orderId.toUpperCase()
      );
      if (duplicate) {
        errors.push({ field: 'orderId', message: `[Warning] Mã đơn hàng "${importRow.orderId}" đã tồn tại - sẽ bỏ qua` });
      }
    }
    
    return errors;
  },
  
  // Transform: Group rows by orderId and build Order objects
  beforeImport: async (data: Order[]) => {
    const importRows = data as unknown as SapoOrderImportRow[];
    
    // Group rows by orderId
    const orderMap = new Map<string, SapoOrderImportRow[]>();
    
    for (const row of importRows) {
      const orderId = row.orderId?.trim();
      if (!orderId) continue;
      
      if (!orderMap.has(orderId)) {
        orderMap.set(orderId, []);
      }
      orderMap.get(orderId)!.push(row);
    }
    
    // Build Order objects
    const orders: Order[] = [];
    const now = new Date().toISOString();
    const defaultBranch = getDefaultBranch();
    
    for (const [orderId, rows] of orderMap.entries()) {
      if (rows.length === 0) continue;
      
      const firstRow = rows[0];
      
      // Lookup customer
      const customer = findCustomer(firstRow.customerId || '') || findCustomer(firstRow.customerName || '');
      
      // Lookup branch
      const branch = findBranch(firstRow.branchName || '') || defaultBranch;
      
      // Lookup salesperson
      const salesperson = findEmployee(firstRow.salesperson || '') || findEmployee(firstRow.createdByName || '');
      
      // Build line items
      const lineItems: LineItem[] = [];
      for (const row of rows) {
        // Skip if no product info
        if (!row.productId && !row.productName) continue;
        
        const product = findProduct(row.productId || '') || findProduct(row.barcode || '');
        
        const quantity = Math.max(1, Math.floor(Number(row.quantity) || 1));
        const unitPrice = Number(row.unitPrice) || (product?.sellingPrice ?? 0);
        const discount = Number(row.lineDiscountAmount) || 0;
        
        lineItems.push({
          productSystemId: product?.systemId || asSystemId(''),
          productId: asBusinessId(product?.id || row.productId || ''),
          productName: product?.name || row.productName || '',
          quantity,
          unitPrice,
          discount,
          discountType: 'fixed',
          note: row.productNote,
        });
      }
      
      if (lineItems.length === 0) continue;
      
      // Calculate totals
      const subtotal = lineItems.reduce((sum, item) => {
        return sum + (item.unitPrice * item.quantity) - (item.discount || 0);
      }, 0);
      
      const shippingFee = Number(firstRow.shippingFee) || 0;
      const orderDiscount = Number(firstRow.orderDiscountAmount) || 0;
      const grandTotal = Number(firstRow.grandTotal) || (subtotal + shippingFee - orderDiscount);
      const paidAmount = Number(firstRow.paidAmount) || 0;
      
      // Build shipping address
      const shippingAddress: OrderAddress | undefined = firstRow.shippingStreet ? {
        street: firstRow.shippingStreet,
        ward: firstRow.shippingWard || '',
        district: firstRow.shippingDistrict || '',
        province: firstRow.shippingProvince || '',
        contactName: firstRow.recipientName || firstRow.customerName,
        phone: firstRow.recipientPhone || firstRow.customerPhone,
        formattedAddress: [
          firstRow.shippingStreet,
          firstRow.shippingWard,
          firstRow.shippingDistrict,
          firstRow.shippingProvince
        ].filter(Boolean).join(', '),
      } : undefined;
      
      // Map statuses
      const status = SAPO_ORDER_STATUS_MAP[firstRow.status || ''] || 'Đặt hàng';
      const paymentStatus = SAPO_PAYMENT_STATUS_MAP[firstRow.paymentStatus || ''] || 'Chưa thanh toán';
      const packagingStatus = SAPO_PACKAGING_STATUS_MAP[firstRow.packagingStatus || ''] || 'Chưa đóng gói';
      const stockOutStatus = SAPO_STOCK_OUT_STATUS_MAP[firstRow.stockOutStatus || ''] || 'Chưa xuất kho';
      const returnStatus = SAPO_RETURN_STATUS_MAP[firstRow.returnStatus || ''] || 'Chưa trả hàng';
      
      // Determine delivery status from package status
      let deliveryStatus: OrderDeliveryStatus = 'Chờ đóng gói';
      if (firstRow.packageStatus) {
        deliveryStatus = SAPO_DELIVERY_STATUS_MAP[firstRow.packageStatus] || 'Chờ đóng gói';
      } else if (packagingStatus === 'Đã đóng gói') {
        deliveryStatus = 'Đang giao hàng';
      }
      
      // Build Order object
      const order: Order = {
        systemId: asSystemId(''), // Will be generated
        id: asBusinessId(orderId),
        
        // Customer info
        customerSystemId: customer?.systemId || asSystemId(''),
        customerName: customer?.name || firstRow.customerName || 'Khách lẻ',
        
        // Branch & Staff
        branchSystemId: branch?.systemId || asSystemId(''),
        branchName: branch?.name || firstRow.branchName || '',
        salesperson: salesperson?.fullName || firstRow.salesperson || '',
        salespersonSystemId: salesperson?.systemId || asSystemId(''),
        
        // Dates
        orderDate: parseSapoDate(firstRow.orderDate) || now,
        completedDate: parseSapoDate(firstRow.completedDate),
        createdAt: parseSapoDate(firstRow.orderDate) || now,
        createdBy: salesperson?.systemId || asSystemId('SYSTEM'),
        updatedAt: now,
        updatedBy: asSystemId('SYSTEM'),
        
        // Line items
        lineItems,
        
        // Totals
        subtotal,
        shippingFee,
        tax: 0,
        orderDiscount,
        grandTotal,
        paidAmount,
        codAmount: Number(firstRow.codAmount) || 0,
        
        // Statuses
        status,
        paymentStatus,
        deliveryStatus,
        printStatus: 'Chưa in' as OrderPrintStatus,
        stockOutStatus,
        returnStatus,
        
        // Shipping
        deliveryMethod: (firstRow.carrier ? 'Dịch vụ giao hàng' : 'Nhận tại cửa hàng') as OrderDeliveryMethod,
        shippingAddress,
        
        // Other
        source: `Sapo: ${firstRow.source || 'Import'}`,
        notes: firstRow.notes,
        tags: firstRow.tags?.split(',').map(t => t.trim()).filter(Boolean),
        
        // Initialize arrays - không tạo packagings vì cấu trúc phức tạp
        payments: [],
        packagings: [],
      };
      
      orders.push(order);
    }
    
    return orders;
  },
};

// Export helper for use in page
export { findCustomer, findProduct, findBranch, findEmployee };
