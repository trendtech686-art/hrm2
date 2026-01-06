import { createCrudStore } from '../../../lib/store-factory';
import type { Unit } from '@/lib/types/prisma-extended';

export const useUnitStore = createCrudStore<Unit>([], 'units', {});
