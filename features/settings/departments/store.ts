/**
 * @deprecated Use React Query hooks instead:
 * - `useDepartments()` for list
 * - `useDepartment(id)` for single
 * - `useDepartmentMutations()` for create/update/delete
 * 
 * Import from: `@/features/settings/departments/hooks/use-departments`
 * 
 * This store will be removed in a future version.
 */
import { createCrudStore } from '../../../lib/store-factory';
import type { Department } from '@/lib/types/prisma-extended';

export const useDepartmentStore = createCrudStore<Department>([], 'departments');
