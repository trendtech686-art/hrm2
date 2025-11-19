import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { InventoryCheckFormPage } from '../form-page';
import { PageHeaderProvider, usePageHeaderContext } from '@/contexts/page-header-context';
import { asBusinessId, asSystemId } from '@/lib/id-types';
import type { Product } from '../../products/types';

const clone = <T,>(value: T): T =>
  typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));

const headerActionsPortalId = 'inventory-check-header-actions';

const HeaderActionsPortal = () => {
  const { pageHeader } = usePageHeaderContext();
  return <div data-testid={headerActionsPortalId}>{pageHeader.actions}</div>;
};

const mockBranches = [
  { systemId: asSystemId('BRANCH000001'), name: 'Chi nhánh Hà Nội', isDefault: true },
];

vi.mock('../../settings/branches/store.ts', () => ({
  useBranchStore: () => ({ data: mockBranches }),
}));

const mockProducts: Product[] = [];

vi.mock('../../products/store.ts', () => ({
  useProductStore: () => ({ data: mockProducts }),
}));

vi.mock('../../../contexts/auth-context.tsx', () => ({
  useAuth: () => ({
    employee: {
      systemId: asSystemId('EMP000777'),
      fullName: 'Inventory Tester',
      id: 'NV777',
    },
  }),
}));

const toastSpies = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
}));

vi.mock('sonner', () => ({ toast: toastSpies }));

let selectProductFactory: () => Product;

vi.mock('../../../components/shared/product-search-combobox.tsx', () => ({
  ProductSearchCombobox: (props: { onSelect: (product: Product) => void }) => (
    <button type="button" onClick={() => props.onSelect(selectProductFactory())}>
      Thêm sản phẩm thử
    </button>
  ),
}));

vi.mock('../../../components/shared/bulk-product-selector-dialog.tsx', () => ({
  BulkProductSelectorDialog: () => null,
}));

let mockStore: any;
let addSpy: ReturnType<typeof vi.fn>;
let balanceSpy: ReturnType<typeof vi.fn>;

const createStore = () => {
  addSpy = vi.fn(() => ({ systemId: asSystemId('INVCHECK999001') }));
  balanceSpy = vi.fn();
  return {
    add: addSpy,
    update: vi.fn(),
    findById: vi.fn(),
    balanceCheck: balanceSpy,
  };
};

vi.mock('../store.ts', () => {
  const hook = () => mockStore;
  hook.getState = () => mockStore;
  return { useInventoryCheckStore: hook };
});

const renderInventoryForm = () => {
  return render(
    <MemoryRouter initialEntries={['/inventory-checks/new']}>
      <PageHeaderProvider>
        <HeaderActionsPortal />
        <Routes>
          <Route path="/inventory-checks/new" element={<InventoryCheckFormPage />} />
          <Route path="/inventory-checks" element={<div>Inventory checks list placeholder</div>} />
        </Routes>
      </PageHeaderProvider>
    </MemoryRouter>
  );
};

describe('InventoryCheckFormPage', () => {
  beforeEach(() => {
    mockStore = createStore();
    toastSpies.success.mockClear();
    toastSpies.error.mockClear();
    toastSpies.warning.mockClear();
    mockProducts.splice(0, mockProducts.length);
    selectProductFactory = () => ({
      systemId: asSystemId('PRODUCT0001'),
      id: asBusinessId('SP0001'),
      name: 'Website Cơ Bản',
      unit: 'Gói',
      inventoryByBranch: { [mockBranches[0].systemId]: 5 },
    } as Product);
  });

  it('submits branded IDs when creating a draft', async () => {
    mockProducts.push(selectProductFactory());
    const user = userEvent.setup();
    const { container } = renderInventoryForm();

    await user.click(screen.getByRole('button', { name: /thêm sản phẩm thử/i }));
    const actionsContainer = screen.getByTestId(headerActionsPortalId);
    const createButton = within(actionsContainer).getByRole('button', { name: 'Tạo phiếu kiểm' });
    await user.click(createButton);

    expect(addSpy).toHaveBeenCalledTimes(1);
    expect(addSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        branchSystemId: asSystemId('BRANCH000001'),
        items: [
          expect.objectContaining({
            productSystemId: asSystemId('PRODUCT0001'),
            productId: asBusinessId('SP0001'),
          }),
        ],
      })
    );
    expect(container).toMatchSnapshot();
  });

  it('renders consistent layout when branch has no inventory data', async () => {
    selectProductFactory = () => ({
      systemId: asSystemId('PRODUCT0002'),
      id: asBusinessId('SP0002'),
      name: 'Laptop Dell Latitude 5420',
      unit: 'Cái',
      inventoryByBranch: {},
    } as Product);
    mockProducts.push(selectProductFactory());

    const user = userEvent.setup();
    const { container } = renderInventoryForm();
    await user.click(screen.getByRole('button', { name: /thêm sản phẩm thử/i }));

    expect(container).toMatchSnapshot();
  });
});
