import { createCrudStore } from '../../../lib/store-factory';
import { data as initialData } from './data';
import type { Department } from './types';

export const useDepartmentStore = createCrudStore<Department>(initialData, 'departments');
