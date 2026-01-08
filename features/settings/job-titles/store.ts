/**
 * @deprecated Use React Query hooks instead:
 * - `useJobTitles()` for list
 * - `useJobTitle(id)` for single
 * - `useJobTitleMutations()` for create/update/delete
 * 
 * Import from: `@/features/settings/job-titles/hooks/use-job-titles`
 * 
 * This store will be removed in a future version.
 */
import { createCrudStore } from '../../../lib/store-factory';
import type { JobTitle } from '@/lib/types/prisma-extended';

export const useJobTitleStore = createCrudStore<JobTitle>([], 'job-titles');
