import { createCrudStore } from '../../lib/store-factory';
import { data as initialData } from './data';
import type { StockLocation } from '@/lib/types/prisma-extended';

export const useStockLocationStore = createCrudStore<StockLocation>(initialData, 'stock-locations', {
  persistKey: 'hrm-stock-locations' // ✅ Enable localStorage persistence
});
