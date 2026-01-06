/**
 * Sales Returns Store - Base Store
 * Core store creation with CRUD operations
 * 
 * @module features/sales-returns/store/base-store
 */

import { createCrudStore } from '../../../lib/store-factory';
import type { SalesReturn } from '@/lib/types/prisma-extended';

// ============================================
// BASE STORE CREATION
// ============================================

export const baseStore = createCrudStore<SalesReturn>([], 'sales-returns', {});

// ============================================
// ORIGINAL ADD REFERENCE
// ============================================

export const originalAdd = baseStore.getState().add;
