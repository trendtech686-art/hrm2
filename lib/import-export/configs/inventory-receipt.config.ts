/**
 * Inventory Receipt Import/Export Configuration
 * 
 * Cấu hình xuất dữ liệu phiếu nhập kho
 */

import type { ImportExportConfig, FieldConfig } from '../types';
import type { InventoryReceipt } from '../../../features/inventory-receipts/types';

const fields: FieldConfig<InventoryReceipt>[] = [
  // Group: Thông tin chung
  { key: 'id', label: 'Mã phiếu nhập', type: 'string', group: 'Thông tin chung', exportable: true },
  { key: 'purchaseOrderId', label: 'Mã đơn mua hàng', type: 'string', group: 'Thông tin chung', exportable: true },
  { key: 'receivedDate', label: 'Ngày nhập kho', type: 'date', group: 'Thông tin chung', exportable: true },
  { key: 'notes', label: 'Ghi chú', type: 'string', group: 'Thông tin chung', exportable: true },
  
  // Group: Nhà cung cấp
  { key: 'supplierName', label: 'Nhà cung cấp', type: 'string', group: 'Nhà cung cấp', exportable: true },
  
  // Group: Kho / Chi nhánh
  { key: 'branchName', label: 'Chi nhánh', type: 'string', group: 'Kho', exportable: true },
  { key: 'warehouseName', label: 'Kho', type: 'string', group: 'Kho', exportable: true },
  
  // Group: Người nhận
  { key: 'receiverName', label: 'Người nhận hàng', type: 'string', group: 'Người nhận', exportable: true },
  
  // Group: Thời gian
  { key: 'createdAt', label: 'Ngày tạo', type: 'date', group: 'Thời gian', exportable: true },
  { key: 'updatedAt', label: 'Ngày cập nhật', type: 'date', group: 'Thời gian', exportable: true },
  
  // Group: Hệ thống
  { key: 'systemId', label: 'System ID', type: 'string', group: 'Hệ thống', exportable: true },
  { key: 'purchaseOrderSystemId', label: 'PO System ID', type: 'string', group: 'Hệ thống', exportable: true },
  { key: 'supplierSystemId', label: 'Supplier System ID', type: 'string', group: 'Hệ thống', exportable: true },
  { key: 'branchSystemId', label: 'Branch System ID', type: 'string', group: 'Hệ thống', exportable: true },
  { key: 'receiverSystemId', label: 'Receiver System ID', type: 'string', group: 'Hệ thống', exportable: true },
];

export const inventoryReceiptConfig: ImportExportConfig<InventoryReceipt> = {
  entityType: 'inventory-receipts',
  entityDisplayName: 'Phiếu nhập kho',
  fields,
  templateFileName: 'phieu-nhap-kho.xlsx',
  
  // Validation - minimal for export-only
  validateRow: () => [],
};

export default inventoryReceiptConfig;
