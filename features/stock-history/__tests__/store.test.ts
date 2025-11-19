import { beforeEach, describe, expect, it, vi } from 'vitest';
import { asBusinessId, asSystemId } from '@/lib/id-types';
import type { StockHistoryEntry } from '../types';

const clone = <T,>(value: T): T =>
  typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));

const baseEntries: StockHistoryEntry[] = [
  {
    systemId: asSystemId('SH-MOCK-001'),
    productId: asSystemId('PRODUCT0001'),
    date: '2025-01-01T09:00:00Z',
    employeeName: 'Tester 1',
    action: 'Nhập kho (Kiểm hàng)',
    quantityChange: 5,
    newStockLevel: 15,
    documentId: asBusinessId('PKK000001'),
    branchSystemId: asSystemId('BRANCH000001'),
    branch: 'Chi nhánh Hà Nội',
  },
  {
    systemId: asSystemId('SH-MOCK-002'),
    productId: asSystemId('PRODUCT0001'),
    date: '2025-01-03T10:00:00Z',
    employeeName: 'Tester 2',
    action: 'Xuất kho (Kiểm hàng)',
    quantityChange: -2,
    newStockLevel: 13,
    documentId: asBusinessId('PKK000002'),
    branchSystemId: asSystemId('BRANCH000002'),
    branch: 'Chi nhánh TP.HCM',
  },
  {
    systemId: asSystemId('SH-MOCK-003'),
    productId: asSystemId('PRODUCT0001'),
    date: '2025-01-02T08:00:00Z',
    employeeName: 'Tester 3',
    action: 'Nhập kho (Kiểm hàng)',
    quantityChange: 3,
    newStockLevel: 16,
    documentId: asBusinessId('PKK000003'),
    branchSystemId: asSystemId('BRANCH000001'),
    branch: 'Chi nhánh Hà Nội',
  },
];

vi.mock('../data.ts', () => ({
  data: clone(baseEntries),
}));

const { useStockHistoryStore } = await import('../store');

const initialEntries = clone(useStockHistoryStore.getState().entries);

beforeEach(() => {
  localStorage.clear();
  const state = useStockHistoryStore.getState();
  state.entries = clone(initialEntries);
});

describe('useStockHistoryStore', () => {
  it('addEntry generates branded systemId and appends to entries', () => {
    const store = useStockHistoryStore.getState();
    store.addEntry({
      productId: asSystemId('PRODUCT0001'),
      date: '2025-02-01T08:00:00Z',
      employeeName: 'Inventory Bot',
      action: 'Nhập kho (Kiểm hàng)',
      quantityChange: 4,
      newStockLevel: 20,
      documentId: asBusinessId('PKK000010'),
      branchSystemId: asSystemId('BRANCH000001'),
      branch: 'Chi nhánh Hà Nội',
    });

    const entries = useStockHistoryStore.getState().entries;
    const lastEntry = entries[entries.length - 1];
    expect(lastEntry).toMatchObject({
      productId: asSystemId('PRODUCT0001'),
      quantityChange: 4,
      branchSystemId: asSystemId('BRANCH000001'),
    });
    expect(lastEntry.systemId).toMatch(/^HISTORY\d{6}_\d+$/);
  });

  it('getHistoryForProduct filters by branch and sorts by date desc', () => {
    const store = useStockHistoryStore.getState();
    const branchEntries = store.getHistoryForProduct(
      asSystemId('PRODUCT0001'),
      asSystemId('BRANCH000001')
    );

    expect(branchEntries).toHaveLength(2);
    expect(branchEntries[0].date).toBe('2025-01-02T08:00:00Z');
    expect(branchEntries[1].date).toBe('2025-01-01T09:00:00Z');
    expect(branchEntries.every((entry) => entry.branchSystemId === asSystemId('BRANCH000001'))).toBe(true);
  });
});
