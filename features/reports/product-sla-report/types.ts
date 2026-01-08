/**
 * Re-export StockAlertReportRow type from centralized prisma-extended.ts
 * This file exists for backwards compatibility during migration
 */
export { type StockAlertReportRow } from '@/lib/types/prisma-extended';

// Local UI-specific type (not in prisma-extended)
export type StockAlertFilter = 'all' | 'out_of_stock' | 'low_stock' | 'below_safety' | 'over_stock';
