import { createCrudStore } from '../../lib/store-factory';
import type { StockLocation } from '@/lib/types/prisma-extended';

export const useStockLocationStore = createCrudStore<StockLocation>([], 'stock-locations', {});
