import { describe, it, afterEach, beforeAll, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PageHeaderProvider } from '../../../../contexts/page-header-context.tsx';
import { BreakpointProvider } from '../../../../contexts/breakpoint-context.tsx';
import { SalesConfigPage } from '../sales-config-page.tsx';

// Smoke test to surface the reported maximum update depth error on /settings/sales-config

describe('SalesConfigPage render stability', () => {
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

  it('renders without crashing', () => {
    render(
      <MemoryRouter initialEntries={["/settings/sales-config"]}>
        <BreakpointProvider>
          <PageHeaderProvider>
            <Routes>
              <Route path="/settings/sales-config" element={<SalesConfigPage />} />
            </Routes>
          </PageHeaderProvider>
        </BreakpointProvider>
      </MemoryRouter>
    );
  });
});
