import { describe, it, beforeEach, expect, vi } from 'vitest';
import type { Product } from '../types';
import { fetchProductsPage, getFilteredProductsSnapshot, DEFAULT_PRODUCT_SORT, type ProductQueryParams } from '../product-service';
import { asBusinessId, asSystemId } from '../../../lib/id-types';

const mockStoreState = { data: [] as Product[] };

vi.mock('../store.ts', async () => {
  const actual = await vi.importActual<typeof import('../store')>('../store');
  return {
    ...actual,
    useProductStore: Object.assign(() => mockStoreState, {
      getState: () => mockStoreState,
    }),
  };
});

describe('product-service filtering pipeline', () => {
  const baseParams: ProductQueryParams = {
    search: '',
    statusFilter: 'all',
    typeFilter: 'all',
    categoryFilter: 'all',
    comboFilter: 'all',
    stockLevelFilter: 'all',
    pkgxFilter: 'all',
    dateRange: undefined,
    pagination: { pageIndex: 0, pageSize: 25 },
    sorting: DEFAULT_PRODUCT_SORT,
  };

  beforeEach(() => {
    mockStoreState.data = [
      {
        systemId: asSystemId('PROD-1'),
        id: asBusinessId('SP001'),
        name: 'Sữa tươi Vinamilk',
        status: 'active',
        type: 'physical',
        categorySystemId: 'cat-1' as any,
        unit: 'Hộp',
        costPrice: 10000,
        prices: {},
        inventoryByBranch: {},
        committedByBranch: {},
        inTransitByBranch: {},
        createdAt: '2024-01-01T00:00:00.000Z',
        isDeleted: false,
      },
      {
        systemId: asSystemId('PROD-2'),
        id: asBusinessId('SP002'),
        name: 'Dịch vụ bảo trì máy',
        status: 'inactive',
        type: 'service',
        categorySystemId: 'cat-2' as any,
        unit: 'Gói',
        costPrice: 20000,
        prices: {},
        inventoryByBranch: {},
        committedByBranch: {},
        inTransitByBranch: {},
        createdAt: '2024-02-15T00:00:00.000Z',
        isDeleted: false,
      },
      {
        systemId: asSystemId('PROD-3'),
        id: asBusinessId('SP003'),
        name: 'Thẻ quà tặng điện tử',
        status: 'active',
        type: 'digital',
        categorySystemId: 'cat-1' as any,
        unit: 'Thẻ',
        costPrice: 0,
        prices: {},
        inventoryByBranch: {},
        committedByBranch: {},
        inTransitByBranch: {},
        createdAt: '2023-12-20T00:00:00.000Z',
        isDeleted: true,
      },
    ];
  });

  it('applies search and status filters before pagination', async () => {
    const result = await fetchProductsPage({
      ...baseParams,
      search: 'vinamilk',
      statusFilter: 'active',
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toContain('Vinamilk');
    expect(result.total).toBe(1);
  });

  it('excludes deleted products from snapshot and respects category filter', () => {
    const snapshot = getFilteredProductsSnapshot({
      ...baseParams,
      categoryFilter: 'cat-1',
    });

    expect(snapshot).toHaveLength(1);
    expect(snapshot[0].id).toBe(asBusinessId('SP001'));
  });

  it('sorts deterministically by createdAt when requested', async () => {
    const result = await fetchProductsPage({
      ...baseParams,
      sorting: { id: 'createdAt', desc: true },
    });

    expect(result.items[0].id).toBe(asBusinessId('SP002'));
  });
});
