/**
 * Re-export CostAdjustment types from centralized prisma-extended.ts
 * This file exists for backwards compatibility during migration
 */
export {
  type CostAdjustmentType,
  type CostAdjustmentStatus,
  type CostAdjustmentItem,
  type CostAdjustment,
} from '@/lib/types/prisma-extended';
