
import { createCrudStore } from '../../lib/store-factory.ts';
import { data as initialData } from './data.ts';
import type { LeaveRequest } from './types.ts';

export const useLeaveStore = createCrudStore<LeaveRequest>(initialData, 'leaves');
