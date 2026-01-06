import { createCrudStore } from '../../../lib/store-factory';
import type { TargetGroup } from '@/lib/types/prisma-extended';

export const useTargetGroupStore = createCrudStore<TargetGroup>([], 'target-groups', {});
