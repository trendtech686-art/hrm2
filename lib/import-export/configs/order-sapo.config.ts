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

import type { Order, LineItem, OrderAddress, OrderMainStatus, OrderPaymentStatus, OrderDeliveryStatus, OrderPrintStatus, OrderStockOutStatus, OrderReturnStatus, OrderDeliveryMethod, PackagingStatus, OrderPayment, Packaging } from '@/lib/types/prisma-extended';
import type { ImportExportConfig, FieldConfig } from '@/lib/import-export/types';
import type { Customer, Product, Branch, Employee } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';
import { asBusinessId, asSystemId } from '@/lib/id-types';
import { parseSapoExcelFile } from '@/lib/import-export/sapo-excel-parser';
// Auto-create customers/products is handled server-side in ORDER API

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
  'Giao hàng thất bại': 'Chờ giao lại',
  'Đã hủy-đã nhận': 'Đã giao hàng',
  'Đã nhận hàng': 'Đã giao hàng',
};

const SAPO_RETURN_STATUS_MAP: Record<string, OrderReturnStatus> = {
  'Chưa trả hàng': 'Chưa trả hàng',
  'Trả một phần': 'Trả hàng một phần',
  'Đã trả hàng': 'Trả hàng toàn bộ',
  'Trả hàng toàn bộ': 'Trả hàng toàn bộ',
};

// ============================================
// HELPER FUNCTIONS (Accept data as parameters)
// ============================================

/**
 * Normalize Vietnamese phone number:
 * - Remove spaces, dashes, dots
 * - Add leading "0" if starts with 3/5/7/8/9 and has 9 digits
 * - Remove +84 prefix and replace with 0
 */
const normalizePhone = (phone?: string): string | undefined => {
  if (!phone) return undefined;
  let cleaned = String(phone).replace(/[\s\-.]+/g, '').trim();
  if (!cleaned) return undefined;
  // +84 prefix
  if (cleaned.startsWith('+84')) cleaned = '0' + cleaned.slice(3);
  if (cleaned.startsWith('84') && cleaned.length === 11) cleaned = '0' + cleaned.slice(2);
  // Missing leading 0 (e.g. 901234567 → 0901234567)
  if (/^[3-9]\d{8}$/.test(cleaned)) cleaned = '0' + cleaned;
  return cleaned || undefined;
};

// Lookup customer by id, name, or phone
const findCustomer = (identifier: string, customers: Customer[], phone?: string) => {
  if (!customers) return undefined;
  
  if (identifier) {
    const normalized = identifier.trim().toUpperCase();
    // Find by id first
    const byId = customers.find(c => c.id.toUpperCase() === normalized);
    if (byId) return byId;
    // Find by name
    const byName = customers.find(c => c.name.toUpperCase() === normalized);
    if (byName) return byName;
  }
  
  // Find by phone (normalized)
  if (phone) {
    const normPhone = normalizePhone(phone);
    if (normPhone) {
      const byPhone = customers.find(c => c.phone && normalizePhone(c.phone) === normPhone);
      if (byPhone) return byPhone;
    }
  }
  
  return undefined;
};

// Lookup product by id/sku/barcode
const findProduct = (identifier: string, products: Product[]) => {
  if (!identifier || !products) return undefined;
  const normalized = identifier.trim().toUpperCase();
  
  // Find by id
  const byId = products.find(p => p.id.toUpperCase() === normalized);
  if (byId) return byId;
  
  // Find by barcode
  const byBarcode = products.find(p => p.barcode?.toUpperCase() === normalized);
  return byBarcode;
};

// Lookup branch by name
const findBranch = (name: string, branches: Branch[]) => {
  if (!name || !branches) return undefined;
  const normalized = name.trim().toLowerCase();
  return branches.find(b => b.name.toLowerCase().includes(normalized));
};

// Lookup employee by name
const findEmployee = (name: string, employees: Employee[]) => {
  if (!name || !employees) return undefined;
  const normalized = name.trim().toLowerCase();
  return employees.find(e => e.fullName?.toLowerCase().includes(normalized));
};

// Get default branch
const getDefaultBranch = (branches: Branch[]) => {
  if (!branches || branches.length === 0) return undefined;
  return branches.find(b => b.isDefault) || branches[0];
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
  // ── Hidden fields: processed by transformImportRow but not shown in preview UI ──
  // These are needed by beforeImport to build complete Order objects
  { key: 'paymentStatus', label: 'Trạng thái thanh toán', type: 'string', hidden: true },
  { key: 'packagingStatus', label: 'Trạng thái đóng gói', type: 'string', hidden: true },
  { key: 'stockOutStatus', label: 'Trạng thái xuất kho', type: 'string', hidden: true },
  { key: 'returnStatus', label: 'Trạng thái trả hàng', type: 'string', hidden: true },
  { key: 'packageStatus', label: 'Tình trạng gói hàng', type: 'string', hidden: true },
  { key: 'completedDate', label: 'Ngày hoàn thành', type: 'string', hidden: true },
  { key: 'approvedDate', label: 'Ngày duyệt đơn', type: 'string', hidden: true },
  { key: 'cancelDate', label: 'Ngày hủy đơn', type: 'string', hidden: true },
  { key: 'expectedDeliveryDate', label: 'Ngày hẹn giao', type: 'string', hidden: true },
  { key: 'shippingFee', label: 'Phí vận chuyển', type: 'number', hidden: true },
  { key: 'orderDiscountAmount', label: 'CK đơn hàng(VNĐ)', type: 'number', hidden: true },
  { key: 'codAmount', label: 'Tiền thu hộ', type: 'number', hidden: true },
  { key: 'notes', label: 'Ghi chú', type: 'string', hidden: true },
  { key: 'tags', label: 'Tag', type: 'string', hidden: true },
  { key: 'shippingStreet', label: 'Địa chỉ giao hàng', type: 'string', hidden: true },
  { key: 'shippingWard', label: 'Phường xã', type: 'string', hidden: true },
  { key: 'shippingDistrict', label: 'Quận huyện', type: 'string', hidden: true },
  { key: 'shippingProvince', label: 'Tỉnh thành', type: 'string', hidden: true },
  { key: 'recipientName', label: 'Người nhận hàng', type: 'string', hidden: true },
  { key: 'recipientPhone', label: 'Số điện thoại', type: 'string', hidden: true },
  { key: 'packageId', label: 'Mã gói hàng', type: 'string', hidden: true },
  { key: 'packagingDate', label: 'Ngày đóng gói', type: 'string', hidden: true },
  { key: 'packagerName', label: 'Nhân viên đóng gói', type: 'string', hidden: true },
  { key: 'createdByName', label: 'Nhân viên tạo đơn', type: 'string', hidden: true },
  { key: 'barcode', label: 'Mã barcode', type: 'string', hidden: true },
  { key: 'lineDiscountAmount', label: 'CK sản phẩm(VNĐ)', type: 'number', hidden: true },
  { key: 'productNote', label: 'Ghi chú sản phẩm', type: 'string', hidden: true },
  { key: 'stockOutDate', label: 'Ngày xuất kho', type: 'string', hidden: true },
  { key: 'stockOutByName', label: 'Nhân viên xuất kho', type: 'string', hidden: true },
  { key: 'carrierFee', label: 'Phí trả đối tác', type: 'number', hidden: true },
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
  
  // Custom parser: ExcelJS streaming for large Sapo files (45MB+, 100K+ rows)
  parseFile: parseSapoExcelFile,
  maxFileSize: 50 * 1024 * 1024, // 50MB - Sapo export files are large
  
  // Import settings
  upsertKey: 'id',
  allowUpdate: false,  // Chỉ thêm mới
  allowInsert: true,
  
  requirePreview: true,
  maxRows: 200000,  // Sapo export có thể có 100K+ dòng (sẽ gộp thành orders ít hơn nhiều)
  maxErrorsAllowed: 0,
  
  // Import options - checkboxes hiển thị trong dialog
  importOptions: [
    {
      key: 'autoCreateCustomer',
      label: 'Tự động tạo khách hàng mới',
      description: 'Nếu mã KH/tên KH không tìm thấy trong hệ thống, tự động tạo khách hàng mới',
      defaultValue: true,
    },
    {
      key: 'autoCreateProduct',
      label: 'Tự động tạo sản phẩm mới',
      description: 'Nếu mã hàng/tên hàng không tìm thấy trong hệ thống, tự động tạo sản phẩm mới',
      defaultValue: true,
    },
  ],
  
  // Preview stats - hiển thị số đơn hàng, KH mới, SP mới
  computePreviewStats: (rawRows, _options, storeContext) => {
    const ctx = (storeContext || {}) as {
      customerStore?: { data: Customer[] };
      productStore?: { data: Product[] };
    }
    const existingCustomers = ctx.customerStore?.data || []
    const existingProducts = ctx.productStore?.data || []
    
    // Count unique order IDs
    const orderIds = new Set<string>()
    const uniqueCustomerKeys = new Set<string>()
    const uniqueProductKeys = new Set<string>()
    
    for (const row of rawRows) {
      const orderId = String(row.orderId || '').trim()
      if (orderId) orderIds.add(orderId)
      
      const customerId = String(row.customerId || '').trim()
      const customerName = String(row.customerName || '').trim()
      const customerKey = customerId || customerName
      if (customerKey) uniqueCustomerKeys.add(customerKey)
      
      const productId = String(row.productId || '').trim()
      const productName = String(row.productName || '').trim()
      const productKey = productId || productName
      if (productKey) uniqueProductKeys.add(productKey)
    }
    
    // Count how many are new (not in existing data)
    let newCustomerCount = 0
    for (const key of uniqueCustomerKeys) {
      if (!findCustomer(key, existingCustomers)) newCustomerCount++
    }
    let newProductCount = 0
    for (const key of uniqueProductKeys) {
      if (!findProduct(key, existingProducts)) newProductCount++
    }
    
    return {
      stats: [
        { label: '📦 Số đơn hàng (sau gộp)', value: orderIds.size, variant: 'info' as const },
        { label: '📋 Tổng dòng sản phẩm', value: rawRows.length, variant: 'default' as const },
        { label: '👤 Khách hàng trong file', value: uniqueCustomerKeys.size, variant: 'default' as const },
        { label: '👤 KH mới (chưa có trong hệ thống)', value: newCustomerCount, variant: newCustomerCount > 0 ? 'warning' as const : 'success' as const },
        { label: '🏷️ Sản phẩm trong file', value: uniqueProductKeys.size, variant: 'default' as const },
        { label: '🏷️ SP mới (chưa có trong hệ thống)', value: newProductCount, variant: newProductCount > 0 ? 'warning' as const : 'success' as const },
      ],
      warnings: rawRows.length > 100000 
        ? ['File rất lớn (100K+ dòng). Quá trình import có thể mất vài phút.'] 
        : undefined,
    }
  },
  
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
  beforeImport: async (data: Order[], context?: Record<string, unknown>) => {
    const storeContext = (context?.storeContext || {}) as { 
      customerStore?: { data: Customer[] }; 
      productStore?: { data: Product[] }; 
      branchStore?: { data: Branch[] }; 
      employeeStore?: { data: Employee[] } 
    }
    const currentUser = context?.currentUser as { systemId: SystemId; name: string } | undefined
    const importRows = data as unknown as SapoOrderImportRow[];
    
    // Get data from storeContext (read-only lookup, no HTTP calls here)
    const customers = storeContext.customerStore?.data || [];
    const products = storeContext.productStore?.data || [];
    const branches = storeContext.branchStore?.data || [];
    const employees = storeContext.employeeStore?.data || [];
    
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
    const defaultBranch = getDefaultBranch(branches);
    
    for (const [orderId, rows] of orderMap.entries()) {
      if (rows.length === 0) continue;
      
      const firstRow = rows[0];
      
      // Lookup customer from existing data only (no HTTP calls - ORDER API handles auto-create)
      const customerPhone = normalizePhone(firstRow.customerPhone);
      const customer = findCustomer(firstRow.customerId || '', customers, customerPhone)
        || findCustomer(firstRow.customerName || '', customers, customerPhone);
      
      // Lookup branch
      const branch = findBranch(firstRow.branchName || '', branches) || defaultBranch;
      
      // Lookup salesperson - fallback to currentUser or first employee
      const salesperson = findEmployee(firstRow.salesperson || '', employees) 
        || findEmployee(firstRow.createdByName || '', employees);
      const salespersonSystemId = salesperson?.systemId 
        || currentUser?.systemId 
        || employees[0]?.systemId 
        || asSystemId('SYSTEM');
      const salespersonName = salesperson?.fullName 
        || currentUser?.name 
        || employees[0]?.fullName 
        || firstRow.salesperson 
        || 'N/A';
      
      // Build line items
      const lineItems: LineItem[] = [];
      for (const row of rows) {
        // Skip if no product info
        if (!row.productId && !row.productName) continue;
        
        // Lookup product from existing data only (no HTTP calls - ORDER API handles auto-create)
        const product = findProduct(row.productId || '', products) || findProduct(row.barcode || '', products);
        
        const quantity = Math.max(1, Math.floor(Number(row.quantity) || 1));
        const unitPrice = Number(row.unitPrice) || (product?.costPrice ?? 0);
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
      
      // Build packaging record from Sapo data
      const deliveryMethod = (firstRow.carrier ? 'Dịch vụ giao hàng' : 'Nhận tại cửa hàng') as OrderDeliveryMethod;
      // Check against original Sapo value (not mapped) since SAPO_PACKAGING_STATUS_MAP maps "Chưa đóng gói" → "Chờ đóng gói"
      const sapoPackagingRaw = (firstRow.packagingStatus || '').trim();
      const hasPackagingData = (sapoPackagingRaw !== '' && sapoPackagingRaw !== 'Chưa đóng gói') || !!firstRow.packageId || !!firstRow.trackingCode;
      const packagingRecord = hasPackagingData ? {
        status: packagingStatus,
        deliveryStatus: deliveryStatus,
        deliveryMethod: deliveryMethod,
        carrier: firstRow.carrier || undefined,
        trackingCode: firstRow.trackingCode || undefined,
        codAmount: Number(firstRow.codAmount) || 0,
        reconciliationStatus: (paidAmount >= grandTotal && paidAmount > 0) ? 'Đã đối soát' : undefined,
        requestDate: parseSapoDate(firstRow.packagingDate) || parseSapoDate(firstRow.orderDate) || now,
        confirmDate: packagingStatus === 'Đã đóng gói' ? (parseSapoDate(firstRow.packagingDate) || now) : undefined,
        deliveredDate: deliveryStatus === 'Đã giao hàng' ? (parseSapoDate(firstRow.completedDate) || now) : undefined,
        assignedEmployeeName: firstRow.packagerName || currentUser?.name || salespersonName,
      } : null;

      // Build Order object
      const order: Order = {
        systemId: asSystemId(''), // Will be generated
        id: asBusinessId(orderId),
        
        // Customer info
        customerSystemId: customer?.systemId || asSystemId(''),
        customerName: customer?.name || firstRow.customerName || 'Khách lẻ',
        customerPhone: customerPhone || firstRow.customerPhone,
        
        // Branch & Staff
        branchSystemId: branch?.systemId || asSystemId(''),
        branchName: branch?.name || firstRow.branchName || '',
        salesperson: salespersonName,
        salespersonSystemId: salespersonSystemId,
        
        // Dates
        orderDate: parseSapoDate(firstRow.orderDate) || now,
        approvedDate: parseSapoDate(firstRow.approvedDate),
        expectedDeliveryDate: parseSapoDate(firstRow.expectedDeliveryDate),
        completedDate: parseSapoDate(firstRow.completedDate),
        cancelledDate: parseSapoDate(firstRow.cancelDate),
        dispatchedDate: parseSapoDate(firstRow.stockOutDate),
        createdAt: parseSapoDate(firstRow.orderDate) || now,
        createdBy: salespersonSystemId,
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
        deliveryMethod,
        shippingAddress,
        
        // Other
        source: `Sapo: ${firstRow.source || 'Import'}`,
        notes: firstRow.notes,
        tags: firstRow.tags?.split(',').map(t => t.trim()).filter(Boolean),
        
        // Packaging from Sapo data
        payments: paidAmount > 0 ? [{
          method: 'Tiền mặt',
          amount: paidAmount,
          date: parseSapoDate(firstRow.orderDate) || now,
          description: 'Thanh toán từ Sapo',
        }] as unknown as OrderPayment[] : [],
        packagings: packagingRecord ? [packagingRecord] as unknown as Packaging[] : [],
      };
      
      // Add discount field for API compatibility (API expects 'discount', not 'orderDiscount')
      const orderWithExtra = Object.assign(order, { discount: orderDiscount });
      
      orders.push(orderWithExtra);
    }
    
    return orders;
  },
};

// Export helper for use in page
export { findCustomer, findProduct, findBranch, findEmployee };
