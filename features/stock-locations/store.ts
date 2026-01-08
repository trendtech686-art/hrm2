/**
 * @deprecated Use React Query hooks instead:
 * - `useStockLocations()` for list
 * - `useStockLocation(id)` for single
 * 
 * Import from: `@/features/stock-locations/hooks/use-stock-locations`
 * 
 * This store will be removed in a future version.
 */
import { createCrudStore } from '../../lib/store-factory';
import type { StockLocation } from '@/lib/types/prisma-extended';

export const useStockLocationStore = createCrudStore<StockLocation>([], 'stock-locations', {});
