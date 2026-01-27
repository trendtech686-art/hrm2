/**
 * Warranty Stock Management
 * 
 * ⚠️ DEPRECATED: These client-side stock operations are unsafe and should be replaced
 * with server-side atomic transactions via warranty API endpoints
 * 
 * Recommended server endpoints:
 * - POST /api/warranties (with stock commit)
 * - POST /api/warranties/:id/complete (with stock deduction)
 * - POST /api/warranties/:id/cancel (with stock rollback/uncommit)
 */

import { getCurrentDate as _getCurrentDate, toISODateTime as _toISODateTime } from '../../../lib/date-utils';
import { toast as _toast } from 'sonner';
import type { WarrantyTicket } from '../types';
import { getCurrentUserName as _getCurrentUserName } from './base-store';
import { asSystemId as _asSystemId, type SystemId as _SystemId } from '../../../lib/id-types';

/**
 * @deprecated Use server endpoint: POST /api/warranties with stock commit
 * Commit stock khi tạo warranty (reserve hàng cho đổi mới)
 * 
 * ⚠️ UNSAFE: Client-side stock commitment without transaction
 */
export function commitWarrantyStock(
  _ticket: WarrantyTicket,
  _products: Array<{ id: string; systemId: string; name: string; [key: string]: unknown }>
) {
  console.warn('⚠️ DEPRECATED: commitWarrantyStock. Use POST /api/warranties endpoint.');
  // Method body removed - use server endpoint
}

/**
 * @deprecated Use server endpoint: POST /api/warranties/:id/cancel with uncommit
 * Uncommit stock khi xóa warranty (giải phóng hàng giữ chỗ)
 * 
 * ⚠️ UNSAFE: Client-side stock uncommitment without transaction
 */
export function uncommitWarrantyStock(
  _ticket: WarrantyTicket,
  _products: Array<{ id: string; systemId: string; name: string; [key: string]: unknown }>,
  _options?: { silent?: boolean }
) {
  console.warn('⚠️ DEPRECATED: uncommitWarrantyStock. Use POST /api/warranties/:id/cancel endpoint.');
  // Method body removed - use server endpoint
}

/**
 * @deprecated Use server endpoint: POST /api/warranties/:id/complete with stock deduction
 * Xuất kho khi 'completed' - Dùng dispatchStock giống đơn hàng
 * 
 * ⚠️ UNSAFE: Client-side stock deduction + stock history without transaction
 */
export function deductWarrantyStock(
  _ticket: WarrantyTicket,
  _products: Array<{ id: string; systemId: string; name: string; inventoryByBranch: Record<string, number>; [key: string]: unknown }>
) {
  console.warn('⚠️ DEPRECATED: deductWarrantyStock. Use POST /api/warranties/:id/complete endpoint.');
  console.error('🚨 UNSAFE: This method accesses useProductStore and useStockHistoryStore without transactions.');
  // Method body removed - use server endpoint
}

/**
 * @deprecated Use server endpoint: POST /api/warranties/:id/cancel with stock rollback
 * Hoàn kho khi hủy warranty - Ngược lại với dispatchStock
 * 
 * ⚠️ UNSAFE: Client-side stock rollback + stock history without transaction
 */
export function rollbackWarrantyStock(
  _ticket: WarrantyTicket,
  _products: Array<{ id: string; systemId: string; name: string; inventoryByBranch: Record<string, number>; [key: string]: unknown }>
) {
  console.warn('⚠️ DEPRECATED: rollbackWarrantyStock. Use POST /api/warranties/:id/cancel endpoint.');
  console.error('🚨 UNSAFE: This method accesses useProductStore and useStockHistoryStore without transactions.');
  // Method body removed - use server endpoint
}
