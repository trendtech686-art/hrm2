import { createCrudStore } from '../../../lib/store-factory';
import type { Department } from '@/lib/types/prisma-extended';

export const useDepartmentStore = createCrudStore<Department>([], 'departments');
