/**
 * Order Import/Export Configuration
 * 
 * Import đơn hàng với các đặc điểm:
 * - Multi-line: Mỗi sản phẩm 1 dòng, các dòng cùng Mã đơn sẽ được gộp thành 1 Order
 * - Lookup khách hàng theo Mã KH (id field)
 * - Lookup sản phẩm theo SKU
 * - Trạng thái mặc định: "Đặt hàng"
 * - Lấy địa chỉ giao hàng từ khách hàng
 * - Không import phí ship, chiết khấu
 */

import type { Order, LineItem, OrderAddress } from '@/features/orders/types';
import type { ImportExportConfig, FieldConfig } from '../types';
import { useCustomerStore } from '@/features/customers/store';
import { useProductStore } from '@/features/products/store';
import { useBranchStore } from '@/features/settings/branches/store';
import { useEmployeeStore } from '@/features/employees/store';
import { asSystemId, asBusinessId, type SystemId, type BusinessId } from '@/lib/id-types';
import type { Customer } from '@/features/customers/types';

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Lookup khách hàng theo Mã KH (id field)
 */
const findCustomerById = (customerId: string): Customer | undefined => {
  if (!customerId) return undefined;
  const customers = useCustomerStore.getState().data;
  const normalizedId = String(customerId).trim().toUpperCase();
  
  return customers.find(c => 
    c.id.toUpperCase() === normalizedId ||
    c.systemId.toUpperCase() === normalizedId
  );
};

/**
 * Lookup sản phẩm theo SKU
 */
const findProductBySku = (sku: string) => {
  if (!sku) return undefined;
  const products = useProductStore.getState().data;
  const normalizedSku = String(sku).trim().toUpperCase();
  
  return products.find(p => 
    p.id.toUpperCase() === normalizedSku ||
    p.sku?.toUpperCase() === normalizedSku ||
    p.systemId.toUpperCase() === normalizedSku
  );
};

/**
 * Lookup chi nhánh theo tên hoặc mã
 */
const findBranch = (branchIdOrName: string) => {
  if (!branchIdOrName) return undefined;
  const branches = useBranchStore.getState().data;
  const normalized = String(branchIdOrName).trim().toLowerCase();
  
  return branches.find(b => 
    b.id.toLowerCase() === normalized ||
    b.name.toLowerCase() === normalized ||
    b.systemId.toLowerCase() === normalized
  );
};

/**
 * Lookup nhân viên theo tên hoặc mã
 */
const findEmployee = (employeeIdOrName: string) => {
  if (!employeeIdOrName) return undefined;
  const employees = useEmployeeStore.getState().data;
  const normalized = String(employeeIdOrName).trim().toLowerCase();
  
  return employees.find(e => 
    e.id.toLowerCase() === normalized ||
    e.fullName.toLowerCase() === normalized ||
    e.systemId.toLowerCase() === normalized
  );
};

/**
 * Get default branch
 */
const getDefaultBranch = () => {
  const branches = useBranchStore.getState().data;
  return branches.find(b => b.isDefault) || branches[0];
};

/**
 * Get default shipping address from customer
 */
const getCustomerShippingAddress = (customer: Customer): OrderAddress | undefined => {
  if (!customer) return undefined;
  
  // Tìm địa chỉ mặc định hoặc địa chỉ đầu tiên
  const defaultAddr = customer.addresses?.find(a => a.isDefault || a.isDefaultShipping) || customer.addresses?.[0];
  
  if (defaultAddr) {
    const formattedAddress = [defaultAddr.street, defaultAddr.ward, defaultAddr.district, defaultAddr.province]
      .filter(Boolean)
      .join(', ');
    return {
      street: defaultAddr.street,
      ward: defaultAddr.ward,
      district: defaultAddr.district,
      province: defaultAddr.province,
      contactName: customer.name,
      phone: customer.phone,
      formattedAddress,
    };
  }
  
  return undefined;
};

// ============================================
// INTERMEDIATE TYPE FOR IMPORT
// ============================================

/**
 * Type cho row nhập từ Excel (flat structure - 1 dòng = 1 sản phẩm)
 * 
 * FORMAT EXCEL MẪU:
 * ┌──────────┬────────┬───────────┬────────────┬────────┬──────────┬─────────┐
 * │ Mã đơn(*) │ Mã KH(*) │ Chi nhánh │ Nhân viên  │ SKU(*) │ Số lượng │ Đơn giá │
 * ├──────────┼────────┼───────────┼────────────┼────────┼──────────┼─────────┤
 * │ DH001    │ KH001  │ CN-A      │ Nguyễn A   │ SP001  │ 2        │ 100000  │ ← Đơn 1, SP 1
 * │          │        │           │            │ SP002  │ 1        │ 200000  │ ← Đơn 1, SP 2 (kế thừa mã đơn + KH)
 * │ DH002    │ KH002  │ CN-B      │ Trần B     │ SP003  │ 3        │ 150000  │ ← Đơn 2, SP 1
 * │          │        │           │            │ SP004  │ 1        │ 300000  │ ← Đơn 2, SP 2
 * └──────────┴────────┴───────────┴────────────┴────────┴──────────┴─────────┘
 * 
 * LOGIC:
 * - Mã đơn (*): BẮT BUỘC điền ở dòng đầu của mỗi đơn hàng
 * - Mã KH (*): BẮT BUỘC điền ở dòng đầu của mỗi đơn hàng  
 * - Các dòng SP sau: để trống Mã đơn + Mã KH → tự kế thừa từ dòng trên
 * - Chi nhánh, Nhân viên: Tùy chọn, để trống sẽ dùng mặc định
 */
export interface OrderImportRow {
  orderId: string;              // Mã đơn hàng (DH001) - có thể để trống nếu muốn auto-gen
  customerId: string;           // Mã khách hàng - chỉ cần điền ở dòng đầu mỗi đơn
  branchName?: string;          // Chi nhánh (tên hoặc mã)
  salespersonName?: string;     // Nhân viên bán (tên hoặc mã)
  productSku: string;           // SKU sản phẩm
  quantity: number;             // Số lượng
  unitPrice?: number;           // Đơn giá (nếu không có thì lấy từ SP)
  lineNote?: string;            // Ghi chú dòng sản phẩm
  orderNote?: string;           // Ghi chú đơn hàng
  orderDate?: string;           // Ngày đặt hàng
  source?: string;              // Nguồn đơn
  tags?: string;                // Tags (comma separated)
}

// ============================================
// FIELD CONFIGURATION
// ============================================

export const orderFields: FieldConfig<OrderImportRow>[] = [
  // ===== Thông tin đơn hàng =====
  {
    key: 'orderId',
    label: 'Mã đơn hàng (*)',
    type: 'string',
    required: true,  // Bắt buộc điền ở dòng đầu, các dòng SP sau có thể để trống
    example: 'DH001',
    group: 'Đơn hàng',
    defaultSelected: true,
    // preProcessRows sẽ fill-down cho các dòng SP sau
  },
  {
    key: 'customerId',
    label: 'Mã khách hàng (*)',
    type: 'string',
    required: true,  // Bắt buộc điền ở dòng đầu, các dòng SP sau có thể để trống
    example: 'KH001',
    group: 'Đơn hàng',
    defaultSelected: true,
    // preProcessRows sẽ fill-down cho các dòng SP sau
  },
  {
    key: 'branchName',
    label: 'Chi nhánh',
    type: 'string',
    required: false,
    example: 'Chi nhánh Hà Nội',
    group: 'Đơn hàng',
    defaultSelected: true,
    validator: (value) => {
      if (value && String(value).trim() !== '') {
        const branch = findBranch(String(value));
        if (!branch) {
          return `Không tìm thấy chi nhánh "${value}"`;
        }
      }
      return true;
    },
  },
  {
    key: 'salespersonName',
    label: 'Nhân viên bán hàng',
    type: 'string',
    required: false,
    example: 'Nguyễn Văn A',
    group: 'Đơn hàng',
    defaultSelected: true,
    validator: (value) => {
      if (value && String(value).trim() !== '') {
        const employee = findEmployee(String(value));
        if (!employee) {
          return `Không tìm thấy nhân viên "${value}"`;
        }
      }
      return true;
    },
  },
  {
    key: 'orderDate',
    label: 'Ngày đặt hàng',
    type: 'date',
    required: false,
    example: '19/12/2024',
    group: 'Đơn hàng',
    defaultSelected: true,
  },
  {
    key: 'source',
    label: 'Nguồn đơn',
    type: 'string',
    required: false,
    example: 'Website',
    group: 'Đơn hàng',
    defaultSelected: false,
  },
  {
    key: 'tags',
    label: 'Tags',
    type: 'string',
    required: false,
    example: 'VIP, Gấp',
    group: 'Đơn hàng',
    defaultSelected: false,
  },
  {
    key: 'orderNote',
    label: 'Ghi chú đơn hàng',
    type: 'string',
    required: false,
    example: 'Giao buổi sáng',
    group: 'Đơn hàng',
    defaultSelected: true,
  },

  // ===== Thông tin sản phẩm =====
  {
    key: 'productSku',
    label: 'SKU sản phẩm (*)',
    type: 'string',
    required: true,
    example: 'SP001',
    group: 'Sản phẩm',
    defaultSelected: true,
    validator: (value) => {
      if (!value || String(value).trim() === '') {
        return 'SKU sản phẩm không được để trống';
      }
      const product = findProductBySku(String(value));
      if (!product) {
        return `Không tìm thấy sản phẩm với SKU "${value}"`;
      }
      return true;
    },
  },
  {
    key: 'quantity',
    label: 'Số lượng (*)',
    type: 'number',
    required: true,
    example: '2',
    group: 'Sản phẩm',
    defaultSelected: true,
    validator: (value) => {
      const qty = Number(value);
      if (isNaN(qty) || qty <= 0) {
        return 'Số lượng phải là số dương';
      }
      return true;
    },
    importTransform: (value) => {
      const num = Number(value);
      return isNaN(num) ? 1 : Math.max(1, Math.floor(num));
    },
  },
  {
    key: 'unitPrice',
    label: 'Đơn giá',
    type: 'number',
    required: false,
    example: '150000',
    group: 'Sản phẩm',
    defaultSelected: true,
    importTransform: (value) => {
      if (value === undefined || value === null || value === '') return undefined;
      const num = Number(value);
      return isNaN(num) ? undefined : Math.max(0, num);
    },
  },
  {
    key: 'lineNote',
    label: 'Ghi chú SP',
    type: 'string',
    required: false,
    example: 'Màu đỏ',
    group: 'Sản phẩm',
    defaultSelected: false,
  },
];

// ============================================
// FIELD GROUPS FOR EXPORT
// ============================================

export const orderFieldGroups = [
  {
    id: 'order-info',
    label: 'Thông tin đơn hàng',
    columns: [
      { key: 'id', label: 'Mã đơn hàng', defaultSelected: true },
      { key: 'orderDate', label: 'Ngày đặt', defaultSelected: true },
      { key: 'status', label: 'Trạng thái', defaultSelected: true },
      { key: 'source', label: 'Nguồn đơn', defaultSelected: false },
      { key: 'tags', label: 'Tags', defaultSelected: false },
      { key: 'notes', label: 'Ghi chú', defaultSelected: false },
    ],
  },
  {
    id: 'customer-info',
    label: 'Thông tin khách hàng',
    columns: [
      { key: 'customerId', label: 'Mã KH', defaultSelected: true },
      { key: 'customerName', label: 'Tên khách hàng', defaultSelected: true },
      { key: 'customerPhone', label: 'SĐT khách', defaultSelected: true },
      { key: 'shippingAddress', label: 'Địa chỉ giao', defaultSelected: true },
    ],
  },
  {
    id: 'product-info',
    label: 'Thông tin sản phẩm',
    columns: [
      { key: 'productSku', label: 'SKU', defaultSelected: true },
      { key: 'productName', label: 'Tên sản phẩm', defaultSelected: true },
      { key: 'quantity', label: 'Số lượng', defaultSelected: true },
      { key: 'unitPrice', label: 'Đơn giá', defaultSelected: true },
      { key: 'lineTotal', label: 'Thành tiền', defaultSelected: true },
      { key: 'lineNote', label: 'Ghi chú SP', defaultSelected: false },
    ],
  },
  {
    id: 'payment-info',
    label: 'Thanh toán',
    columns: [
      { key: 'subtotal', label: 'Tạm tính', defaultSelected: true },
      { key: 'shippingFee', label: 'Phí ship', defaultSelected: false },
      { key: 'orderDiscount', label: 'Chiết khấu', defaultSelected: false },
      { key: 'grandTotal', label: 'Tổng tiền', defaultSelected: true },
      { key: 'paidAmount', label: 'Đã thanh toán', defaultSelected: true },
      { key: 'paymentStatus', label: 'Trạng thái TT', defaultSelected: true },
    ],
  },
  {
    id: 'delivery-info',
    label: 'Vận chuyển',
    columns: [
      { key: 'deliveryMethod', label: 'Phương thức giao', defaultSelected: true },
      { key: 'deliveryStatus', label: 'Trạng thái giao', defaultSelected: true },
      { key: 'trackingCode', label: 'Mã vận đơn', defaultSelected: false },
      { key: 'carrier', label: 'ĐVVC', defaultSelected: false },
    ],
  },
  {
    id: 'branch-staff',
    label: 'Chi nhánh & Nhân viên',
    columns: [
      { key: 'branchName', label: 'Chi nhánh', defaultSelected: true },
      { key: 'salesperson', label: 'Nhân viên bán', defaultSelected: true },
    ],
  },
];

// ============================================
// MAIN CONFIG
// ============================================

export const orderImportExportConfig: ImportExportConfig<Order> = {
  entityType: 'orders',
  entityDisplayName: 'Đơn hàng',
  
  fields: orderFields as unknown as FieldConfig<Order>[],
  
  templateFileName: 'Mau_Nhap_Don_Hang.xlsx',
  sheetName: 'Đơn hàng',
  
  // Import settings
  upsertKey: 'id',
  allowUpdate: false,  // Chỉ cho phép thêm mới, không update đơn hàng qua import
  allowInsert: true,
  
  requirePreview: true,
  maxRows: 1000,
  maxErrorsAllowed: 0,  // Không cho phép lỗi
  
  // Pre-process: Fill empty orderId/customerId from previous row
  // User must fill orderId + customerId on first row of each order
  // Subsequent product rows can leave them empty → will inherit from previous row
  preProcessRows: (rows: unknown[]) => {
    const importRows = rows as OrderImportRow[];
    let currentOrderId = '';
    let currentCustomerId = '';
    
    for (const row of importRows) {
      // If orderId is provided, use it and update current
      if (row.orderId?.trim()) {
        currentOrderId = row.orderId.trim();
        // Also update customerId if provided on the same row
        if (row.customerId?.trim()) {
          currentCustomerId = row.customerId.trim();
        }
      } else if (currentOrderId) {
        // Fill from previous row's orderId (for subsequent product lines)
        row.orderId = currentOrderId;
      }
      // Note: if orderId is empty and no previous orderId → validation will catch it
      
      // Fill customerId if empty (inherit from previous row)
      if (!row.customerId?.trim() && currentCustomerId) {
        row.customerId = currentCustomerId;
      } else if (row.customerId?.trim()) {
        currentCustomerId = row.customerId.trim();
      }
    }
    
    return importRows;
  },
  
  // Validate row (after pre-processing)
  validateRow: (row, _index, existingData, mode) => {
    const errors: Array<{ field?: string; message: string }> = [];
    const importRow = row as unknown as OrderImportRow;
    
    // Check required fields - orderId must be filled on first row of each order
    if (!importRow.orderId) {
      errors.push({ field: 'orderId', message: 'Mã đơn hàng không được để trống (bắt buộc điền ở dòng đầu của mỗi đơn)' });
    }
    if (!importRow.customerId) {
      errors.push({ field: 'customerId', message: 'Mã khách hàng không được để trống (điền ở dòng đầu của mỗi đơn)' });
    }
    if (!importRow.productSku) {
      errors.push({ field: 'productSku', message: 'SKU sản phẩm không được để trống' });
    }
    
    // Validate customer
    if (importRow.customerId) {
      const customer = findCustomerById(importRow.customerId);
      if (!customer) {
        errors.push({ field: 'customerId', message: `Không tìm thấy khách hàng "${importRow.customerId}"` });
      }
    }
    
    // Validate product
    if (importRow.productSku) {
      const product = findProductBySku(importRow.productSku);
      if (!product) {
        errors.push({ field: 'productSku', message: `Không tìm thấy sản phẩm "${importRow.productSku}"` });
      }
    }
    
    // Validate branch if provided
    if (importRow.branchName) {
      const branch = findBranch(importRow.branchName);
      if (!branch) {
        errors.push({ field: 'branchName', message: `Không tìm thấy chi nhánh "${importRow.branchName}"` });
      }
    }
    
    // Validate salesperson if provided
    if (importRow.salespersonName) {
      const employee = findEmployee(importRow.salespersonName);
      if (!employee) {
        errors.push({ field: 'salespersonName', message: `Không tìm thấy nhân viên "${importRow.salespersonName}"` });
      }
    }
    
    // Validate quantity
    if (importRow.quantity !== undefined) {
      const qty = Number(importRow.quantity);
      if (isNaN(qty) || qty <= 0) {
        errors.push({ field: 'quantity', message: 'Số lượng phải là số dương' });
      }
    }
    
    // Check duplicate order ID in existing data (only in insert-only mode)
    if (mode === 'insert-only' && importRow.orderId) {
      const duplicate = existingData.find(o => 
        o.id.toUpperCase() === importRow.orderId.toUpperCase()
      );
      if (duplicate) {
        errors.push({ field: 'orderId', message: `Mã đơn hàng "${importRow.orderId}" đã tồn tại` });
      }
    }
    
    return errors;
  },
  
  // Transform: Group rows by orderId and build Order objects
  // This is handled in postTransformRow and beforeImport
  beforeImport: async (data: Order[]) => {
    // data here is actually OrderImportRow[] after field transforms
    const importRows = data as unknown as OrderImportRow[];
    
    // Group rows by orderId
    const orderMap = new Map<string, {
      rows: OrderImportRow[];
      customer?: Customer;
      branch?: ReturnType<typeof findBranch>;
      employee?: ReturnType<typeof findEmployee>;
    }>();
    
    for (const row of importRows) {
      const orderId = row.orderId?.trim().toUpperCase();
      if (!orderId) continue;
      
      if (!orderMap.has(orderId)) {
        const customer = findCustomerById(row.customerId);
        const branch = row.branchName ? findBranch(row.branchName) : getDefaultBranch();
        const employee = row.salespersonName ? findEmployee(row.salespersonName) : undefined;
        
        orderMap.set(orderId, {
          rows: [],
          customer,
          branch,
          employee,
        });
      }
      orderMap.get(orderId)!.rows.push(row);
    }
    
    // Build Order objects
    const orders: Order[] = [];
    const now = new Date().toISOString();
    
    for (const [orderId, { rows, customer, branch, employee }] of orderMap.entries()) {
      if (!customer || rows.length === 0) continue;
      
      // Build line items
      const lineItems: LineItem[] = [];
      for (const row of rows) {
        const product = findProductBySku(row.productSku);
        if (!product) continue;
        
        const quantity = Math.max(1, Math.floor(Number(row.quantity) || 1));
        const unitPrice = row.unitPrice ?? product.sellingPrice ?? product.costPrice ?? 0;
        
        lineItems.push({
          productSystemId: product.systemId,
          productId: product.id,
          productName: product.name,
          quantity,
          unitPrice,
          discount: 0,
          discountType: 'fixed',
          note: row.lineNote,
        });
      }
      
      if (lineItems.length === 0) continue;
      
      // Calculate totals
      const subtotal = lineItems.reduce((sum, item) => {
        return sum + (item.unitPrice * item.quantity);
      }, 0);
      
      // Get first row for order-level data
      const firstRow = rows[0];
      
      // Parse order date
      let orderDate = now;
      if (firstRow.orderDate) {
        const parsed = new Date(firstRow.orderDate);
        if (!isNaN(parsed.getTime())) {
          orderDate = parsed.toISOString();
        }
      }
      
      // Build shipping address from customer
      const shippingAddress = getCustomerShippingAddress(customer);
      
      // Parse tags
      const tags = firstRow.tags 
        ? firstRow.tags.split(',').map(t => t.trim()).filter(Boolean)
        : undefined;
      
      const order: Order = {
        systemId: asSystemId(''), // Will be assigned by store
        id: asBusinessId(orderId),
        customerSystemId: customer.systemId,
        customerName: customer.name,
        branchSystemId: branch?.systemId || asSystemId(''),
        branchName: branch?.name || '',
        salespersonSystemId: employee?.systemId || asSystemId(''),
        salesperson: employee?.fullName || '',
        orderDate,
        
        // Statuses - all new orders start with "Đặt hàng"
        status: 'Đặt hàng',
        paymentStatus: 'Chưa thanh toán',
        deliveryStatus: 'Chờ đóng gói',
        printStatus: 'Chưa in',
        stockOutStatus: 'Chưa xuất kho',
        returnStatus: 'Chưa trả hàng',
        deliveryMethod: 'Dịch vụ giao hàng',
        
        // Address
        shippingAddress,
        
        // Line items
        lineItems,
        
        // Totals (no discount, no shipping fee from import)
        subtotal,
        shippingFee: 0,
        tax: 0,
        grandTotal: subtotal,
        paidAmount: 0,
        codAmount: 0,
        
        // Arrays
        payments: [],
        packagings: [],
        
        // Optional fields
        notes: firstRow.orderNote,
        source: firstRow.source,
        tags,
        
        // Timestamps
        createdAt: now,
        updatedAt: now,
      };
      
      orders.push(order);
    }
    
    return orders;
  },
};

// ============================================
// EXPORT HELPERS
// ============================================

/**
 * Flatten orders to rows for export (1 row per line item)
 */
export function flattenOrdersForExport(orders: Order[]): Array<Record<string, unknown>> {
  const rows: Array<Record<string, unknown>> = [];
  
  for (const order of orders) {
    // Get customer info
    const customer = useCustomerStore.getState().findById(order.customerSystemId);
    
    // Get latest packaging for tracking info
    const latestPackaging = order.packagings?.[order.packagings.length - 1];
    
    for (const item of order.lineItems) {
      rows.push({
        // Order info
        id: order.id,
        orderDate: order.orderDate,
        status: order.status,
        source: order.source || '',
        tags: order.tags?.join(', ') || '',
        notes: order.notes || '',
        
        // Customer info
        customerId: customer?.id || '',
        customerName: order.customerName,
        customerPhone: customer?.phone || '',
        shippingAddress: typeof order.shippingAddress === 'string' 
          ? order.shippingAddress 
          : (order.shippingAddress as OrderAddress)?.formattedAddress || '',
        
        // Product info
        productSku: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.unitPrice * item.quantity,
        lineNote: item.note || '',
        
        // Payment info
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        orderDiscount: order.orderDiscount || 0,
        grandTotal: order.grandTotal,
        paidAmount: order.paidAmount,
        paymentStatus: order.paymentStatus,
        
        // Delivery info
        deliveryMethod: order.deliveryMethod,
        deliveryStatus: order.deliveryStatus,
        trackingCode: latestPackaging?.trackingCode || '',
        carrier: latestPackaging?.carrier || '',
        
        // Branch & Staff
        branchName: order.branchName,
        salesperson: order.salesperson,
      });
    }
  }
  
  return rows;
}
