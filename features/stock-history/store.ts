import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import type { StockHistoryEntry } from './types.ts';
import { data as initialData } from './data.ts';

// ✨ Migration helper: Convert SKU to systemId for old data
function migrateHistoryData(entries: StockHistoryEntry[]): StockHistoryEntry[] {
  // Map SKU → systemId from products
  const skuToSystemId: Record<string, string> = {
    'DV-WEB-01': 'SP00000001',
    'DV-WEB-02': 'SP00000002',
    'DV-WEB-03': 'SP00000003',
    'DV-MKT-01': 'SP00000004',
    'DV-MKT-02': 'SP00000005',
    'DV-MKT-03': 'SP00000006',
    'DV-SEO-01': 'SP00000007',
    'DV-SEO-02': 'SP00000008',
    'DV-IT-01': 'SP00000009',
    'DV-DSN-01': 'SP00000010',
    'SW-CRM-01': 'SP00000011',
    'SW-ERP-01': 'SP00000012',
    'SW-WIN-01': 'SP00000013',
    'SW-OFF-01': 'SP00000014',
    'SW-ADOBE-01': 'SP00000015',
    'HW-SRV-01': 'SP00000016',
    'HW-SRV-02': 'SP00000017',
    'HW-PC-01': 'SP00000018',
    'HW-PC-02': 'SP00000019',
    'HW-LT-01': 'SP00000020',
    'HW-NET-01': 'SP00000021',
    'HW-NET-02': 'SP00000022',
    'HW-CAM-01': 'SP00000023',
    'MISC-HOST-01': 'SP00000024',
    'MISC-HOST-02': 'SP00000025',
    'MISC-SSL-01': 'SP00000026',
    'MISC-DOMAIN-COM': 'SP00000027',
    'MISC-DOMAIN-VN': 'SP00000028',
    'MISC-PRINT-01': 'SP00000029',
    'MISC-PRINT-02': 'SP00000030',
  };
  
  return entries.map(entry => ({
    ...entry,
    productId: skuToSystemId[entry.productId] || entry.productId // Convert or keep if already systemId
  }));
}

interface StockHistoryState {
  entries: StockHistoryEntry[];
  addEntry: (entry: Omit<StockHistoryEntry, 'systemId'>) => void;
  getHistoryForProduct: (productId: string, branchSystemId?: 'all' | string) => StockHistoryEntry[];
}

let entryCounter = initialData.length;

export const useStockHistoryStore = create<StockHistoryState>()(
  persist(
    (set, get) => ({
      entries: migrateHistoryData(initialData), // ✨ Apply migration to initial data
      addEntry: (entry) => set((state) => {
        entryCounter++;
        const newEntry: StockHistoryEntry = {
            ...entry,
            systemId: `SH_${Date.now()}_${entryCounter}`,
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
    }),
    {
      name: 'hrm-stock-history-storage',
      storage: createJSONStorage(() => localStorage),
      // ✨ Apply migration when rehydrating from localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.entries = migrateHistoryData(state.entries);
        }
      },
    }
  )
);
