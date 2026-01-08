/**
 * Products Store - Base Store Setup
 * Core store configuration using store factory
 * 
 * @deprecated Use React Query hooks instead:
 * - `useProducts()` for list
 * - `useProduct(id)` for single
 * - `useProductMutations()` for create/update/delete
 * 
 * Import from: `@/features/products/hooks/use-products`
 * 
 * This store will be removed in a future version.
 * Current usage kept for backward compatibility only.
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
