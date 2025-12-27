/**
 * Stock Transfer Import/Export Configuration
 * 
 * Nhập/Xuất phiếu chuyển kho
 * 
 * FORMAT:
 * - Multi-line: 1 phiếu chuyển kho có thể có nhiều dòng sản phẩm
 * - Các dòng cùng Mã phiếu sẽ được nhóm thành 1 phiếu chuyển kho
 */

import type { StockTransfer, StockTransferItem, StockTransferStatus } from '@/lib/types/prisma-extended';
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

const findEmployee = (name: string) => {
  if (!name) return undefined;
  const store = getEmployeeStore();
  const normalized = name.trim().toLowerCase();
  return store.data.find(e => e.fullName?.toLowerCase().includes(normalized));
};

// ============================================
// IMPORT ROW TYPE
// ============================================

interface StockTransferImportRow {
  transferId: string;
  fromBranchIdOrName: string;
  toBranchIdOrName: string;
  status?: string;
  createdDate?: string;
  createdByName?: string;
  note?: string;
  referenceCode?: string;
  // Line item
  productIdOrSku: string;
  productName?: string;
  quantity: number;
  itemNote?: string;
}

// ============================================
// FIELD CONFIGURATION
// ============================================

export const stockTransferFields: FieldConfig<StockTransferImportRow>[] = [
  // Phiếu chuyển kho
  {
    key: 'transferId',
    label: 'Mã phiếu (*)',
    type: 'string',
    required: true,
    example: 'PCK001',
    group: 'Phiếu chuyển kho',
    defaultSelected: true,
  },
  {
    key: 'fromBranchIdOrName',
    label: 'Kho chuyển (*)',
    type: 'string',
    required: true,
    example: 'Chi nhánh A',
    group: 'Phiếu chuyển kho',
    defaultSelected: true,
  },
  {
    key: 'toBranchIdOrName',
    label: 'Kho nhận (*)',
    type: 'string',
    required: true,
    example: 'Chi nhánh B',
    group: 'Phiếu chuyển kho',
    defaultSelected: true,
  },
  {
    key: 'status',
    label: 'Trạng thái',
    type: 'string',
    required: false,
    example: 'pending',
    group: 'Phiếu chuyển kho',
  },
  {
    key: 'createdDate',
    label: 'Ngày tạo',
    type: 'string',
    required: false,
    example: '2024-01-15',
    group: 'Phiếu chuyển kho',
    defaultSelected: true,
  },
  {
    key: 'createdByName',
    label: 'Người tạo',
    type: 'string',
    required: false,
    example: 'Nguyễn Văn A',
    group: 'Phiếu chuyển kho',
  },
  {
    key: 'note',
    label: 'Ghi chú',
    type: 'string',
    required: false,
    example: 'Chuyển hàng bổ sung',
    group: 'Phiếu chuyển kho',
  },
  {
    key: 'referenceCode',
    label: 'Mã tham chiếu',
    type: 'string',
    required: false,
    example: 'REF001',
    group: 'Phiếu chuyển kho',
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
    key: 'itemNote',
    label: 'Ghi chú SP',
    type: 'string',
    required: false,
    example: 'Lưu ý SP',
    group: 'Sản phẩm',
  },
];

// ============================================
// STATUS MAPPING
// ============================================

const STATUS_MAP: Record<string, StockTransferStatus> = {
  'pending': 'pending',
  'Chờ chuyển': 'pending',
  'transferring': 'transferring',
  'Đang chuyển': 'transferring',
  'completed': 'completed',
  'Hoàn thành': 'completed',
  'cancelled': 'cancelled',
  'Đã hủy': 'cancelled',
};

// ============================================
// MAIN CONFIG
// ============================================

export const stockTransferImportExportConfig: ImportExportConfig<StockTransfer> = {
  entityType: 'stock-transfers',
  entityDisplayName: 'Phiếu chuyển kho',
  
  fields: stockTransferFields as unknown as FieldConfig<StockTransfer>[],
  
  templateFileName: 'Mau_Chuyen_Kho.xlsx',
  sheetName: 'ChuyenKho',
  
  // Import settings
  upsertKey: 'id',
  allowUpdate: false,
  allowInsert: true,
  
  requirePreview: true,
  maxRows: 2000,
  maxErrorsAllowed: 0,
  
  // Fill-down for multi-line
  preProcessRows: (rows) => {
    let lastTransferId = '';
    let lastFromBranch = '';
    let lastToBranch = '';
    let lastCreatedDate = '';
    let lastCreatedBy = '';
    let lastNote = '';
    
    return rows.map((row: Record<string, unknown>) => {
      if (row.transferId) {
        lastTransferId = String(row.transferId);
        lastFromBranch = String(row.fromBranchIdOrName || '');
        lastToBranch = String(row.toBranchIdOrName || '');
        lastCreatedDate = String(row.createdDate || '');
        lastCreatedBy = String(row.createdByName || '');
        lastNote = String(row.note || '');
      }
      
      return {
        ...row,
        transferId: row.transferId || lastTransferId,
        fromBranchIdOrName: row.fromBranchIdOrName || lastFromBranch,
        toBranchIdOrName: row.toBranchIdOrName || lastToBranch,
        createdDate: row.createdDate || lastCreatedDate,
        createdByName: row.createdByName || lastCreatedBy,
        note: row.note || lastNote,
      };
    });
  },
  
  // Validate each row
  validateRow: (row, _index, existingData, mode) => {
    const errors: Array<{ field?: string; message: string }> = [];
    const importRow = row as unknown as StockTransferImportRow;
    
    if (!importRow.transferId) {
      errors.push({ field: 'transferId', message: 'Mã phiếu không được để trống' });
    }
    
    if (!importRow.fromBranchIdOrName) {
      errors.push({ field: 'fromBranchIdOrName', message: 'Kho chuyển không được để trống' });
    }
    
    if (!importRow.toBranchIdOrName) {
      errors.push({ field: 'toBranchIdOrName', message: 'Kho nhận không được để trống' });
    }
    
    if (!importRow.productIdOrSku) {
      errors.push({ field: 'productIdOrSku', message: 'Mã SP không được để trống' });
    }
    
    if (!importRow.quantity || importRow.quantity <= 0) {
      errors.push({ field: 'quantity', message: 'Số lượng phải lớn hơn 0' });
    }
    
    // Same branch check
    if (importRow.fromBranchIdOrName && importRow.toBranchIdOrName) {
      if (importRow.fromBranchIdOrName.toLowerCase() === importRow.toBranchIdOrName.toLowerCase()) {
        errors.push({ field: 'toBranchIdOrName', message: 'Kho nhận phải khác kho chuyển' });
      }
    }
    
    // Check duplicate
    if (mode === 'insert-only' && importRow.transferId) {
      const duplicate = existingData.find(t => 
        t.id.toUpperCase() === importRow.transferId.toUpperCase()
      );
      if (duplicate) {
        // Warning only - same transfer can have multiple lines
      }
    }
    
    return errors;
  },
  
  // Transform: Group rows by transferId and build StockTransfer objects
  beforeImport: async (data: StockTransfer[]) => {
    const importRows = data as unknown as StockTransferImportRow[];
    
    // Group rows by transferId
    const transferMap = new Map<string, StockTransferImportRow[]>();
    
    for (const row of importRows) {
      const transferId = row.transferId?.trim();
      if (!transferId) continue;
      
      if (!transferMap.has(transferId)) {
        transferMap.set(transferId, []);
      }
      transferMap.get(transferId)!.push(row);
    }
    
    // Build StockTransfer objects
    const transfers: StockTransfer[] = [];
    const now = new Date().toISOString();
    
    for (const [transferId, rows] of transferMap.entries()) {
      if (rows.length === 0) continue;
      
      const firstRow = rows[0];
      
      // Lookup branches
      const fromBranch = findBranch(firstRow.fromBranchIdOrName || '');
      const toBranch = findBranch(firstRow.toBranchIdOrName || '');
      
      if (!fromBranch || !toBranch) continue;
      
      // Lookup creator
      const creator = findEmployee(firstRow.createdByName || '');
      
      // Build items
      const items: StockTransferItem[] = [];
      for (const row of rows) {
        if (!row.productIdOrSku) continue;
        
        const product = findProduct(row.productIdOrSku || '');
        
        const quantity = Math.max(1, Math.floor(Number(row.quantity) || 1));
        
        items.push({
          productSystemId: product?.systemId || asSystemId(''),
          productId: asBusinessId(product?.id || row.productIdOrSku || ''),
          productName: product?.name || row.productName || '',
          quantity,
          note: row.itemNote,
        });
      }
      
      if (items.length === 0) continue;
      
      // Map status
      const status = STATUS_MAP[firstRow.status || ''] || 'pending';
      
      // Build StockTransfer object
      const transfer: StockTransfer = {
        systemId: asSystemId(''), // Will be generated
        id: asBusinessId(transferId),
        referenceCode: firstRow.referenceCode,
        
        fromBranchSystemId: fromBranch.systemId,
        fromBranchName: fromBranch.name,
        
        toBranchSystemId: toBranch.systemId,
        toBranchName: toBranch.name,
        
        status,
        items,
        
        createdDate: firstRow.createdDate || now,
        createdBySystemId: creator?.systemId || asSystemId(''),
        createdByName: creator?.fullName || firstRow.createdByName || '',
        
        note: firstRow.note,
        
        createdAt: now,
        updatedAt: now,
      };
      
      transfers.push(transfer);
    }
    
    return transfers;
  },
};

// Flatten transfers for export (multi-line per product)
export function flattenStockTransfersForExport(transfers: StockTransfer[]): StockTransferImportRow[] {
  const rows: StockTransferImportRow[] = [];
  
  for (const transfer of transfers) {
    for (let i = 0; i < transfer.items.length; i++) {
      const item = transfer.items[i];
      rows.push({
        transferId: i === 0 ? transfer.id : '',
        fromBranchIdOrName: i === 0 ? transfer.fromBranchName : '',
        toBranchIdOrName: i === 0 ? transfer.toBranchName : '',
        status: i === 0 ? transfer.status : '',
        createdDate: i === 0 ? transfer.createdDate : '',
        createdByName: i === 0 ? transfer.createdByName : '',
        note: i === 0 ? transfer.note : '',
        referenceCode: i === 0 ? transfer.referenceCode : '',
        productIdOrSku: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        itemNote: item.note,
      });
    }
  }
  
  return rows;
}
