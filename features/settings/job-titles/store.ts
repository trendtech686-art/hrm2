import { createCrudStore } from '../../../lib/store-factory';
import { data as initialData } from './data';
import type { JobTitle } from './types';

export const useJobTitleStore = createCrudStore<JobTitle>(initialData, 'job-titles');
