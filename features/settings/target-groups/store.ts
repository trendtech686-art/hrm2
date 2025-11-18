import { createCrudStore } from '../../../lib/store-factory.ts';
import { data as initialData } from './data.ts';
import type { TargetGroup } from './types.ts';

export const useTargetGroupStore = createCrudStore<TargetGroup>(initialData, 'target-groups', {
  persistKey: 'hrm-target-groups' // ✅ Enable localStorage persistence
});
