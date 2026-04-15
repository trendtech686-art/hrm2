/**
 * Purchase Order Sapo Import Configuration
 * 
 * Import đơn nhập hàng từ file export của Sapo POS
 * 
 * FORMAT FILE SAPO:
 * - Multi-line: 1 đơn nhập hàng có thể có nhiều dòng sản phẩm
 * - Các dòng cùng "Mã đơn nhập hàng" sẽ được nhóm thành 1 đơn nhập hàng
 * - Header row 8, data from row 9
 * - Duplicate columns: Tham chiếu, Ngày tạo, Nhân viên tạo, Mã SKU, Chi phí, Thuế, Phương thức thanh toán
 */

import type { ImportExportConfig, FieldConfig } from '@/lib/import-export/types';
import { parseSapoExcelFile } from '@/lib/import-export/sapo-excel-parser';

// ============================================
// SAPO COLUMN MAPPING (Vietnamese header → internal key)
// ============================================

export const SAPO_PO_COLUMN_MAP: Record<string, string> = {
  // Đơn nhập hàng
  'STT': 'stt',
  'Mã đơn nhập hàng': 'purchaseOrderId',
  'Mã đơn đặt hàng': 'linkedOrderId',
  'Ngày hẹn giao': 'expectedDate',
  'Ngày tạo': 'orderDate',
  'Ngày nhập': 'receivedDate',
  'Ngày huỷ': 'cancelDate',
  'Ngày kết thúc': 'completedDate',
  'Trạng thái': 'status',
  'Trạng thái nhập': 'deliveryStatus',
  'Chi nhánh tạo đơn': 'branchName',
  'Tên nhà cung cấp': 'supplierName',
  'Mã nhà cung cấp': 'supplierId',
  'SĐT nhà cung cấp': 'supplierPhone',
  'Địa chỉ nhà cung cấp': 'supplierAddress',
  'Email nhà cung cấp': 'supplierEmail',
  'Nhân viên tạo': 'creatorName',
  'Nhân viên nhập': 'receiverName',
  'Nhân viên huỷ': 'cancellerName',
  'Nhân viên kết thúc': 'completerName',
  'Ghi chú đơn': 'notes',
  'Tags': 'tags',
  'Tham chiếu': 'reference',
  'Tổng SL nhập': 'totalQuantity',
  'Tổng tiền': 'subtotal',
  'Tổng chiết khấu đơn': 'discount',
  'Chi phí': 'shippingFee',
  'Tổng thuế': 'tax',
  'Tiền cần trả': 'grandTotal',

  // Sản phẩm nhập
  'Mã SKU': 'productSku',
  'Tên phiên bản sản phẩm': 'productName',
  'Mã Barcode': 'barcode',
  'Đơn vị tính': 'unit',
  'Ghi chú sản phẩm': 'productNote',
  'SL nhập': 'quantity',
  'Đơn giá': 'unitPrice',
  'Chiết khấu sản phẩm': 'lineDiscount',
  'Thuế': 'lineTax',
  'Áp dụng thuế': 'taxType',
  'Serials / IMEI': 'serial',
  'Mã lô': 'batchCode',
  'Ngày sản xuất': 'manufactureDate',
  'Ngày hết hạn': 'expiryDate',
  'Thành tiền': 'lineTotal',

  // Thanh toán
  'Trạng thái thanh toán': 'paymentStatus',
  'Ngày tạo thanh toán': 'paymentDate',
  'Ngày ghi nhận': 'paymentRecognitionDate',
  'Nhân viên thanh toán': 'paymentEmployee',
  'Phương thức thanh toán': 'paymentMethod',
  'Số tiền thanh toán': 'paymentAmount',
  'Tham chiếu_2': 'paymentReference',

  // Đơn trả hàng (duplicate column names get _2 suffix from parser)
  'Mã đơn trả hàng': 'returnOrderId',
  'Ngày tạo_2': 'returnCreatedDate',
  'Ngày trả hàng': 'returnDate',
  'Nhân viên tạo_2': 'returnCreator',
  'Tên sản phẩm': 'returnProductName',
  'Mã SKU_2': 'returnProductSku',
  'Số lượng hàng trả': 'returnQuantity',
  'Đơn giá trả': 'returnUnitPrice',
  'Chi phí_2': 'returnCost',
  'Thuế_2': 'returnTax',
  'Chiết khấu': 'returnDiscount',
  'Tổng giá trị hàng trả': 'returnTotalValue',
  'Số tiền nhận lại': 'returnRefundAmount',
  'Phương thức thanh toán_2': 'returnPaymentMethod',
};

// ============================================
// STATUS MAPS
// ============================================

const SAPO_PO_STATUS_MAP: Record<string, string> = {
  'Đặt hàng': 'Đặt hàng',
  'Đang giao dịch': 'Đang giao dịch',
  'Hoàn thành': 'Hoàn thành',
  'Kết thúc': 'Hoàn thành',
  'Đã hủy': 'Đã hủy',
};

const SAPO_PO_DELIVERY_STATUS_MAP: Record<string, string> = {
  'Đã nhập': 'Đã nhập',
  'Chưa nhập': 'Chưa nhập',
  'Nhập một phần': 'Nhập một phần',
};

const SAPO_PO_PAYMENT_STATUS_MAP: Record<string, string> = {
  'Đã thanh toán': 'Đã thanh toán',
  'Thanh toán một phần': 'Thanh toán một phần',
  'Chưa thanh toán': 'Chưa thanh toán',
};

// ============================================
// HELPERS
// ============================================

function parseSapoDate(dateStr?: string | null): string | undefined {
  if (!dateStr) return undefined;
  // "20/03/2026 15:18" → ISO string
  const match = String(dateStr).match(/^(\d{2})\/(\d{2})\/(\d{4})\s*(\d{2}:\d{2})?/);
  if (match) {
    const [, dd, mm, yyyy, time] = match;
    return `${yyyy}-${mm}-${dd}T${time || '00:00'}:00.000Z`;
  }
  // Already ISO-ish
  const d = new Date(String(dateStr));
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

// ============================================
// IMPORT ROW TYPE
// ============================================

interface SapoPOImportRow {
  stt?: number;
  purchaseOrderId: string;
  linkedOrderId?: string;
  expectedDate?: string;
  orderDate?: string;
  receivedDate?: string;
  cancelDate?: string;
  completedDate?: string;
  status?: string;
  deliveryStatus?: string;
  branchName?: string;
  supplierName?: string;
  supplierId?: string;
  supplierPhone?: string;
  supplierAddress?: string;
  supplierEmail?: string;
  creatorName?: string;
  receiverName?: string;
  cancellerName?: string;
  completerName?: string;
  notes?: string;
  tags?: string;
  reference?: string;
  totalQuantity?: number;
  subtotal?: number;
  discount?: number;
  shippingFee?: number;
  tax?: number;
  grandTotal?: number;
  // Product
  productSku?: string;
  productName?: string;
  barcode?: string;
  unit?: string;
  productNote?: string;
  quantity?: number;
  unitPrice?: number;
  lineDiscount?: number;
  lineTax?: number;
  taxType?: string;
  serial?: string;
  batchCode?: string;
  manufactureDate?: string;
  expiryDate?: string;
  lineTotal?: number;
  // Payment
  paymentStatus?: string;
  paymentDate?: string;
  paymentRecognitionDate?: string;
  paymentEmployee?: string;
  paymentMethod?: string;
  paymentAmount?: number;
  paymentReference?: string;
  // Return
  returnOrderId?: string;
  returnCreatedDate?: string;
  returnDate?: string;
  returnCreator?: string;
  returnProductName?: string;
  returnProductSku?: string;
  returnQuantity?: number;
  returnUnitPrice?: number;
  returnCost?: number;
  returnTax?: number;
  returnDiscount?: number;
  returnTotalValue?: number;
  returnRefundAmount?: number;
  returnPaymentMethod?: string;
}

// ============================================
// FIELD CONFIG
// ============================================

const sapoPOFields: FieldConfig<SapoPOImportRow>[] = [
  // Visible fields
  { key: 'purchaseOrderId', label: 'Mã đơn nhập (*)', type: 'string', required: true, example: 'PON00754', group: 'Đơn nhập hàng', defaultSelected: true },
  { key: 'supplierName', label: 'Tên NCC', type: 'string', required: false, example: 'Bình', group: 'Đơn nhập hàng', defaultSelected: true },
  { key: 'supplierId', label: 'Mã NCC', type: 'string', required: false, example: 'SUPN00009', group: 'Đơn nhập hàng', defaultSelected: true },
  { key: 'branchName', label: 'Chi nhánh', type: 'string', required: false, example: 'Chi nhánh mặc định', group: 'Đơn nhập hàng', defaultSelected: true },
  { key: 'status', label: 'Trạng thái', type: 'string', required: false, example: 'Đang giao dịch', group: 'Đơn nhập hàng', defaultSelected: true },
  { key: 'productSku', label: 'Mã SKU (*)', type: 'string', required: true, example: 'CA5', group: 'Sản phẩm', defaultSelected: true },
  { key: 'productName', label: 'Tên sản phẩm', type: 'string', required: false, example: 'Giá đỡ điện thoại', group: 'Sản phẩm', defaultSelected: true },
  { key: 'quantity', label: 'SL nhập (*)', type: 'number', required: true, example: '50', group: 'Sản phẩm', defaultSelected: true },
  { key: 'unitPrice', label: 'Đơn giá (*)', type: 'number', required: true, example: '50500', group: 'Sản phẩm', defaultSelected: true },
  { key: 'lineTotal', label: 'Thành tiền', type: 'number', required: false, example: '2525000', group: 'Sản phẩm', defaultSelected: true },
  { key: 'grandTotal', label: 'Tiền cần trả', type: 'number', required: false, example: '2727000', group: 'Đơn nhập hàng', defaultSelected: true },
  // Hidden fields (processed but not shown in preview)
  { key: 'stt', label: 'STT', type: 'number', hidden: true },
  { key: 'linkedOrderId', label: 'Mã đơn đặt hàng', type: 'string', hidden: true },
  { key: 'expectedDate', label: 'Ngày hẹn giao', type: 'string', hidden: true },
  { key: 'orderDate', label: 'Ngày tạo', type: 'string', hidden: true },
  { key: 'receivedDate', label: 'Ngày nhập', type: 'string', hidden: true },
  { key: 'cancelDate', label: 'Ngày huỷ', type: 'string', hidden: true },
  { key: 'completedDate', label: 'Ngày kết thúc', type: 'string', hidden: true },
  { key: 'deliveryStatus', label: 'Trạng thái nhập', type: 'string', hidden: true },
  { key: 'supplierPhone', label: 'SĐT nhà cung cấp', type: 'string', hidden: true },
  { key: 'supplierAddress', label: 'Địa chỉ nhà cung cấp', type: 'string', hidden: true },
  { key: 'supplierEmail', label: 'Email nhà cung cấp', type: 'string', hidden: true },
  { key: 'creatorName', label: 'Nhân viên tạo', type: 'string', hidden: true },
  { key: 'receiverName', label: 'Nhân viên nhập', type: 'string', hidden: true },
  { key: 'cancellerName', label: 'Nhân viên huỷ', type: 'string', hidden: true },
  { key: 'completerName', label: 'Nhân viên kết thúc', type: 'string', hidden: true },
  { key: 'notes', label: 'Ghi chú đơn', type: 'string', hidden: true },
  { key: 'tags', label: 'Tags', type: 'string', hidden: true },
  { key: 'reference', label: 'Tham chiếu', type: 'string', hidden: true },
  { key: 'totalQuantity', label: 'Tổng SL nhập', type: 'number', hidden: true },
  { key: 'subtotal', label: 'Tổng tiền', type: 'number', hidden: true },
  { key: 'discount', label: 'Tổng chiết khấu đơn', type: 'number', hidden: true },
  { key: 'shippingFee', label: 'Chi phí', type: 'number', hidden: true },
  { key: 'tax', label: 'Tổng thuế', type: 'number', hidden: true },
  { key: 'barcode', label: 'Mã Barcode', type: 'string', hidden: true },
  { key: 'unit', label: 'Đơn vị tính', type: 'string', hidden: true },
  { key: 'productNote', label: 'Ghi chú sản phẩm', type: 'string', hidden: true },
  { key: 'lineDiscount', label: 'Chiết khấu sản phẩm', type: 'number', hidden: true },
  { key: 'lineTax', label: 'Thuế SP', type: 'number', hidden: true },
  { key: 'taxType', label: 'Áp dụng thuế', type: 'string', hidden: true },
  { key: 'serial', label: 'Serials / IMEI', type: 'string', hidden: true },
  { key: 'batchCode', label: 'Mã lô', type: 'string', hidden: true },
  { key: 'manufactureDate', label: 'Ngày sản xuất', type: 'string', hidden: true },
  { key: 'expiryDate', label: 'Ngày hết hạn', type: 'string', hidden: true },
  { key: 'paymentStatus', label: 'Trạng thái thanh toán', type: 'string', hidden: true },
  { key: 'paymentDate', label: 'Ngày tạo thanh toán', type: 'string', hidden: true },
  { key: 'paymentRecognitionDate', label: 'Ngày ghi nhận', type: 'string', hidden: true },
  { key: 'paymentEmployee', label: 'Nhân viên thanh toán', type: 'string', hidden: true },
  { key: 'paymentMethod', label: 'Phương thức thanh toán', type: 'string', hidden: true },
  { key: 'paymentAmount', label: 'Số tiền thanh toán', type: 'number', hidden: true },
  { key: 'paymentReference' as keyof SapoPOImportRow, label: 'Tham chiếu TT', type: 'string', hidden: true },
  // Return fields
  { key: 'returnOrderId' as keyof SapoPOImportRow, label: 'Mã đơn trả hàng', type: 'string', hidden: true },
  { key: 'returnCreatedDate' as keyof SapoPOImportRow, label: 'Ngày tạo trả hàng', type: 'string', hidden: true },
  { key: 'returnDate' as keyof SapoPOImportRow, label: 'Ngày trả hàng', type: 'string', hidden: true },
  { key: 'returnCreator' as keyof SapoPOImportRow, label: 'NV tạo trả hàng', type: 'string', hidden: true },
  { key: 'returnProductName' as keyof SapoPOImportRow, label: 'Tên SP trả', type: 'string', hidden: true },
  { key: 'returnProductSku' as keyof SapoPOImportRow, label: 'Mã SKU trả', type: 'string', hidden: true },
  { key: 'returnQuantity' as keyof SapoPOImportRow, label: 'SL hàng trả', type: 'number', hidden: true },
  { key: 'returnUnitPrice' as keyof SapoPOImportRow, label: 'Đơn giá trả', type: 'number', hidden: true },
  { key: 'returnCost' as keyof SapoPOImportRow, label: 'Chi phí trả', type: 'number', hidden: true },
  { key: 'returnTax' as keyof SapoPOImportRow, label: 'Thuế trả', type: 'number', hidden: true },
  { key: 'returnDiscount' as keyof SapoPOImportRow, label: 'Chiết khấu trả', type: 'number', hidden: true },
  { key: 'returnTotalValue' as keyof SapoPOImportRow, label: 'Tổng giá trị hàng trả', type: 'number', hidden: true },
  { key: 'returnRefundAmount' as keyof SapoPOImportRow, label: 'Số tiền nhận lại', type: 'number', hidden: true },
  { key: 'returnPaymentMethod' as keyof SapoPOImportRow, label: 'PT thanh toán trả', type: 'string', hidden: true },
];

// ============================================
// EXPORT CONFIG
// ============================================

// Output type from beforeImport — flat PO object for batch API
export interface SapoPOImportOutput {
  id: string;
  supplierId?: string;
  supplierName?: string;
  branchName?: string;
  branchSystemId?: string;
  buyerName?: string;
  creatorName?: string;
  orderDate?: string;
  expectedDate?: string;
  receivedDate?: string;
  deliveryDate?: string;
  status?: string;
  deliveryStatus?: string;
  paymentStatus?: string;
  subtotal?: number;
  shippingFee?: number;
  discount?: number;
  tax?: number;
  total?: number;
  grandTotal?: number;
  paid?: number;
  debt?: number;
  notes?: string;
  reference?: string;
  createdAt?: string;
  lineItems: Array<{
    productSku?: string;
    productName?: string;
    barcode?: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    total?: number;
    receivedQty?: number;
  }>;
  payments: Array<{
    method?: string;
    amount?: number;
    date?: string;
    description?: string;
    reference?: string;
  }>;
  returns: Array<{
    returnOrderId: string;
    returnDate?: string;
    createdDate?: string;
    creatorName?: string;
    items: Array<{
      productSku?: string;
      productName?: string;
      quantity: number;
      unitPrice: number;
      cost?: number;
      tax?: number;
      discount?: number;
      totalValue?: number;
    }>;
    totalReturnValue?: number;
    refundAmount?: number;
    refundMethod?: string;
  }>;
  _importOptions?: {
    autoCreateSupplier?: boolean;
    autoCreateProduct?: boolean;
  };
}

export const sapoPurchaseOrderImportConfig: ImportExportConfig<SapoPOImportRow> = {
  entityType: 'purchase-orders',
  entityDisplayName: 'Đơn nhập hàng (Sapo)',
  templateFileName: 'danhsachdonnhap.xlsx',
  fields: sapoPOFields,

  // Import options (checkboxes shown in upload step)
  importOptions: [
    {
      key: 'autoCreateSupplier',
      label: 'Tự động tạo nhà cung cấp mới',
      description: 'Nếu mã NCC/tên NCC không tìm thấy trong hệ thống, tự động tạo nhà cung cấp mới',
      defaultValue: true,
    },
    {
      key: 'autoCreateProduct',
      label: 'Tự động tạo sản phẩm mới',
      description: 'Nếu mã hàng/tên hàng không tìm thấy trong hệ thống, tự động tạo sản phẩm mới',
      defaultValue: true,
    },
  ],
  
  // Server-side Excel parsing (for large Sapo files)
  parseFile: parseSapoExcelFile,

  // Map Sapo Vietnamese columns → internal keys
  preTransformRawRow: (rawRow) => {
    const result: Record<string, unknown> = {};
    for (const [sapoCol, value] of Object.entries(rawRow)) {
      const internalKey = SAPO_PO_COLUMN_MAP[sapoCol];
      if (internalKey) {
        result[internalKey] = value;
      } else {
        result[sapoCol] = value;
      }
    }
    return result;
  },

  // Validate each row
  validateRow: (row, _index, existingData, mode) => {
    const errors: Array<{ field?: string; message: string }> = [];
    const importRow = row as unknown as SapoPOImportRow;

    if (!importRow.purchaseOrderId) {
      errors.push({ field: 'purchaseOrderId', message: 'Mã đơn nhập hàng không được để trống' });
    }
    if (!importRow.productSku && !importRow.productName) {
      errors.push({ field: 'productSku', message: 'Mã SKU hoặc tên sản phẩm không được để trống' });
    }
    if (importRow.quantity !== undefined && importRow.quantity <= 0) {
      errors.push({ field: 'quantity', message: 'Số lượng phải lớn hơn 0' });
    }
    // Duplicate check
    if (mode === 'insert-only' && importRow.purchaseOrderId) {
      const existing = existingData as unknown as Array<{ id?: string }>;
      const duplicate = existing.find(o =>
        o.id?.toUpperCase() === importRow.purchaseOrderId.toUpperCase()
      );
      if (duplicate) {
        errors.push({ field: 'purchaseOrderId', message: `[Warning] Mã đơn "${importRow.purchaseOrderId}" đã tồn tại - sẽ bỏ qua` });
      }
    }
    return errors;
  },

  findExisting: (row, existingData) => {
    const importRow = row as unknown as SapoPOImportRow;
    const existing = existingData as unknown as Array<{ id?: string }>;
    return (existing.find(o =>
      o.id?.toUpperCase() === importRow.purchaseOrderId?.toUpperCase()
    ) as unknown as SapoPOImportRow) || null;
  },

  computePreviewStats: (previewRows) => {
    const uniquePOs = new Set(previewRows.map(r => (r as unknown as SapoPOImportRow).purchaseOrderId).filter(Boolean));
    const totalValue = [...uniquePOs].reduce((sum, poId) => {
      const firstRow = previewRows.find(r => (r as unknown as SapoPOImportRow).purchaseOrderId === poId);
      return sum + (Number((firstRow as unknown as SapoPOImportRow)?.grandTotal) || 0);
    }, 0);
    return {
      stats: [
        { label: 'Đơn nhập hàng', value: uniquePOs.size },
        { label: 'Dòng sản phẩm', value: previewRows.length },
        { label: 'Tổng giá trị', value: new Intl.NumberFormat('vi-VN').format(totalValue) + 'đ' },
      ],
    };
  },

  /**
   * beforeImport: Group multi-line rows into PurchaseOrder objects
   * Same pattern as order-sapo.config.ts
   */
  beforeImport: async (rows: SapoPOImportRow[], context?: Record<string, unknown>) => {
    const currentUser = context?.currentUser as { systemId: string; name: string } | undefined;
    const importOptions = (context?.importOptions || {}) as { autoCreateSupplier?: boolean; autoCreateProduct?: boolean };
    const now = new Date().toISOString();

    // Group rows by PO ID
    const grouped = new Map<string, SapoPOImportRow[]>();
    for (const row of rows) {
      const r = row as unknown as SapoPOImportRow;
      const poId = r.purchaseOrderId;
      if (!poId) continue;
      const group = grouped.get(poId) || [];
      group.push(r);
      grouped.set(poId, group);
    }

    const purchaseOrders: SapoPOImportOutput[] = [];

    for (const [poId, groupRows] of grouped) {
      const firstRow = groupRows[0];

      // Build line items
      const lineItems: SapoPOImportOutput['lineItems'] = [];
      for (const row of groupRows) {
        const quantity = Number(row.quantity) || 0;
        const unitPrice = Number(row.unitPrice) || 0;
        const discount = Number(row.lineDiscount) || 0;
        if (quantity <= 0) continue;

        lineItems.push({
          productSku: row.productSku || row.barcode || '',
          productName: row.productName || row.productSku || '',
          barcode: row.barcode,
          quantity,
          unitPrice,
          discount,
          total: Number(row.lineTotal) || (quantity * unitPrice - discount),
          receivedQty: firstRow.deliveryStatus === 'Đã nhập' ? quantity : 0,
        });
      }

      if (lineItems.length === 0) continue;

      // Calculate totals
      const subtotal = Number(firstRow.subtotal) || lineItems.reduce((sum, li) => sum + (li.total || 0), 0);
      const shippingFee = Number(firstRow.shippingFee) || 0;
      const discount = Number(firstRow.discount) || 0;
      const tax = Number(firstRow.tax) || 0;
      const grandTotal = Number(firstRow.grandTotal) || (subtotal + shippingFee + tax - discount);

      // Collect all payment rows (multiple payments possible)
      const payments: SapoPOImportOutput['payments'] = [];
      for (const row of groupRows) {
        const payAmount = Number(row.paymentAmount) || 0;
        if (payAmount > 0) {
          payments.push({
            method: row.paymentMethod || 'Tiền mặt',
            amount: payAmount,
            date: parseSapoDate(row.paymentDate) || parseSapoDate(firstRow.orderDate) || now,
            description: 'Thanh toán từ Sapo',
            reference: row.paymentReference,
          });
        }
      }

      // Collect return data (group by returnOrderId)
      const returnsMap = new Map<string, SapoPOImportOutput['returns'][0]>();
      for (const row of groupRows) {
        const retId = row.returnOrderId;
        if (!retId) continue;
        let ret = returnsMap.get(retId);
        if (!ret) {
          ret = {
            returnOrderId: retId,
            returnDate: parseSapoDate(row.returnDate),
            createdDate: parseSapoDate(row.returnCreatedDate),
            creatorName: row.returnCreator,
            items: [],
            totalReturnValue: Number(row.returnTotalValue) || 0,
            refundAmount: Number(row.returnRefundAmount) || 0,
            refundMethod: row.returnPaymentMethod,
          };
          returnsMap.set(retId, ret);
        }
        const retQty = Number(row.returnQuantity) || 0;
        if (retQty > 0) {
          ret.items.push({
            productSku: row.returnProductSku,
            productName: row.returnProductName,
            quantity: retQty,
            unitPrice: Number(row.returnUnitPrice) || 0,
            cost: Number(row.returnCost) || 0,
            tax: Number(row.returnTax) || 0,
            discount: Number(row.returnDiscount) || 0,
            totalValue: Number(row.returnTotalValue) || 0,
          });
        }
      }
      const returns = [...returnsMap.values()];
      const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

      // Map statuses
      const status = SAPO_PO_STATUS_MAP[firstRow.status || ''] || 'Đặt hàng';
      const deliveryStatus = SAPO_PO_DELIVERY_STATUS_MAP[firstRow.deliveryStatus || ''] || 'Chưa nhập';
      const paymentStatus = SAPO_PO_PAYMENT_STATUS_MAP[firstRow.paymentStatus || ''] || 
        (totalPaid >= grandTotal && totalPaid > 0 ? 'Đã thanh toán' : totalPaid > 0 ? 'Thanh toán một phần' : 'Chưa thanh toán');

      const po: SapoPOImportOutput = {
        id: poId,

        // Supplier
        supplierId: firstRow.supplierId || '',
        supplierName: firstRow.supplierName || '',

        // Branch
        branchName: firstRow.branchName || '',

        // Creator
        buyerName: firstRow.creatorName || currentUser?.name || '',
        creatorName: firstRow.creatorName || currentUser?.name || '',

        // Dates
        orderDate: parseSapoDate(firstRow.orderDate) || now,
        expectedDate: parseSapoDate(firstRow.expectedDate),
        receivedDate: parseSapoDate(firstRow.receivedDate),
        deliveryDate: parseSapoDate(firstRow.receivedDate),
        createdAt: parseSapoDate(firstRow.orderDate) || now,

        // Line items
        lineItems,

        // Totals
        subtotal,
        shippingFee,
        discount,
        tax,
        total: subtotal,
        grandTotal,
        paid: totalPaid,
        debt: Math.max(0, grandTotal - totalPaid),

        // Statuses
        status,
        deliveryStatus,
        paymentStatus,

        // Other
        notes: firstRow.notes,
        reference: firstRow.reference || firstRow.linkedOrderId,

        // Payments
        payments,

        // Returns
        returns,

        // Import options (passed through to batch API)
        _importOptions: importOptions,
      };

      purchaseOrders.push(po);
    }

    return purchaseOrders as unknown as SapoPOImportRow[];
  },
};
