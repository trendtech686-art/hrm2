import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PageHeaderProvider } from '../../../contexts/page-header-context.tsx';
import { PayrollRunPage } from '../run-page.tsx';

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
