import { createCrudStore } from '../../../lib/store-factory';
import { data as initialData } from './data';
import type { Unit } from '@/lib/types/prisma-extended';

export const useUnitStore = createCrudStore<Unit>(initialData, 'units', {
  persistKey: 'hrm-units' // ✅ Enable localStorage persistence
});
