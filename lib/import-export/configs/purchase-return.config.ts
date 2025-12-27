/**
 * Purchase Return Import/Export Configuration
 * 
 * Cấu hình xuất dữ liệu phiếu trả hàng nhà cung cấp
 */

import type { ImportExportConfig, FieldConfig } from '@/lib/import-export/types';
import type { PurchaseReturn } from '@/lib/types/prisma-extended';

const fields: FieldConfig<PurchaseReturn>[] = [
  // Group: Thông tin chung
  { key: 'id', label: 'Mã phiếu trả', type: 'string', group: 'Thông tin chung', exportable: true },
  { key: 'purchaseOrderId', label: 'Mã đơn nhập hàng', type: 'string', group: 'Thông tin chung', exportable: true },
  { key: 'returnDate', label: 'Ngày trả hàng', type: 'date', group: 'Thông tin chung', exportable: true },
  { key: 'reason', label: 'Lý do trả hàng', type: 'string', group: 'Thông tin chung', exportable: true },
  
  // Group: Nhà cung cấp
  { key: 'supplierName', label: 'Nhà cung cấp', type: 'string', group: 'Nhà cung cấp', exportable: true },
  
  // Group: Chi nhánh
  { key: 'branchName', label: 'Chi nhánh', type: 'string', group: 'Chi nhánh', exportable: true },
  
  // Group: Tài chính
  { 
    key: 'totalReturnValue', 
    label: 'Tổng giá trị trả', 
    type: 'number',
    group: 'Tài chính', 
    exportable: true,
    transform: (value) => typeof value === 'number' ? value : 0
  },
  { 
    key: 'refundAmount', 
    label: 'Số tiền hoàn lại', 
    type: 'number',
    group: 'Tài chính', 
    exportable: true,
    transform: (value) => typeof value === 'number' ? value : 0
  },
  { key: 'refundMethod', label: 'Phương thức hoàn tiền', type: 'string', group: 'Tài chính', exportable: true },
  
  // Group: Người tạo
  { key: 'creatorName', label: 'Người tạo phiếu', type: 'string', group: 'Người tạo', exportable: true },
  { key: 'createdAt', label: 'Ngày tạo', type: 'date', group: 'Người tạo', exportable: true },
  { key: 'updatedAt', label: 'Ngày cập nhật', type: 'date', group: 'Người tạo', exportable: true },
  
  // Group: Hệ thống
  { key: 'systemId', label: 'System ID', type: 'string', group: 'Hệ thống', exportable: true },
  { key: 'purchaseOrderSystemId', label: 'PO System ID', type: 'string', group: 'Hệ thống', exportable: true },
  { key: 'supplierSystemId', label: 'Supplier System ID', type: 'string', group: 'Hệ thống', exportable: true },
  { key: 'branchSystemId', label: 'Branch System ID', type: 'string', group: 'Hệ thống', exportable: true },
  { key: 'accountSystemId', label: 'Account System ID', type: 'string', group: 'Hệ thống', exportable: true },
];

export const purchaseReturnConfig: ImportExportConfig<PurchaseReturn> = {
  entityType: 'purchase-returns',
  entityDisplayName: 'Phiếu trả hàng NCC',
  fields,
  templateFileName: 'phieu-tra-hang-ncc.xlsx',
  
  // Validation - minimal for export-only
  validateRow: () => [],
};

export default purchaseReturnConfig;
