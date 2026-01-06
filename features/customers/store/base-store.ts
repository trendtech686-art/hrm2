/**
 * Customers Store - Base Store Setup
 * Core store configuration using store factory
 * 
 * @module features/customers/store/base-store
 */

import { createCrudStore, CrudState } from '../../../lib/store-factory';
import type { Customer } from '@/lib/types/prisma-extended';
import { getCurrentUserSystemId } from '../../../contexts/auth-context';

export const baseStore = createCrudStore<Customer>([], 'customers', {
    businessIdField: 'id',
    getCurrentUser: getCurrentUserSystemId,
});

export type { CrudState };
export const originalAdd = baseStore.getState().add;
export const originalUpdate = baseStore.getState().update;
