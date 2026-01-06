/**
 * Products Store - Base Store Setup
 * Core store configuration using store factory
 * 
 * @module features/products/store/base-store
 */

import { createCrudStore, CrudState } from '../../../lib/store-factory';
import type { Product } from '@/lib/types/prisma-extended';
import { getCurrentUserSystemId } from '../../../contexts/auth-context';

export const baseStore = createCrudStore<Product>([], 'products', {
    businessIdField: 'id',
    getCurrentUser: getCurrentUserSystemId,
});

export type { CrudState };
