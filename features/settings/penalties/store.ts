import { createCrudStore } from '../../../lib/store-factory.ts';
import { data as initialData } from './data.ts';
import type { Penalty } from './types.ts';

export const usePenaltyStore = createCrudStore<Penalty>(initialData, 'penalties');
