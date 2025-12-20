/**
 * COD Reconciliation Import/Export Configuration
 * 
 * Cấu hình xuất dữ liệu đối soát COD
 * ReconciliationItem = Packaging + order info
 */

import type { ImportExportConfig, FieldConfig } from '../types';
import type { ReconciliationItem } from '../../../features/reconciliation/page';

const fields: FieldConfig<ReconciliationItem>[] = [
  // Group: Thông tin chung
  { key: 'id', label: 'Mã đóng gói', type: 'string', group: 'Thông tin chung', exportable: true },
  { key: 'orderId', label: 'Mã đơn hàng', type: 'string', group: 'Thông tin chung', exportable: true },
  { key: 'customerName', label: 'Khách hàng', type: 'string', group: 'Thông tin chung', exportable: true },
  { key: 'trackingCode', label: 'Mã vận đơn', type: 'string', group: 'Thông tin chung', exportable: true },
  
  // Group: Vận chuyển
  { key: 'carrier', label: 'Hãng vận chuyển', type: 'string', group: 'Vận chuyển', exportable: true },
  { key: 'service', label: 'Dịch vụ', type: 'string', group: 'Vận chuyển', exportable: true },
  { key: 'deliveryStatus', label: 'Trạng thái giao hàng', type: 'string', group: 'Vận chuyển', exportable: true },
  { key: 'deliveredDate', label: 'Ngày giao hàng', type: 'date', group: 'Vận chuyển', exportable: true },
  
  // Group: Tài chính COD
  { 
    key: 'codAmount', 
    label: 'Tiền COD', 
    type: 'number',
    group: 'Tài chính', 
    exportable: true,
    transform: (value) => typeof value === 'number' ? value : 0
  },
  { 
    key: 'shippingFeeToPartner', 
    label: 'Phí vận chuyển', 
    type: 'number',
    group: 'Tài chính', 
    exportable: true,
    transform: (value) => typeof value === 'number' ? value : 0
  },
  { key: 'reconciliationStatus', label: 'Trạng thái đối soát', type: 'string', group: 'Tài chính', exportable: true },
  { key: 'payer', label: 'Người trả phí', type: 'string', group: 'Tài chính', exportable: true },
  
  // Group: Đóng gói
  { key: 'status', label: 'Trạng thái đóng gói', type: 'string', group: 'Đóng gói', exportable: true },
  { key: 'requestDate', label: 'Ngày yêu cầu', type: 'date', group: 'Đóng gói', exportable: true },
  { key: 'confirmDate', label: 'Ngày xác nhận', type: 'date', group: 'Đóng gói', exportable: true },
  
  // Group: Nhân viên
  { key: 'requestingEmployeeName', label: 'Người yêu cầu', type: 'string', group: 'Nhân viên', exportable: true },
  { key: 'confirmingEmployeeName', label: 'Người xác nhận', type: 'string', group: 'Nhân viên', exportable: true },
  
  // Group: Hệ thống
  { key: 'systemId', label: 'System ID', type: 'string', group: 'Hệ thống', exportable: true },
  { key: 'orderSystemId', label: 'Order System ID', type: 'string', group: 'Hệ thống', exportable: true },
];

export const reconciliationConfig: ImportExportConfig<ReconciliationItem> = {
  entityType: 'cod-reconciliation',
  entityDisplayName: 'Đối soát COD',
  fields,
  templateFileName: 'doi-soat-cod.xlsx',
  
  // Validation - minimal for export-only
  validateRow: () => [],
};

export default reconciliationConfig;
