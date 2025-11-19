import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StockLocationForm } from '../form';
import { asBusinessId, asSystemId } from '@/lib/id-types';

const branches = [
  { systemId: asSystemId('BRANCH000001'), name: 'Chi nhánh Hà Nội', isDefault: true },
  { systemId: asSystemId('BRANCH000002'), name: 'Chi nhánh TP.HCM', isDefault: false },
];

vi.mock('../../settings/branches/store.ts', () => ({
  useBranchStore: () => ({ data: branches }),
}));

describe('StockLocationForm', () => {
  it('submits branded IDs via callback when initial data is provided', async () => {
    const onSubmit = vi.fn();
    const initialData = {
      systemId: asSystemId('LOC000001'),
      id: asBusinessId('LOC001'),
      name: 'Kho trung tâm',
      branchSystemId: asSystemId('BRANCH000002'),
    };

    const { container } = render(<StockLocationForm initialData={initialData} onSubmit={onSubmit} />);
    const form = container.querySelector('form#stock-location-form');
    expect(form).toBeTruthy();
    await act(async () => {
      fireEvent.submit(form!);
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const payload = onSubmit.mock.calls[0][0];
    expect(payload).toMatchObject({
      id: asBusinessId('LOC001'),
      branchSystemId: asSystemId('BRANCH000002'),
    });
    expect(container).toMatchSnapshot();
  });

  it('falls back to default branch and captures user input', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const { container } = render(<StockLocationForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/tên điểm lưu kho/i), 'Kho Mới');
    await act(async () => {
      fireEvent.submit(container.querySelector('form#stock-location-form')!);
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const payload = onSubmit.mock.calls[0][0];
    expect(payload).toMatchObject({
      name: 'Kho Mới',
      branchSystemId: asSystemId('BRANCH000001'),
    });
    expect(container).toMatchSnapshot();
  });
});
