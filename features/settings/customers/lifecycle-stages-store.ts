import { createCrudStore } from '../../../lib/store-factory';
import type { LifecycleStage } from './types';

export const useLifecycleStageStore = createCrudStore<LifecycleStage>(
  [], 'lifecycle-stages',
  {}
);
