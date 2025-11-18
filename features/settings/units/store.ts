import { createCrudStore } from '../../../lib/store-factory.ts';
import { data as initialData } from './data.ts';
import type { Unit } from './types.ts';

export const useUnitStore = createCrudStore<Unit>(initialData, 'units', {
  persistKey: 'hrm-units' // ✅ Enable localStorage persistence
});
