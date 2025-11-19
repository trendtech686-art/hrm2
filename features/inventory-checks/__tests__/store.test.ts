import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { asBusinessId, asSystemId, type SystemId } from '@/lib/id-types';
import type { InventoryCheck } from '../types';

const clone = <T>(value: T): T =>
  typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));

vi.mock('../../../contexts/auth-context.tsx', () => ({
  getCurrentUserSystemId: () => asSystemId('EMP999999'),
}));

vi.mock('../../employees/store.ts', () => ({
  useEmployeeStore: {
    getState: () => ({
      data: [{ systemId: asSystemId('EMP999999'), fullName: 'Tester' }],
    }),
  },
}));

const updateInventory = vi.fn();
const addEntry = vi.fn();

vi.mock('../../products/store.ts', () => ({
  useProductStore: {
    getState: () => ({
      updateInventory,
    }),
  },
}));

vi.mock('../../stock-history/store.ts', () => ({
  useStockHistoryStore: {
    getState: () => ({
      addEntry,
    }),
  },
}));

vi.mock('../data.ts', () => ({
  data: [
    {
      systemId: asSystemId('INVCHECKTEST'),
      id: asBusinessId('PKKTEST'),
      branchSystemId: asSystemId('BRANCH000001'),
      branchName: 'CN1',
      status: 'draft',
      createdBy: asSystemId('EMP000001'),
      createdAt: '2025-01-01T00:00:00Z',
      items: [],
    } satisfies InventoryCheck,
  ],
}));

const { useInventoryCheckStore } = await import('../store');

const initialDataSnapshot = clone(useInventoryCheckStore.getState().data);
const initialCounterSnapshot = clone(useInventoryCheckStore.getState()._counters);

describe('useInventoryCheckStore.balanceCheck', () => {
    beforeEach(() => {
      localStorage.clear();
      const state = useInventoryCheckStore.getState();
      state.data = clone(initialDataSnapshot);
      state._counters = clone(initialCounterSnapshot);
      updateInventory.mockClear();
      addEntry.mockClear();
    });

  afterEach(() => {
    updateInventory.mockClear();
    addEntry.mockClear();
  });

  it('balances draft check and updates inventory when difference > 0', async () => {
    const store = useInventoryCheckStore.getState();
    const systemId: SystemId = asSystemId('INVCHECKTEST');

    store.update(systemId, {
      ...store.findById(systemId)!,
      items: [
        {
          productSystemId: asSystemId('PRODUCT0001'),
          productId: asBusinessId('SP1'),
          productName: 'SP 1',
          unit: 'Cai',
          systemQuantity: 5,
          actualQuantity: 8,
          difference: 3,
        },
      ],
    });

    await store.balanceCheck(systemId);

    expect(store.findById(systemId)?.status).toBe('balanced');
    expect(store.findById(systemId)?.balancedBy).toEqual(asSystemId('EMP999999'));
    expect(updateInventory).toHaveBeenCalledWith(asSystemId('PRODUCT0001'), asSystemId('BRANCH000001'), 3);
    expect(addEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: asSystemId('PRODUCT0001'),
        quantityChange: 3,
        branchSystemId: asSystemId('BRANCH000001'),
      })
    );
  });

  it('skips inventory update when difference === 0 or status not draft', async () => {
    const store = useInventoryCheckStore.getState();
    const systemId = asSystemId('INVCHECKTEST');

    await store.balanceCheck(systemId);
    expect(updateInventory).not.toHaveBeenCalled();

    store.update(systemId, {
      ...store.findById(systemId)!,
      status: 'draft',
      items: [
        {
          productSystemId: asSystemId('PRODUCT0001'),
          productId: asBusinessId('SP1'),
          productName: 'SP 1',
          unit: 'Cai',
          systemQuantity: 10,
          actualQuantity: 10,
          difference: 0,
        },
      ],
    });

    await store.balanceCheck(systemId);
    expect(updateInventory).not.toHaveBeenCalled();
    expect(addEntry).not.toHaveBeenCalled();
  });
});
