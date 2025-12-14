import { createCrudStore } from '../../../lib/store-factory';
import type { LifecycleStage } from './types';
import { defaultLifecycleStages } from './lifecycle-stages-data';

export const useLifecycleStageStore = createCrudStore<LifecycleStage>(
  defaultLifecycleStages, 'lifecycle-stages',
  {
    persistKey: 'hrm-lifecycle-stages',
  }
);
