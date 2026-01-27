/**
 * Sales Returns Store - Inventory Slice
 * Handles inventory updates when processing returns
 * 
 * ⚠️ DEPRECATED: These client-side operations are unsafe and should be replaced
 * with server-side atomic transactions via POST /api/sales-returns
 * 
 * @module features/sales-returns/store/inventory-slice
 */

import type { SalesReturn } from '@/lib/types/prisma-extended';
import type { SystemId } from '../../../lib/id-types';

// ============================================
// UPDATE INVENTORY FOR RETURN
// ============================================

/**
 * @deprecated Use server-side endpoint: POST /api/sales-returns with isReceived=true
 * Update inventory when items are received from customer
 * Handles combo products by adding stock to child products
 * 
 * ⚠️ UNSAFE: Client-side inventory updates are not atomic and can cause data corruption
 */
export const updateInventoryForReturn = (
    _salesReturn: SalesReturn,
    _products: Array<{ systemId: SystemId; inventoryByBranch: Record<string, number> }>
): void => {
    console.warn('⚠️ DEPRECATED: updateInventoryForReturn. Use server-side POST /api/sales-returns endpoint.');
    // Method body removed - use server endpoint
};

// ============================================
// CONFIRM RECEIPT SLICE
// ============================================

export const inventorySlice = {
    /**
     * @deprecated Use React Query mutation: useSalesReturnMutations().receive
     * Confirm receipt of returned items and update inventory
     * 
     * Server endpoint: POST /api/sales-returns/:id/receive
     * ⚠️ UNSAFE: Client-side operation - use server endpoint for atomic transaction
     */
    confirmReceipt: (
        _returnSystemId: SystemId,
        _products: Array<{ systemId: SystemId; inventoryByBranch: Record<string, number> }>
    ): { success: boolean; message: string } => {
        console.warn('⚠️ DEPRECATED: confirmReceipt. Use useSalesReturnMutations().receive mutation instead.');
        return { success: false, message: 'Method deprecated - use server endpoint' };
    },
};
