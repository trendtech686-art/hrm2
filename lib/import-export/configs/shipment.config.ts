/**
 * Shipment Import/Export Configuration
 * 
 * Cấu hình xuất dữ liệu vận đơn
 */

import type { ImportExportConfig, FieldConfig } from '@/lib/import-export/types';
import type { ShipmentView } from '@/lib/types/prisma-extended';

const fields: FieldConfig<ShipmentView>[] = [
  // Group: Thông tin chung
  { key: 'id', label: 'Mã vận đơn', type: 'string', group: 'Thông tin chung', exportable: true },
  { key: 'orderId', label: 'Mã đơn hàng', type: 'string', group: 'Thông tin chung', exportable: true },
  { key: 'trackingCode', label: 'Mã tracking', type: 'string', group: 'Thông tin chung', exportable: true },
  
  // Group: Khách hàng
  { key: 'customerName', label: 'Tên khách hàng', type: 'string', group: 'Khách hàng', exportable: true },
  { key: 'customerPhone', label: 'SĐT khách hàng', type: 'phone', group: 'Khách hàng', exportable: true },
  { key: 'customerAddress', label: 'Địa chỉ giao hàng', type: 'string', group: 'Khách hàng', exportable: true },
  { key: 'customerEmail', label: 'Email', type: 'email', group: 'Khách hàng', exportable: true },
  
  // Group: Vận chuyển
  { key: 'carrier', label: 'Hãng vận chuyển', type: 'string', group: 'Vận chuyển', exportable: true },
  { key: 'service', label: 'Dịch vụ', type: 'string', group: 'Vận chuyển', exportable: true },
  { key: 'deliveryStatus', label: 'Trạng thái giao hàng', type: 'string', group: 'Vận chuyển', exportable: true },
  { key: 'partnerStatus', label: 'Trạng thái đối tác', type: 'string', group: 'Vận chuyển', exportable: true },
  { key: 'payer', label: 'Người trả phí', type: 'string', group: 'Vận chuyển', exportable: true },
  
  // Group: Tài chính
  { 
    key: 'shippingFeeToPartner', 
    label: 'Phí vận chuyển', 
    type: 'number',
    group: 'Tài chính', 
    exportable: true,
    transform: (value) => typeof value === 'number' ? value : 0
  },
  { 
    key: 'codAmount', 
    label: 'Tiền COD', 
    type: 'number',
    group: 'Tài chính', 
    exportable: true,
    transform: (value) => typeof value === 'number' ? value : 0
  },
  { key: 'reconciliationStatus', label: 'Trạng thái đối soát', type: 'string', group: 'Tài chính', exportable: true },
  
  // Group: Ngày tháng
  { key: 'createdAt', label: 'Ngày tạo', type: 'date', group: 'Ngày tháng', exportable: true },
  { key: 'dispatchedAt', label: 'Ngày xuất kho', type: 'date', group: 'Ngày tháng', exportable: true },
  { key: 'deliveredAt', label: 'Ngày giao thành công', type: 'date', group: 'Ngày tháng', exportable: true },
  { key: 'cancelledAt', label: 'Ngày hủy', type: 'date', group: 'Ngày tháng', exportable: true },
  
  // Group: Kích thước & Khối lượng
  { 
    key: 'weight', 
    label: 'Khối lượng (gram)', 
    type: 'number',
    group: 'Kích thước', 
    exportable: true,
    transform: (value) => typeof value === 'number' ? value : 0
  },
  { key: 'dimensions', label: 'Kích thước', type: 'string', group: 'Kích thước', exportable: true },
  
  // Group: In ấn
  { key: 'printStatus', label: 'Trạng thái in', type: 'string', group: 'In ấn', exportable: true },
  
  // Group: Ghi chú
  { key: 'noteToShipper', label: 'Ghi chú giao hàng', type: 'string', group: 'Ghi chú', exportable: true },
  
  // Group: Hệ thống
  { key: 'systemId', label: 'System ID', type: 'string', group: 'Hệ thống', exportable: true },
  { key: 'orderSystemId', label: 'Order System ID', type: 'string', group: 'Hệ thống', exportable: true },
  { key: 'packagingSystemId', label: 'Packaging System ID', type: 'string', group: 'Hệ thống', exportable: true },
];

export const shipmentConfig: ImportExportConfig<ShipmentView> = {
  entityType: 'shipments',
  entityDisplayName: 'Vận đơn',
  fields,
  templateFileName: 'van-don.xlsx',
  
  // Validation - minimal for export-only
  validateRow: () => [],
};

export default shipmentConfig;
