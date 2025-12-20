import React from 'react';
import { describe, it, beforeAll, afterEach, beforeEach, expect, vi } from 'vitest';
import type { MockedFunction } from 'vitest';
import { cleanup, render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from '@/lib/next-compat';

import { CustomersPage } from '../page';
import { PageHeaderProvider } from '../../../contexts/page-header-context';
import { BreakpointProvider } from '../../../contexts/breakpoint-context';
import type { CustomerQueryParams, CustomerQueryResult } from '../customer-service';
import { fetchCustomersPage } from '../customer-service';

vi.mock('../customer-service', async () => {
  const actual = await vi.importActual<typeof import('../customer-service')>('../customer-service');
  return {
    ...actual,
    fetchCustomersPage: vi.fn(async (params: CustomerQueryParams): Promise<CustomerQueryResult> => ({
      items: [],
      total: 0,
      pageCount: 1,
      pageIndex: params.pagination.pageIndex,
    })),
  };
});

const fetchCustomersPageMock = fetchCustomersPage as MockedFunction<typeof fetchCustomersPage>;

function renderCustomersPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/customers']}>
        <BreakpointProvider>
          <PageHeaderProvider>
            <Routes>
              <Route path="/customers" element={<CustomersPage />} />
            </Routes>
          </PageHeaderProvider>
        </BreakpointProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

function mockDomApis() {
  if (!window.matchMedia) {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  }

  if (!window.ResizeObserver) {
    window.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as typeof ResizeObserver;
  }
}

describe('CustomersPage persistence + query integration', () => {
  beforeAll(() => {
    mockDomApis();
  });

  beforeEach(() => {
    fetchCustomersPageMock.mockClear();
    localStorage.clear();
    sessionStorage.clear?.();
  });

  afterEach(() => {
    cleanup();
  });

  it('hydrates persisted table state (forcing showDeleted=false) and passes it to fetchCustomersPage', async () => {
    const persistedState: CustomerQueryParams = {
      search: 'acme',
      statusFilter: 'Đang giao dịch',
      typeFilter: 'all',
      dateRange: undefined,
      showDeleted: true,
      slaFilter: 'all',
      debtFilter: 'all',
      pagination: { pageIndex: 2, pageSize: 25 },
      sorting: { id: 'createdAt', desc: true },
    };
    localStorage.setItem('customers-table-state', JSON.stringify(persistedState));

    renderCustomersPage();

    await waitFor(() => expect(fetchCustomersPageMock).toHaveBeenCalled());
    
    // Get the last call params (may be called multiple times due to React Query)
    const lastCallIndex = fetchCustomersPageMock.mock.calls.length - 1;
    const callParams = fetchCustomersPageMock.mock.calls[lastCallIndex][0];
    expect(callParams.search).toBe('acme');
    expect(callParams.statusFilter).toBe('Đang giao dịch');
    expect(callParams.showDeleted).toBe(false);
    expect(callParams.pagination).toMatchObject({ pageIndex: 2, pageSize: 25 });
    expect(callParams.sorting).toMatchObject({ id: 'createdAt', desc: true });

    const storedState = JSON.parse(localStorage.getItem('customers-table-state') as string);
    expect(storedState.showDeleted).toBe(false);
  });
});
