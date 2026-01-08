/**
 * @deprecated Use React Query hooks instead:
 * - `useStockHistory()` for list
 * 
 * Import from: `@/features/stock-history/hooks/use-stock-history`
 * 
 * This store will be removed in a future version.
 */
import { create } from 'zustand';
// Date utils removed - not used in this store
import type { StockHistoryEntry } from '@/lib/types/prisma-extended';
import { asSystemId } from '../../lib/id-types';
import type { SystemId } from '../../lib/id-types';

interface StockHistoryState {
  entries: StockHistoryEntry[];
  addEntry: (entry: Omit<StockHistoryEntry, 'systemId'>) => void;
  getHistoryForProduct: (productId: SystemId, branchSystemId?: 'all' | SystemId) => StockHistoryEntry[];
}

let entryCounter = 0;

export const useStockHistoryStore = create<StockHistoryState>()(
    (set, get) => ({
      entries: [], // Seed data removed for production
      addEntry: (entry) => set((state) => {
        entryCounter++;
        const newEntry: StockHistoryEntry = {
            ...entry,
            systemId: asSystemId(`HISTORY${String(Date.now()).slice(-6)}_${entryCounter}`),
        };
        return { entries: [...state.entries, newEntry] };
      }),
      getHistoryForProduct: (productId, branchSystemId = 'all') => {
          const productHistory = get().entries.filter(e => e.productId === productId);
          const sortedHistory = productHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          if (branchSystemId === 'all') {
            return sortedHistory;
          }
          return sortedHistory.filter(e => e.branchSystemId === branchSystemId);
        },
    })
);
