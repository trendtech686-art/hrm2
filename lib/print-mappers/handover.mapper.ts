/**
 * Handover Mapper - Phiếu bàn giao tài sản/thiết bị
 * Đồng bộ với variables/phieu-ban-giao.ts và templates/handover.ts
 */

import { 
  PrintData, 
  PrintLineItem,
  formatCurrency,
  formatDate,
  formatTime,
  getStoreData,
  StoreSettings
} from '@/lib/print-service';

/**
 * Interface cho Phiếu bàn giao tài sản
 */
export interface HandoverForPrint {
  // === THÔNG TIN PHIẾU ===
  code: string;
  createdAt: string | Date;
  handoverType?: string; // Bàn giao công việc, Bàn giao tài sản, Bàn giao thiết bị...
  status?: string;
  note?: string;
  accountName?: string; // Người tạo phiếu

  // === NGƯỜI BÀN GIAO ===
  fromEmployee?: {
    code?: string;
    name?: string;
    department?: string;
    position?: string;
  };

  // === NGƯỜI NHẬN ===
  toEmployee?: {
    code?: string;
    name?: string;
    department?: string;
    position?: string;
  };

  // === DANH SÁCH TÀI SẢN BÀN GIAO ===
  items: Array<{
    itemCode?: string;
    itemName?: string;
    description?: string;
    serial?: string;
    quantity?: number;
    unit?: string;
    condition?: string; // Tốt, Hư hỏng nhẹ, Cần sửa chữa...
    value?: number;
    note?: string;
  }>;

  // === TỔNG KẾT ===
  totalItems?: number;
  totalQuantity?: number;
  totalValue?: number;
}

/**
 * Map HandoverForPrint sang PrintData
 */
export function mapHandoverToPrintData(handover: HandoverForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN PHIẾU ===
    '{handover_code}': handover.code,
    '{created_on}': formatDate(handover.createdAt),
    '{created_on_time}': formatTime(handover.createdAt),
    '{handover_type}': handover.handoverType || '',
    '{status}': handover.status || '',
    '{note}': handover.note || '',
    '{account_name}': handover.accountName || '',

    // === NGƯỜI BÀN GIAO ===
    '{from_employee}': handover.fromEmployee?.name || '',
    '{from_employee_code}': handover.fromEmployee?.code || '',
    '{from_department}': handover.fromEmployee?.department || '',
    '{from_position}': handover.fromEmployee?.position || '',

    // === NGƯỜI NHẬN ===
    '{to_employee}': handover.toEmployee?.name || '',
    '{to_employee_code}': handover.toEmployee?.code || '',
    '{to_department}': handover.toEmployee?.department || '',
    '{to_position}': handover.toEmployee?.position || '',

    // === TỔNG KẾT ===
    '{total_items}': handover.totalItems?.toString() || handover.items.length.toString(),
    '{total_quantity}': handover.totalQuantity?.toString() || 
      handover.items.reduce((sum, item) => sum + (item.quantity || 0), 0).toString(),
    '{total_value}': formatCurrency(handover.totalValue || 
      handover.items.reduce((sum, item) => sum + (item.value || 0), 0)),
  };
}

/**
 * Map line items cho bảng chi tiết bàn giao
 */
export function mapHandoverLineItems(items: HandoverForPrint['items']): PrintLineItem[] {
  return items.map((item) => ({
    '{line_item_code}': item.itemCode || '',
    '{line_item_name}': item.itemName || '',
    '{line_description}': item.description || '',
    '{line_serial}': item.serial || '',
    '{line_quantity}': item.quantity?.toString() || '1',
    '{line_unit}': item.unit || 'Cái',
    '{line_condition}': item.condition || 'Tốt',
    '{line_value}': formatCurrency(item.value),
    '{line_note}': item.note || '',
  }));
}
