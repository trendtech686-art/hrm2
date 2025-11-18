import { createCrudStore } from '../../../lib/store-factory.ts';
import { data as initialData } from './data.ts';
import type { Department } from './types.ts';

export const useDepartmentStore = createCrudStore<Department>(initialData, 'departments');
