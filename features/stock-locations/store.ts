import { createCrudStore } from '../../lib/store-factory.ts';
import { data as initialData } from './data.ts';
import type { StockLocation } from './types.ts';

export const useStockLocationStore = createCrudStore<StockLocation>(initialData, 'stock-locations', {
  persistKey: 'hrm-stock-locations' // ✅ Enable localStorage persistence
});
