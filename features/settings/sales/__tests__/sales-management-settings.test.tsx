import { afterEach, beforeAll, describe, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { SalesManagementSettings } from '../sales-management-settings.tsx';

// Minimal harness to reproduce sales-management tab crash

describe('SalesManagementSettings', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
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

  it('renders without infinite updates', () => {
    render(<SalesManagementSettings />);
  });
});
