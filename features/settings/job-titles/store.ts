import { createCrudStore } from '../../../lib/store-factory';
import type { JobTitle } from '@/lib/types/prisma-extended';

export const useJobTitleStore = createCrudStore<JobTitle>([], 'job-titles');
