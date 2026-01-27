/**
 * @deprecated Use React Query hooks instead:
 * - `usePurchaseReturns()` for list
 * - `usePurchaseReturn(id)` for single
 * - `usePurchaseReturnMutations()` for create/update/delete
 * 
 * Import from: `@/features/purchase-returns/hooks/use-purchase-returns`
 * 
 * This store will be removed in a future version.
 */
import { createCrudStore, type CrudState } from '../../lib/store-factory';
import type { PurchaseReturn } from '@/lib/types/prisma-extended';
import { type SystemId } from '@/lib/id-types';

const baseStore = createCrudStore<PurchaseReturn>(
  [],
  'purchase-returns',
  {}
);

const _originalAdd = baseStore.getState().add;

/**
 * @deprecated Use React Query mutation: usePurchaseReturnMutations().create
 * 
 * Server endpoint: POST /api/purchase-returns
 * ⚠️ UNSAFE: Client-side multi-store operations are not atomic
 * 
 * Required server-side operations:
 * - Create the return record
 * - Update inventory (reduce stock)
 * - Add stock history entry
 * - Create receipt if supplier refunds money
 * - Update original PO status
 * - Validate against received quantities
 */
const newAdd = (_item: Omit<PurchaseReturn, 'systemId'>): PurchaseReturn | undefined => {
    console.warn('⚠️ DEPRECATED: purchase-returns store newAdd method. Use usePurchaseReturnMutations().create mutation instead.');
    console.error('🚨 UNSAFE OPERATION: This method accesses 8 different stores without transactions:');
    console.error('   - useProductStore (updateInventory, findById)');
    console.error('   - useStockHistoryStore (addEntry)');
    console.error('   - useReceiptStore (add)');
    console.error('   - usePurchaseOrderStore (processReturn, data)');
    console.error('   - useCashbookStore (accounts)');
    console.error('   - useReceiptTypeStore (data)');
    console.error('   - useInventoryReceiptStore (data)');
    console.error('');
    console.error('   Use server-side POST /api/purchase-returns endpoint for atomic transaction.');
    
    return undefined;
};

const otherMethods = {
  findByPurchaseOrderSystemId: (purchaseOrderSystemId: SystemId) => {
    return baseStore.getState().data.filter(pr => pr.purchaseOrderSystemId === purchaseOrderSystemId);
  }
};

type BaseState = CrudState<PurchaseReturn>;

export type PurchaseReturnStoreState = Omit<BaseState, 'add'> & {
  add: typeof newAdd;
  findByPurchaseOrderSystemId: (purchaseOrderSystemId: SystemId) => PurchaseReturn[];
};

export const usePurchaseReturnStore = (): PurchaseReturnStoreState => {
  const { add: _unusedAdd, ...rest } = baseStore();
  return {
    ...rest,
    add: newAdd,
    ...otherMethods,
  } as PurchaseReturnStoreState;
};

usePurchaseReturnStore.getState = (): PurchaseReturnStoreState => {
  const { add: _unusedAdd, ...rest } = baseStore.getState();
  return {
    ...rest,
    add: newAdd,
    ...otherMethods,
  } as PurchaseReturnStoreState;
};
