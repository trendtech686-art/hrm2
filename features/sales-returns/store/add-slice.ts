/**
 * Sales Returns Store - Add Slice
 * Main add operation with all side effects
 * 
 * ⚠️ DEPRECATED: This client-side operation is unsafe and should be replaced
 * with server-side atomic transaction via POST /api/sales-returns
 * 
 * @module features/sales-returns/store/add-slice
 */

import type { SalesReturn } from '@/lib/types/prisma-extended';
import type { SystemId } from '../../../lib/id-types';

// ============================================
// ADD WITH SIDE EFFECTS
// ============================================

export const addSlice = {
    /**
     * @deprecated Use React Query mutation: useSalesReturnMutations().create
     * 
     * Server endpoint: POST /api/sales-returns
     * ⚠️ UNSAFE: Client-side multi-store operations are not atomic
     * 
     * Required server-side operations:
     * - Create the sales return record
     * - Update customer return stats
     * - Create exchange order if needed
     * - Adjust customer debt
     * - Create payment/receipt vouchers
     * - Update inventory (if items received)
     * - Update original order's return status
     */
    addWithSideEffects: (_item: Omit<SalesReturn, 'systemId' | 'id'> & { creatorId: string }): { 
        newReturn: SalesReturn | null; 
        newOrderSystemId: SystemId | null 
    } => {
        console.warn('⚠️ DEPRECATED: addWithSideEffects. Use useSalesReturnMutations().create mutation instead.');
        console.error('🚨 UNSAFE OPERATION: This method performs multiple store updates without transactions.');
        console.error('   - useOrderStore (update, findById)');
        console.error('   - useCustomerStore (updateDebt, incrementReturnStats)');
        console.error('   - useProductStore (via updateInventoryForReturn)');
        console.error('   - useStockHistoryStore (via updateInventoryForReturn)');
        console.error('   - usePaymentStore (via createRefundVouchers/createReceiptVouchers)');
        console.error('   - useReceiptStore (via createRefundVouchers/createReceiptVouchers)');
        console.error('');
        console.error('   Use server-side POST /api/sales-returns endpoint for atomic transaction.');
        
        return { newReturn: null, newOrderSystemId: null };
    },
};
