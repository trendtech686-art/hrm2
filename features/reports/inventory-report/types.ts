/**
 * Re-export InventoryReportRow type from centralized prisma-extended.ts
 * This file exists for backwards compatibility during migration
 */
export { type InventoryReportRow } from '@/lib/types/prisma-extended';

// Local UI-specific type (not in prisma-extended)
export type ProductTypeFilter = 'all' | 'single' | 'combo';
