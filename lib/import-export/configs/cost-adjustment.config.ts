/**
 * Cost Adjustment Import/Export Configuration
 * 
 * Nhập/Xuất phiếu điều chỉnh giá vốn
 * 
 * FORMAT:
 * - Multi-line: 1 phiếu điều chỉnh có thể có nhiều dòng sản phẩm
 * - Các dòng cùng Mã phiếu sẽ được nhóm thành 1 phiếu
 */

import type { CostAdjustment, CostAdjustmentItem, CostAdjustmentStatus, CostAdjustmentType } from '@/features/cost-adjustments/types';
import type { ImportExportConfig, FieldConfig } from '../types';
import { useProductStore } from '@/features/products/store';
import { useEmployeeStore } from '@/features/employees/store';
import { asBusinessId, asSystemId } from '@/lib/id-types';

// ============================================
// HELPER FUNCTIONS
// ============================================

const getProductStore = () => useProductStore.getState();
const getEmployeeStore = () => useEmployeeStore.getState();

const findProduct = (identifier: string) => {
  if (!identifier) return undefined;
  const store = getProductStore();
  const normalized = identifier.trim().toUpperCase();
  
  const byId = store.data.find(p => p.id.toUpperCase() === normalized);
  if (byId) return byId;
  
  const bySku = store.data.find(p => p.sku?.toUpperCase() === normalized);
  return bySku;
};

const findEmployee = (name: string) => {
  if (!name) return undefined;
  const store = getEmployeeStore();
  const normalized = name.trim().toLowerCase();
  return store.data.find(e => e.fullName?.toLowerCase().includes(normalized));
};

// ============================================
// IMPORT ROW TYPE
// ============================================

interface CostAdjustmentImportRow {
  adjustmentId: string;
  type?: string;
  status?: string;
  createdDate?: string;
  createdByName?: string;
  reason?: string;
  note?: string;
  referenceCode?: string;
  // Line item
  productIdOrSku: string;
  productName?: string;
  oldCostPrice: number;
  newCostPrice: number;
  itemReason?: string;
}

// ============================================
// FIELD CONFIGURATION
// ============================================

export const costAdjustmentFields: FieldConfig<CostAdjustmentImportRow>[] = [
  // Phiếu điều chỉnh
  {
    key: 'adjustmentId',
    label: 'Mã phiếu (*)',
    type: 'string',
    required: true,
    example: 'DCGV001',
    group: 'Phiếu điều chỉnh',
    defaultSelected: true,
  },
  {
    key: 'type',
    label: 'Loại',
    type: 'string',
    required: false,
    example: 'manual',
    group: 'Phiếu điều chỉnh',
  },
  {
    key: 'status',
    label: 'Trạng thái',
    type: 'string',
    required: false,
    example: 'draft',
    group: 'Phiếu điều chỉnh',
  },
  {
    key: 'createdDate',
    label: 'Ngày tạo',
    type: 'string',
    required: false,
    example: '2024-01-15',
    group: 'Phiếu điều chỉnh',
    defaultSelected: true,
  },
  {
    key: 'createdByName',
    label: 'Người tạo',
    type: 'string',
    required: false,
    example: 'Nguyễn Văn A',
    group: 'Phiếu điều chỉnh',
  },
  {
    key: 'reason',
    label: 'Lý do chung',
    type: 'string',
    required: false,
    example: 'Cập nhật giá vốn theo thị trường',
    group: 'Phiếu điều chỉnh',
  },
  {
    key: 'note',
    label: 'Ghi chú',
    type: 'string',
    required: false,
    example: 'Điều chỉnh tháng 1/2024',
    group: 'Phiếu điều chỉnh',
  },
  {
    key: 'referenceCode',
    label: 'Mã tham chiếu',
    type: 'string',
    required: false,
    example: 'REF001',
    group: 'Phiếu điều chỉnh',
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
    key: 'oldCostPrice',
    label: 'Giá vốn cũ (*)',
    type: 'number',
    required: true,
    example: '100000',
    group: 'Sản phẩm',
    defaultSelected: true,
  },
  {
    key: 'newCostPrice',
    label: 'Giá vốn mới (*)',
    type: 'number',
    required: true,
    example: '120000',
    group: 'Sản phẩm',
    defaultSelected: true,
  },
  {
    key: 'itemReason',
    label: 'Lý do SP',
    type: 'string',
    required: false,
    example: 'Tăng giá nhập',
    group: 'Sản phẩm',
  },
];

// ============================================
// STATUS & TYPE MAPPING
// ============================================

const STATUS_MAP: Record<string, CostAdjustmentStatus> = {
  'draft': 'draft',
  'Nháp': 'draft',
  'confirmed': 'confirmed',
  'Đã xác nhận': 'confirmed',
  'Xác nhận': 'confirmed',
  'cancelled': 'cancelled',
  'Đã hủy': 'cancelled',
};

const TYPE_MAP: Record<string, CostAdjustmentType> = {
  'manual': 'manual',
  'Thủ công': 'manual',
  'import': 'import',
  'Từ đơn nhập': 'import',
  'batch': 'batch',
  'Hàng loạt': 'batch',
};

// ============================================
// MAIN CONFIG
// ============================================

export const costAdjustmentImportExportConfig: ImportExportConfig<CostAdjustment> = {
  entityType: 'cost-adjustments',
  entityDisplayName: 'Điều chỉnh giá vốn',
  
  fields: costAdjustmentFields as unknown as FieldConfig<CostAdjustment>[],
  
  templateFileName: 'Mau_Dieu_Chinh_Gia_Von.xlsx',
  sheetName: 'DieuChinhGiaVon',
  
  // Import settings
  upsertKey: 'id',
  allowUpdate: false,
  allowInsert: true,
  
  requirePreview: true,
  maxRows: 2000,
  maxErrorsAllowed: 0,
  
  // Fill-down for multi-line
  preProcessRows: (rows) => {
    let lastAdjustmentId = '';
    let lastType = '';
    let lastStatus = '';
    let lastCreatedDate = '';
    let lastCreatedBy = '';
    let lastReason = '';
    let lastNote = '';
    
    return rows.map((row: Record<string, unknown>) => {
      if (row.adjustmentId) {
        lastAdjustmentId = String(row.adjustmentId);
        lastType = String(row.type || '');
        lastStatus = String(row.status || '');
        lastCreatedDate = String(row.createdDate || '');
        lastCreatedBy = String(row.createdByName || '');
        lastReason = String(row.reason || '');
        lastNote = String(row.note || '');
      }
      
      return {
        ...row,
        adjustmentId: row.adjustmentId || lastAdjustmentId,
        type: row.type || lastType,
        status: row.status || lastStatus,
        createdDate: row.createdDate || lastCreatedDate,
        createdByName: row.createdByName || lastCreatedBy,
        reason: row.reason || lastReason,
        note: row.note || lastNote,
      };
    });
  },
  
  // Validate each row
  validateRow: (row, _index, existingData, mode) => {
    const errors: Array<{ field?: string; message: string }> = [];
    const importRow = row as unknown as CostAdjustmentImportRow;
    
    if (!importRow.adjustmentId) {
      errors.push({ field: 'adjustmentId', message: 'Mã phiếu không được để trống' });
    }
    
    if (!importRow.productIdOrSku) {
      errors.push({ field: 'productIdOrSku', message: 'Mã SP không được để trống' });
    }
    
    if (importRow.oldCostPrice === undefined || importRow.oldCostPrice < 0) {
      errors.push({ field: 'oldCostPrice', message: 'Giá vốn cũ không hợp lệ' });
    }
    
    if (importRow.newCostPrice === undefined || importRow.newCostPrice < 0) {
      errors.push({ field: 'newCostPrice', message: 'Giá vốn mới không hợp lệ' });
    }
    
    // Check duplicate
    if (mode === 'insert-only' && importRow.adjustmentId) {
      const duplicate = existingData.find(a => 
        a.id.toUpperCase() === importRow.adjustmentId.toUpperCase()
      );
      if (duplicate) {
        // Warning only - same adjustment can have multiple lines
      }
    }
    
    return errors;
  },
  
  // Transform: Group rows by adjustmentId and build CostAdjustment objects
  beforeImport: async (data: CostAdjustment[]) => {
    const importRows = data as unknown as CostAdjustmentImportRow[];
    
    // Group rows by adjustmentId
    const adjustmentMap = new Map<string, CostAdjustmentImportRow[]>();
    
    for (const row of importRows) {
      const adjustmentId = row.adjustmentId?.trim();
      if (!adjustmentId) continue;
      
      if (!adjustmentMap.has(adjustmentId)) {
        adjustmentMap.set(adjustmentId, []);
      }
      adjustmentMap.get(adjustmentId)!.push(row);
    }
    
    // Build CostAdjustment objects
    const adjustments: CostAdjustment[] = [];
    const now = new Date().toISOString();
    
    for (const [adjustmentId, rows] of adjustmentMap.entries()) {
      if (rows.length === 0) continue;
      
      const firstRow = rows[0];
      
      // Lookup creator
      const creator = findEmployee(firstRow.createdByName || '');
      
      // Build items
      const items: CostAdjustmentItem[] = [];
      for (const row of rows) {
        if (!row.productIdOrSku) continue;
        
        const product = findProduct(row.productIdOrSku || '');
        
        const oldCostPrice = Number(row.oldCostPrice) || 0;
        const newCostPrice = Number(row.newCostPrice) || 0;
        const adjustmentAmount = newCostPrice - oldCostPrice;
        const adjustmentPercent = oldCostPrice > 0 ? (adjustmentAmount / oldCostPrice) * 100 : 0;
        
        items.push({
          productSystemId: product?.systemId || asSystemId(''),
          productId: product?.id || row.productIdOrSku || '',
          productName: product?.name || row.productName || '',
          productImage: product?.images?.[0],
          oldCostPrice,
          newCostPrice,
          adjustmentAmount,
          adjustmentPercent: Math.round(adjustmentPercent * 100) / 100,
          reason: row.itemReason,
        });
      }
      
      if (items.length === 0) continue;
      
      // Map status and type
      const status = STATUS_MAP[firstRow.status || ''] || 'draft';
      const type = TYPE_MAP[firstRow.type || ''] || 'manual';
      
      // Build CostAdjustment object
      const adjustment: CostAdjustment = {
        systemId: asSystemId(''), // Will be generated
        id: asBusinessId(adjustmentId),
        
        type,
        status,
        items,
        
        note: firstRow.note,
        reason: firstRow.reason,
        referenceCode: firstRow.referenceCode,
        
        createdDate: firstRow.createdDate || now,
        createdBySystemId: creator?.systemId || asSystemId(''),
        createdByName: creator?.fullName || firstRow.createdByName || '',
        
        createdAt: now,
        updatedAt: now,
      };
      
      adjustments.push(adjustment);
    }
    
    return adjustments;
  },
};

// Flatten adjustments for export (multi-line per product)
export function flattenCostAdjustmentsForExport(adjustments: CostAdjustment[]): CostAdjustmentImportRow[] {
  const rows: CostAdjustmentImportRow[] = [];
  
  for (const adjustment of adjustments) {
    for (let i = 0; i < adjustment.items.length; i++) {
      const item = adjustment.items[i];
      rows.push({
        adjustmentId: i === 0 ? adjustment.id : '',
        type: i === 0 ? adjustment.type : '',
        status: i === 0 ? adjustment.status : '',
        createdDate: i === 0 ? adjustment.createdDate : '',
        createdByName: i === 0 ? adjustment.createdByName : '',
        reason: i === 0 ? adjustment.reason : '',
        note: i === 0 ? adjustment.note : '',
        referenceCode: i === 0 ? adjustment.referenceCode : '',
        productIdOrSku: item.productId,
        productName: item.productName,
        oldCostPrice: item.oldCostPrice,
        newCostPrice: item.newCostPrice,
        itemReason: item.reason,
      });
    }
  }
  
  return rows;
}
