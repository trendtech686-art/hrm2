/**
 * @deprecated Use React Query hooks instead:
 * - `usePenalties()` for list
 * - `usePenaltyById(id)` for single
 * - `usePenaltyMutations()` for create/update/delete
 * 
 * Import from: `@/features/settings/penalties/hooks/use-penalties`
 * 
 * This store will be removed in a future version.
 */
import { createCrudStore } from '../../../lib/store-factory';
import type { Penalty, PenaltyType } from './types';

export const usePenaltyStore = createCrudStore<Penalty>([], 'penalties', {
  businessIdField: 'id',
});

export const usePenaltyTypeStore = createCrudStore<PenaltyType>([], 'penalties', {
  businessIdField: 'id',
});
