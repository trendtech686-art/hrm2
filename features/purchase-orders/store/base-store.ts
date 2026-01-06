/**
 * Purchase Orders Store - Base Store Setup
 * Core store configuration using store factory
 * 
 * @module features/purchase-orders/store/base-store
 */

import { createCrudStore } from '../../../lib/store-factory';
import type { PurchaseOrder } from '@/lib/types/prisma-extended';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const baseStore = createCrudStore<any>([] as PurchaseOrder[], 'purchase-orders', {
    businessIdField: 'id',
});
