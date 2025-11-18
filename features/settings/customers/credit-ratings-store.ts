import { createCrudStore } from '../../../lib/store-factory';
import type { CreditRating } from './types';
import { defaultCreditRatings } from './credit-ratings-data';

export const useCreditRatingStore = createCrudStore<CreditRating>(
  defaultCreditRatings, 'credit-ratings',
  {
    persistKey: 'hrm-credit-ratings',
  }
);
