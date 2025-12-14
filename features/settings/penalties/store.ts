import { createCrudStore } from '../../../lib/store-factory.ts';
import { data as initialData, penaltyTypesData } from './data.ts';
import type { Penalty, PenaltyType } from './types.ts';

export const usePenaltyStore = createCrudStore<Penalty>(initialData, 'penalties', {
  businessIdField: 'id',
  persistKey: 'hrm-penalties',
});

export const usePenaltyTypeStore = createCrudStore<PenaltyType>(penaltyTypesData, 'penalties', {
  businessIdField: 'id',
  persistKey: 'hrm-penalty-types',
});
