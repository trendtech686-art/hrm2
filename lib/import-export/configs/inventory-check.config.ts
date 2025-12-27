/**
 * Inventory Check (Kiểm kê) Import/Export Configuration
 * 
 * Nhập/Xuất phiếu kiểm kê
 * 
 * FORMAT:
 * - Multi-line: 1 phiếu kiểm kê có thể có nhiều dòng sản phẩm
 * - Các dòng cùng Mã phiếu sẽ được nhóm thành 1 phiếu kiểm kê
 */

import type { 
  InventoryCheck, 
  InventoryCheckItem, 
  InventoryCheckStatus, 
  DifferenceReason 
} from '@/lib/types/prisma-extended';
import type { ImportExportConfig, FieldConfig } from '@/lib/import-export/types';
import { useProductStore } from '@/features/products/store';
import { useBranchStore } from '@/features/settings/branches/store';
import { useEmployeeStore } from '@/features/employees/store';
import { asBusinessId, asSystemId } from '@/lib/id-types';

// ============================================
// HELPER FUNCTIONS
// ============================================

const getProductStore = () => useProductStore.getState();
const getBranchStore = () => useBranchStore.getState();
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

const findBranch = (identifier: string) => {
  if (!identifier) return undefined;
  const store = getBranchStore();
  const normalized = identifier.trim().toLowerCase();
  
  const byId = store.data.find(b => b.id.toLowerCase() === normalized);
  if (byId) return byId;
  
  return store.data.find(b => b.name.toLowerCase().includes(normalized));
};

const getDefaultBranch = () => {
  const store = getBranchStore();
  return store.data.find(b => b.isDefault) || store.data[0];
};

// ============================================
// IMPORT ROW TYPE
// ============================================

interface InventoryCheckImportRow {
  checkId: string;
  branchIdOrName: string;
  status?: string;
  createdAt?: string;
  note?: string;
  // Line item
  productIdOrSku: string;
  productName?: string;
  unit?: string;
  systemQuantity: number;
  actualQuantity: number;
  reason?: string;
  itemNote?: string;
}

// ============================================
// FIELD CONFIGURATION
// ============================================

export const inventoryCheckFields: FieldConfig<InventoryCheckImportRow>[] = [
  // Phiếu kiểm kê
  {
    key: 'checkId',
    label: 'Mã phiếu (*)',
    type: 'string',
    required: true,
    example: 'PKK001',
    group: 'Phiếu kiểm kê',
    defaultSelected: true,
  },
  {
    key: 'branchIdOrName',
    label: 'Chi nhánh (*)',
    type: 'string',
    required: true,
    example: 'Chi nhánh chính',
    group: 'Phiếu kiểm kê',
    defaultSelected: true,
  },
  {
    key: 'status',
    label: 'Trạng thái',
    type: 'string',
    required: false,
    example: 'draft',
    group: 'Phiếu kiểm kê',
  },
  {
    key: 'createdAt',
    label: 'Ngày tạo',
    type: 'string',
    required: false,
    example: '2024-01-15',
    group: 'Phiếu kiểm kê',
    defaultSelected: true,
  },
  {
    key: 'note',
    label: 'Ghi chú',
    type: 'string',
    required: false,
    example: 'Kiểm kê định kỳ',
    group: 'Phiếu kiểm kê',
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
    key: 'unit',
    label: 'Đơn vị',
    type: 'string',
    required: false,
    example: 'Cái',
    group: 'Sản phẩm',
  },
  {
    key: 'systemQuantity',
    label: 'SL hệ thống (*)',
    type: 'number',
    required: true,
    example: '100',
    group: 'Sản phẩm',
    defaultSelected: true,
  },
  {
    key: 'actualQuantity',
    label: 'SL thực tế (*)',
    type: 'number',
    required: true,
    example: '98',
    group: 'Sản phẩm',
    defaultSelected: true,
  },
  {
    key: 'reason',
    label: 'Lý do chênh lệch',
    type: 'string',
    required: false,
    example: 'damaged',
    group: 'Sản phẩm',
  },
  {
    key: 'itemNote',
    label: 'Ghi chú SP',
    type: 'string',
    required: false,
    example: 'Hư hỏng do vận chuyển',
    group: 'Sản phẩm',
  },
];

// ============================================
// STATUS & REASON MAPPING
// ============================================

const STATUS_MAP: Record<string, InventoryCheckStatus> = {
  'DRAFT': 'draft',
  'draft': 'draft',
  'Nháp': 'draft',
  'IN_PROGRESS': 'in_progress',
  'in_progress': 'in_progress',
  'Đang kiểm': 'in_progress',
  'COMPLETED': 'completed',
  'completed': 'completed',
  'balanced': 'completed',
  'Cân bằng': 'completed',
  'Đã cân bằng': 'completed',
  'Hoàn thành': 'completed',
  'CANCELLED': 'cancelled',
  'cancelled': 'cancelled',
  'Đã hủy': 'cancelled',
};

const REASON_MAP: Record<string, DifferenceReason> = {
  'other': 'other',
  'Khác': 'other',
  'damaged': 'damaged',
  'Hư hỏng': 'damaged',
  'wear': 'wear',
  'Hao mòn': 'wear',
  'return': 'return',
  'Trả hàng': 'return',
  'transfer': 'transfer',
  'Chuyển hàng': 'transfer',
  'production': 'production',
  'Sản xuất': 'production',
};

// ============================================
// MAIN CONFIG
// ============================================

export const inventoryCheckImportExportConfig: ImportExportConfig<InventoryCheck> = {
  entityType: 'inventory-checks',
  entityDisplayName: 'Phiếu kiểm kê',
  
  fields: inventoryCheckFields as unknown as FieldConfig<InventoryCheck>[],
  
  templateFileName: 'Mau_Kiem_Ke.xlsx',
  sheetName: 'KiemKe',
  
  // Import settings
  upsertKey: 'id',
  allowUpdate: false,
  allowInsert: true,
  
  requirePreview: true,
  maxRows: 5000,
  maxErrorsAllowed: 0,
  
  // Fill-down for multi-line
  preProcessRows: (rows) => {
    let lastCheckId = '';
    let lastBranch = '';
    let lastStatus = '';
    let lastCreatedAt = '';
    let lastNote = '';
    
    return rows.map((row: Record<string, unknown>) => {
      if (row.checkId) {
        lastCheckId = String(row.checkId);
        lastBranch = String(row.branchIdOrName || '');
        lastStatus = String(row.status || '');
        lastCreatedAt = String(row.createdAt || '');
        lastNote = String(row.note || '');
      }
      
      return {
        ...row,
        checkId: row.checkId || lastCheckId,
        branchIdOrName: row.branchIdOrName || lastBranch,
        status: row.status || lastStatus,
        createdAt: row.createdAt || lastCreatedAt,
        note: row.note || lastNote,
      };
    });
  },
  
  // Validate each row
  validateRow: (row, _index, existingData, mode) => {
    const errors: Array<{ field?: string; message: string }> = [];
    const importRow = row as unknown as InventoryCheckImportRow;
    
    if (!importRow.checkId) {
      errors.push({ field: 'checkId', message: 'Mã phiếu không được để trống' });
    }
    
    if (!importRow.branchIdOrName) {
      errors.push({ field: 'branchIdOrName', message: 'Chi nhánh không được để trống' });
    }
    
    if (!importRow.productIdOrSku) {
      errors.push({ field: 'productIdOrSku', message: 'Mã SP không được để trống' });
    }
    
    if (importRow.systemQuantity === undefined || importRow.systemQuantity < 0) {
      errors.push({ field: 'systemQuantity', message: 'SL hệ thống không hợp lệ' });
    }
    
    if (importRow.actualQuantity === undefined || importRow.actualQuantity < 0) {
      errors.push({ field: 'actualQuantity', message: 'SL thực tế không hợp lệ' });
    }
    
    // Check duplicate
    if (mode === 'insert-only' && importRow.checkId) {
      const duplicate = existingData.find(c => 
        c.id.toUpperCase() === importRow.checkId.toUpperCase()
      );
      if (duplicate) {
        // Warning only - same check can have multiple lines
      }
    }
    
    return errors;
  },
  
  // Transform: Group rows by checkId and build InventoryCheck objects
  beforeImport: async (data: InventoryCheck[]) => {
    const importRows = data as unknown as InventoryCheckImportRow[];
    
    // Group rows by checkId
    const checkMap = new Map<string, InventoryCheckImportRow[]>();
    
    for (const row of importRows) {
      const checkId = row.checkId?.trim();
      if (!checkId) continue;
      
      if (!checkMap.has(checkId)) {
        checkMap.set(checkId, []);
      }
      checkMap.get(checkId)!.push(row);
    }
    
    // Build InventoryCheck objects
    const checks: InventoryCheck[] = [];
    const now = new Date().toISOString();
    const defaultBranch = getDefaultBranch();
    
    for (const [checkId, rows] of checkMap.entries()) {
      if (rows.length === 0) continue;
      
      const firstRow = rows[0];
      
      // Lookup branch
      const branch = findBranch(firstRow.branchIdOrName || '') || defaultBranch;
      
      if (!branch) continue;
      
      // Build items
      const items: InventoryCheckItem[] = [];
      for (const row of rows) {
        if (!row.productIdOrSku) continue;
        
        const product = findProduct(row.productIdOrSku || '');
        
        const systemQuantity = Math.max(0, Math.floor(Number(row.systemQuantity) || 0));
        const actualQuantity = Math.max(0, Math.floor(Number(row.actualQuantity) || 0));
        const difference = actualQuantity - systemQuantity;
        
        items.push({
          productSystemId: product?.systemId || asSystemId(''),
          productId: asBusinessId(product?.id || row.productIdOrSku || ''),
          productName: product?.name || row.productName || '',
          unit: product?.unit || row.unit || '',
          systemQuantity,
          actualQuantity,
          difference,
          reason: REASON_MAP[row.reason || ''] || (difference !== 0 ? 'other' : undefined),
          note: row.itemNote,
        });
      }
      
      if (items.length === 0) continue;
      
      // Map status
      const status = STATUS_MAP[firstRow.status || ''] || 'draft';
      
      // Build InventoryCheck object
      const check: InventoryCheck = {
        systemId: asSystemId(''), // Will be generated
        id: asBusinessId(checkId),
        
        branchSystemId: branch.systemId,
        branchName: branch.name,
        
        status,
        items,
        
        createdBy: asSystemId(''),
        createdAt: firstRow.createdAt || now,
        note: firstRow.note,
      };
      
      checks.push(check);
    }
    
    return checks;
  },
};

// Flatten checks for export (multi-line per product)
export function flattenInventoryChecksForExport(checks: InventoryCheck[]): InventoryCheckImportRow[] {
  const rows: InventoryCheckImportRow[] = [];
  
  for (const check of checks) {
    for (let i = 0; i < check.items.length; i++) {
      const item = check.items[i];
      rows.push({
        checkId: i === 0 ? check.id : '',
        branchIdOrName: i === 0 ? check.branchName : '',
        status: i === 0 ? check.status : '',
        createdAt: i === 0 ? (check.createdAt instanceof Date ? check.createdAt.toISOString() : check.createdAt || '') : '',
        note: i === 0 ? check.note : '',
        productIdOrSku: item.productId,
        productName: item.productName,
        unit: item.unit,
        systemQuantity: item.systemQuantity,
        actualQuantity: item.actualQuantity,
        reason: item.reason,
        itemNote: item.note,
      });
    }
  }
  
  return rows;
}
