import { createCrudStore } from '../../../lib/store-factory';
import { data as initialData } from './data';
import type { Department } from '@/lib/types/prisma-extended';

export const useDepartmentStore = createCrudStore<Department>(initialData, 'departments');
