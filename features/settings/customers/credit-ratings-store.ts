import { createCrudStore } from '../../../lib/store-factory';
import type { CreditRating } from './types';

export const useCreditRatingStore = createCrudStore<CreditRating>(
  [], 'credit-ratings',
  {}
);
