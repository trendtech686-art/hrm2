/**
 * Packaging Import/Export Configuration
 * 
 * Cấu hình xuất dữ liệu phiếu đóng gói
 */

import type { ImportExportConfig, FieldConfig } from '../types.ts';
import type { PackagingSlip } from '../../../features/packaging/types.ts';

const fields: FieldConfig<PackagingSlip>[] = [
  // Group: Thông tin chung
  { key: 'id', label: 'Mã đóng gói', type: 'string', group: 'Thông tin chung', exportable: true },
  { key: 'orderId', label: 'Mã đơn hàng', type: 'string', group: 'Thông tin chung', exportable: true },
  { key: 'customerName', label: 'Khách hàng', type: 'string', group: 'Thông tin chung', exportable: true },
  { key: 'branchName', label: 'Chi nhánh', type: 'string', group: 'Thông tin chung', exportable: true },
  
  // Group: Trạng thái
  { key: 'status', label: 'Trạng thái đóng gói', type: 'string', group: 'Trạng thái', exportable: true },
  { key: 'printStatus', label: 'Trạng thái in', type: 'string', group: 'Trạng thái', exportable: true },
  { key: 'cancelReason', label: 'Lý do hủy', type: 'string', group: 'Trạng thái', exportable: true },
  
  // Group: Ngày tháng
  { key: 'requestDate', label: 'Ngày yêu cầu', type: 'date', group: 'Ngày tháng', exportable: true },
  { key: 'confirmDate', label: 'Ngày xác nhận', type: 'date', group: 'Ngày tháng', exportable: true },
  { key: 'cancelDate', label: 'Ngày hủy', type: 'date', group: 'Ngày tháng', exportable: true },
  
  // Group: Nhân viên xử lý
  { key: 'requestingEmployeeName', label: 'Người yêu cầu', type: 'string', group: 'Nhân viên', exportable: true },
  { key: 'confirmingEmployeeName', label: 'Người xác nhận', type: 'string', group: 'Nhân viên', exportable: true },
  { key: 'cancelingEmployeeName', label: 'Người hủy', type: 'string', group: 'Nhân viên', exportable: true },
  { key: 'assignedEmployeeName', label: 'Người được giao', type: 'string', group: 'Nhân viên', exportable: true },
  
  // Group: Hệ thống
  { key: 'systemId', label: 'System ID', type: 'string', group: 'Hệ thống', exportable: true },
  { key: 'orderSystemId', label: 'Order System ID', type: 'string', group: 'Hệ thống', exportable: true },
];

export const packagingConfig: ImportExportConfig<PackagingSlip> = {
  entityType: 'packaging',
  entityDisplayName: 'Phiếu đóng gói',
  fields,
  templateFileName: 'phieu-dong-goi.xlsx',
  
  // Validation - minimal for export-only
  validateRow: () => [],
};

export default packagingConfig;
