/**
 * @deprecated Use React Query hooks instead:
 * - `useTargetGroups()` for list
 * - `useTargetGroupById(id)` for single
 * - `useTargetGroupMutations()` for create/update/delete
 * 
 * Import from: `@/features/settings/target-groups/hooks/use-target-groups`
 * 
 * This store will be removed in a future version.
 */
import { createCrudStore } from '../../../lib/store-factory';
import type { TargetGroup } from '@/lib/types/prisma-extended';

export const useTargetGroupStore = createCrudStore<TargetGroup>([], 'target-groups', {});
