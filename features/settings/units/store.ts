/**
 * @deprecated Use React Query hooks instead:
 * - `useUnits()` for list
 * - `useUnit(id)` for single
 * - `useUnitMutations()` for create/update/delete
 * 
 * Import from: `@/features/settings/units/hooks/use-units`
 * 
 * This store will be removed in a future version.
 */
import { createCrudStore } from '../../../lib/store-factory';
import type { Unit } from '@/lib/types/prisma-extended';

export const useUnitStore = createCrudStore<Unit>([], 'units', {});
