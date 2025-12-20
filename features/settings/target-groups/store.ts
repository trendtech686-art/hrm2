import { createCrudStore } from '../../../lib/store-factory';
import { data as initialData } from './data';
import type { TargetGroup } from './types';

export const useTargetGroupStore = createCrudStore<TargetGroup>(initialData, 'target-groups', {
  persistKey: 'hrm-target-groups' // ✅ Enable localStorage persistence
});
