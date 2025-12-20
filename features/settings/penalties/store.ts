import { createCrudStore } from '../../../lib/store-factory';
import { data as initialData, penaltyTypesData } from './data';
import type { Penalty, PenaltyType } from './types';

export const usePenaltyStore = createCrudStore<Penalty>(initialData, 'penalties', {
  businessIdField: 'id',
  persistKey: 'hrm-penalties',
});

export const usePenaltyTypeStore = createCrudStore<PenaltyType>(penaltyTypesData, 'penalties', {
  businessIdField: 'id',
  persistKey: 'hrm-penalty-types',
});
