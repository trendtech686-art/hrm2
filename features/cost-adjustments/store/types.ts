/**
 * Cost Adjustments Store - Types
 * Store state interface and type definitions
 * 
 * @module features/cost-adjustments/store/types
 */

import type { SystemId } from '../../../lib/id-types';
import type { CostAdjustment, CostAdjustmentItem, CostAdjustmentType, CostAdjustmentStatus } from '@/lib/types/prisma-extended';

export interface CostAdjustmentStoreState {
  data: CostAdjustment[];
  counter: number;
  
  // CRUD
  getById: (systemId: string | SystemId) => CostAdjustment | undefined;
  getByBusinessId: (businessId: string) => CostAdjustment | undefined;
  
  // Create
  create: (
    items: Omit<CostAdjustmentItem, 'adjustmentAmount' | 'adjustmentPercent'>[],
    type: CostAdjustmentType,
    createdBySystemId: string | SystemId,
    createdByName: string,
    options?: {
      customId?: string;
      note?: string;
      reason?: string;
      referenceCode?: string;
      status?: CostAdjustmentStatus;
    }
  ) => CostAdjustment;
  
  // Actions
  confirm: (systemId: string | SystemId, confirmedBySystemId: string | SystemId, confirmedByName: string) => boolean;
  cancel: (systemId: string | SystemId, cancelledBySystemId: string | SystemId, cancelledByName: string, reason?: string) => boolean;
  
  // Queries
  getAll: () => CostAdjustment[];
  getByStatus: (status: CostAdjustmentStatus) => CostAdjustment[];
  
  // Helpers
  generateNextId: () => string;
  isBusinessIdExists: (businessId: string) => boolean;
}

export type { CostAdjustment, CostAdjustmentItem, CostAdjustmentType, CostAdjustmentStatus };
