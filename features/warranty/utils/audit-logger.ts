/**
 * Audit Logger for Warranty Module
 * 
 * Tự động log mọi thao tác quan trọng:
 * - Tạo/sửa phiếu
 * - Thêm/sửa/xóa sản phẩm
 * - Upload/xóa ảnh
 * - Thay đổi trạng thái
 * - Thay đổi thông tin khách hàng
 */

import { getCurrentDate, toISODateTime } from '../../../lib/date-utils.ts';
import type { WarrantyHistory, WarrantyTicket, WarrantyProduct } from '../types.ts';

import { asSystemId, type SystemId } from '@/lib/id-types';

// Simple ID generator for audit logs
function generateId(): SystemId {
  return asSystemId(`AUD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
}

/**
 * Create audit log entry
 */
export function createAuditLog(
  action: string,
  actionLabel: string,
  performedBy: string,
  options?: {
    entityType?: string;
    entityId?: SystemId;
    changes?: Array<{ field: string; oldValue: any; newValue: any }>;
    note?: string;
    performedBySystemId?: SystemId;
  }
): WarrantyHistory {
  const now = getCurrentDate();
  const timestamp = toISODateTime(now) || new Date().toISOString(); // Fallback to native ISO string
  
  return {
    systemId: generateId(),
    action,
    actionLabel,
    entityType: options?.entityType,
    entityId: options?.entityId,
    changes: options?.changes,
    performedBy,
    performedBySystemId: options?.performedBySystemId,
    performedAt: timestamp,
    note: options?.note,
  };
}

/**
 * Log: Tạo phiếu mới
 */
export function logCreateTicket(ticketSystemId: SystemId, performedBy: string, performedBySystemId?: SystemId): WarrantyHistory {
  return createAuditLog(
    'create_ticket',
    `Tạo phiếu bảo hành ${ticketSystemId}`,
    performedBy,
    {
      entityType: 'ticket',
      entityId: ticketSystemId,
      performedBySystemId,
    }
  );
}

/**
 * Log: Cập nhật thông tin phiếu
 */
export function logUpdateTicket(
  ticketSystemId: SystemId,
  performedBy: string,
  changes: Array<{ field: string; oldValue: any; newValue: any }>,
  performedBySystemId?: SystemId,
): WarrantyHistory {
  const fieldLabels: Record<string, string> = {
    customerName: 'Tên khách hàng',
    customerPhone: 'Số điện thoại',
    customerAddress: 'Địa chỉ',
    trackingCode: 'Mã vận đơn',
    shippingFee: 'Phí cước',
    notes: 'Ghi chú',
    branchSystemId: 'Chi nhánh',
    employeeSystemId: 'Nhân viên xử lý',
  };

  const changeLabels = changes.map(c => fieldLabels[c.field] || c.field).join(', ');

  return createAuditLog(
    'update_ticket',
    `Cập nhật phiếu: ${changeLabels}`,
    performedBy,
    {
      entityType: 'ticket',
      entityId: ticketSystemId,
      changes,
      performedBySystemId,
    }
  );
}

/**
 * Log: Thêm sản phẩm
 */
export function logAddProduct(productName: string, performedBy: string): WarrantyHistory {
  return createAuditLog(
    'add_product',
    `Thêm sản phẩm "${productName}"`,
    performedBy,
    {
      entityType: 'product',
    }
  );
}

/**
 * Log: Xóa sản phẩm
 */
export function logRemoveProduct(productName: string, performedBy: string): WarrantyHistory {
  return createAuditLog(
    'remove_product',
    `Xóa sản phẩm "${productName}"`,
    performedBy,
    {
      entityType: 'product',
    }
  );
}

/**
 * Log: Cập nhật sản phẩm
 */
export function logUpdateProduct(
  productName: string,
  performedBy: string,
  changes: Array<{ field: string; oldValue: any; newValue: any }>
): WarrantyHistory {
  const fieldLabels: Record<string, string> = {
    quantity: 'Số lượng',
    unitPrice: 'Đơn giá',
    issueDescription: 'Mô tả tình trạng',
    resolution: 'Kết quả xử lý',
    deductionAmount: 'Số tiền trừ',
  };

  const changeLabels = changes.map(c => fieldLabels[c.field] || c.field).join(', ');

  return createAuditLog(
    'update_product',
    `Cập nhật sản phẩm "${productName}": ${changeLabels}`,
    performedBy,
    {
      entityType: 'product',
      changes,
    }
  );
}

/**
 * Log: Upload ảnh
 */
export function logUploadImages(
  imageType: 'received' | 'processed' | 'product',
  count: number,
  performedBy: string,
  productName?: string
): WarrantyHistory {
  const typeLabels = {
    received: 'ảnh đơn hàng lúc nhận',
    processed: 'ảnh đơn hàng đã xử lý',
    product: `ảnh sản phẩm "${productName}"`,
  };

  return createAuditLog(
    'upload_images',
    `Tải lên ${count} ${typeLabels[imageType]}`,
    performedBy,
    {
      entityType: 'image',
      note: `Số lượng: ${count}`,
    }
  );
}

/**
 * Log: Xóa ảnh
 */
export function logDeleteImages(
  imageType: 'received' | 'processed' | 'product',
  count: number,
  performedBy: string,
  productName?: string
): WarrantyHistory {
  const typeLabels = {
    received: 'ảnh đơn hàng lúc nhận',
    processed: 'ảnh đơn hàng đã xử lý',
    product: `ảnh sản phẩm "${productName}"`,
  };

  return createAuditLog(
    'delete_images',
    `Xóa ${count} ${typeLabels[imageType]}`,
    performedBy,
    {
      entityType: 'image',
      note: `Số lượng: ${count}`,
    }
  );
}

/**
 * Log: Thay đổi trạng thái
 */
export function logStatusChange(
  oldStatus: string,
  newStatus: string,
  performedBy: string,
  performedBySystemId?: SystemId,
): WarrantyHistory {
  const statusLabels: Record<string, string> = {
    new: 'Mới',
    pending: 'Chưa xử lý',
    processed: 'Đã xử lý',
    returned: 'Đã trả',
  };

  return createAuditLog(
    'change_status',
    `Chuyển trạng thái: ${statusLabels[oldStatus]} → ${statusLabels[newStatus]}`,
    performedBy,
    {
      entityType: 'status',
      changes: [
        {
          field: 'status',
          oldValue: oldStatus,
          newValue: newStatus,
        },
      ],
      performedBySystemId,
    }
  );
}

/**
 * Compare two tickets and generate change log
 */
export function generateChangeLog(
  oldTicket: WarrantyTicket,
  newTicket: WarrantyTicket,
  performedBy: string
): WarrantyHistory[] {
  const logs: WarrantyHistory[] = [];
  const changes: Array<{ field: string; oldValue: any; newValue: any }> = [];

  // Check basic fields
  const fieldsToCheck = [
    'customerName',
    'customerPhone',
    'customerAddress',
    'trackingCode',
    'shippingFee',
    'notes',
    'branchSystemId',
    'employeeSystemId',
  ] as const;

  fieldsToCheck.forEach((field) => {
    if (oldTicket[field] !== newTicket[field]) {
      changes.push({
        field,
        oldValue: oldTicket[field],
        newValue: newTicket[field],
      });
    }
  });

  if (changes.length > 0) {
    logs.push(logUpdateTicket(newTicket.systemId, performedBy, changes));
  }

  // Check status change
  if (oldTicket.status !== newTicket.status) {
    logs.push(logStatusChange(oldTicket.status, newTicket.status, performedBy));
  }

  // Check images
  if (oldTicket.receivedImages.length !== newTicket.receivedImages.length) {
    const diff = newTicket.receivedImages.length - oldTicket.receivedImages.length;
    if (diff > 0) {
      logs.push(logUploadImages('received', diff, performedBy));
    } else {
      logs.push(logDeleteImages('received', Math.abs(diff), performedBy));
    }
  }

  if ((oldTicket.processedImages?.length || 0) !== (newTicket.processedImages?.length || 0)) {
    const diff = (newTicket.processedImages?.length || 0) - (oldTicket.processedImages?.length || 0);
    if (diff > 0) {
      logs.push(logUploadImages('processed', diff, performedBy));
    } else {
      logs.push(logDeleteImages('processed', Math.abs(diff), performedBy));
    }
  }

  // Check products (basic comparison by length)
  if (oldTicket.products.length < newTicket.products.length) {
    const newProducts = newTicket.products.slice(oldTicket.products.length);
    newProducts.forEach((p) => {
      logs.push(logAddProduct(p.productName, performedBy));
    });
  } else if (oldTicket.products.length > newTicket.products.length) {
    const removedProducts = oldTicket.products.slice(newTicket.products.length);
    removedProducts.forEach((p) => {
      logs.push(logRemoveProduct(p.productName, performedBy));
    });
  }

  return logs;
}
