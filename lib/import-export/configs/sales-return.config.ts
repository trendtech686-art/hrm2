/**
 * Sales Return Import/Export Configuration
 * 
 * Cấu hình xuất dữ liệu phiếu trả hàng bán
 */

import type { ImportExportConfig, FieldConfig } from '@/lib/import-export/types';
import type { SalesReturn } from '@/lib/types/prisma-extended';

const fields: FieldConfig<SalesReturn>[] = [
  // Group: Thông tin chung
  { key: 'id', label: 'Mã phiếu trả', type: 'string', group: 'Thông tin chung', exportable: true },
  { key: 'returnDate', label: 'Ngày trả hàng', type: 'date', group: 'Thông tin chung', exportable: true },
  { key: 'orderId', label: 'Mã đơn hàng gốc', type: 'string', group: 'Thông tin chung', exportable: true },
  { key: 'reason', label: 'Lý do trả hàng', type: 'string', group: 'Thông tin chung', exportable: true },
  { key: 'note', label: 'Ghi chú ngắn', type: 'string', group: 'Thông tin chung', exportable: true },
  { key: 'notes', label: 'Ghi chú chi tiết', type: 'string', group: 'Thông tin chung', exportable: true },
  { key: 'reference', label: 'Mã tham chiếu', type: 'string', group: 'Thông tin chung', exportable: true },
  
  // Group: Khách hàng
  { key: 'customerName', label: 'Tên khách hàng', type: 'string', group: 'Khách hàng', exportable: true },
  
  // Group: Chi nhánh
  { key: 'branchName', label: 'Chi nhánh', type: 'string', group: 'Chi nhánh', exportable: true },
  
  // Group: Giá trị trả hàng
  { 
    key: 'totalReturnValue', 
    label: 'Giá trị hàng trả', 
    type: 'number',
    group: 'Giá trị', 
    exportable: true,
    transform: (value) => typeof value === 'number' ? value : 0
  },
  { key: 'isReceived', label: 'Đã nhận hàng', type: 'boolean', group: 'Giá trị', exportable: true, transform: (v) => v ? 'Đã nhận' : 'Chưa nhận' },
  
  // Group: Đổi hàng mới
  { 
    key: 'subtotalNew', 
    label: 'Giá trị hàng mới', 
    type: 'number',
    group: 'Đổi hàng', 
    exportable: true,
    transform: (value) => typeof value === 'number' ? value : 0
  },
  { 
    key: 'shippingFeeNew', 
    label: 'Phí vận chuyển mới', 
    type: 'number',
    group: 'Đổi hàng', 
    exportable: true,
    transform: (value) => typeof value === 'number' ? value : 0
  },
  { 
    key: 'grandTotalNew', 
    label: 'Tổng tiền đơn mới', 
    type: 'number',
    group: 'Đổi hàng', 
    exportable: true,
    transform: (value) => typeof value === 'number' ? value : 0
  },
  
  // Group: Tài chính
  { 
    key: 'finalAmount', 
    label: 'Số tiền quyết toán', 
    type: 'number',
    group: 'Tài chính', 
    exportable: true,
    transform: (value) => typeof value === 'number' ? value : 0
  },
  
  // Group: Vận chuyển
  { key: 'deliveryMethod', label: 'Phương thức giao hàng', type: 'string', group: 'Vận chuyển', exportable: true },
  
  // Group: Hệ thống
  { key: 'systemId', label: 'System ID', type: 'string', group: 'Hệ thống', exportable: true },
  { key: 'orderSystemId', label: 'Order System ID', type: 'string', group: 'Hệ thống', exportable: true },
  { key: 'customerSystemId', label: 'Customer System ID', type: 'string', group: 'Hệ thống', exportable: true },
  { key: 'branchSystemId', label: 'Branch System ID', type: 'string', group: 'Hệ thống', exportable: true },
];

export const salesReturnConfig: ImportExportConfig<SalesReturn> = {
  entityType: 'sales-returns',
  entityDisplayName: 'Phiếu trả hàng',
  fields,
  templateFileName: 'phieu-tra-hang.xlsx',
  
  // Validation - minimal for export-only
  validateRow: () => [],
};

export default salesReturnConfig;
