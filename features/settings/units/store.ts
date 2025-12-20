import { createCrudStore } from '../../../lib/store-factory';
import { data as initialData } from './data';
import type { Unit } from './types';

export const useUnitStore = createCrudStore<Unit>(initialData, 'units', {
  persistKey: 'hrm-units' // ✅ Enable localStorage persistence
});
