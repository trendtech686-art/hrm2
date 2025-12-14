import { describe, it, afterEach, beforeAll, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PageHeaderProvider } from '../../../contexts/page-header-context.tsx';
import { BreakpointProvider } from '../../../contexts/breakpoint-context.tsx';
import { CustomersPage } from '../page.tsx';

// Basic smoke test to reproduce the reported maximum update depth error

describe('CustomersPage render stability', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    sessionStorage.clear?.();
  });

  beforeAll(() => {
    if (!window.matchMedia) {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
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
  });

  it('renders customers list page without crashing', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/customers"]}>
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
  });
});
