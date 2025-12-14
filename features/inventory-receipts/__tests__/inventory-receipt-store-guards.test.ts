import { describe, expect, it } from 'vitest';
import { useInventoryReceiptStore, syncInventoryReceiptsWithPurchaseOrders } from '@/features/inventory-receipts/store';
import type { InventoryReceipt } from '@/features/inventory-receipts/types';
import type { CrudState } from '@/lib/store-factory';

const REQUIRED_METHODS: Array<keyof CrudState<InventoryReceipt>> = [
  'add',
  'addMultiple',
  'update',
  'remove',
  'hardDelete',
  'restore',
  'findById',
  'getActive',
  'getDeleted',
];

describe('inventory receipts guard tests', () => {
  it('exposes the CRUD helpers expected from the factory store', () => {
    const state = useInventoryReceiptStore.getState();

    REQUIRED_METHODS.forEach((method) => {
      expect(typeof state[method]).toBe('function');
    });
    expect(Array.isArray(state.data)).toBe(true);
    expect(state.data.every((receipt) => Boolean(receipt.systemId && receipt.id))).toBe(true);
  });

  it('keeps the sync utility callable even with empty inputs', () => {
    const before = useInventoryReceiptStore.getState().data;
    syncInventoryReceiptsWithPurchaseOrders({ purchaseOrders: [], products: [] });
    const after = useInventoryReceiptStore.getState().data;
    expect(after).toBe(before);
  });
});
