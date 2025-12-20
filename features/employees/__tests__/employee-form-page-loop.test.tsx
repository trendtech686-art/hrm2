import { describe, it } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from '@/lib/next-compat';
import { PageHeaderProvider } from '../../../contexts/page-header-context';
import { EmployeeFormPage } from '../employee-form-page';

describe('EmployeeFormPage render', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    sessionStorage.clear?.();
  });

  it('renders new employee page without crashing', () => {
    render(
      <MemoryRouter initialEntries={["/employees/new"]}>
        <PageHeaderProvider>
          <Routes>
            <Route path="/employees/new" element={<EmployeeFormPage />} />
          </Routes>
        </PageHeaderProvider>
      </MemoryRouter>
    );
  });
});
