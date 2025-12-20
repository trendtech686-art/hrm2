import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from '@/lib/next-compat';
import { PageHeaderProvider } from '../../../contexts/page-header-context';
import { PayrollRunPage } from '../run-page';

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/payroll/run"]}>
      <PageHeaderProvider>
        <PayrollRunPage />
      </PageHeaderProvider>
    </MemoryRouter>
  );
}

describe('PayrollRunPage', () => {
  test('renders step wizard without crashing', () => {
    renderPage();
    expect(screen.getByText('Tiến trình')).toBeInTheDocument();
    expect(screen.getByText('Cấu hình kỳ lương')).toBeInTheDocument();
  });
});
