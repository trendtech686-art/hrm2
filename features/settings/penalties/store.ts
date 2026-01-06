import { createCrudStore } from '../../../lib/store-factory';
import type { Penalty, PenaltyType } from './types';

export const usePenaltyStore = createCrudStore<Penalty>([], 'penalties', {
  businessIdField: 'id',
});

export const usePenaltyTypeStore = createCrudStore<PenaltyType>([], 'penalties', {
  businessIdField: 'id',
});
