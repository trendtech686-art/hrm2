import { createCrudStore } from '../../../lib/store-factory.ts';
import { data as initialData } from './data.ts';
import type { JobTitle } from './types.ts';

export const useJobTitleStore = createCrudStore<JobTitle>(initialData, 'job-titles');
