import { createCrudStore } from '../../lib/store-factory.ts';
import { data as initialData } from './data.ts';
import type { InventoryReceipt } from './types.ts';

export const useInventoryReceiptStore = createCrudStore<InventoryReceipt>(
  initialData as any, 
  'inventory-receipts',
  {
    persistKey: 'hrm-inventory-receipts' // ✅ Enable localStorage persistence
  }
);
